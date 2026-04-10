# DentNaav backend

FastAPI service with **S3-backed questionnaire definitions**, dynamic validation, Groq pathway generation, Google OIDC, and Postgres persistence.

## Layout

| Area | Role |
|------|------|
| `app/api/v1/` | HTTP routers (thin) |
| `app/domain/questionnaire/` | Questionnaire document model + **dynamic** validators (driven by JSON) |
| `app/services/` | Questionnaire fetch/cache, application use-cases, pathway LLM |
| `app/integrations/` | S3 / local filesystem blob access |
| `app/repositories/` | Persistence helpers |
| `app/models/` | SQLAlchemy (`User`, `UserResponse`, `QuestionnaireMetadata`) |
| `app/middleware/` | Request logging |
| `app/api/exception_handlers.py` | Uniform `{ "error": { "code", "message", "details" } }` |

## Configuration

Copy `.env.example` → `.env`. Key variables:

- **`S3_QUESTIONNAIRE_BUCKET`** — if set, questionnaire JSON is loaded from S3 (`S3_QUESTIONNAIRE_KEY`, optional `?version=` maps to a sibling object key).
- **`QUESTIONNAIRE_LOCAL_PATH`** — if the bucket is **empty**, the API reads JSON from this file (dev/tests).
- **`QUESTIONNAIRE_CACHE_TTL_SECONDS`** — in-memory cache TTL (0 disables).

Upload your questionnaire JSON to S3 (same schema as `tests/fixtures/questionnaire.json`: `id`, `version`, `title`, `questions[]` with `type`, `options`, `constraints`, etc.).

## API (v1)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/questionnaire` | Load questionnaire from storage (`?version=` optional) |
| POST | `/api/v1/questionnaire/validate` | `{ "answers": {}, "version": null }` → `{ valid, errors[] }` |
| POST | `/api/v1/questionnaire/submit` | Validate, store `UserResponse`, run pathway LLM → `201` + `response_id` |
| GET | `/api/v1/results/{user_id}` | List stored analyses for user (Bearer JWT; must match `user_id`) |
| POST | `/auth/google` | OIDC; optional `submission_id` (UUID of `UserResponse`) to attach |

**Pathway:** `knowledge_base.txt` + answers → Groq (`GROQ_API_KEY`). Without a key, a stub payload is returned.

## Local setup

1. Postgres + `.env` with `DATABASE_URL`, `SECRET_KEY`, optional `GOOGLE_CLIENT_ID`.
2. `uv run alembic upgrade head`
3. `uv run uvicorn app.main:app --reload --host 127.0.0.1 --port 8000`

Open `/docs`. Set `CORS_ORIGINS` for the frontend origin.

## Docker

```bash
docker build -t dentnaav-api .
docker run --env-file .env -p 8000:8000 dentnaav-api
```

## Tests

```bash
uv run pytest
```

Uses SQLite + `tests/fixtures/questionnaire.json` (monkeypatched `QUESTIONNAIRE_LOCAL_PATH`).
