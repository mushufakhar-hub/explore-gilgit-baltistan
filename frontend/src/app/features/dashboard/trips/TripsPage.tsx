import React from 'react'
import DashboardSectionShell from '../DashboardSectionShell'
import useDashboardData from '../useDashboardData'

const sampleTrips = [
  { id: 't1', title: 'Gilgit to Hunza Road Trip', dates: 'Jun 10–14', status: 'Upcoming' },
  { id: 't2', title: 'Skardu Adventure Weekend', dates: 'May 4–7', status: 'Completed' },
]

export default function TripsPage() {
  const { data, isLoading, isError } = useDashboardData(sampleTrips, sampleTrips, 'success')

  if (isLoading) return <p className="text-slate-600">Loading your trips…</p>
  if (isError) return <p className="text-red-600">Unable to load trips. Refresh to try again.</p>
  if (!data || data.length === 0) return <p className="text-slate-600">No trips yet. Book a stay or activity to see it here.</p>

  return (
    <DashboardSectionShell
      title="Trips"
      description="Track upcoming journeys and review past adventures."
    >
      <div className="space-y-4">
        {data.map((trip) => (
          <article key={trip.id} className="rounded-3xl border bg-slate-50 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-semibold">{trip.title}</h3>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">{trip.status}</span>
            </div>
            <p className="mt-3 text-slate-600">{trip.dates}</p>
          </article>
        ))}
      </div>
    </DashboardSectionShell>
  )
}
