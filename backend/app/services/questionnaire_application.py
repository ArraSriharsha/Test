"""Use-cases: validate and submit questionnaire responses."""

from __future__ import annotations

import logging
from typing import Any
from uuid import UUID

import httpx
from app.core.config import Settings
from app.core.errors import AppError
from app.domain.questionnaire.validation import ValidationIssue, validate_answers
from app.repositories.questionnaire_metadata_repository import QuestionnaireMetadataRepository
from app.repositories.user_response_repository import UserResponseRepository
from app.services.pathway_service import bundle_result, generate_pathway
from app.services.questionnaire_provider import LoadedQuestionnaire, QuestionnaireProvider
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


class QuestionnaireApplicationService:
    def __init__(
        self,
        *,
        settings: Settings,
        provider: QuestionnaireProvider,
        user_responses: UserResponseRepository,
        metadata: QuestionnaireMetadataRepository,
    ) -> None:
        self._settings = settings
        self._provider = provider
        self._user_responses = user_responses
        self._metadata = metadata

    def load_and_validate(
        self,
        answers: dict[str, Any],
        storage_version: str | None,
    ) -> tuple[LoadedQuestionnaire, list[ValidationIssue]]:
        loaded = self._provider.load(storage_version)
        issues = validate_answers(loaded.document, answers)
        return loaded, issues

    def validate_only(
        self,
        answers: dict[str, Any],
        storage_version: str | None,
    ) -> tuple[LoadedQuestionnaire, list[ValidationIssue]]:
        return self.load_and_validate(answers, storage_version)

    def submit(
        self,
        db: Session,
        answers: dict[str, Any],
        storage_version: str | None,
        user_id: UUID | None,
    ) -> tuple[UUID, Any, Any, str, str]:
        loaded, issues = self.load_and_validate(answers, storage_version)
        if issues:
            raise AppError(
                "VALIDATION_FAILED",
                "Answers do not pass questionnaire validation",
                status_code=400,
                details={
                    "errors": [
                        {"field": i.field, "code": i.code, "message": i.message}
                        for i in issues
                    ],
                },
            )

        self._metadata.upsert_snapshot(
            db,
            questionnaire_id=loaded.document.id,
            content_version=loaded.resolved_version,
            storage_key=loaded.source_key,
            s3_etag=loaded.etag,
            raw_body=loaded.raw_body,
        )

        try:
            analysis, pathway = generate_pathway(self._settings, answers)
        except httpx.HTTPStatusError as e:
            logger.warning("LLM provider HTTP error: %s", e)
            raise AppError(
                "LLM_PROVIDER_ERROR",
                "Upstream LLM request failed",
                status_code=502,
                details={"status": e.response.status_code},
            ) from e
        except (KeyError, ValueError, TypeError) as e:
            logger.warning("LLM response parse error: %s", e)
            raise AppError(
                "LLM_PARSE_ERROR",
                "Could not parse LLM response",
                status_code=502,
            ) from e

        bundle = bundle_result(analysis, pathway)
        row = self._user_responses.create(
            db,
            questionnaire_id=loaded.document.id,
            questionnaire_version=loaded.resolved_version,
            answers=answers,
            result_bundle=bundle,
            user_id=user_id,
        )
        return row.id, analysis, pathway, loaded.document.id, loaded.resolved_version
