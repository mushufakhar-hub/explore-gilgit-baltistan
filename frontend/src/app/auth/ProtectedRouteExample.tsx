import React from 'react'
import ProtectedRoute from '../shared/components/ProtectedRoute'

export default function ProtectedRouteExample(){
  return (
    <ProtectedRoute roles={["Business","Admin"]}>
      <div>Protected content for Business or Admin</div>
    </ProtectedRoute>
  )
}
