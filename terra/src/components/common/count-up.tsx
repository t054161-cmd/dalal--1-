'use client'

import * as React from 'react'
import { useI18n } from '@/i18n/provider'
import { useInView, useReducedMotion } from '@/lib/hooks'

/**
 * Counts up to a number when it scrolls into view. Under reduced motion it
 * simply prints the final figure — no animation, same information.
 */
export function CountUp({
  to,
  duration = 1800,
  className,
  /** Adds this many per second after the count-up finishes (live ticker). */
  perSecond = 0,
}: {
  to: number
  duration?: number
  className?: string
  perSecond?: number
}) {
  const { n } = useI18n()
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.4 })
  const reduced = useReducedMotion()
  const [value, setValue] = React.useState(0)

  React.useEffect(() => {
    if (!inView) return
    if (reduced) {
      setValue(to)
      return
    }
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      // easeOutQuart — fast at first, settles gently.
      const eased = 1 - Math.pow(1 - progress, 4)
      setValue(Math.round(to * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, to, duration, reduced])

  // The live part: keep nudging the number up while the section is on screen.
  React.useEffect(() => {
    if (!inView || !perSecond || reduced) return
    const id = window.setInterval(() => setValue((v) => (v >= to ? v + perSecond : v)), 1000)
    return () => window.clearInterval(id)
  }, [inView, perSecond, reduced, to])

  return (
    <span ref={ref} className={className}>
      {n(Math.round(value))}
    </span>
  )
}
