import React from 'react'
import ListingCard from '../listings/ListingCard'
import ListingErrorState from '../listings/ListingErrorState'
import ListingEmptyState from '../listings/ListingEmptyState'
import ListingSkeleton from '../listings/ListingSkeleton'
import useListings from '../listings/useListings'

export default function FeaturedDestinations() {
  const { data, error, isError, isLoading, refetch } = useListings({ categoryGroupId: 'stay', limit: 3, sort: 'created_at_desc' })

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Featured destinations</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Plan your signature mountain retreat</h2>
        </div>
        <button className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          View all destinations
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <ListingSkeleton key={index} />
          ))}
        </div>
      ) : isError ? (
        <ListingErrorState error={error} reset={refetch} />
      ) : !data || data.items.length === 0 ? (
        <ListingEmptyState />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {data.items.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              title={listing.name}
              subtitle={listing.summary ?? ''}
              image={listing.image_url ?? undefined}
              price={listing.price}
              categoryGroup={(listing.category_group ?? 'stay') as any}
              location={[listing.city, listing.region, listing.country].filter(Boolean).join(', ') || undefined}
              featured={listing.is_featured ?? false}
            />
          ))}
        </div>
      )}
    </section>
  )
}
