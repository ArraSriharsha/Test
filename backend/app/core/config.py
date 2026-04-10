"""Application settings — loaded from environment only (no secrets in code)."""

from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_BACKEND_ROOT = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/dentnaav"
    secret_key: str = "CHANGE_ME_USE_LONG_RANDOM_SECRET"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    google_client_id: str = Field(default="", description="Google OAuth Web client ID")
    cors_origins: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000",
        description="Comma-separated browser origins for CORS",
    )

    # S3 — leave bucket empty to use QUESTIONNAIRE_LOCAL_PATH (dev / tests)
    aws_region: str = Field(default="us-east-1", description="AWS region for S3 client")
    aws_access_key_id: str = Field(
        default="",
        description="AWS access key (optional if using IAM role)",
    )
    aws_secret_access_key: str = Field(default="", description="AWS secret key")
    s3_questionnaire_bucket: str = Field(default="", description="S3 bucket for questionnaire JSON")
    s3_questionnaire_key: str = Field(
        default="questionnaires/current.json",
        description="Default object key for questionnaire JSON",
    )

    questionnaire_local_path: str = Field(
        default="",
        description="When S3 bucket is unset, read questionnaire JSON from this filesystem path",
    )

    questionnaire_cache_ttl_seconds: int = Field(
        default=60,
        ge=0,
        description="In-memory TTL for fetched questionnaire (0 disables cache)",
    )

    groq_api_key: str = Field(default="", description="Groq API key for pathway LLM")
    groq_model: str = Field(default="llama-3.3-70b-versatile")
    groq_api_base: str = Field(default="https://api.groq.com/openai/v1")
    knowledge_base_path: str = Field(
        default=str(_BACKEND_ROOT / "knowledge_base.txt"),
        description="Plain-text knowledge base for LLM context",
    )

    log_level: str = Field(default="INFO", description="Root log level")

    @field_validator("knowledge_base_path", mode="before")
    @classmethod
    def empty_kb_path_to_default(cls, v: object) -> str:
        if v is None or (isinstance(v, str) and not v.strip()):
            return str(_BACKEND_ROOT / "knowledge_base.txt")
        return str(v)

    @property
    def use_s3_for_questionnaire(self) -> bool:
        return bool(self.s3_questionnaire_bucket.strip())


settings = Settings()
