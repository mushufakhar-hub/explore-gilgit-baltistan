import React from 'react'
import { Route } from 'react-router-dom'
import DashboardLayout from '../../features/dashboard/DashboardLayout'
import DashboardIndexPage from '../../features/dashboard/DashboardIndexPage'
import SavedPlacesPage from '../../features/dashboard/savedPlaces/SavedPlacesPage'
import WishlistPage from '../../features/dashboard/wishlist/WishlistPage'
import TripsPage from '../../features/dashboard/trips/TripsPage'
import ReviewsPage from '../../features/dashboard/reviews/ReviewsPage'
import BookingsPage from '../../features/dashboard/bookings/BookingsPage'
import PlansPage from '../../features/dashboard/plans/PlansPage'

export default function DashboardRouter() {
  return (
    <Route path="dashboard" element={<DashboardLayout />}>
      <Route index element={<DashboardIndexPage />} />
      <Route path="saved-places" element={<SavedPlacesPage />} />
      <Route path="wishlist" element={<WishlistPage />} />
      <Route path="trips" element={<TripsPage />} />
      <Route path="reviews" element={<ReviewsPage />} />
      <Route path="bookings" element={<BookingsPage />} />
      <Route path="plans" element={<PlansPage />} />
    </Route>
  )
}
