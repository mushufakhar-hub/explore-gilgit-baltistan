import React from 'react'
import { SignUp as ClerkSignUp } from '@clerk/clerk-react'

export default function SignUp(){
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create an account</h1>
      <ClerkSignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </div>
  )
}
