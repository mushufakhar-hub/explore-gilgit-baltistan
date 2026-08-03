import React from 'react'
import { ApiError } from '../../shared/lib/api-client'

export default function ListingErrorState({ error, reset }: { error: unknown; reset: () => void }) {
  const message = error instanceof ApiError ? error.payload.error.message : 'Unable to load listings.'

  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50 p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.32em] text-rose-700">Error</p>
      <h2 className="mt-4 text-2xl font-semibold text-slate-900">{message}</h2>
      <button
        onClick={reset}
        className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Try again
      </button>
    </div>
  )
}
