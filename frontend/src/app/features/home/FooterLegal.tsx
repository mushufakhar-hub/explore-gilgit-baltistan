import React from 'react'

export default function FooterLegal() {
  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-900">About</p>
          <p className="mt-4 text-sm leading-6">Explore Pakistan is a modern travel marketplace connecting travelers with hotel, dining, and guided experience partners across Gilgit-Baltistan.</p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-900">Legal</p>
          <ul className="mt-4 space-y-2 text-sm leading-6">
            <li>Terms of service</li>
            <li>Privacy policy</li>
            <li>Cookie settings</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-900">Support</p>
          <ul className="mt-4 space-y-2 text-sm leading-6">
            <li>Contact us</li>
            <li>Help center</li>
            <li>Trust & safety</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
