import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import BookingCalendar from './BookingCalendar'
import BookingPackageSelector from './BookingPackageSelector'
import BookingCheckoutSummary from './BookingCheckoutSummary'
import useCreateBooking from './useCreateBooking'
import type { BookingModelType, BookingSelection } from './BookingFlowTypes'
import useListingDetail from '../listings/useListingDetail'
import ListingDetailSkeleton from '../listings/ListingDetailSkeleton'
import ListingErrorState from '../listings/ListingErrorState'

const PACKAGE_OPTIONS: Record<BookingModelType, { id: string; label: string; price: number }[]> = {
  ROOM_AVAILABILITY: [
    { id: 'standard', label: 'Standard Room', price: 12000 },
    { id: 'deluxe', label: 'Deluxe Suite', price: 19500 },
  ],
  TABLE_RESERVATION: [
    { id: 'table-basic', label: 'Dining Table', price: 0 },
    { id: 'table-chef', label: 'Chef’s Tasting', price: 6500 },
  ],
  FLEET_AVAILABILITY: [
    { id: 'sedan', label: 'Sedan', price: 8500 },
    { id: 'suv', label: 'SUV', price: 12500 },
  ],
  SLOT_BASED: [
    { id: 'morning', label: 'Morning Slot', price: 2400 },
    { id: 'evening', label: 'Evening Slot', price: 2600 },
  ],
}

const PACKAGE_BY_ID = Object.values(PACKAGE_OPTIONS).flat().reduce((map, option) => {
  map[option.id] = option
  return map
}, {} as Record<string, { id: string; label: string; price: number }>)

const PACKAGE_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(PACKAGE_BY_ID).map(([id, option]) => [id, option.label]),
)

const DEFAULT_SELECTION: BookingSelection = {
  bookingModel: 'ROOM_AVAILABILITY',
  guestCount: 2,
}

function availableBookingModels(listing: any): BookingModelType[] {
  if (!listing) return ['ROOM_AVAILABILITY']
  return [listing.category.booking_model ?? 'ROOM_AVAILABILITY'] as BookingModelType[]
}

function BookingFlowPage() {
  const { slug } = useParams()
  const { data: listing, error, isError, isLoading, refetch } = useListingDetail(slug)
  const [step, setStep] = useState(1)
  const [selection, setSelection] = useState<BookingSelection>(DEFAULT_SELECTION)
  const createBooking = useCreateBooking()

  const bookingModels = useMemo(() => availableBookingModels(listing), [listing])
  const selectedPackageOption = selection.packageId ? PACKAGE_BY_ID[selection.packageId] : undefined
  const selectedPackage = selectedPackageOption?.label
  const packagePrice = selectedPackageOption?.price ?? 0

  if (isLoading) {
    return <ListingDetailSkeleton />
  }

  if (isError || !listing) {
    return <ListingErrorState error={error} reset={refetch} />
  }

  const handleSubmit = async () => {
    if (!listing) return
    const payload = {
      listing_id: listing.id,
      user_id: 'guest_user',
      booking_model: selection.bookingModel,
      resource_type: listing.category.kind === 'BUSINESS' ? 'listing' : 'experience',
      resource_id: listing.id,
      quantity: selection.guestCount,
      check_in_at: selection.date,
      check_out_at: selection.endDate,
      total_amount: packagePrice,
      currency: 'PKR',
      notes: selection.pickupLocation,
    }

    await createBooking.mutateAsync(payload)
  }

  const model = bookingModels[0]

  return (
    <div className="space-y-10">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Booking flow</p>
          <h1 className="text-3xl font-semibold text-slate-900">Reserve your experience</h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600">Select availability, guests, package, and confirm your booking with optimistic checkout behavior.</p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Step {step}: {step === 1 ? 'Choose dates' : step === 2 ? 'Select package' : 'Confirm booking'}</h2>
            <div className="space-y-6 pt-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-700">
                  Booking type
                  <select
                    value={selection.bookingModel}
                    onChange={(event) => setSelection((current) => ({ ...current, bookingModel: event.target.value as BookingModelType }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
                  >
                    {bookingModels.map((value) => (
                      <option value={value} key={value}>{value.replace('_', ' ')}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2 text-sm text-slate-700">
                  Guests
                  <input
                    type="number"
                    min={1}
                    value={selection.guestCount}
                    onChange={(event) => setSelection((current) => ({ ...current, guestCount: Number(event.target.value) }))}
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
                  />
                </label>
              </div>
              <BookingCalendar
                bookingModel={selection.bookingModel}
                selectedDate={selection.date}
                selectedEndDate={selection.endDate}
                onSelectDate={(date) => setSelection((current) => ({ ...current, date }))}
                onSelectEndDate={(date) => setSelection((current) => ({ ...current, endDate: date }))}
              />
            </div>
          </div>

          <BookingPackageSelector
            bookingModel={selection.bookingModel}
            selectedPackageId={selection.packageId}
            onSelectPackage={(packageId) => setSelection((current) => ({ ...current, packageId }))}
          />

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm space-y-4">
            <h2 className="text-2xl font-semibold text-slate-900">Booking options</h2>
            <label className="space-y-2 text-sm text-slate-700">
              Pickup location
              <input
                type="text"
                value={selection.pickupLocation ?? ''}
                onChange={(event) => setSelection((current) => ({ ...current, pickupLocation: event.target.value }))}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
              />
            </label>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => setStep(Math.min(3, step + 1))}
              className="rounded-full bg-indigo-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              Next step
            </button>
          </div>
        </div>

        <aside className="space-y-6">
          <BookingCheckoutSummary
            selection={selection}
            packageName={selectedPackage}
            packagePrice={packagePrice}
          />
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Checkout</p>
            <button
              type="button"
              disabled={!selection.date || (selection.bookingModel === 'ROOM_AVAILABILITY' && !selection.endDate) || !selection.packageId || createBooking.isPending}
              onClick={handleSubmit}
              className="mt-4 w-full rounded-full bg-saffron-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-saffron-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createBooking.isPending ? 'Processing…' : 'Confirm booking'}
            </button>
            {createBooking.isError ? (
              <p className="mt-4 text-sm text-rose-600">Booking failed. Please try again or adjust your selections.</p>
            ) : null}
            {createBooking.isSuccess ? (
              <p className="mt-4 text-sm text-emerald-700">Booking confirmed! Reference ID: {createBooking.data?.id}</p>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  )
}

export default BookingFlowPage
