from fastapi import APIRouter, Depends, Request
from fastapi.responses import PlainTextResponse

from app.db.session import get_db
from app.seo import robots_txt, sitemap_xml

router = APIRouter(prefix="/seo", tags=["seo"])

@router.get("/sitemap.xml", response_class=PlainTextResponse)
async def get_sitemap(request: Request, db=Depends(get_db)) -> PlainTextResponse:
    return await sitemap_xml(request, db)

@router.get("/robots.txt", response_class=PlainTextResponse)
async def get_robots() -> PlainTextResponse:
    return robots_txt()
