import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BusinessOnboardingTitle from './BusinessOnboardingTitle'
import { getBusinessListingDraft, updateBusinessListingDraft } from './business-api'

export default function BusinessPhotosStep() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const draftId = params.get('draftId') || ''
  const [photos, setPhotos] = useState('')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!draftId) return
    getBusinessListingDraft(draftId)
      .then((listing) => {
        setPhotos((listing.attributes?.photos as string) || '')
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
        attributes: { photos },
      })
      navigate(`/business/onboarding/pricing?draftId=${draftId}`)
    } catch {
      setError('Unable to save photos. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <BusinessOnboardingTitle title="Photos" description="Upload visuals that help your listing stand out." />
      <form onSubmit={handleSubmit} className="space-y-6">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Photo URLs</span>
          <textarea value={photos} onChange={(e) => setPhotos(e.target.value)} rows={4} className="w-full rounded-3xl border p-3" placeholder="Enter one image URL per line" />
        </label>
        {!dataLoaded ? <p className="text-slate-600">Loading your draft…</p> : null}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-3">
          <button type="submit" className="inline-flex items-center rounded-3xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700">Save and continue</button>
          <button type="button" className="inline-flex items-center rounded-3xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100" onClick={() => navigate(`/business/onboarding/category?draftId=${draftId}`)}>
            Back
          </button>
        </div>
      </form>
    </div>
  )
}
