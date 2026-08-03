import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BusinessOnboardingTitle from './BusinessOnboardingTitle'
import { getBusinessListingDraft, updateBusinessListingDraft } from './business-api'

export default function BusinessPricingStep() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const draftId = params.get('draftId') || ''
  const [price, setPrice] = useState('')
  const [availability, setAvailability] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!draftId) return
    getBusinessListingDraft(draftId)
      .then((listing) => {
        setPrice((listing.attributes?.price as string) || '')
        setAvailability((listing.attributes?.availability as string) || '')
      })
      .finally(() => setDataLoaded(true))
  }, [draftId])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!draftId) {
      setError('Missing draft ID. Please start again from the first step.')
      return
    }

    setError(null)
    try {
      await updateBusinessListingDraft(draftId, {
        attributes: { price, availability },
      })
      navigate(`/business/onboarding/verify?draftId=${draftId}`)
    } catch {
      setError('Unable to save pricing and availability. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <BusinessOnboardingTitle title="Pricing & availability" description="Set the base price and availability details for your business listing." />
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Base price</span>
          <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full rounded-3xl border p-3" placeholder="e.g. PKR 4,500" />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Availability notes</span>
          <textarea value={availability} onChange={(e) => setAvailability(e.target.value)} rows={4} className="w-full rounded-3xl border p-3" placeholder="Open hours, booking rules, or availability details." />
        </label>

        {!dataLoaded ? <p className="text-slate-600">Loading your draft…</p> : null}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center rounded-3xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700">Save and continue</button>
          <button type="button" className="inline-flex items-center rounded-3xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100" onClick={() => navigate(`/business/onboarding/photos?draftId=${draftId}`)}>
            Back
          </button>
        </div>
      </form>
    </div>
  )
}
