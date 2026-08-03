import { useQuery } from '@tanstack/react-query'
import api from '../../shared/lib/api-client'
import type { ListingReview } from './listing-types'

const LISTING_REVIEWS_QUERY_KEY = 'listing-reviews'

const fetchListingReviews = async (listingId: string): Promise<ListingReview[]> => {
  return api.get<ListingReview[]>(`/reviews/listings/${listingId}`)
}

export default function useListingReviews(listingId?: string) {
  return useQuery({
    queryKey: [LISTING_REVIEWS_QUERY_KEY, listingId],
    queryFn: () => fetchListingReviews(listingId!),
    enabled: Boolean(listingId),
    staleTime: 1000 * 20,
    retry: 1,
  })
}
