from __future__ import annotations

import hashlib
from datetime import UTC, datetime

from app.models.questionnaire_metadata import QuestionnaireMetadata
from sqlalchemy import select
from sqlalchemy.orm import Session


class QuestionnaireMetadataRepository:
    def upsert_snapshot(
        self,
        db: Session,
        *,
        questionnaire_id: str,
        content_version: str,
        storage_key: str,
        s3_etag: str | None,
        raw_body: bytes,
    ) -> QuestionnaireMetadata:
        digest = hashlib.sha256(raw_body).hexdigest()
        stmt = select(QuestionnaireMetadata).where(
            QuestionnaireMetadata.questionnaire_id == questionnaire_id,
            QuestionnaireMetadata.content_version == content_version,
        )
        existing = db.scalars(stmt).first()
        if existing:
            existing.storage_key = storage_key
            existing.s3_etag = s3_etag
            existing.content_sha256 = digest
            existing.raw_bytes_length = len(raw_body)
            existing.fetched_at = datetime.now(UTC)
            db.add(existing)
            db.commit()
            db.refresh(existing)
            return existing

        row = QuestionnaireMetadata(
            questionnaire_id=questionnaire_id,
            content_version=content_version,
            storage_key=storage_key,
            s3_etag=s3_etag,
            content_sha256=digest,
            raw_bytes_length=len(raw_body),
        )
        db.add(row)
        db.commit()
        db.refresh(row)
        return row
