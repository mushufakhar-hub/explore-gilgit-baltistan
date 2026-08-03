from __future__ import annotations

from typing import Any


class APIError(Exception):
    def __init__(
        self,
        *,
        status_code: int,
        code: str,
        message: str,
        details: dict[str, Any] | None = None,
    ) -> None:
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details or {}


class BadRequestError(APIError):
    def __init__(self, message: str, details: dict[str, Any] | None = None) -> None:
        super().__init__(status_code=400, code="bad_request", message=message, details=details)


class UnauthorizedError(APIError):
    def __init__(self, message: str = "Unauthorized", details: dict[str, Any] | None = None) -> None:
        super().__init__(status_code=401, code="unauthorized", message=message, details=details)


class ForbiddenError(APIError):
    def __init__(self, message: str = "Forbidden", details: dict[str, Any] | None = None) -> None:
        super().__init__(status_code=403, code="forbidden", message=message, details=details)


class NotFoundError(APIError):
    def __init__(self, message: str = "Not found", details: dict[str, Any] | None = None) -> None:
        super().__init__(status_code=404, code="not_found", message=message, details=details)


class ConflictError(APIError):
    def __init__(self, message: str = "Conflict", details: dict[str, Any] | None = None) -> None:
        super().__init__(status_code=409, code="conflict", message=message, details=details)


class UpstreamDependencyError(APIError):
    def __init__(self, message: str = "Upstream dependency failure", details: dict[str, Any] | None = None) -> None:
        super().__init__(status_code=502, code="upstream_dependency_failure", message=message, details=details)
