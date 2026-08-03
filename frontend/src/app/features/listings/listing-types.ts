export type ListingCategoryGroup =
  | 'stay'
  | 'eat-drink'
  | 'transport-rentals'
  | 'guided-experiences'
  | 'shopping'
  | 'essential-services'

export type ListingAttribute = {
  key: string
  label: string
  value: string | number | boolean | null
  type?: 'string' | 'number' | 'boolean' | 'enum' | 'price'
}

export type ListingReview = {
  id: string
  user_id: string
  rating: number
  text?: string | null
  owner_reply?: string | null
}

export type ListingDetail = {
  id: string
  category_id: string
  owner_id?: string | null
  name: string
  slug: string
  description?: string | null
  summary?: string | null
  country?: string | null
  region?: string | null
  city?: string | null
  address_line_1?: string | null
  address_line_2?: string | null
  postal_code?: string | null
  latitude?: number | null
  longitude?: number | null
  phone?: string | null
  email?: string | null
  website?: string | null
  status: string
  verification_status: string
  is_featured: boolean
  is_published: boolean
  seo_title?: string | null
  seo_description?: string | null
  canonical_url?: string | null
  attributes?: Record<string, unknown> | null
  created_at: string
  updated_at: string
  published_at?: string | null
  category: {
    id: string
    group_id: string
    slug: string
    name: string
    description?: string | null
    kind: string
    booking_model: string
    is_active: boolean
    sort_order: number
    group: {
      id: string
      slug: string
      name: string
      description?: string | null
      is_active: boolean
    }
  }
}

export type ListingSummary = {
  id: string
  slug: string
  name: string
  summary?: string
  category_group?: ListingCategoryGroup
  category_id?: string
  city?: string | null
  region?: string | null
  country?: string | null
  status?: string
  is_featured?: boolean
  attributes?: Record<string, unknown>
  price?: string
  image_url?: string
}

export type ListingsResponse = {
  items: ListingSummary[]
  page: number
  limit: number
  total: number
}

export type UseListingsParams = {
  categoryId?: string
  categoryGroupId?: string
  page?: number
  limit?: number
  sort?: 'created_at_desc' | 'created_at_asc' | 'name_asc' | 'name_desc'
}
