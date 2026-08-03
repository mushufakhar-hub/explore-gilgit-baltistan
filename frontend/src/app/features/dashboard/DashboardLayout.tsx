import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { path: 'saved-places', label: 'Saved Places' },
  { path: 'wishlist', label: 'Wishlist' },
  { path: 'trips', label: 'Trips' },
  { path: 'reviews', label: 'My Reviews' },
  { path: 'bookings', label: 'My Bookings' },
  { path: 'plans', label: 'Saved Trip Plans' },
]

export default function DashboardLayout() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white border p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Traveler dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold">Your travel hub</h1>
            <p className="mt-1 text-slate-600 max-w-2xl">Manage saved discoveries, upcoming trips, reviews, bookings, and AI trip plans.</p>
          </div>
        </div>
      </header>

      <nav className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `rounded-2xl border px-4 py-3 text-center text-sm font-medium transition ${
                isActive ? 'bg-indigo-600 text-white border-transparent shadow' : 'bg-white text-slate-700 hover:border-slate-300'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <section className="rounded-3xl bg-white border p-6 shadow-sm">
        <Outlet />
      </section>
    </div>
  )
}
