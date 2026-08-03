import type { ListingCategoryGroup, ListingDetail } from '../../features/listings/listing-types'

export type CategorySeoConfig = {
  title: string
  description: string
  ogType: string
  schemaType: string
}

export const SITE_NAME = 'Explore Gilgit-Baltistan'
export const DEFAULT_DESCRIPTION =
  'Discover curated stays, dining, guides, transport, and services across Gilgit-Baltistan.'
export const DEFAULT_OG_IMAGE = 'https://explore-gb.example.com/og-image.png'

export const CATEGORY_GROUP_SEO: Record<ListingCategoryGroup, CategorySeoConfig> = {
  stay: {
    title: 'Stay in Gilgit-Baltistan',
    description:
      'Browse premium hotels, lodges, and mountain homestays across Gilgit-Baltistan.',
    ogType: 'website',
    schemaType: 'LodgingBusiness',
  },
  'eat-drink': {
    title: 'Eat & Drink in Gilgit-Baltistan',
    description:
      'Find the best restaurants, cafés, and local food experiences in Gilgit-Baltistan.',
    ogType: 'article',
    schemaType: 'Restaurant',
  },
  'transport-rentals': {
    title: 'Transport & Rentals in Gilgit-Baltistan',
    description:
      'Reserve local transport, rental cars, and mountain transfer services for your journey.',
    ogType: 'article',
    schemaType: 'Service',
  },
  'guided-experiences': {
    title: 'Guided Experiences in Gilgit-Baltistan',
    description:
      'Book guided tours, local adventures, and cultural experiences in Gilgit-Baltistan.',
    ogType: 'article',
    schemaType: 'TouristAttraction',
  },
  shopping: {
    title: 'Shopping in Gilgit-Baltistan',
    description:
      'Discover artisan shops, markets, and artisan souvenirs throughout the region.',
    ogType: 'article',
    schemaType: 'Store',
  },
  'essential-services': {
    title: 'Essential Services in Gilgit-Baltistan',
    description:
      'Find essential travel services, support, and local businesses for your Gilgit-Baltistan trip.',
    ogType: 'article',
    schemaType: 'LocalBusiness',
  },
}

export function getCategoryGroupSeo(categoryGroup: string | undefined): CategorySeoConfig {
  if (categoryGroup && categoryGroup in CATEGORY_GROUP_SEO) {
    return CATEGORY_GROUP_SEO[categoryGroup as ListingCategoryGroup]
  }

  return {
    title: 'Explore Gilgit-Baltistan',
    description: DEFAULT_DESCRIPTION,
    ogType: 'website',
    schemaType: 'LocalBusiness',
  }
}

export type BreadcrumbSchemaItem = {
  name: string
  item: string
}

export function createBreadcrumbJsonLd(items: BreadcrumbSchemaItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }
}

function buildAddress(listing: ListingDetail) {
  const address: Record<string, string> = {}

  if (listing.address_line_1) {
    address.streetAddress = listing.address_line_1
    if (listing.address_line_2) {
      address.streetAddress += ` ${listing.address_line_2}`
    }
  }

  if (listing.city) {
    address.addressLocality = listing.city
  }

  if (listing.region) {
    address.addressRegion = listing.region
  }

  if (listing.postal_code) {
    address.postalCode = listing.postal_code
  }

  if (listing.country) {
    address.addressCountry = listing.country
  }

  return Object.keys(address).length ? { '@type': 'PostalAddress', ...address } : undefined
}

function buildGeoCoordinates(listing: ListingDetail) {
  if (listing.latitude == null || listing.longitude == null) {
    return undefined
  }

  return {
    '@type': 'GeoCoordinates',
    latitude: listing.latitude,
    longitude: listing.longitude,
  }
}

export function createListingJsonLd(listing: ListingDetail, canonicalUrl: string) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': getCategoryGroupSeo(listing.category.group.slug).schemaType,
    name: listing.name,
    description:
      listing.summary || listing.description ||
      getCategoryGroupSeo(listing.category.group.slug).description,
    url: listing.website || canonicalUrl,
    telephone: listing.phone || undefined,
    email: listing.email || undefined,
    address: buildAddress(listing),
    geo: buildGeoCoordinates(listing),
    priceRange: listing.attributes?.price ? String(listing.attributes.price) : undefined,
  }

  return Object.fromEntries(
    Object.entries(schema).filter(([, value]) => value !== undefined),
  )
}
