import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }

export default function Button({ variant = 'primary', children, ...rest }: ButtonProps) {
  const base = 'inline-flex items-center rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2'
  const style = variant === 'primary' ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500' : 'bg-transparent text-slate-700 hover:bg-slate-100'
  return (
    <button className={`${base} ${style}`} {...rest}>
      {children}
    </button>
  )
}
