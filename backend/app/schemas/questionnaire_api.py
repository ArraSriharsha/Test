"""HTTP request/response models for questionnaire endpoints."""

from __future__ import annotations

from typing import Any
from uuid import UUID

from app.schemas.analysis import AnalysisResultPayload, PathwaySummary
from pydantic import BaseModel, Field


class AnswersPayload(BaseModel):
    """Answers keyed by question id; optional storage version selector (S3 key variant)."""

    answers: dict[str, Any] = Field(default_factory=dict)
    version: str | None = Field(
        default=None,
        description="Optional storage version (same as GET /questionnaire?version=).",
    )


class ValidationIssueOut(BaseModel):
    field: str
    code: str
    message: str


class QuestionnaireValidateResponse(BaseModel):
    valid: bool
    questionnaire_id: str
    questionnaire_version: str
    errors: list[ValidationIssueOut] = Field(default_factory=list)


class QuestionnaireSubmitResponse(BaseModel):
    response_id: UUID
    questionnaire_id: str
    questionnaire_version: str
    analysis: AnalysisResultPayload
    pathway: PathwaySummary


class QuestionnaireEnvelope(BaseModel):
    questionnaire_version: str
    source_key: str
    questionnaire: dict[str, Any]


class UserResultItem(BaseModel):
    response_id: UUID
    questionnaire_id: str
    questionnaire_version: str
    created_at: str
    analysis: AnalysisResultPayload


class UserResultsResponse(BaseModel):
    user_id: UUID
    results: list[UserResultItem]
