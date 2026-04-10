import uuid

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class GoogleIdTokenBody(BaseModel):
    id_token: str = Field(..., description="Google OIDC id_token from the client")
    submission_id: uuid.UUID | None = Field(
        default=None,
        description="Optional questionnaire submission to attach after Google sign-in",
    )


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: EmailStr
    full_name: str | None
    avatar_url: str | None
    email_verified: bool
    is_active: bool