from collections.abc import Generator
from pathlib import Path

import pytest
from app.core import config
from app.db.base import Base
from app.db.session import get_db
from app.main import app
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool


@pytest.fixture
def client(monkeypatch: pytest.MonkeyPatch) -> Generator[TestClient, None, None]:
    qpath = Path(__file__).resolve().parent / "fixtures" / "questionnaire.json"
    monkeypatch.setattr(config.settings, "questionnaire_local_path", str(qpath))
    monkeypatch.setattr(config.settings, "s3_questionnaire_bucket", "")
    monkeypatch.setattr(config.settings, "groq_api_key", "")
    monkeypatch.setattr(config.settings, "questionnaire_cache_ttl_seconds", 0)

    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def override_get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    try:
        with TestClient(app) as c:
            yield c
    finally:
        app.dependency_overrides.clear()
        Base.metadata.drop_all(bind=engine)
