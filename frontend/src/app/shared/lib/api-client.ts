/* Typed API client wrapper that matches backend standardized error shape.
   Reads base URL from Vite env var `VITE_API_BASE_URL` or process env fallback.
*/

export type ApiErrorPayload = {
  success: false
  error: {
    code: string
    message: string
    details: any
  }
}

export class ApiError extends Error {
  public payload: ApiErrorPayload
  public status: number

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.error.message)
    this.name = 'ApiError'
    this.payload = payload
    this.status = status
  }
}

const getBase = (): string => {
  const vite = typeof import.meta !== 'undefined'
    ? (import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_API_BASE_URL
    : undefined
  const node = typeof process !== 'undefined' ? process.env.REACT_APP_API_BASE_URL : undefined
  return (vite || node || '').replace(/\/$/, '')
}

import { getAuthToken } from '../../auth/auth-token'

const BASE = getBase()

type RequestOptions = Omit<RequestInit, 'body' | 'method'> & { body?: any }

async function parseJsonSafe(resp: Response) {
  const ct = resp.headers.get('content-type') || ''
  if (ct.includes('application/json')) return resp.json()
  return null
}

export async function apiRequest<T>(path: string, method: string = 'GET', opts: RequestOptions = {}): Promise<T> {
  const url = BASE ? `${BASE}${path}` : path
  const headers: Record<string, string> = { ...(opts.headers as Record<string, string> || {}) }
  let body: BodyInit | undefined
  if (opts.body !== undefined) {
    headers['content-type'] = 'application/json'
    body = JSON.stringify(opts.body)
  }

  const token = await getAuthToken()
  if (token) headers['authorization'] = token
  const resp = await fetch(url, { method, headers, body, credentials: 'include' })
  const data = await parseJsonSafe(resp)

  if (!resp.ok) {
    // If the backend returned our standardized error shape, wrap it
    if (data && typeof data === 'object' && data.success === false && data.error) {
      throw new ApiError(resp.status, data as ApiErrorPayload)
    }
    // Otherwise, construct a generic ApiError
    const payload: ApiErrorPayload = {
      success: false,
      error: { code: 'http_error', message: resp.statusText || 'HTTP error', details: data },
    }
    throw new ApiError(resp.status, payload)
  }

  return data as T
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) => apiRequest<T>(path, 'GET', opts),
  post: <T>(path: string, body?: any, opts?: RequestOptions) => apiRequest<T>(path, 'POST', { ...opts, body }),
  put: <T>(path: string, body?: any, opts?: RequestOptions) => apiRequest<T>(path, 'PUT', { ...opts, body }),
  del: <T>(path: string, opts?: RequestOptions) => apiRequest<T>(path, 'DELETE', opts),
}

export default api
