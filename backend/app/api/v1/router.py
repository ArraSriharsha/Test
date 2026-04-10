from fastapi import APIRouter

from app.api.v1 import questionnaire, results

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(questionnaire.router, prefix="/questionnaire")
api_v1_router.include_router(results.router, prefix="/results")
