import React from 'react'
import { Link } from 'react-router-dom'

export default function Layout({ children }: { children: React.ReactNode }){
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div style={{width:36,height:36,backgroundColor:'var(--color-glacier-500)'}} className="rounded-md" aria-hidden />
            <span className="font-semibold text-lg">Explore GB</span>
          </Link>
          <nav>
            <ul className="flex items-center gap-3">
              <li><Link to="/listings" className="px-3 py-2 rounded hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">Listings</Link></li>
              <li><Link to="/dashboard" className="px-3 py-2 rounded hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">Dashboard</Link></li>
              <li><Link to="/trips" className="px-3 py-2 rounded hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">Trips</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container px-4 py-8">{children}</main>

      <footer className="border-t mt-12 py-6 text-center text-sm text-slate-600">
        <div className="container px-4">© Explore Gilgit-Baltistan</div>
      </footer>
    </div>
  )
}
