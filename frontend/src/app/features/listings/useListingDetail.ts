import { useQuery } from '@tanstack/react-query'
import api from '../../shared/lib/api-client'
import type { ListingDetail } from './listing-types'

const LISTING_DETAIL_QUERY_KEY = 'listing-detail'

const fetchListingDetail = async (slug: string): Promise<ListingDetail> => {
  return api.get<ListingDetail>(`/listings/${slug}`)
}

export default function useListingDetail(slug?: string) {
  return useQuery({
    queryKey: [LISTING_DETAIL_QUERY_KEY, slug],
    queryFn: () => fetchListingDetail(slug!),
    enabled: Boolean(slug),
    staleTime: 1000 * 60,
    retry: 1,
  })
}
