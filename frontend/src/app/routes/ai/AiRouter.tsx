import React from 'react'
import { Route } from 'react-router-dom'
import AiTripPlannerPage from '../../features/ai/AiTripPlannerPage'

export default function AiRouter() {
  return (
    <>
      <Route path="ai" element={<AiTripPlannerPage />} />
    </>
  )
}
