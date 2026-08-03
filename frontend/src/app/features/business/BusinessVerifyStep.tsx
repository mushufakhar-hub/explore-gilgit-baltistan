import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BusinessOnboardingTitle from './BusinessOnboardingTitle'
import { getBusinessListingDraft, submitBusinessListingVerification } from './business-api'

export default function BusinessVerifyStep() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const draftId = params.get('draftId') || ''
  const [listingName, setListingName] = useState('')
  const [statusText, setStatusText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!draftId) return
    getBusinessListingDraft(draftId)
      .then((listing) => {
        setListingName(listing.name || '')
        setStatusText(listing.verification_status || 'unverified')
      })
      .catch(() => setError('Unable to load verification details.'))
      .finally(() => setLoading(false))
  }, [draftId])

  const handleSubmit = async () => {
    if (!draftId) {
      setError('Missing draft ID. Please start again from the first step.')
      return
    }
    setError(null)
    try {
      await submitBusinessListingVerification(draftId)
      navigate(`/business/onboarding/complete?draftId=${draftId}`)
    } catch {
      setError('Unable to submit verification. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      <BusinessOnboardingTitle title="Verification submission" description="Submit your listing for review after completing all required details." />
      {loading ? (
        <p className="text-slate-600">Loading verification summary…</p>
      ) : (
        <div className="space-y-4">
          <div className="rounded-3xl border bg-slate-50 p-5">
            <p className="text-sm text-slate-500">Listing</p>
            <h3 className="mt-2 text-xl font-semibold">{listingName}</h3>
            <p className="mt-1 text-slate-600">Current status: <strong>{statusText}</strong></p>
          </div>
          <div className="rounded-3xl border bg-slate-50 p-5">
            <p className="text-slate-600">When you submit, your business listing will move from draft to pending review. We’ll notify you once verification is complete.</p>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex items-center gap-3">
            <button onClick={handleSubmit} className="inline-flex items-center rounded-3xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700">Submit for review</button>
            <button type="button" className="inline-flex items-center rounded-3xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100" onClick={() => navigate(`/business/onboarding/pricing?draftId=${draftId}`)}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
