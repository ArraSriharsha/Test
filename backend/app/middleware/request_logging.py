"""Request lifecycle logging."""

from __future__ import annotations

import logging
import time
from collections.abc import Awaitable, Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("app.request")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(
        self,
        request: Request,
        call_next: Callable[[Request], Awaitable[Response]],
    ) -> Response:
        start = time.perf_counter()
        path = request.url.path
        try:
            response = await call_next(request)
        except Exception:
            duration_ms = (time.perf_counter() - start) * 1000
            logger.exception("request_failed path=%s duration_ms=%.2f", path, duration_ms)
            raise
        duration_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "request path=%s method=%s status=%s duration_ms=%.2f",
            path,
            request.method,
            response.status_code,
            duration_ms,
        )
        return response
