import React from 'react'
import DashboardSectionShell from '../DashboardSectionShell'
import useDashboardData from '../useDashboardData'

const samplePlans = [
  { id: 'p1', name: 'Northern Peaks Weekend', summary: '3-day plan including Hunza, Karimabad, and local food stops.' },
  { id: 'p2', name: 'Culture & Lakes Tour', summary: 'A relaxed route with lakes, markets, and heritage sites around Gilgit.' },
]

export default function PlansPage() {
  const { data, isLoading, isError } = useDashboardData(samplePlans, samplePlans, 'success')

  if (isLoading) return <p className="text-slate-600">Loading your AI trip plans…</p>
  if (isError) return <p className="text-red-600">Unable to load plans. Refresh to try again.</p>
  if (!data || data.length === 0) return <p className="text-slate-600">No saved plans yet. Generate AI-assisted itineraries while planning a trip.</p>

  return (
    <DashboardSectionShell
      title="Saved trip plans"
      description="Handy plans generated to help you explore more with less effort."
    >
      <div className="space-y-4">
        {data.map((plan) => (
          <article key={plan.id} className="rounded-3xl border bg-slate-50 p-5 shadow-sm">
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p className="mt-3 text-slate-600">{plan.summary}</p>
          </article>
        ))}
      </div>
    </DashboardSectionShell>
  )
}
