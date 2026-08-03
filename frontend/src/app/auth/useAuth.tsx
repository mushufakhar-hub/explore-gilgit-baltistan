import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react'

export default function useAuth() {
  const { isSignedIn, userId, getToken } = useClerkAuth() as { isSignedIn: boolean; userId?: string; getToken: (opts?: any) => Promise<string> }
  const currentUser = useUser() as { user?: { publicMetadata?: Record<string, unknown> } }

  const role = (currentUser.user?.publicMetadata?.role as string | null) ?? null

  return {
    isSignedIn,
    userId,
    user: currentUser.user,
    role,
    getToken,
  }
}
