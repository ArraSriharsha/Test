"""Questionnaire HTTP API — thin handlers."""

from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session

from app.api.auth import get_optional_user_id
from app.api.deps import QuestionnaireAppDep
from app.db.session import get_db
from app.schemas.questionnaire_api import (
    AnswersPayload,
    QuestionnaireEnvelope,
    QuestionnaireSubmitResponse,
    QuestionnaireValidateResponse,
    ValidationIssueOut,
)
from app.services.questionnaire_provider import QuestionnaireProvider

router = APIRouter(tags=["questionnaire"])


def _provider(request: Request) -> QuestionnaireProvider:
    p = getattr(request.app.state, "questionnaire_provider", None)
    if p is None:
        raise RuntimeError("QuestionnaireProvider not initialized")
    return p


@router.get(
    "",
    response_model=QuestionnaireEnvelope,
    summary="Get active questionnaire definition from object storage",
)
def get_questionnaire(
    request: Request,
    version: Annotated[str | None, Query(description="Optional storage version segment")] = None,
) -> QuestionnaireEnvelope:
    loaded = _provider(request).load(version)
    return QuestionnaireEnvelope(
        questionnaire_version=loaded.resolved_version,
        source_key=loaded.source_key,
        questionnaire=loaded.document.public_dict(),
    )


@router.post("/validate", response_model=QuestionnaireValidateResponse)
def validate_answers(
    body: AnswersPayload,
    app_svc: QuestionnaireAppDep,
) -> QuestionnaireValidateResponse:
    loaded, issues = app_svc.validate_only(body.answers, body.version)
    return QuestionnaireValidateResponse(
        valid=len(issues) == 0,
        questionnaire_id=loaded.document.id,
        questionnaire_version=loaded.resolved_version,
        errors=[
            ValidationIssueOut(field=i.field, code=i.code, message=i.message) for i in issues
        ],
    )


@router.post("/submit", response_model=QuestionnaireSubmitResponse, status_code=201)
def submit_questionnaire(
    body: AnswersPayload,
    app_svc: QuestionnaireAppDep,
    db: Session = Depends(get_db),
    user_id: UUID | None = Depends(get_optional_user_id),
) -> QuestionnaireSubmitResponse:
    """Persist answers, run pathway LLM. Optional Bearer JWT attaches ``user_id``."""
    rid, analysis, pathway, qid, qver = app_svc.submit(
        db,
        body.answers,
        body.version,
        user_id,
    )
    return QuestionnaireSubmitResponse(
        response_id=rid,
        questionnaire_id=qid,
        questionnaire_version=qver,
        analysis=analysis,
        pathway=pathway,
    )
