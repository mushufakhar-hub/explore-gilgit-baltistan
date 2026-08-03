import React from 'react'
import { Link } from 'react-router-dom'
import type { ListingCategoryGroup } from './listing-types'

export type ListingCardProps = {
  id: string
  slug?: string
  title: string
  subtitle?: string
  image?: string
  price?: string
  categoryGroup?: ListingCategoryGroup
  location?: string
  featured?: boolean
}

const groupStyles: Record<ListingCategoryGroup, string> = {
  stay: 'border-glacier-500 bg-glacier-50',
  'eat-drink': 'border-earth-500 bg-earth-50',
  'transport-rentals': 'border-indigo-500 bg-indigo-50',
  'guided-experiences': 'border-saffron-500 bg-saffron-50',
  shopping: 'border-pine-500 bg-pine-50',
  'essential-services': 'border-slate-300 bg-slate-50',
}

export default function ListingCard({
  id,
  slug,
  title,
  subtitle,
  image,
  price,
  categoryGroup = 'essential-services',
  location,
  featured = false,
}: ListingCardProps) {
  const themeClass = groupStyles[categoryGroup]

  return (
    <article
      className={`relative group overflow-hidden rounded-3xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus-within:ring-2 focus-within:ring-indigo-500 ${themeClass}`}
      tabIndex={slug ? undefined : 0}
      aria-labelledby={`listing-${id}`}
    >
      {slug ? (
        <Link to={`/listings/${slug}`} className="absolute inset-0 z-10" aria-label={`View ${title}`} />
      ) : null}
      <div className="relative z-20 overflow-hidden rounded-2xl bg-slate-100">
        {image ? (
          <img src={image} alt={title} className="h-48 w-full object-cover transition duration-300 group-hover:scale-105" />
        ) : (
          <div className="h-48 w-full bg-slate-200" />
        )}
        {featured && (
          <span className="absolute left-4 top-4 rounded-full bg-saffron-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-900">
            Featured
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 id={`listing-${id}`} className="text-xl font-semibold text-slate-900">
            {title}
          </h3>
          {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
          {location && <p className="mt-3 text-sm text-slate-500">{location}</p>}
        </div>
        {price && <p className="text-right text-base font-semibold text-indigo-700">{price}</p>}
      </div>
    </article>
  )
}
