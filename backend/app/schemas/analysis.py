from pydantic import BaseModel, Field


class AnalysisResultPayload(BaseModel):
    """Snapshot for the analysis UI (matches frontend `AnalysisResultPayload`)."""

    Country: str
    degree: str
    yearsOfExp: str
    Performance: int = Field(..., ge=0, le=100)
    ClearTag: str
    Blurtag1: str
    Blurtag2: str


class PathwaySummary(BaseModel):
    headline: str
    narrative: str
    next_steps: list[str] = Field(default_factory=list)
