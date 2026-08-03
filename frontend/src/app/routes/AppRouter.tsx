import React from 'react'
import { Routes, Route } from 'react-router-dom'
import RootLayout from './RootLayout'
import HomePage from './HomePage'
import SignIn from '../auth/SignIn'
import SignUp from '../auth/SignUp'
import ListingDetailPage from '../features/listings/ListingDetailPage'
import BookingFlowPage from '../features/bookings/BookingFlowPage'
import DashboardRouter from './dashboard/DashboardRouter'
import BusinessRouter from './business/BusinessRouter'
import AiRouter from './ai/AiRouter'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="listings/:slug" element={<ListingDetailPage />} />
        <Route path="listings/:slug/book" element={<BookingFlowPage />} />
        <Route path="sign-in" element={<SignIn />} />
        <Route path="sign-up" element={<SignUp />} />
        <DashboardRouter />
        <BusinessRouter />
        <AiRouter />
      </Route>
    </Routes>
  )
}
