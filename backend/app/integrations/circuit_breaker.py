from __future__ import annotations

import time
import logging
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)


class RedisCircuitBreaker:
    """A tiny Redis-backed circuit breaker.

    It records consecutive failures and opens the circuit when a threshold is reached.
    """

    def __init__(self, name: str, failure_threshold: int = 5, recovery_timeout: int = 60):
        self.name = name
        self.failure_threshold = failure_threshold
        self.recovery_timeout = recovery_timeout

        try:
            import redis

            self._client = redis.from_url(settings.redis_url, decode_responses=True)
        except Exception:
            self._client = None

    def _keys(self) -> tuple[str, str, str]:
        return (f"cb:{self.name}:failures", f"cb:{self.name}:opened_at", f"cb:{self.name}:state")

    def _get(self, key: str) -> Optional[str]:
        if not self._client:
            return None
        try:
            return self._client.get(key)
        except Exception:
            return None

    def _set(self, key: str, value: str, ex: Optional[int] = None) -> None:
        if not self._client:
            return
        try:
            if ex:
                self._client.set(key, value, ex=ex)
            else:
                self._client.set(key, value)
        except Exception:
            return

    def record_failure(self) -> None:
        failures_key, opened_key, state_key = self._keys()
        if not self._client:
            return
        pipe = self._client.pipeline()
        pipe.incr(failures_key)
        pipe.get(failures_key)
        failures, after = pipe.execute()
        try:
            failures = int(failures)
        except Exception:
            failures = 0
        if failures >= self.failure_threshold:
            self._set(state_key, "open")
            self._set(opened_key, str(int(time.time())))
            logger.warning("Circuit breaker %s opened", self.name)

    def record_success(self) -> None:
        failures_key, opened_key, state_key = self._keys()
        if not self._client:
            return
        try:
            self._client.delete(failures_key)
            self._client.delete(opened_key)
            self._client.set(state_key, "closed")
        except Exception:
            return

    def is_open(self) -> bool:
        failures_key, opened_key, state_key = self._keys()
        state = self._get(state_key)
        if state == "open":
            opened = self._get(opened_key)
            try:
                opened_ts = int(opened or 0)
            except Exception:
                opened_ts = 0
            if time.time() - opened_ts > self.recovery_timeout:
                # allow half-open by resetting
                self._set(state_key, "half-open")
                return False
            return True
        return False
