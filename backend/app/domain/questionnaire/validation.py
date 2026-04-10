"""Dynamic validation: rules come from questionnaire definition only."""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any

from app.domain.questionnaire.document import (
    DropdownQuestion,
    MultiSelectQuestion,
    NumberQuestion,
    PlainTextQuestion,
    QuestionnaireDocument,
    RadioQuestion,
    TextareaQuestion,
)


@dataclass(frozen=True)
class ValidationIssue:
    field: str
    code: str
    message: str


def validate_answers(
    document: QuestionnaireDocument,
    answers: dict[str, Any],
) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    sorted_q = sorted(document.questions, key=lambda q: q.order)

    for q in sorted_q:
        raw = answers.get(q.id, None)

        if not q.required:
            if raw is None:
                continue
            if isinstance(raw, list) and len(raw) == 0:
                continue
            if isinstance(raw, str) and not raw.strip():
                continue

        if raw is None or (isinstance(raw, str) and q.required and not raw.strip()):
            if q.required:
                issues.append(
                    ValidationIssue(
                        field=q.id,
                        code="required",
                        message=f"Field {q.id!r} is required",
                    )
                )
            continue

        if isinstance(q, (TextareaQuestion, PlainTextQuestion)):
            issues.extend(_validate_text(q.id, raw, q.required, q.constraints))
        elif isinstance(q, (DropdownQuestion, RadioQuestion)):
            issues.extend(_validate_enum(q.id, raw, q.options))
        elif isinstance(q, MultiSelectQuestion):
            issues.extend(_validate_multi(q.id, raw, q.options, q.minSelections, q.maxSelections))
        elif isinstance(q, NumberQuestion):
            issues.extend(_validate_number(q.id, raw, q.constraints))
        else:
            issues.append(
                ValidationIssue(
                    field=q.id,
                    code="unsupported_type",
                    message=f"Unknown question type for {q.id!r}",
                )
            )

    unknown = set(answers) - {x.id for x in document.questions}
    for uid in sorted(unknown):
        issues.append(
            ValidationIssue(
                field=uid,
                code="unknown_field",
                message=f"Unknown question id {uid!r}",
            )
        )

    return issues


def _validate_text(
    qid: str,
    raw: Any,
    required: bool,
    constraints: Any,
) -> list[ValidationIssue]:
    issues: list[ValidationIssue] = []
    if not isinstance(raw, str):
        return [
            ValidationIssue(
                field=qid,
                code="type",
                message="Expected string",
            )
        ]
    s = raw.strip()
    if required and not s:
        return [ValidationIssue(field=qid, code="required", message="Cannot be empty")]

    c = constraints
    if c:
        if c.min_length is not None and len(s) < c.min_length:
            issues.append(
                ValidationIssue(
                    field=qid,
                    code="min_length",
                    message=f"Minimum length is {c.min_length}",
                )
            )
        if c.max_length is not None and len(s) > c.max_length:
            issues.append(
                ValidationIssue(
                    field=qid,
                    code="max_length",
                    message=f"Maximum length is {c.max_length}",
                )
            )
        if c.pattern and s and not re.search(c.pattern, s):
            issues.append(
                ValidationIssue(
                    field=qid,
                    code="pattern",
                    message="Value does not match required pattern",
                )
            )
    elif required and s and len(s) < 1:
        issues.append(ValidationIssue(field=qid, code="min_length", message="Cannot be empty"))

    return issues


def _validate_enum(qid: str, raw: Any, options: list[str]) -> list[ValidationIssue]:
    if not isinstance(raw, str):
        return [ValidationIssue(field=qid, code="type", message="Expected string")]
    if raw not in options:
        return [
            ValidationIssue(
                field=qid,
                code="enum",
                message="Value must be one of the allowed options",
            )
        ]
    return []


def _validate_multi(
    qid: str,
    raw: Any,
    options: list[str],
    min_sel: int | None,
    max_sel: int | None,
) -> list[ValidationIssue]:
    if not isinstance(raw, list):
        return [ValidationIssue(field=qid, code="type", message="Expected array of strings")]
    if not all(isinstance(x, str) for x in raw):
        return [ValidationIssue(field=qid, code="type", message="Expected array of strings")]
    opt = set(options)
    for item in raw:
        if item not in opt:
            return [
                ValidationIssue(
                    field=qid,
                    code="enum",
                    message=f"Invalid option {item!r}",
                )
            ]
    if len(raw) != len(set(raw)):
        return [
            ValidationIssue(
                field=qid,
                code="unique",
                message="Duplicate selections are not allowed",
            )
        ]

    lo = min_sel if min_sel is not None else 1
    hi = max_sel if max_sel is not None else len(options)
    if len(raw) < lo:
        return [
            ValidationIssue(
                field=qid,
                code="min_selections",
                message=f"Select at least {lo} option(s)",
            )
        ]
    if len(raw) > hi:
        return [
            ValidationIssue(
                field=qid,
                code="max_selections",
                message=f"Select at most {hi} option(s)",
            )
        ]
    return []


def _validate_number(qid: str, raw: Any, constraints: Any) -> list[ValidationIssue]:
    try:
        if isinstance(raw, bool):
            raise ValueError
        num = float(raw) if not isinstance(raw, (int, float)) else float(raw)
    except (TypeError, ValueError):
        return [ValidationIssue(field=qid, code="type", message="Expected number")]

    if constraints:
        if constraints.minimum is not None and num < constraints.minimum:
            return [
                ValidationIssue(
                    field=qid,
                    code="minimum",
                    message=f"Must be >= {constraints.minimum}",
                )
            ]
        if constraints.maximum is not None and num > constraints.maximum:
            return [
                ValidationIssue(
                    field=qid,
                    code="maximum",
                    message=f"Must be <= {constraints.maximum}",
                )
            ]
    return []
