from __future__ import annotations

import logging
from typing import Any, Callable, Optional

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential_jitter, retry_if_exception_type

from app.core.config import settings

logger = logging.getLogger(__name__)


class BaseHTTPClient:
    """HTTP client wrapper with per-service timeouts, tenacity retries and optional circuit breaker.

    Usage: subclass and set `base_url`, `default_timeout`, and `retry_policy` as needed.
    """

    base_url: str = ""
    default_timeout: float = 5.0
    max_retries: int = 3

    def __init__(self, *, timeout: Optional[float] = None):
        self.timeout = timeout or self.default_timeout
        self.client = httpx.Client(base_url=self.base_url, timeout=self.timeout)

    def _is_retryable_exception(self, exc: Exception) -> bool:
        return isinstance(exc, (httpx.ConnectError, httpx.ReadTimeout, httpx.RemoteProtocolError))

    def _retry_decorator(self, apply_retry: bool = True) -> Callable:
        if not apply_retry:
            def _identity(fn):
                return fn

            return _identity

        return retry(
            reraise=True,
            stop=stop_after_attempt(self.max_retries),
            wait=wait_exponential_jitter(initial=0.5, max=10.0),
            retry=retry_if_exception_type((httpx.HTTPError,)),
        )

    def request(self, method: str, url: str, *, apply_retry: bool = True, **kwargs: Any) -> httpx.Response:
        decorator = self._retry_decorator(apply_retry=apply_retry)

        @decorator
        def _do():
            try:
                resp = self.client.request(method, url, **kwargs)
                resp.raise_for_status()
                return resp
            except Exception as exc:
                logger.debug("HTTP request failed: %s %s -> %s", method, url, exc)
                raise

        return _do()

    def get(self, url: str, *, apply_retry: bool = True, **kwargs: Any) -> httpx.Response:
        return self.request("GET", url, apply_retry=apply_retry, **kwargs)

    def post(self, url: str, *, apply_retry: bool = True, **kwargs: Any) -> httpx.Response:
        return self.request("POST", url, apply_retry=apply_retry, **kwargs)
