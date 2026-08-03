from __future__ import annotations

import logging
from typing import Any, Optional

from app.core.config import settings
from app.integrations.base_client import BaseHTTPClient
from app.integrations.circuit_breaker import RedisCircuitBreaker

logger = logging.getLogger(__name__)


class GoogleMapsClient(BaseHTTPClient):
    base_url = "https://maps.googleapis.com/maps/api"
    default_timeout = 5.0
    max_retries = 3

    def __init__(self, api_key: Optional[str] = None):
        super().__init__()
        self.api_key = api_key or settings.google_maps_api_key if hasattr(settings, "google_maps_api_key") else None
        self.cb = RedisCircuitBreaker("google_maps", failure_threshold=3, recovery_timeout=60)

    def geocode(self, address: str) -> dict[str, Any]:
        if self.cb.is_open():
            raise RuntimeError("Google Maps circuit open")

        params = {"address": address, "key": self.api_key}
        try:
            resp = self.get("/geocode/json", params=params)
            data = resp.json()
            self.cb.record_success()
            return data
        except Exception as exc:
            logger.exception("Google Maps geocode failed")
            self.cb.record_failure()
            raise
