import React from 'react'
import DashboardSectionShell from '../DashboardSectionShell'
import useDashboardData from '../useDashboardData'

const sampleWishlist = [
  { id: 'w1', title: 'Rama Meadows Retreat', note: 'Great mountain views' },
  { id: 'w2', title: 'Haven Valley Homestay', note: 'Family-friendly option' },
]

export default function WishlistPage() {
  const { data, isLoading, isError } = useDashboardData(sampleWishlist, sampleWishlist, 'success')

  if (isLoading) return <p className="text-slate-600">Loading your wishlist…</p>
  if (isError) return <p className="text-red-600">Unable to load wishlist. Refresh to try again.</p>
  if (!data || data.length === 0) return <p className="text-slate-600">Your wishlist is empty. Save your favorite stays and activities while browsing.</p>

  return (
    <DashboardSectionShell
      title="Wishlist"
      description="Your hand-picked travel ideas."
    >
      <div className="grid gap-4 md:grid-cols-2">
        {data.map((item) => (
          <article key={item.id} className="rounded-3xl border bg-slate-50 p-5 shadow-sm">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-slate-600">{item.note}</p>
          </article>
        ))}
      </div>
    </DashboardSectionShell>
  )
}
