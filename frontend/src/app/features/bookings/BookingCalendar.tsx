import React from 'react'
import type { BookingModelType } from './BookingFlowTypes'

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const formatShortDate = (date: Date) => date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

export default function BookingCalendar({
  bookingModel,
  selectedDate,
  selectedEndDate,
  onSelectDate,
  onSelectEndDate,
}: {
  bookingModel: BookingModelType
  selectedDate?: string
  selectedEndDate?: string
  onSelectDate: (date: string) => void
  onSelectEndDate?: (date: string) => void
}) {
  const today = new Date()
  const days = Array.from({ length: 14 }).map((_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() + index)
    return date
  })

  const isSelected = (current: string) => current === selectedDate
  const isInRange = (current: string) => {
    if (!selectedDate || !selectedEndDate) return false
    const from = new Date(selectedDate)
    const to = new Date(selectedEndDate)
    const currentDate = new Date(current)
    return currentDate >= from && currentDate <= to
  }

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Availability calendar</p>
          <h3 className="text-xl font-semibold text-slate-900">Select your preferred {bookingModel === 'TABLE_RESERVATION' ? 'reservation' : 'travel'} dates</h3>
        </div>
        <div className="text-sm text-slate-500">
          {selectedDate ? `Start: ${selectedDate}` : 'Choose a start date'}
          {bookingModel === 'ROOM_AVAILABILITY' && selectedEndDate ? ` • End: ${selectedEndDate}` : ''}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-7">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            {name}
          </div>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-7">
        {days.map((date) => {
          const dateKey = date.toISOString().split('T')[0]
          const selected = isSelected(dateKey)
          const inRange = isInRange(dateKey)
          return (
            <button
              key={dateKey}
              type="button"
              onClick={() => {
                if (bookingModel === 'ROOM_AVAILABILITY' && onSelectEndDate) {
                  if (!selectedDate || !selectedEndDate) {
                    onSelectDate(dateKey)
                    if (onSelectEndDate) onSelectEndDate(dateKey)
                    return
                  }
                  const start = new Date(selectedDate)
                  if (date < start) {
                    onSelectDate(dateKey)
                    if (onSelectEndDate) onSelectEndDate(dateKey)
                  } else {
                    if (onSelectEndDate) onSelectEndDate(dateKey)
                  }
                } else {
                  onSelectDate(dateKey)
                }
              }}
              className={`rounded-3xl border px-3 py-4 text-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                selected ? 'border-indigo-600 bg-indigo-600 text-white' : inRange ? 'border-indigo-200 bg-indigo-50 text-slate-900' : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <span className="block font-semibold">{date.getDate()}</span>
              <span className="text-[0.65rem] text-slate-500">{formatShortDate(date)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
