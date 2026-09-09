'use client'

import * as React from 'react'
import { useInView, useReducedMotion } from '@/lib/hooks'
import { cn } from '@/lib/utils'

/**
 * A scroll reveal: content rises a little and fades in once, slowly.
 * Under prefers-reduced-motion it is simply there.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
  distance = 22,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article' | 'figure' | 'header'
  distance?: number
}) {
  const [ref, inView] = useInView<HTMLDivElement>(0.16)
  const reduced = useReducedMotion()
  const shown = inView || reduced

  return (
    <Tag
      ref={ref as never}
      className={cn('transition-[opacity,transform] duration-1100 ease-cinema motion-reduce:transition-none', className)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : `translateY(${distance}px)`,
        transitionDelay: shown && !reduced ? `${delay}ms` : undefined,
      }}
    >
      {children}
    </Tag>
  )
}

/**
 * The cinematic title: each glyph rises out of a blur, in sequence, as though
 * the word were being written.
 */
export function SplitTitle({
  text,
  className,
  delay = 0,
  step = 90,
  ariaLabel,
}: {
  text: string
  className?: string
  delay?: number
  step?: number
  ariaLabel?: string
}) {
  const glyphs = React.useMemo(() => [...text], [text])
  return (
    <span className={className} aria-label={ariaLabel ?? text} role="text">
      {glyphs.map((glyph, i) => (
        <span
          key={`${glyph}-${i}`}
          aria-hidden
          className="glyph"
          style={{ animationDelay: `${delay + i * step}ms` }}
        >
          {glyph === ' ' ? ' ' : glyph}
        </span>
      ))}
    </span>
  )
}

/**
 * A magnetic control: it leans a few pixels toward the pointer, then settles
 * back. Subtle on purpose, and off entirely for reduced motion and touch.
 */
export function Magnetic({
  children,
  strength = 10,
  className,
}: {
  children: React.ReactNode
  strength?: number
  className?: string
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const reduced = useReducedMotion()

  const onMove = (event: React.PointerEvent<HTMLSpanElement>) => {
    if (reduced || event.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    el.style.transform = `translate(${dx * strength}px, ${dy * strength * 0.5}px)`
  }

  const reset = () => {
    const el = ref.current
    if (el) el.style.transform = ''
  }

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={cn('inline-block transition-transform duration-500 ease-cinema', className)}
    >
      {children}
    </span>
  )
}

/** Parallax: shifts a layer against the scroll, gently. */
export function Parallax({
  children,
  amount = 40,
  className,
}: {
  children: React.ReactNode
  amount?: number
  className?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  React.useEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    let frame = 0
    let visible = false

    const tick = () => {
      const rect = el.getBoundingClientRect()
      const middle = rect.top + rect.height / 2
      const offset = (middle - window.innerHeight / 2) / window.innerHeight
      el.style.transform = `translate3d(0, ${(-offset * amount).toFixed(2)}px, 0)`
      frame = visible ? requestAnimationFrame(tick) : 0
    }

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame) frame = requestAnimationFrame(tick)
    })
    io.observe(el)

    return () => {
      io.disconnect()
      if (frame) cancelAnimationFrame(frame)
      visible = false
    }
  }, [amount, reduced])

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  )
}
