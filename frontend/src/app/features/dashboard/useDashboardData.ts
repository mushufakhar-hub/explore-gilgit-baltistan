import { useQuery } from '@tanstack/react-query'

export type DashboardLoadMode = 'success' | 'empty' | 'error'

export default function useDashboardData<T>(queryKey: readonly unknown[], data: T, mode: DashboardLoadMode = 'success') {
  return useQuery<T, Error>({
    queryKey,
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 400))
      if (mode === 'error') {
        throw new Error('Unable to load dashboard data. Please try again.')
      }

      if (mode === 'empty') {
        return ([] as unknown) as T
      }

      return data
    },
    staleTime: 1000 * 60,
    retry: false,
  })
}
