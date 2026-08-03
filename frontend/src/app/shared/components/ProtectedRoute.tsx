import React from 'react'
import { Navigate } from 'react-router-dom'
import useAuth from '../../auth/useAuth'

type Props = { children: React.ReactNode; roles?: string[] }

export default function ProtectedRoute({ children, roles }: Props){
  const { isSignedIn, role } = useAuth()
  if (!isSignedIn) return <Navigate to="/sign-in" replace />

  // If roles specified, ensure user role is included
  if (roles && roles.length > 0) {
    if (!role || !roles.includes(role)) return <Navigate to="/" replace />
  }
  return <>{children}</>
}
