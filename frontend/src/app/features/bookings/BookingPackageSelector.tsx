import React from 'react'
import type { BookingPackageOption, BookingModelType } from './BookingFlowTypes'

const packageOptionsByModel: Record<BookingModelType, BookingPackageOption[]> = {
  ROOM_AVAILABILITY: [
    { id: 'standard', label: 'Standard Room', description: 'Comfortable room for 2 guests', price: 12000 },
    { id: 'deluxe', label: 'Deluxe Suite', description: 'Premium room with mountain view', price: 19500 },
  ],
  TABLE_RESERVATION: [
    { id: 'table-basic', label: 'Dining Table', description: 'Table for up to 4 guests', price: 0 },
    { id: 'table-chef', label: 'Chef’s Tasting', description: 'Curated menu with wine pairings', price: 6500 },
  ],
  FLEET_AVAILABILITY: [
    { id: 'sedan', label: 'Sedan', description: '4-passenger scenic transfer', price: 8500 },
    { id: 'suv', label: 'SUV', description: 'Up to 6 passengers with luggage', price: 12500 },
  ],
  SLOT_BASED: [
    { id: 'morning', label: 'Morning Slot', description: '8:00 AM to 11:00 AM', price: 2400 },
    { id: 'evening', label: 'Evening Slot', description: '4:00 PM to 7:00 PM', price: 2600 },
  ],
}

export default function BookingPackageSelector({
  bookingModel,
  selectedPackageId,
  onSelectPackage,
}: {
  bookingModel: BookingModelType
  selectedPackageId?: string
  onSelectPackage: (packageId: string) => void
}) {
  const options = packageOptionsByModel[bookingModel]

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Package selection</p>
        <h3 className="text-xl font-semibold text-slate-900">Pick the package that fits your booking</h3>
      </div>
      <div className="space-y-4">
        {options.map((option) => (
          <button
            type="button"
            key={option.id}
            onClick={() => onSelectPackage(option.id)}
            className={`w-full rounded-3xl border p-5 text-left transition duration-200 ${
              selectedPackageId === option.id ? 'border-indigo-600 bg-indigo-50' : 'border-slate-200 bg-slate-50 hover:border-indigo-300'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">{option.label}</p>
                <p className="mt-2 text-sm text-slate-600">{option.description}</p>
              </div>
              <span className="text-sm font-semibold text-indigo-700">PKR {option.price.toLocaleString()}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
