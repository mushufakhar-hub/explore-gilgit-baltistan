from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration for the FastAPI backend."""

    app_name: str = Field(default="Explore Gilgit-Baltistan API")
    environment: str = Field(default="development")
    debug: bool = Field(default=False)
    testing: bool = Field(default=False, validation_alias="TESTING")
    api_v1_prefix: str = Field(default="/api/v1")

    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@localhost:5432/explore_gb",
        validation_alias="DATABASE_URL",
    )
    redis_url: str = Field(
        default="redis://localhost:6379/0",
        validation_alias="REDIS_URL",
    )
    secret_key: str = Field(default="change-me-in-production")
    payment_webhook_secret: str = Field(
        default="change-me-in-production",
        validation_alias="PAYMENT_WEBHOOK_SECRET",
    )
    cors_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:3000", "http://127.0.0.1:3000"],
        validation_alias="CORS_ORIGINS",
    )

    supabase_url: str | None = Field(default=None, validation_alias="SUPABASE_URL")
    supabase_service_role_key: str | None = Field(
        default=None,
        validation_alias="SUPABASE_SERVICE_ROLE_KEY",
    )
    cloudinary_cloud_name: str | None = Field(
        default=None,
        validation_alias="CLOUDINARY_CLOUD_NAME",
    )
    cloudinary_api_key: str | None = Field(
        default=None,
        validation_alias="CLOUDINARY_API_KEY",
    )
    cloudinary_api_secret: str | None = Field(
        default=None,
        validation_alias="CLOUDINARY_API_SECRET",
    )

    clerk_jwks_url: str = Field(
        default="https://example.clerk.accounts.dev/.well-known/jwks.json",
        validation_alias="CLERK_JWKS_URL",
    )
    clerk_issuer: str = Field(
        default="https://example.clerk.accounts.dev",
        validation_alias="CLERK_ISSUER",
    )
    clerk_secret_key: str | None = Field(default=None, validation_alias="CLERK_SECRET_KEY")

    openai_api_key: str | None = Field(default=None, validation_alias="OPENAI_API_KEY")
    sentry_dsn: str | None = Field(default=None, validation_alias="SENTRY_DSN")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()
