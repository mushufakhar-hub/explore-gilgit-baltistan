import React from 'react'
import DashboardSectionShell from '../DashboardSectionShell'
import useDashboardData from '../useDashboardData'

const sampleBookings = [
  { id: 'b1', listing: 'Hunza Valley Chalet', dates: 'Aug 20–24', total: 'PKR 48,500', status: 'Confirmed' },
  { id: 'b2', listing: 'Gilgit Riverside Tent', dates: 'Jul 3–6', total: 'PKR 18,200', status: 'Pending' },
]

export default function BookingsPage() {
  const { data, isLoading, isError } = useDashboardData(sampleBookings, sampleBookings, 'success')

  if (isLoading) return <p className="text-slate-600">Loading your bookings…</p>
  if (isError) return <p className="text-red-600">Unable to load bookings. Refresh to try again.</p>
  if (!data || data.length === 0) return <p className="text-slate-600">You don’t have any bookings yet. Start planning your next trip by booking a stay or activity.</p>

  return (
    <DashboardSectionShell
      title="My bookings"
      description="Upcoming and recent reservations, all in one place."
    >
      <div className="space-y-4">
        {data.map((booking) => (
          <article key={booking.id} className="rounded-3xl border bg-slate-50 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">{booking.listing}</h3>
                <p className="mt-2 text-slate-600">{booking.dates}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{booking.total}</p>
                <p className="mt-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">{booking.status}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </DashboardSectionShell>
  )
}
