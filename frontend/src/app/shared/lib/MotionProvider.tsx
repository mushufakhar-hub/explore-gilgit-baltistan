import React from 'react'
import { MotionConfig } from 'framer-motion'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export default function MotionProvider({ children }: { children: React.ReactNode }){
  const prefersReduced = usePrefersReducedMotion()
  // If user prefers reduced motion, set extremely short durations via MotionConfig
  const reduced = prefersReduced
  return (
    <MotionConfig reducedMotion={reduced ? 'always' : 'never'}>
      {children}
    </MotionConfig>
  )
}
