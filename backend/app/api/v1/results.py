"""Stored pathway results per user."""

from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.core.errors import AppError
from app.db.session import get_db
from app.models.user import User
from app.repositories.user_response_repository import UserResponseRepository
from app.schemas.analysis import AnalysisResultPayload
from app.schemas.questionnaire_api import UserResultItem, UserResultsResponse

router = APIRouter(tags=["results"])


@router.get("/{user_id}", response_model=UserResultsResponse)
def list_user_results(
    user_id: uuid.UUID,
    db: Session = Depends(get_db),
    current: User = Depends(get_current_user),
) -> UserResultsResponse:
    if user_id != current.id:
        raise AppError(
            "FORBIDDEN",
            "You may only access your own results",
            status_code=403,
        )
    repo = UserResponseRepository()
    rows = repo.list_for_user(db, user_id)
    items: list[UserResultItem] = []
    for row in rows:
        bundle = row.result_bundle
        analysis = AnalysisResultPayload.model_validate(bundle["analysis"])
        items.append(
            UserResultItem(
                response_id=row.id,
                questionnaire_id=row.questionnaire_id,
                questionnaire_version=row.questionnaire_version,
                created_at=row.created_at.isoformat(),
                analysis=analysis,
            )
        )
    return UserResultsResponse(user_id=user_id, results=items)
