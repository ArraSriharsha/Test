"""LLM pathway generation from arbitrary validated answer dict + knowledge base."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

import httpx
from app.core.config import Settings
from app.schemas.analysis import AnalysisResultPayload, PathwaySummary

logger = logging.getLogger(__name__)


def _load_kb_text(settings: Settings) -> str:
    path = Path(settings.knowledge_base_path)
    if not path.is_file():
        return ""
    return path.read_text(encoding="utf-8", errors="replace")


def _stub_no_api_key() -> tuple[AnalysisResultPayload, PathwaySummary]:
    return (
        AnalysisResultPayload(
            Country="—",
            degree="—",
            yearsOfExp="—",
            Performance=0,
            ClearTag="Pending",
            Blurtag1="Pathway",
            Blurtag2="Programs",
        ),
        PathwaySummary(
            headline="LLM not configured",
            narrative="Set GROQ_API_KEY in .env and add your knowledge base text file.",
            next_steps=[
                "Get a key at https://console.groq.com/keys",
                "Export your PDF to knowledge_base.txt",
                "Restart the API",
            ],
        ),
    )


def generate_pathway(
    settings: Settings,
    answers: dict[str, Any],
) -> tuple[AnalysisResultPayload, PathwaySummary]:
    if not settings.groq_api_key.strip():
        logger.info(
            "pathway: GROQ_API_KEY empty; stub kb_path=%s",
            settings.knowledge_base_path,
        )
        return _stub_no_api_key()

    kb = _load_kb_text(settings)
    answers_json = json.dumps(answers, ensure_ascii=False)

    logger.info(
        "pathway: Groq model=%s kb_chars=%d answers_json_chars=%d",
        settings.groq_model,
        len(kb),
        len(answers_json),
    )

    system = f"""You are DentNav, a U.S. dental pathway advisor.

Use the knowledge base below together with the user's questionnaire JSON. Be practical and specific.

--- Knowledge base ---
{kb or "(No knowledge base file loaded; rely on general U.S. dental pathway facts.)"}
--- End knowledge base ---

Respond with ONLY valid JSON (no markdown), exactly this shape:
{{
  "analysis": {{
    "Country": "short label for profile",
    "degree": "short label e.g. BDS",
    "yearsOfExp": "short range label",
    "Performance": <integer 0-100 readiness score>,
    "ClearTag": "short status label e.g. On Track",
    "Blurtag1": "Pathway",
    "Blurtag2": "Programs"
  }},
  "pathway": {{
    "headline": "one line",
    "narrative": "2-4 sentences",
    "next_steps": ["step 1", "step 2", "step 3"]
  }}
}}"""

    user = f"User answers (JSON):\n{answers_json}"

    payload = {
        "model": settings.groq_model,
        "messages": [
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        "response_format": {"type": "json_object"},
    }

    base = settings.groq_api_base.rstrip("/") + "/"
    url = urljoin(base, "chat/completions")

    with httpx.Client(timeout=120.0) as client:
        r = client.post(
            url,
            headers={
                "Authorization": f"Bearer {settings.groq_api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
        )
        r.raise_for_status()
        data = r.json()

    content = data["choices"][0]["message"]["content"]
    parsed = json.loads(content)
    analysis = AnalysisResultPayload.model_validate(parsed["analysis"])
    pathway = PathwaySummary.model_validate(parsed["pathway"])
    logger.info(
        "pathway: Groq OK performance=%s headline=%r",
        analysis.Performance,
        pathway.headline[:80] if pathway.headline else "",
    )
    return analysis, pathway


def bundle_result(analysis: AnalysisResultPayload, pathway: PathwaySummary) -> dict[str, Any]:
    return {
        "analysis": analysis.model_dump(),
        "pathway": pathway.model_dump(),
    }
