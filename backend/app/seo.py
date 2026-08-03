from __future__ import annotations

from xml.sax.saxutils import escape

from fastapi import Depends
from fastapi.responses import PlainTextResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.requests import Request

from app.db.session import get_db
from app.models.listing import Listing

STATIC_SITEMAP_PATHS = [
    '/',
    '/listings',
    '/ai',
    '/sign-in',
    '/sign-up',
    '/business/onboarding',
    '/dashboard',
    '/trips',
]


def build_url_element(base_url: str, path: str) -> str:
    return (
        '  <url>\n'
        f'    <loc>{escape(f"{base_url}{path}")}</loc>\n'
        '    <changefreq>weekly</changefreq>\n'
        f'    <priority>{"0.8" if path == "/" else "0.6"}</priority>\n'
        '  </url>'
    )


async def get_published_listing_slugs(session: AsyncSession) -> list[str]:
    stmt = select(Listing.slug).where(Listing.is_published.is_(True)).order_by(Listing.updated_at.desc())
    result = await session.execute(stmt)
    return [slug for (slug,) in result.all()]


async def sitemap_xml(request: Request, db: AsyncSession = Depends(get_db)) -> PlainTextResponse:
    base_url = str(request.base_url).rstrip('/')
    listing_slugs = await get_published_listing_slugs(db)
    sitemap_paths = STATIC_SITEMAP_PATHS + [f'/listings/{slug}' for slug in listing_slugs]
    sitemap_entries = '\n'.join(build_url_element(base_url, path) for path in sitemap_paths)

    sitemap_text = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f'{sitemap_entries}\n'
        '</urlset>'
    )

    return PlainTextResponse(sitemap_text, media_type='application/xml')


def robots_txt() -> PlainTextResponse:
    return PlainTextResponse(
        'User-agent: *\nAllow: /\nSitemap: /sitemap.xml\n',
        media_type='text/plain',
    )
