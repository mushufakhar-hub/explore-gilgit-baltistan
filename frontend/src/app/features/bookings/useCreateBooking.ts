import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../../shared/lib/api-client'
import type { BookingCreatePayload } from './BookingFlowTypes'

export default function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation<{ id: string; status: string }, Error, BookingCreatePayload>({
    mutationFn: (payload: BookingCreatePayload) => api.post('/bookings', payload),
    onMutate: async (newBooking) => {
      await queryClient.cancelQueries({ queryKey: ['booking', newBooking.listing_id] })
      const previous = queryClient.getQueryData<{ id: string; status: string }[]>(['booking', newBooking.listing_id])
      queryClient.setQueryData<{ id: string; status: string }[]>(['booking', newBooking.listing_id], (old) => [
        ...(Array.isArray(old) ? old : []),
        { ...newBooking, id: `optimistic-${newBooking.listing_id}`, status: 'PENDING', optimistic: true },
      ])
      return { previous }
    },
    onError: (_error, _variables, context) => {
      const previousContext = context as { previous?: { id: string; status: string }[] } | undefined
      if (previousContext?.previous) {
        queryClient.setQueryData(['booking', _variables.listing_id], previousContext.previous)
      }
    },
    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['booking', variables.listing_id] })
    },
  })
}
