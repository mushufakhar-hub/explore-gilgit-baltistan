import React from 'react'
import { Outlet, NavLink } from 'react-router-dom'

const steps = [
  { to: 'basic', label: 'Basic info' },
  { to: 'category', label: 'Category details' },
  { to: 'photos', label: 'Photos' },
  { to: 'pricing', label: 'Pricing & availability' },
  { to: 'verify', label: 'Verification' },
]

export default function BusinessOnboardingLayout() {
  return (
    <div className="space-y-6">
      <header className="rounded-3xl bg-white border p-6 shadow-sm">
        <h1 className="text-3xl font-semibold">Business listing onboarding</h1>
        <p className="mt-2 text-slate-600">Create or continue a business listing in guided steps. Progress is saved to the backend so it survives refresh.</p>
      </header>

      <nav className="grid grid-cols-2 gap-2 rounded-3xl border bg-slate-50 p-4 md:grid-cols-5">
        {steps.map((step) => (
          <NavLink
            key={step.to}
            to={step.to}
            className={({ isActive }) =>
              `rounded-2xl px-3 py-2 text-sm font-medium text-center ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-white'
              }`
            }
          >
            {step.label}
          </NavLink>
        ))}
      </nav>

      <section className="rounded-3xl bg-white border p-6 shadow-sm">
        <Outlet />
      </section>
    </div>
  )
}
