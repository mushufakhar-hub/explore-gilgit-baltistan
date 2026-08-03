import React from 'react'

export default function AiTripPlannerCta() {
  return (
    <section className="rounded-[2rem] border border-indigo-100 bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 p-10 text-white shadow-lg">
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-300">AI trip planner</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">Build your custom Gilgit-Baltistan itinerary in minutes.</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-200">
            Answer a few questions and get a luxury-ready route, curated day plans, and top local experiences.
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-200">Ready to travel smarter?</p>
          <a href="/ai" className="inline-flex items-center justify-center rounded-full bg-saffron-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-saffron-400 focus:outline-none focus:ring-2 focus:ring-slate-100">
            Start trip planner
          </a>
          <p className="text-sm text-slate-300">Save time and discover routes matched to your preferred pace, budget, and comfort.</p>
        </div>
      </div>
    </section>
  )
}
