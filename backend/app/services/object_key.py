"""Map API version query to concrete object keys."""

from __future__ import annotations


def questionnaire_object_key(base_key: str, version: str | None) -> str:
    if not version or not version.strip():
        return base_key
    v = version.strip()
    if base_key.endswith(".json"):
        stem = base_key[:-5]
        prefix = f"{stem}.{v}.json"
        return prefix
    return f"{base_key}.{v}"


def local_questionnaire_path(base_path_str: str, version: str | None) -> str:
    from pathlib import Path

    p = Path(base_path_str).resolve()
    if not version or not version.strip():
        return str(p)
    v = version.strip()
    if p.suffix.lower() == ".json":
        return str(p.with_name(f"{p.stem}.{v}{p.suffix}"))
    return str(p.with_name(f"{p.name}.{v}"))
