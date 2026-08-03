import React from 'react'

export default function ListingEmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <p className="text-sm uppercase tracking-[0.32em] text-slate-500">No results</p>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900">No listings match your filters yet</h2>
      <p className="mt-3 text-sm text-slate-600">Try adjusting the category, sort order, or location filters.</p>
    </div>
  )
}
