import api from '../../shared/lib/api-client'

export type AiTripPlannerRequest = {
  origin: string
  days: number
  budget: number
  travel_style: string
  party_size: number
}

export type AiTripPlannerResult = {
  name: string
  days: number
  items: Array<{ listing_id: string; day: number; title: string; description?: string }>
  cost_breakdown?: { [key: string]: number }
  packing_list?: string[]
}

export type AiTripPlannerStatus = {
  status: 'running' | 'finished' | 'failed' | 'unknown'
  result?: AiTripPlannerResult
}

export async function createAiTripPlan(payload: AiTripPlannerRequest) {
  return api.post<{ task_id: string; cached: boolean }>('/ai/trip-plans', payload)
}

export async function getAiTripPlanStatus(taskId: string) {
  return api.get<AiTripPlannerStatus>(`/ai/trip-plans/${taskId}`)
}
