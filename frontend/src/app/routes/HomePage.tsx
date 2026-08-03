import React from 'react'
import HeroSection from '../features/home/HeroSection'
import FeaturedDestinations from '../features/home/FeaturedDestinations'
import PopularHotels from '../features/home/PopularHotels'
import TrendingRestaurants from '../features/home/TrendingRestaurants'
import BrowseCategories from '../features/home/BrowseCategories'
import AiTripPlannerCta from '../features/home/AiTripPlannerCta'
import FooterLegal from '../features/home/FooterLegal'

import HomeSeo from '../features/home/HomeSeo'

export default function HomePage() {
  return (
    <div className="space-y-20">
      <HomeSeo />
      <HeroSection />
      <FeaturedDestinations />
      <PopularHotels />
      <TrendingRestaurants />
      <BrowseCategories />
      <AiTripPlannerCta />
      <FooterLegal />
    </div>
  )
}
