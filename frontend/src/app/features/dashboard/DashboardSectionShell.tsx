import React from 'react'

export default function DashboardSectionShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-slate-600 max-w-2xl">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
