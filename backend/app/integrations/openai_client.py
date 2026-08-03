from __future__ import annotations

import logging
from typing import Any, Optional

from app.core.config import settings
from app.integrations.base_client import BaseHTTPClient
from app.integrations.circuit_breaker import RedisCircuitBreaker

logger = logging.getLogger(__name__)


class OpenAIClient(BaseHTTPClient):
    base_url = "https://api.openai.com/v1"
    default_timeout = 10.0
    max_retries = 4

    def __init__(self, api_key: Optional[str] = None):
        super().__init__()
        self.api_key = api_key or settings.openai_api_key
        self.cb = RedisCircuitBreaker("openai", failure_threshold=5, recovery_timeout=120)

    def completion(self, prompt: str, model: str = "gpt-4o-mini") -> dict[str, Any]:
        if self.cb.is_open():
            raise RuntimeError("OpenAI circuit open")

        headers = {"Authorization": f"Bearer {self.api_key}"}
        json_payload = {"model": model, "prompt": prompt, "max_tokens": 256}
        try:
            resp = self.post("/completions", headers=headers, json=json_payload)
            data = resp.json()
            self.cb.record_success()
            return data
        except Exception:
            logger.exception("OpenAI completion failed")
            self.cb.record_failure()
            raise
