/**
 * ============================================================================
 * PATTERNS — drawn in code, never loaded as images
 * ============================================================================
 * Every pattern is painted onto a canvas at request time, in whatever ink the
 * customer (or the AI designer) chose. That keeps them weightless, infinitely
 * recolourable, and crisp at any zoom on the 3D body.
 *
 * All of them tile horizontally, because the canvas wraps the cup: whatever is
 * drawn at x = 0 must meet what is drawn at x = width.
 * ============================================================================
 */

import type { PatternId } from '@/types'

/** Deterministic PRNG, so a pattern looks identical on every render. */
function seeded(seed: number) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

type PaintArgs = {
  ctx: CanvasRenderingContext2D
  width: number
  height: number
  color: string
  /** 0.6 – 1.6, from the designer's "density" control. */
  scale?: number
  opacity?: number
}

/** One olive leaf, drawn from the origin pointing along +x. */
function leaf(ctx: CanvasRenderingContext2D, length: number, width: number) {
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(length * 0.45, -width, length, 0)
  ctx.quadraticCurveTo(length * 0.45, width, 0, 0)
  ctx.closePath()
}

function paintOlive({ ctx, width, height, color, scale = 1 }: PaintArgs) {
  const rand = seeded(31)
  const cols = Math.max(3, Math.round(5 / scale))
  const rows = Math.max(3, Math.round(6 / scale))
  const cw = width / cols
  const ch = height / rows

  ctx.fillStyle = color
  ctx.strokeStyle = color

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Stagger every other row so the repeat reads as organic.
      const x = c * cw + (r % 2 ? cw / 2 : 0) + cw * 0.2
      const y = r * ch + ch * 0.5
      const angle = -0.5 + rand() * 1.0
      const stem = cw * 0.52 * scale

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.globalAlpha = 0.9

      // stem
      ctx.lineWidth = Math.max(1.4, cw * 0.012)
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.quadraticCurveTo(stem * 0.5, -stem * 0.12, stem, -stem * 0.05)
      ctx.stroke()

      // leaves alternating along the stem
      const leaves = 5
      for (let i = 1; i <= leaves; i++) {
        const t = i / (leaves + 1)
        const lx = stem * t
        const ly = -stem * 0.09 * t
        const side = i % 2 ? -1 : 1
        ctx.save()
        ctx.translate(lx, ly)
        ctx.rotate(side * (0.9 - t * 0.25))
        leaf(ctx, stem * 0.34, stem * 0.085)
        ctx.fill()
        ctx.restore()
      }
      ctx.restore()
    }
  }
}

function paintSprig({ ctx, width, height, color, scale = 1 }: PaintArgs) {
  const cols = Math.max(2, Math.round(4 / scale))
  const rows = Math.max(2, Math.round(4 / scale))
  const cw = width / cols
  const ch = height / rows
  ctx.strokeStyle = color
  ctx.fillStyle = color

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cw + (r % 2 ? cw / 2 : 0) + cw * 0.5
      const y = r * ch + ch * 0.5
      const h = ch * 0.42 * scale
      ctx.save()
      ctx.translate(x, y)
      ctx.globalAlpha = 0.85
      ctx.lineWidth = Math.max(1.2, cw * 0.008)
      ctx.beginPath()
      ctx.moveTo(0, h / 2)
      ctx.lineTo(0, -h / 2)
      ctx.stroke()
      for (let i = 0; i < 4; i++) {
        const t = i / 4
        const ly = h / 2 - h * (0.25 + t * 0.7)
        for (const side of [-1, 1]) {
          ctx.save()
          ctx.translate(0, ly)
          ctx.rotate(side * 1.05)
          leaf(ctx, h * 0.22, h * 0.05)
          ctx.fill()
          ctx.restore()
        }
      }
      ctx.restore()
    }
  }
}

function paintArch({ ctx, width, height, color, scale = 1 }: PaintArgs) {
  const cols = Math.max(3, Math.round(7 / scale))
  const cw = width / cols
  const rows = Math.max(2, Math.round(5 / scale))
  const ch = height / rows
  ctx.strokeStyle = color
  ctx.globalAlpha = 0.75
  ctx.lineWidth = Math.max(1.4, cw * 0.02)

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cw + cw / 2
      const y = r * ch + ch * 0.72
      const w = cw * 0.46
      const h = ch * 0.44
      // Three nested arches — an architectural motif, not a rainbow.
      for (let i = 0; i < 3; i++) {
        const k = 1 - i * 0.28
        ctx.beginPath()
        ctx.moveTo(x - w * k, y)
        ctx.lineTo(x - w * k, y - h * k * 0.45)
        ctx.arc(x, y - h * k * 0.45, w * k, Math.PI, 0)
        ctx.lineTo(x + w * k, y)
        ctx.stroke()
      }
    }
  }
}

function paintField({ ctx, width, height, color, scale = 1 }: PaintArgs) {
  const rand = seeded(7)
  const cols = Math.max(8, Math.round(18 / scale))
  const rows = Math.max(10, Math.round(24 / scale))
  const cw = width / cols
  const ch = height / rows
  ctx.fillStyle = color

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const jx = (rand() - 0.5) * cw * 0.4
      const jy = (rand() - 0.5) * ch * 0.4
      const radius = cw * (0.05 + rand() * 0.06) * scale
      ctx.globalAlpha = 0.35 + rand() * 0.45
      ctx.beginPath()
      ctx.arc(c * cw + cw / 2 + jx, r * ch + ch / 2 + jy, radius, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

function paintRidge({ ctx, width, height, color, scale = 1 }: PaintArgs) {
  const lines = Math.max(6, Math.round(16 / scale))
  ctx.strokeStyle = color
  ctx.lineWidth = Math.max(1.2, width * 0.0016)

  for (let i = 0; i < lines; i++) {
    const baseY = (height / lines) * (i + 0.5)
    ctx.globalAlpha = 0.28 + (i % 3) * 0.16
    ctx.beginPath()
    // Whole periods across the width, so the seam meets exactly.
    const periods = 3 + (i % 3)
    for (let x = 0; x <= width; x += 6) {
      const phase = (x / width) * Math.PI * 2 * periods
      const y = baseY + Math.sin(phase + i) * (height / lines) * 0.34
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

function paintTerrazzo({ ctx, width, height, color, scale = 1 }: PaintArgs) {
  const rand = seeded(19)
  const count = Math.round((width * height) / (26000 * scale))
  ctx.fillStyle = color

  for (let i = 0; i < count; i++) {
    const x = rand() * width
    const y = rand() * height
    const r = (4 + rand() * 12) * scale
    ctx.globalAlpha = 0.25 + rand() * 0.4
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rand() * Math.PI)
    ctx.beginPath()
    // An irregular fleck: a polygon with wobbled radii.
    const points = 5 + Math.floor(rand() * 3)
    for (let p = 0; p < points; p++) {
      const a = (p / points) * Math.PI * 2
      const rr = r * (0.6 + rand() * 0.6)
      const px = Math.cos(a) * rr
      const py = Math.sin(a) * rr * 0.7
      if (p === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}

const PAINTERS: Record<Exclude<PatternId, 'none'>, (args: PaintArgs) => void> = {
  olive: paintOlive,
  sprig: paintSprig,
  arch: paintArch,
  field: paintField,
  ridge: paintRidge,
  terrazzo: paintTerrazzo,
}

export function paintPattern(args: PaintArgs & { pattern: PatternId }) {
  const { pattern, ctx, opacity = 1 } = args
  if (pattern === 'none') return
  ctx.save()
  ctx.globalAlpha = opacity
  PAINTERS[pattern]({ ...args })
  ctx.restore()
}

/** A small standalone swatch of a pattern, for the picker buttons. */
export function patternSwatch(pattern: PatternId, color: string, size = 96) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  paintPattern({ ctx, width: size, height: size, color, pattern, scale: 1.7 })
  return canvas
}
