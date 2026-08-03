import React from 'react'
import { Link, useParams } from 'react-router-dom'
import type { ListingDetail } from './listing-types'
import useListingDetail from './useListingDetail'
import useListingReviews from './useListingReviews'
import ListingDetailSkeleton from './ListingDetailSkeleton'
import ListingErrorState from './ListingErrorState'
import ListingSeo from './ListingSeo'
import Breadcrumbs from '../../shared/components/Breadcrumbs'

const renderAttributes = (attributes?: Record<string, unknown>) => {
  if (!attributes || Object.keys(attributes).length === 0) {
    return <p className="text-sm text-slate-500">No attributes available for this category.</p>
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Object.entries(attributes).map(([key, value]) => (
        <div key={key} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">{key.replace(/_/g, ' ')}</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">{String(value)}</p>
        </div>
      ))}
    </div>
  )
}

const renderNearbyPlaces = (listing: ListingDetail) => {
  const location = [listing.city, listing.region, listing.country].filter(Boolean).join(', ')
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Nearby highlights</p>
        <ul className="mt-4 space-y-3 text-sm text-slate-700">
          <li>Lakefront boardwalk — 2 km from {location}</li>
          <li>Local market district — 1.4 km from {location}</li>
          <li>Guided valley hike start point — 3 km from {location}</li>
        </ul>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Travel info</p>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <p>Phone: {listing.phone ?? 'Not provided'}</p>
          <p>Website: {listing.website ?? 'Not provided'}</p>
          <p>Address: {listing.address_line_1 || '—'} {listing.address_line_2 || ''}</p>
        </div>
      </div>
    </div>
  )
}

const renderMapEmbed = (listing: ListingDetail) => {
  if (!listing.latitude || !listing.longitude) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
        Map not available for this listing.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
      <iframe
        title="Listing location"
        width="100%"
        height="420"
        className="min-h-[420px]"
        loading="lazy"
        src={`https://www.google.com/maps?q=${listing.latitude},${listing.longitude}&output=embed`}
      />
    </div>
  )
}

export default function ListingDetailPage() {
  const { slug } = useParams()
  const { data: listing, error, isError, isLoading, refetch } = useListingDetail(slug)
  const listingId = listing?.id
  const { data: reviews, isLoading: reviewsLoading } = useListingReviews(listingId)

  if (isLoading) {
    return <ListingDetailSkeleton />
  }

  if (isError || !listing) {
    return <ListingErrorState error={error} reset={refetch} />
  }

  const breadcrumbs = [
    { name: 'Home', to: '/' },
    { name: listing.category.group.name, to: `/listings?category_group_id=${listing.category.group.slug}` },
    { name: listing.name },
  ]

  return (
    <div className="space-y-12">
      <ListingSeo listing={listing} />
      <Breadcrumbs items={breadcrumbs} />

      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">{listing.category.group.name}</p>
          <h1 className="text-4xl font-semibold text-slate-900">{listing.name}</h1>
          <p className="max-w-3xl text-base leading-8 text-slate-600">{listing.summary ?? listing.description ?? 'A premium listing in the Gilgit-Baltistan region.'}</p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-500">
            {listing.city && <span>{listing.city}</span>}
            {listing.region && <span>{listing.region}</span>}
            {listing.country && <span>{listing.country}</span>}
            {listing.is_featured && <span className="rounded-full bg-saffron-100 px-3 py-1 text-saffron-700">Featured</span>}
          </div>
          <div className="mt-6">
            <Link
              to={`/listings/${listing.slug}/book`}
              className="inline-flex rounded-full bg-saffron-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-saffron-400"
            >
              Book now
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="h-64 rounded-[1.5rem] bg-slate-200" />
              <div className="h-64 rounded-[1.5rem] bg-slate-200" />
              <div className="h-64 rounded-[1.5rem] bg-slate-200" />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-semibold text-slate-900">Description</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">{listing.description ?? 'No detailed description is available for this listing.'}</p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Attributes</h2>
                <p className="mt-2 text-sm text-slate-500">Rendered from category schema and listing metadata.</p>
              </div>
            </div>
            <div className="mt-6">{renderAttributes(listing.attributes ?? {})}</div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-semibold text-slate-900">Reviews</h2>
            {reviewsLoading ? (
              <p className="mt-4 text-sm text-slate-500">Loading reviews…</p>
            ) : reviews && reviews.length > 0 ? (
              <div className="mt-6 space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <p className="font-semibold text-slate-900">Traveler</p>
                      <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700">{review.rating} / 5</span>
                    </div>
                    <p className="mt-3 text-sm text-slate-700">{review.text ?? 'No comment provided.'}</p>
                    {review.owner_reply ? (
                      <div className="mt-4 rounded-3xl bg-white p-4 text-sm text-slate-600 shadow-sm">
                        <p className="font-semibold text-slate-900">Owner reply</p>
                        <p className="mt-2">{review.owner_reply}</p>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-500">No reviews yet for this listing.</p>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-semibold text-slate-900">Nearby places</h2>
            <div className="mt-6">{renderNearbyPlaces(listing)}</div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-semibold text-slate-900">Pricing</h2>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              {listing.attributes?.price ? `From ${String(listing.attributes.price)} per night` : 'Pricing details are available after inquiry.'}
            </p>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-semibold text-slate-900">Location</h2>
            <p className="mt-4 text-sm text-slate-700">{[listing.address_line_1, listing.address_line_2].filter(Boolean).join(', ') || 'Address not available'}</p>
            <p className="mt-3 text-sm text-slate-700">{[listing.city, listing.region, listing.country].filter(Boolean).join(', ')}</p>
          </div>
          <div>{renderMapEmbed(listing)}</div>
        </aside>
      </section>
    </div>
  )
}
