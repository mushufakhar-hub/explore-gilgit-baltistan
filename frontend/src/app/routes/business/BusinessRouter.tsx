import React from 'react'
import { Route } from 'react-router-dom'
import BusinessOnboardingLayout from '../../features/business/BusinessOnboardingLayout'
import BusinessBasicStep from '../../features/business/BusinessBasicStep'
import BusinessCategoryStep from '../../features/business/BusinessCategoryStep'
import BusinessPhotosStep from '../../features/business/BusinessPhotosStep'
import BusinessPricingStep from '../../features/business/BusinessPricingStep'
import BusinessVerifyStep from '../../features/business/BusinessVerifyStep'
import BusinessCompleteStep from '../../features/business/BusinessCompleteStep'

export default function BusinessRouter() {
  return (
    <>
      <Route path="business/onboarding" element={<BusinessOnboardingLayout />}>
        <Route index element={<BusinessBasicStep />} />
        <Route path="basic" element={<BusinessBasicStep />} />
        <Route path="category" element={<BusinessCategoryStep />} />
        <Route path="photos" element={<BusinessPhotosStep />} />
        <Route path="pricing" element={<BusinessPricingStep />} />
        <Route path="verify" element={<BusinessVerifyStep />} />
        <Route path="complete" element={<BusinessCompleteStep />} />
      </Route>
    </>
  )
}
