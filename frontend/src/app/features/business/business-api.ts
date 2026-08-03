import api from '../../shared/lib/api-client'

export type BusinessListingDraft = {
  id: string
  name: string
  slug: string
  category_id: string
  summary?: string
  description?: string
  country?: string
  region?: string
  city?: string
  address_line_1?: string
  address_line_2?: string
  postal_code?: string
  phone?: string
  email?: string
  website?: string
  status?: string
  verification_status?: string
  attributes?: Record<string, unknown>
}

export async function createBusinessListingDraft(payload: BusinessListingDraft) {
  return api.post('/business/listing', payload)
}

export async function getBusinessListingDraft(listingId: string) {
  return api.get<BusinessListingDraft>(`/business/listing/${listingId}`)
}

export async function updateBusinessListingDraft(listingId: string, payload: Partial<BusinessListingDraft>) {
  return api.put<BusinessListingDraft>(`/business/listing/${listingId}`, payload)
}

export async function submitBusinessListingVerification(listingId: string) {
  return api.post(`/business/listing/${listingId}/submit-verification`)
}
