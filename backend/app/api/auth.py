import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, decode_access_token
from app.db.session import get_db
from app.models.user import User
from app.models.user_response import UserResponse
from app.schemas.auth import GoogleIdTokenBody, TokenResponse, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])
bearer = HTTPBearer(auto_error=False)


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    if creds is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    payload = decode_access_token(creds.credentials)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    try:
        uid = uuid.UUID(str(payload["sub"]))
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token subject",
        )
    user = db.get(User, uid)
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_optional_user_id(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> uuid.UUID | None:
    if creds is None:
        return None
    payload = decode_access_token(creds.credentials)
    if not payload or "sub" not in payload:
        return None
    try:
        uid = uuid.UUID(str(payload["sub"]))
    except ValueError:
        return None
    user = db.get(User, uid)
    if user is None or not user.is_active:
        return None
    return uid


@router.post("/google", response_model=TokenResponse)
def login_google(body: GoogleIdTokenBody, db: Session = Depends(get_db)) -> TokenResponse:
    if not settings.google_client_id.strip():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth is not configured (set GOOGLE_CLIENT_ID)",
        )
    try:
        idinfo = id_token.verify_oauth2_token(
            body.id_token,
            google_requests.Request(),
            audience=settings.google_client_id,
        )
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Google token")

    google_sub = idinfo.get("sub")
    email = idinfo.get("email")
    if not google_sub or not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing Google profile",
        )

    stmt = select(User).where(User.google_sub == google_sub)
    user = db.execute(stmt).scalar_one_or_none()
    now = datetime.now(UTC)

    if user is None:
        user = User(
            google_sub=google_sub,
            email=str(email).lower(),
            full_name=idinfo.get("name"),
            avatar_url=idinfo.get("picture"),
            email_verified=bool(idinfo.get("email_verified", False)),
            is_active=True,
            last_login_at=now,
        )
        db.add(user)
    else:
        user.email = str(email).lower()
        user.full_name = idinfo.get("name") or user.full_name
        user.avatar_url = idinfo.get("picture") or user.avatar_url
        user.email_verified = bool(idinfo.get("email_verified", False))
        user.last_login_at = now

    db.commit()
    db.refresh(user)

    if body.submission_id is not None:
        sub = db.get(UserResponse, body.submission_id)
        if sub is not None and sub.user_id is None:
            sub.user_id = user.id
            db.add(sub)
            db.commit()

    token = create_access_token(str(user.id))
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserRead)
def me(current: User = Depends(get_current_user)) -> User:
    return current