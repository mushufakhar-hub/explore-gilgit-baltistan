import React from 'react'

export default function BusinessOnboardingTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-slate-600">{description}</p>
    </div>
  )
}
