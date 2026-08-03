import React from 'react'
import { useLocation } from 'react-router-dom'
import SeoMeta from '../../shared/components/SeoMeta'
import { createListingJsonLd, getCategoryGroupSeo, SITE_NAME } from '../../shared/seo/seo-config'
import type { ListingDetail } from './listing-types'

export default function ListingSeo({ listing }: { listing: ListingDetail }) {
  const location = useLocation()
  const url = `${window.location.origin}${location.pathname}`
  const categorySeo = getCategoryGroupSeo(listing.category.group.slug)
  const title = listing.seo_title || `${listing.name} | ${categorySeo.title}`
  const description = listing.seo_description || listing.summary || categorySeo.description

  const breadcrumbs = [
    { name: 'Home', item: window.location.origin },
    { name: listing.category.group.name, item: `${window.location.origin}/listings?category_group_id=${listing.category.group.slug}` },
    { name: listing.name, item: url },
  ]

  return (
    <SeoMeta
      title={`${title} | ${SITE_NAME}`}
      description={description}
      canonical={listing.canonical_url || url}
      url={url}
      ogType={categorySeo.ogType}
      jsonLd={[createListingJsonLd(listing, listing.canonical_url || url)]}
      breadcrumbs={breadcrumbs}
    />
  )
}
