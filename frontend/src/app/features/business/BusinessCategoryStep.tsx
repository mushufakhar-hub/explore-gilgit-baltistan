import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BusinessOnboardingTitle from './BusinessOnboardingTitle'
import { getBusinessListingDraft, updateBusinessListingDraft } from './business-api'

export default function BusinessCategoryStep() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const draftId = params.get('draftId') || ''
  const [pricingModel, setPricingModel] = useState('room_availability')
  const [amenities, setAmenities] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!draftId) return
    getBusinessListingDraft(draftId)
      .then((listing) => {
        setPricingModel((listing.attributes?.pricing_model as string) || 'room_availability')
        setAmenities((listing.attributes?.amenities as string) || '')
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
        attributes: { pricing_model: pricingModel, amenities },
      })
      navigate(`/business/onboarding/photos?draftId=${draftId}`)
    } catch {
      setError('Unable to save category-specific details. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <BusinessOnboardingTitle title="Category-specific details" description="Add the details that matter most for your business category." />
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Pricing model</span>
          <select value={pricingModel} onChange={(e) => setPricingModel(e.target.value)} className="w-full rounded-3xl border p-3">
            <option value="room_availability">Room availability</option>
            <option value="table_reservation">Table reservation</option>
            <option value="fleet_availability">Fleet availability</option>
            <option value="slot_based">Slot based</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Amenities or attributes</span>
          <textarea value={amenities} onChange={(e) => setAmenities(e.target.value)} rows={4} className="w-full rounded-3xl border p-3" />
        </label>

        {!dataLoaded ? <p className="text-slate-600">Loading your draft…</p> : null}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center rounded-3xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700">Save and continue</button>
          <button type="button" className="inline-flex items-center rounded-3xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100" onClick={() => navigate(`/business/onboarding/basic?draftId=${draftId}`)}>
            Back
          </button>
        </div>
      </form>
    </div>
  )
}
