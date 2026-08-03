from __future__ import annotations

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

if settings.database_url.startswith("postgresql://"):
    database_url = settings.database_url.replace("postgresql://", "postgresql+asyncpg://", 1)
elif settings.database_url.startswith("postgresql+psycopg://"):
    database_url = settings.database_url.replace("postgresql+psycopg://", "postgresql+asyncpg://", 1)
else:
    database_url = settings.database_url

engine = create_async_engine(database_url, echo=settings.debug, future=True)
AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
