import React, { useEffect, useState } from 'react'
import { createAiTripPlan, getAiTripPlanStatus, type AiTripPlannerRequest, type AiTripPlannerResult, type AiTripPlannerStatus } from './ai-api'
import AiTripPlannerForm from './AiTripPlannerForm'
import AiTripPlannerResultView from './AiTripPlannerResultView'

export default function AiTripPlannerPage() {
  const [taskId, setTaskId] = useState<string | null>(null)
  const [status, setStatus] = useState<AiTripPlannerStatus>({ status: 'unknown' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!taskId) return

    const interval = setInterval(async () => {
      try {
        const next = await getAiTripPlanStatus(taskId)
        setStatus(next)
      } catch {
        setStatus({ status: 'failed' })
        setError('The AI service is currently unavailable. Please try again later.')
      }
    }, 2500)

    return () => clearInterval(interval)
  }, [taskId])

  useEffect(() => {
    if (status.status === 'finished' || status.status === 'failed') {
      setIsSubmitting(false)
    }
  }, [status.status])

  const handleSubmit = async (payload: AiTripPlannerRequest) => {
    setError(null)
    setIsSubmitting(true)
    try {
      const response = await createAiTripPlan(payload)
      setTaskId(response.task_id)
      setStatus({ status: 'running' })
    } catch {
      setError('Unable to reach the AI service. Please try again later.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <AiTripPlannerForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-rose-700 shadow-sm">
          <p className="font-semibold">AI service unavailable</p>
          <p className="mt-2 text-sm">{error}</p>
        </div>
      ) : null}

      {taskId && status.status === 'running' ? (
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <p className="text-lg font-semibold">Generating your itinerary…</p>
          <p className="mt-2 text-slate-600">This may take a moment while the AI prepares your daily plan.</p>
        </div>
      ) : null}

      {status.status === 'finished' && status.result ? (
        <AiTripPlannerResultView result={status.result as AiTripPlannerResult} />
      ) : null}

      {status.status === 'failed' ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-amber-800 shadow-sm">
          <p className="font-semibold">The AI planner could not complete the request.</p>
          <p className="mt-2 text-sm">Try again later or adjust your inputs. If the backend is down, the service will recover soon.</p>
        </div>
      ) : null}
    </div>
  )
}
