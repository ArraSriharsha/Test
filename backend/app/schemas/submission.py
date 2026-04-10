import uuid

from app.schemas.analysis import AnalysisResultPayload, PathwaySummary
from pydantic import BaseModel


class SubmissionResponse(BaseModel):
    submission_id: uuid.UUID
    analysis: AnalysisResultPayload
    pathway: PathwaySummary
