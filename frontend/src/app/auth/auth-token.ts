// Simple registry to provide async bearer token getter to non-hook modules
type TokenGetter = () => Promise<string | null>

let getter: TokenGetter | null = null

export function registerTokenGetter(fn: TokenGetter) {
  getter = fn
}

export async function getAuthToken(): Promise<string | null> {
  if (!getter) return null
  try {
    return await getter()
  } catch {
    return null
  }
}
