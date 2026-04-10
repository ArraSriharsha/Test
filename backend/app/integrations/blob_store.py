"""Object storage abstraction — S3 or local file (for dev/tests)."""

from __future__ import annotations

from pathlib import Path
from typing import Protocol

from app.core.errors import AppError


class BlobFetchResult:
    __slots__ = ("body", "etag")

    def __init__(self, body: bytes, etag: str | None) -> None:
        self.body = body
        self.etag = etag


class BlobStore(Protocol):
    def fetch(self, key: str) -> BlobFetchResult: ...


class LocalFilesystemBlobStore:
    """Reads a resolved absolute path (key is ignored; path computed by caller)."""

    def __init__(self, absolute_path: Path) -> None:
        self._path = absolute_path

    def fetch(self, key: str) -> BlobFetchResult:
        _ = key
        if not self._path.is_file():
            raise AppError(
                "QUESTIONNAIRE_NOT_FOUND",
                f"Questionnaire file not found: {self._path}",
                status_code=404,
                details={"path": str(self._path)},
            )
        data = self._path.read_bytes()
        return BlobFetchResult(body=data, etag=None)


class S3BlobStore:
    def __init__(
        self,
        *,
        bucket: str,
        region: str,
        access_key_id: str,
        secret_access_key: str,
    ) -> None:
        import boto3  # lazy import

        session_kw: dict[str, str] = {"region_name": region}
        if access_key_id and secret_access_key:
            session_kw["aws_access_key_id"] = access_key_id
            session_kw["aws_secret_access_key"] = secret_access_key
        self._client = boto3.client("s3", **session_kw)
        self._bucket = bucket

    def fetch(self, key: str) -> BlobFetchResult:
        from botocore.exceptions import ClientError

        try:
            o = self._client.get_object(Bucket=self._bucket, Key=key)
            body: bytes = o["Body"].read()
            raw_etag = o.get("ETag")
            etag = raw_etag.strip('"') if isinstance(raw_etag, str) else None
            return BlobFetchResult(body=body, etag=etag)
        except ClientError as e:
            code = e.response.get("Error", {}).get("Code", "")
            if code in ("404", "NoSuchKey", "NotFound"):
                raise AppError(
                    "QUESTIONNAIRE_NOT_FOUND",
                    "Questionnaire object not found in storage",
                    status_code=404,
                    details={"key": key, "bucket": self._bucket, "s3_code": code},
                ) from e
            raise AppError(
                "STORAGE_ERROR",
                "Failed to fetch questionnaire from object storage",
                status_code=502,
                details={"key": key, "s3_code": code},
            ) from e
        except OSError as e:
            raise AppError(
                "STORAGE_ERROR",
                "Network or I/O error talking to object storage",
                status_code=502,
                details={"key": key},
            ) from e
