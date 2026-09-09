'use client'

import * as React from 'react'
import { useInView, useReducedMotion } from '@/lib/hooks'
import { cn } from '@/lib/utils'

/** Gentle scroll reveal. Becomes a no-op under prefers-reduced-motion. */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.15 })
  const reduced = useReducedMotion()

  return (
    <Tag
      ref={ref as never}
      className={cn(
        'transition-[opacity,transform] duration-700 ease-organic motion-reduce:transition-none',
        inView || reduced ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
        className,
      )}
      style={{ transitionDelay: inView && !reduced ? `${delay}ms` : undefined }}
    >
      {children}
    </Tag>
  )
}
