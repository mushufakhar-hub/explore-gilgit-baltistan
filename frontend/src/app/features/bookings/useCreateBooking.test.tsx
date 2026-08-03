import type { ReactNode } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi } from 'vitest'

import useCreateBooking from './useCreateBooking'
import api from '../../shared/lib/api-client'

describe('useCreateBooking', () => {
  const queryClient = new QueryClient()

  beforeEach(() => {
    vi.spyOn(api, 'post').mockResolvedValue({ id: 'booking-1', status: 'CONFIRMED' } as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    queryClient.clear()
  })

  it('submits booking payload and returns data', async () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    const { result } = renderHook(() => useCreateBooking(), { wrapper })

    result.current.mutateAsync({
      listing_id: 'l1',
      user_id: 'guest_user',
      booking_model: 'ROOM_AVAILABILITY',
      resource_type: 'listing',
      resource_id: 'l1',
      quantity: 2,
      check_in_at: '2026-09-01',
      check_out_at: '2026-09-03',
      total_amount: 12000,
      currency: 'PKR',
      notes: 'Pickup at hotel',
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.post).toHaveBeenCalledWith('/bookings', expect.any(Object))
    expect(result.current.data).toEqual({ id: 'booking-1', status: 'CONFIRMED' })
  })
})
