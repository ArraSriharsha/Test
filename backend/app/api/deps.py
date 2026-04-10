"""FastAPI dependencies."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Request

from app.core.config import Settings, settings
from app.services.questionnaire_application import QuestionnaireApplicationService


def get_settings_dep() -> Settings:
    return settings


def get_questionnaire_application_service(request: Request) -> QuestionnaireApplicationService:
    svc = getattr(request.app.state, "questionnaire_application_service", None)
    if svc is None:
        raise RuntimeError("Application service not initialized (lifespan)")
    return svc


SettingsDep = Annotated[Settings, Depends(get_settings_dep)]
QuestionnaireAppDep = Annotated[
    QuestionnaireApplicationService,
    Depends(get_questionnaire_application_service),
]
