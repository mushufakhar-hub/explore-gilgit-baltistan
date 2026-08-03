import React from 'react'
import ListingCard from './ListingCard'
import ListingSkeleton from './ListingSkeleton'
import ListingEmptyState from './ListingEmptyState'
import ListingErrorState from './ListingErrorState'
import useListings from './useListings'
import type { UseListingsParams } from './listing-types'

export default function ListingListView(params: UseListingsParams) {
  const { data, error, isError, isLoading, isFetching, refetch } = useListings(params)

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <ListingSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (isError) {
    return <ListingErrorState error={error} reset={refetch} />
  }

  if (!data || data.items.length === 0) {
    return <ListingEmptyState />
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Listings</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Explore curated places</h1>
        </div>
        {isFetching && <p className="text-sm text-slate-500">Updating results…</p>}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((listing) => (
          <ListingCard
            key={listing.id}
            id={listing.id}
            slug={listing.slug}
            title={listing.name}
            subtitle={listing.summary ?? ''}
            image={listing.image_url ?? undefined}
            price={listing.price}
            categoryGroup={(listing.category_group ?? 'essential-services') as any}
            location={[listing.city, listing.region, listing.country].filter(Boolean).join(', ') || undefined}
            featured={listing.is_featured ?? false}
          />
        ))}
      </div>
      <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        <div>{data.total} listings found</div>
        <div>{data.page} / {Math.ceil(data.total / data.limit)}</div>
      </div>
    </div>
  )
}
