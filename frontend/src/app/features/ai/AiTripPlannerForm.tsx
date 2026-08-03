import React, { useState } from 'react'
import BusinessOnboardingTitle from '../business/BusinessOnboardingTitle'
import type { AiTripPlannerRequest } from './ai-api'

export type AiTripPlannerFormProps = {
  onSubmit: (payload: AiTripPlannerRequest) => void
  isSubmitting: boolean
}

export default function AiTripPlannerForm({ onSubmit, isSubmitting }: AiTripPlannerFormProps) {
  const [form, setForm] = useState<AiTripPlannerRequest>({
    origin: 'Gilgit',
    days: 5,
    budget: 100000,
    travel_style: 'relaxed',
    party_size: 2,
  })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: name === 'days' || name === 'budget' || name === 'party_size' ? Number(value) : value,
    }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(form)
  }

  return (
    <div className="space-y-6">
      <BusinessOnboardingTitle title="AI trip planner" description="Generate a tailored itinerary with budget, pace, and party size." />
      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Start location</span>
            <input name="origin" value={form.origin} onChange={handleChange} required className="w-full rounded-3xl border p-3" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Travel style</span>
            <select name="travel_style" value={form.travel_style} onChange={handleChange} className="w-full rounded-3xl border p-3">
              <option value="relaxed">Relaxed</option>
              <option value="adventurous">Adventurous</option>
              <option value="luxury">Luxury</option>
              <option value="family">Family-friendly</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Days</span>
            <input name="days" type="number" min={1} value={form.days} onChange={handleChange} required className="w-full rounded-3xl border p-3" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">People</span>
            <input name="party_size" type="number" min={1} value={form.party_size} onChange={handleChange} required className="w-full rounded-3xl border p-3" />
          </label>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Budget (PKR)</span>
          <input name="budget" type="number" min={1000} value={form.budget} onChange={handleChange} required className="w-full rounded-3xl border p-3" />
        </label>

        <button type="submit" disabled={isSubmitting} className="inline-flex items-center rounded-3xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700 disabled:opacity-60">
          {isSubmitting ? 'Planning your trip…' : 'Generate itinerary'}
        </button>
      </form>
    </div>
  )
}
