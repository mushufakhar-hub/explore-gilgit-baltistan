import React from 'react'
import DashboardSectionShell from '../DashboardSectionShell'
import useDashboardData from '../useDashboardData'

const sampleReviews = [
  { id: 'r1', title: 'Serene Lake Cabin', rating: 5, text: 'A peaceful stay with incredible service.' },
  { id: 'r2', title: 'Mountain View Hostel', rating: 4, text: 'Clean rooms and a great location for exploring.' },
]

export default function ReviewsPage() {
  const { data, isLoading, isError } = useDashboardData(sampleReviews, sampleReviews, 'success')

  if (isLoading) return <p className="text-slate-600">Loading your reviews…</p>
  if (isError) return <p className="text-red-600">Unable to load reviews. Refresh to try again.</p>
  if (!data || data.length === 0) return <p className="text-slate-600">You haven’t written any reviews yet. Share your experience after a trip.</p>

  return (
    <DashboardSectionShell
      title="My reviews"
      description="Your feedback helps future travelers choose the best experiences."
    >
      <div className="space-y-4">
        {data.map((review) => (
          <article key={review.id} className="rounded-3xl border bg-slate-50 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold">{review.title}</h3>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">{review.rating}⭐</span>
            </div>
            <p className="mt-3 text-slate-600">{review.text}</p>
          </article>
        ))}
      </div>
    </DashboardSectionShell>
  )
}
