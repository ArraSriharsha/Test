"""Load and parse questionnaire JSON from configured storage with optional TTL cache."""

from __future__ import annotations

import json
import logging
import threading
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from app.core.config import Settings
from app.core.errors import AppError
from app.domain.questionnaire.document import QuestionnaireDocument
from app.integrations.blob_store import BlobFetchResult, LocalFilesystemBlobStore, S3BlobStore
from app.services.object_key import local_questionnaire_path, questionnaire_object_key
from pydantic import ValidationError

logger = logging.getLogger(__name__)


@dataclass(frozen=True)
class LoadedQuestionnaire:
    document: QuestionnaireDocument
    resolved_version: str
    source_key: str
    etag: str | None
    raw_body: bytes


class QuestionnaireProvider:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._cache: dict[str, tuple[float, LoadedQuestionnaire]] = {}
        self._cache_lock = threading.Lock()

    def _cache_key(self, object_key: str) -> str:
        if self._settings.use_s3_for_questionnaire:
            return f"s3:{self._settings.s3_questionnaire_bucket}:{object_key}"
        return f"local:{object_key}"

    def _get_store_and_key(self, version: str | None) -> tuple[Any, str]:
        s = self._settings
        if s.use_s3_for_questionnaire:
            key = questionnaire_object_key(s.s3_questionnaire_key, version)
            store = S3BlobStore(
                bucket=s.s3_questionnaire_bucket.strip(),
                region=s.aws_region,
                access_key_id=s.aws_access_key_id,
                secret_access_key=s.aws_secret_access_key,
            )
            return store, key

        if not s.questionnaire_local_path.strip():
            raise AppError(
                "MISCONFIGURED",
                "Set S3_QUESTIONNAIRE_BUCKET or QUESTIONNAIRE_LOCAL_PATH",
                status_code=503,
            )
        path_str = local_questionnaire_path(s.questionnaire_local_path, version)
        path = Path(path_str)
        store = LocalFilesystemBlobStore(path)
        return store, path_str

    def load(self, version: str | None = None) -> LoadedQuestionnaire:
        store, resolved_key = self._get_store_and_key(version)
        ck = self._cache_key(resolved_key)
        ttl = self._settings.questionnaire_cache_ttl_seconds

        if ttl > 0:
            with self._cache_lock:
                hit = self._cache.get(ck)
                if hit and hit[0] > time.monotonic():
                    logger.debug("questionnaire cache hit key=%s", resolved_key)
                    return hit[1]

        logger.info(
            "Fetching questionnaire key=%s s3=%s",
            resolved_key,
            self._settings.use_s3_for_questionnaire,
        )
        try:
            result: BlobFetchResult = store.fetch(resolved_key)
        except AppError:
            raise
        except Exception as e:
            logger.exception("Unexpected fetch failure")
            raise AppError(
                "STORAGE_ERROR",
                "Could not load questionnaire",
                status_code=502,
                details={"key": resolved_key},
            ) from e

        try:
            payload = json.loads(result.body.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as e:
            logger.warning("Invalid questionnaire JSON key=%s err=%s", resolved_key, e)
            raise AppError(
                "INVALID_QUESTIONNAIRE_JSON",
                "Questionnaire file is not valid JSON",
                status_code=502,
                details={"key": resolved_key},
            ) from e

        try:
            document = QuestionnaireDocument.model_validate(payload)
        except ValidationError as e:
            logger.warning("Questionnaire schema validation failed: %s", e)
            raise AppError(
                "INVALID_QUESTIONNAIRE_SCHEMA",
                "Questionnaire JSON does not match the expected schema",
                status_code=502,
                details={"errors": e.errors()},
            ) from e

        resolved_ver = document.version
        loaded = LoadedQuestionnaire(
            document=document,
            resolved_version=resolved_ver,
            source_key=resolved_key,
            etag=result.etag,
            raw_body=result.body,
        )

        if ttl > 0:
            with self._cache_lock:
                self._cache[ck] = (time.monotonic() + ttl, loaded)

        return loaded

    def invalidate_cache(self) -> None:
        with self._cache_lock:
            self._cache.clear()
