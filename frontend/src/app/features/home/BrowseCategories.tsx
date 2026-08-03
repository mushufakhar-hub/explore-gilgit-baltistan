import React from 'react'

const categories = [
  { title: 'Stay', description: 'Luxury hotels and resorts', icon: '🏨' },
  { title: 'Eat & Drink', description: 'Local cuisine and fine dining', icon: '🍽️' },
  { title: 'Transport', description: 'Scenic transfers and rentals', icon: '🚗' },
  { title: 'Guided Experiences', description: 'Private tours and guides', icon: '🧭' },
  { title: 'Shopping', description: 'Artisan markets and boutiques', icon: '🛍️' },
  { title: 'Essential Services', description: 'Travel essentials and support', icon: '🛎️' },
]

export default function BrowseCategories() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Browse by category</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Find exactly what you need</h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <article key={category.title} className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-xl">{category.icon}</div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">{category.title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">{category.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
