import React from 'react'
import type { AiTripPlannerResult } from './ai-api'

export default function AiTripPlannerResultView({ result }: { result: AiTripPlannerResult }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">{result.name}</h2>
        <p className="mt-3 text-slate-600">{result.days} days of curated travel plans.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border bg-slate-50 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Cost breakdown</p>
          <div className="mt-4 space-y-2">
            {result.cost_breakdown ? (
              Object.entries(result.cost_breakdown).map(([label, amount]) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-700">{label}</span>
                  <span className="font-semibold text-slate-900">PKR {amount.toLocaleString()}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-600">Cost details are unavailable for this plan.</p>
            )}
          </div>
        </div>

        <div className="rounded-3xl border bg-slate-50 p-6 lg:col-span-2">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Itinerary</p>
          <div className="mt-4 space-y-4">
            {result.items.map((item) => (
              <div key={`${item.day}-${item.listing_id}`} className="rounded-3xl border bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold text-indigo-700">Day {item.day}</span>
                  <span className="text-sm text-slate-500">{item.title}</span>
                </div>
                <p className="mt-2 text-slate-600">{item.description || 'No description available.'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border bg-slate-50 p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Packing list</p>
        {result.packing_list?.length ? (
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {result.packing_list.map((item) => (
              <li key={item} className="rounded-2xl bg-white p-3 text-sm text-slate-700 shadow-sm">{item}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-slate-600">Packing tips are not available for this plan.</p>
        )}
      </div>
    </div>
  )
}
