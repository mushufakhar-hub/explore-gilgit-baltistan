import React from 'react'
import { Link } from 'react-router-dom'
import DashboardSectionShell from './DashboardSectionShell'

const items = [
  { to: 'saved-places', label: 'Saved Places' },
  { to: 'wishlist', label: 'Wishlist' },
  { to: 'trips', label: 'Trips' },
  { to: 'reviews', label: 'My Reviews' },
  { to: 'bookings', label: 'My Bookings' },
  { to: 'plans', label: 'Saved Trip Plans' },
]

export default function DashboardIndexPage() {
  return (
    <DashboardSectionShell
      title="Welcome to your dashboard"
      description="Quick access to saved places, bookings, trip plans, reviews, and more."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-base font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-white"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </DashboardSectionShell>
  )
}
