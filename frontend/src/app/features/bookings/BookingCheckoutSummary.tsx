import React from 'react'
import type { BookingSelection } from './BookingFlowTypes'

export default function BookingCheckoutSummary({
  selection,
  packageName,
  packagePrice,
}: {
  selection: BookingSelection
  packageName?: string
  packagePrice?: number
}) {
  const nights = selection.date && selection.endDate ? Math.max(1, (new Date(selection.endDate).getTime() - new Date(selection.date).getTime()) / (1000 * 60 * 60 * 24)) : 1
  const subtotal = (packagePrice ?? 0) * (selection.bookingModel === 'ROOM_AVAILABILITY' ? nights : 1)

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Checkout summary</p>
        <h3 className="text-xl font-semibold text-slate-900">Review your booking details</h3>
      </div>
      <div className="space-y-3 text-sm text-slate-700">
        <div className="flex justify-between gap-4">
          <span>Booking type</span>
          <span>{selection.bookingModel.replace('_', ' ')}</span>
        </div>
        {selection.date ? (
          <div className="flex justify-between gap-4">
            <span>Check-in</span>
            <span>{selection.date}</span>
          </div>
        ) : null}
        {selection.endDate ? (
          <div className="flex justify-between gap-4">
            <span>Check-out</span>
            <span>{selection.endDate}</span>
          </div>
        ) : null}
        {selection.timeSlot ? (
          <div className="flex justify-between gap-4">
            <span>Time slot</span>
            <span>{selection.timeSlot}</span>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <span>Guests</span>
          <span>{selection.guestCount}</span>
        </div>
        {selection.pickupLocation ? (
          <div className="flex justify-between gap-4">
            <span>Pickup</span>
            <span>{selection.pickupLocation}</span>
          </div>
        ) : null}
        {packageName ? (
          <div className="flex justify-between gap-4">
            <span>Package</span>
            <span>{packageName}</span>
          </div>
        ) : null}
      </div>
      <div className="mt-6 rounded-3xl bg-slate-50 p-5 text-sm text-slate-900">
        <div className="flex justify-between border-b border-slate-200 pb-3">
          <span>Subtotal</span>
          <span>PKR {subtotal.toLocaleString()}</span>
        </div>
        <p className="mt-3 text-sm text-slate-500">Final price may vary after backend availability validation.</p>
      </div>
    </div>
  )
}
