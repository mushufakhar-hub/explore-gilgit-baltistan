import React from 'react'
import { useSearchParams } from 'react-router-dom'
import BusinessOnboardingTitle from './BusinessOnboardingTitle'

export default function BusinessCompleteStep() {
  const [params] = useSearchParams()
  const draftId = params.get('draftId') || ''

  return (
    <div className="space-y-6">
      <BusinessOnboardingTitle title="Listing submitted" description="Your business listing is now pending review." />
      <div className="rounded-3xl border bg-slate-50 p-8 text-slate-700">
        <p className="text-lg font-semibold">Congratulations!</p>
        <p className="mt-4">Your listing draft <strong>{draftId}</strong> has been submitted for verification.</p>
        <p className="mt-2 text-slate-600">We’ll notify you once the review is complete and your business listing is approved.</p>
      </div>
      <p className="text-sm text-slate-500">If you need to update the draft again, you can reopen the onboarding flow with the same draft ID.</p>
    </div>
  )
}
