import React from 'react'
import ListingListView from '../features/listings/ListingListView'

export default function HomeRoute() {
  return (
    <section>
      <ListingListView page={1} limit={12} sort="created_at_desc" />
    </section>
  )
}
