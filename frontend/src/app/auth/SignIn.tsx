import React from 'react'
import { SignIn as ClerkSignIn } from '@clerk/clerk-react'

export default function SignIn(){
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <ClerkSignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </div>
  )
}
