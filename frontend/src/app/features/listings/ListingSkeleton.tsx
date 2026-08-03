import React from 'react'

export default function ListingSkeleton() {
  return (
    <article className="animate-pulse rounded-3xl border border-slate-200 bg-slate-100 p-4">
      <div className="h-48 w-full rounded-2xl bg-slate-200" />
      <div className="mt-4 h-5 w-3/4 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-4 w-1/4 rounded bg-slate-200" />
      </div>
    </article>
  )
}
