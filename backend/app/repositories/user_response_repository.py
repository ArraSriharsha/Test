from __future__ import annotations

import uuid
from typing import Any

from app.models.user_response import UserResponse
from sqlalchemy import select
from sqlalchemy.orm import Session


class UserResponseRepository:
    def create(
        self,
        db: Session,
        *,
        questionnaire_id: str,
        questionnaire_version: str,
        answers: dict[str, Any],
        result_bundle: dict[str, Any],
        user_id: uuid.UUID | None = None,
    ) -> UserResponse:
        row = UserResponse(
            questionnaire_id=questionnaire_id,
            questionnaire_version=questionnaire_version,
            answers=answers,
            result_bundle=result_bundle,
            user_id=user_id,
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return row

    def get(self, db: Session, response_id: uuid.UUID) -> UserResponse | None:
        return db.get(UserResponse, response_id)

    def list_for_user(self, db: Session, user_id: uuid.UUID) -> list[UserResponse]:
        stmt = (
            select(UserResponse)
            .where(UserResponse.user_id == user_id)
            .order_by(UserResponse.created_at.desc())
        )
        return list(db.scalars(stmt).all())
