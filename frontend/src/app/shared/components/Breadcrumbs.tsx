import React from 'react'
import { Link } from 'react-router-dom'

type BreadcrumbItem = {
  name: string
  to?: string
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              {item.to && !isLast ? (
                <Link to={item.to} className="text-slate-500 transition hover:text-slate-900">
                  {item.name}
                </Link>
              ) : (
                <span className={isLast ? 'font-medium text-slate-700' : 'text-slate-500'}>
                  {item.name}
                </span>
              )}

              {!isLast ? <span aria-hidden="true">/</span> : null}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
