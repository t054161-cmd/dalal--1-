'use client'

import * as React from 'react'
import { paintPattern } from '@/lib/patterns'
import type { PatternId } from '@/types'

/**
 * A live swatch of a pattern, painted with the same code that prints it on the
 * cup — so what the button shows is exactly what the body gets.
 */
export function PatternSwatch({
  pattern,
  ink,
  body,
  size = 96,
}: {
  pattern: PatternId
  ink: string
  body: string
  size?: number
}) {
  const ref = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = size * dpr
    canvas.height = size * dpr
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(dpr, dpr)
    ctx.fillStyle = body
    ctx.fillRect(0, 0, size, size)
    paintPattern({ ctx, width: size, height: size, color: ink, pattern, scale: 2.1, opacity: 0.85 })
  }, [pattern, ink, body, size])

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="block aspect-square w-full"
      style={{ width: '100%', height: 'auto' }}
    />
  )
}
