export type BookingModelType =
  | 'ROOM_AVAILABILITY'
  | 'TABLE_RESERVATION'
  | 'FLEET_AVAILABILITY'
  | 'SLOT_BASED'

export type BookingPackageOption = {
  id: string
  label: string
  description: string
  price: number
}

export type BookingSelection = {
  bookingModel: BookingModelType
  date?: string
  endDate?: string
  timeSlot?: string
  guestCount: number
  packageId?: string
  pickupLocation?: string
  resourceId?: string
}

export type BookingCreatePayload = {
  listing_id: string
  user_id: string
  booking_model: BookingModelType
  resource_type: string
  resource_id: string
  quantity: number
  check_in_at?: string
  check_out_at?: string
  total_amount: number
  currency: string
  notes?: string
}

export type BookingResponse = {
  id: string
  status: string
  total_amount: number
  currency: string
}
