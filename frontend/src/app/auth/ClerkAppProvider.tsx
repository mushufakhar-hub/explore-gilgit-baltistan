import React, { PropsWithChildren, useEffect } from 'react'
import { ClerkProvider, useAuth } from '@clerk/clerk-react'
import { registerTokenGetter } from './auth-token'

function RegisterToken() {
  const { getToken } = useAuth() as { getToken: (opts?: any) => Promise<string> }
  useEffect(() => {
    // register a token getter for api client
    registerTokenGetter(async () => {
      try {
        const token = await getToken()
        return token ? `Bearer ${token}` : null
      } catch {
        return null
      }
    })
  }, [getToken])
  return null
}

export default function ClerkAppProvider({ children }: PropsWithChildren) {
  const publishableKey = ((import.meta as ImportMeta & { env?: Record<string, string | undefined> }).env?.VITE_CLERK_PUBLISHABLE_KEY ?? process.env.REACT_APP_CLERK_PUBLISHABLE_KEY) as string | undefined
  if (!publishableKey) {
    console.warn('VITE_CLERK_PUBLISHABLE_KEY not set; Clerk will not be initialized')
  }

  return (
    <ClerkProvider publishableKey={publishableKey ?? ''}>
      <RegisterToken />
      {children}
    </ClerkProvider>
  )
}
