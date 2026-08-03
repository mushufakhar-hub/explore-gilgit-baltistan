import { useQuery } from '@tanstack/react-query'
import api from '../../shared/lib/api-client'
import type { ListingsResponse, UseListingsParams } from './listing-types'

const LISTINGS_QUERY_KEY = 'listings'

const fetchListings = async (params: UseListingsParams): Promise<ListingsResponse> => {
  const query = new URLSearchParams()
  if (params.categoryId) query.set('category_id', params.categoryId)
  if (params.categoryGroupId) query.set('category_group_id', params.categoryGroupId)
  if (params.page) query.set('page', String(params.page))
  if (params.limit) query.set('limit', String(params.limit))
  if (params.sort) query.set('sort', params.sort)

  return api.get<ListingsResponse>(`/listings?${query.toString()}`)
}

export default function useListings(params: UseListingsParams) {
  return useQuery<ListingsResponse>({
    queryKey: [LISTINGS_QUERY_KEY, params],
    queryFn: () => fetchListings(params),
    placeholderData: (previousData) => previousData,
  })
}
