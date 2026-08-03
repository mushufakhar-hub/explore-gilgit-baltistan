import React from 'react'
import DashboardSectionShell from '../DashboardSectionShell'
import useDashboardData from '../useDashboardData'

const samplePlaces = [
  { id: '1', title: 'Upper Kachura Lake Camp', location: 'Skardu' },
  { id: '2', title: 'Fairy Meadows Cottage', location: 'Nanga Parbat Base' },
  { id: '3', title: 'Deosai Plains Stay', location: 'Deosai National Park' },
]

export default function SavedPlacesPage() {
  const { data, isLoading, isError } = useDashboardData(samplePlaces, samplePlaces, 'success')

  if (isLoading) return <p className="text-slate-600">Loading your saved places…</p>
  if (isError) return <p className="text-red-600">Unable to load saved places. Refresh to try again.</p>
  if (!data || data.length === 0) return <p className="text-slate-600">You don’t have any saved places yet. Start exploring listings and save favorites for later.</p>

  return (
    <DashboardSectionShell
      title="Saved places"
      description="These are places you marked to revisit later."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {data.map((place) => (
          <article key={place.id} className="rounded-3xl border bg-slate-50 p-5 shadow-sm">
            <div className="text-sm uppercase tracking-[0.2em] text-slate-500">{place.location}</div>
            <h3 className="mt-3 text-xl font-semibold">{place.title}</h3>
          </article>
        ))}
      </div>
    </DashboardSectionShell>
  )
}
