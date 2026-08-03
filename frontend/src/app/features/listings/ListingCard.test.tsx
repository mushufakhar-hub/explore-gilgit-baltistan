import React from 'react'
import { render, screen } from '@testing-library/react'
import ListingCard from './ListingCard'

describe('ListingCard', () => {
  it('renders title, subtitle, location, and price', () => {
    render(
      <ListingCard
        id="l1"
        title="Mountain Retreat"
        subtitle="Cozy stay by the lake"
        location="Hunza, GB"
        price="PKR 12,000"
        categoryGroup="stay"
      />,
    )

    expect(screen.getByText('Mountain Retreat')).toBeInTheDocument()
    expect(screen.getByText('Cozy stay by the lake')).toBeInTheDocument()
    expect(screen.getByText('Hunza, GB')).toBeInTheDocument()
    expect(screen.getByText('PKR 12,000')).toBeInTheDocument()
  })

  it('renders a link when slug is provided', () => {
    render(
      <ListingCard
        id="l2"
        slug="mountain-retreat"
        title="Mountain Retreat"
        categoryGroup="stay"
      />,
    )

    expect(screen.getByRole('link', { name: /view mountain retreat/i })).toHaveAttribute('href', '/listings/mountain-retreat')
  })
})
