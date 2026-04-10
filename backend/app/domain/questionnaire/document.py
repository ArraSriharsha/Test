"""Questionnaire definition as stored in S3 (validated, not hardcoded in Python)."""

from __future__ import annotations

from typing import Annotated, Any, Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

QuestionType = Literal["textarea", "text", "dropdown", "radio", "multiSelect", "number"]


class QuestionConstraints(BaseModel):
    model_config = ConfigDict(extra="ignore")

    min_length: int | None = None
    max_length: int | None = None
    pattern: str | None = Field(default=None, description="Regex as string")
    minimum: float | None = None
    maximum: float | None = None


class QuestionnaireQuestionBase(BaseModel):
    model_config = ConfigDict(extra="ignore")

    id: str = Field(..., min_length=1)
    order: int = Field(..., ge=0)
    type: QuestionType
    label: str
    description: str | None = None
    required: bool = True
    constraints: QuestionConstraints | None = None


class TextareaQuestion(QuestionnaireQuestionBase):
    type: Literal["textarea"] = "textarea"
    placeholder: str | None = None
    rows: int | None = None


class PlainTextQuestion(QuestionnaireQuestionBase):
    type: Literal["text"] = "text"
    placeholder: str | None = None


class DropdownQuestion(QuestionnaireQuestionBase):
    type: Literal["dropdown"] = "dropdown"
    placeholder: str | None = None
    options: list[str] = Field(..., min_length=1)

    @field_validator("options")
    @classmethod
    def non_empty_strings(cls, v: list[str]) -> list[str]:
        return [str(x) for x in v]


class RadioQuestion(QuestionnaireQuestionBase):
    type: Literal["radio"] = "radio"
    options: list[str] = Field(..., min_length=1)


class MultiSelectQuestion(QuestionnaireQuestionBase):
    type: Literal["multiSelect"] = "multiSelect"
    placeholder: str | None = None
    options: list[str] = Field(..., min_length=1)
    minSelections: int | None = Field(default=None, ge=0)
    maxSelections: int | None = Field(default=None, ge=0)


class NumberQuestion(QuestionnaireQuestionBase):
    type: Literal["number"] = "number"
    placeholder: str | None = None


Question = Annotated[
    TextareaQuestion
    | PlainTextQuestion
    | DropdownQuestion
    | RadioQuestion
    | MultiSelectQuestion
    | NumberQuestion,
    Field(discriminator="type"),
]


class QuestionnaireDocument(BaseModel):
    """Root object returned to the frontend (opaque JSON shape beyond this schema)."""

    model_config = ConfigDict(extra="allow")

    id: str = Field(..., min_length=1)
    title: str
    subtitle: str = ""
    version: str = Field(
        default="1.0.0",
        description="Semantic version of this questionnaire content",
    )
    questions: list[Question]

    @field_validator("questions")
    @classmethod
    def unique_question_ids(cls, v: list[Any]) -> list[Any]:
        ids = [q.id for q in v]
        if len(ids) != len(set(ids)):
            raise ValueError("Duplicate question id in questionnaire")
        return v

    def public_dict(self) -> dict[str, Any]:
        """Serialize for API (includes extra fields allowed on root)."""
        return self.model_dump(mode="json")
