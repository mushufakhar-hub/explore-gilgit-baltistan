import React from 'react'

const categories = [
  { label: 'Stay', query: 'stay' },
  { label: 'Eat & Drink', query: 'eat-drink' },
  { label: 'Transport', query: 'transport-rentals' },
  { label: 'Guided', query: 'guided-experiences' },
  { label: 'Shopping', query: 'shopping' },
  { label: 'Services', query: 'essential-services' },
]

export default function HeroSection() {
  return (
    <section className="rounded-[2rem] bg-gradient-to-br from-glacier-50 via-white to-indigo-50 p-8 shadow-lg sm:p-12">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-500">Gilgit-Baltistan travel</p>
          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-5xl">
            Discover premium experiences across mountains, lakes, and culture.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600">
            Find curated stays, local dining, scenic transport, and live guides with a luxuriously calm booking experience.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <button className="rounded-full bg-indigo-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              Start search
            </button>
            <button className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              Explore categories
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Search by category</h2>
          <div className="mt-5 grid gap-3">
            {categories.map((item) => (
              <button key={item.query} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <span className="block font-semibold">{item.label}</span>
                <span className="text-xs text-slate-500">Browse curated {item.label.toLowerCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
