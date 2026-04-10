import uuid
from datetime import datetime

from sqlalchemy import DateTime, Integer, String, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class QuestionnaireMetadata(Base):
    """Tracks questionnaire content versions observed from storage (audit / versioning)."""

    __tablename__ = "questionnaire_metadata"
    __table_args__ = (
        UniqueConstraint("questionnaire_id", "content_version", name="uq_qmeta_qid_version"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    questionnaire_id: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    content_version: Mapped[str] = mapped_column(String(64), nullable=False)
    storage_key: Mapped[str] = mapped_column(String(512), nullable=False)
    s3_etag: Mapped[str | None] = mapped_column(String(128), nullable=True)
    content_sha256: Mapped[str] = mapped_column(String(64), nullable=False)
    raw_bytes_length: Mapped[int] = mapped_column(Integer, nullable=False)
    fetched_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
