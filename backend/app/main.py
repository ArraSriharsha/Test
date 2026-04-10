from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.exception_handlers import register_exception_handlers
from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.core.logging_config import configure_logging
from app.middleware.request_logging import RequestLoggingMiddleware
from app.repositories.questionnaire_metadata_repository import QuestionnaireMetadataRepository
from app.repositories.user_response_repository import UserResponseRepository
from app.services.questionnaire_application import QuestionnaireApplicationService
from app.services.questionnaire_provider import QuestionnaireProvider


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    provider = QuestionnaireProvider(settings)
    app.state.questionnaire_provider = provider
    app.state.questionnaire_application_service = QuestionnaireApplicationService(
        settings=settings,
        provider=provider,
        user_responses=UserResponseRepository(),
        metadata=QuestionnaireMetadataRepository(),
    )
    yield


app = FastAPI(title="DentNaav API", lifespan=lifespan)

register_exception_handlers(app)

app.add_middleware(RequestLoggingMiddleware)

_origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(api_v1_router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
