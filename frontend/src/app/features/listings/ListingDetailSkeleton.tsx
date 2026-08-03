import React from 'react'

export default function ListingDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="animate-pulse space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8">
        <div className="h-7 w-48 rounded-full bg-slate-200" />
        <div className="h-6 w-32 rounded-full bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-64 rounded-[1.5rem] bg-slate-200" />
          <div className="h-64 rounded-[1.5rem] bg-slate-200" />
          <div className="h-64 rounded-[1.5rem] bg-slate-200" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8">
          <div className="h-6 w-40 rounded-full bg-slate-200" />
          <div className="h-48 rounded-[1.5rem] bg-slate-200" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-16 rounded-3xl bg-slate-200" />
            <div className="h-16 rounded-3xl bg-slate-200" />
          </div>
        </div>
        <div className="space-y-4 rounded-[2rem] border border-slate-200 bg-white p-8">
          <div className="h-6 w-32 rounded-full bg-slate-200" />
          <div className="h-44 rounded-[1.5rem] bg-slate-200" />
        </div>
      </div>
    </div>
  )
}
