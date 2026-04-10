import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import JSON, DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class UserResponse(Base):
    """Persisted questionnaire submission and LLM result bundle."""

    __tablename__ = "user_responses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    questionnaire_id: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    questionnaire_version: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    answers: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    result_bundle: Mapped[dict[str, Any]] = mapped_column(JSON, nullable=False)
    user_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
