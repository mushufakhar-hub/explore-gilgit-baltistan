from fastapi import APIRouter

from app.api.v1.listings import router as listings_router
from app.api.v1.payments import router as payments_router
from app.api.v1.health import router as health_router
from app.api.v1.reviews import router as reviews_router
from app.api.v1.ai import router as ai_router
from app.api.v1.business import router as business_router

api_router = APIRouter()
api_router.include_router(listings_router)
api_router.include_router(payments_router)
api_router.include_router(health_router)
api_router.include_router(reviews_router)
api_router.include_router(ai_router)
api_router.include_router(business_router)


@api_router.get("/ready")
async def api_health() -> dict[str, str]:
    return {"status": "ok"}
