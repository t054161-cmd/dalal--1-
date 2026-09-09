/**
 * ============================================================================
 * THE PRINTED SLEEVE
 * ============================================================================
 * One canvas wraps the cup body and carries everything printed on it: the
 * pattern, the TERRA wordmark at the lower middle, and the customer's own mark
 * and symbol.
 *
 * It is drawn with the browser's 2D text engine on purpose — that is what
 * gives correct Arabic shaping and right-to-left order for free, and it means
 * the type on the 3D cup is the same face the customer sees in the picker.
 * ============================================================================
 */

import * as THREE from 'three'
import type { CupConfig, SymbolId } from '@/types'
import { markFonts } from '@/data/product'
import { paintPattern } from './patterns'

/** Sleeve canvas. Wide enough that the wordmark stays crisp at full zoom. */
const W = 2048
const H = 1720

/** Where things sit vertically, as a fraction of the sleeve height. */
const LAYOUT = {
  symbol: 0.33,
  mark: 0.46,
  /** The wordmark sits low on the body, as it does on the real cup. */
  wordmark: 0.71,
}

/**
 * Only about a third of the circumference faces the camera at once, so
 * anything printed has to fit inside that third to be readable.
 */
const FRONT_FACE = W * 0.33

/**
 * next/font declares its variables in a class on <body>, not on the root
 * element, so the body is where they have to be read from.
 */
function cssVar(name: string) {
  if (typeof document === 'undefined') return 'sans-serif'
  const raw = name.startsWith('var(') ? name.slice(4, -1) : name
  const key = raw.trim()
  const fromBody = getComputedStyle(document.body).getPropertyValue(key).trim()
  const fromRoot = getComputedStyle(document.documentElement).getPropertyValue(key).trim()
  return fromBody || fromRoot || 'sans-serif'
}

const hasArabic = (text: string) => /[؀-ۿݐ-ݿﭐ-﻿]/.test(text)

/** Width of a tracked line, so it can be fitted before it is drawn. */
function trackedWidth(ctx: CanvasRenderingContext2D, text: string, size: number, tracking: number) {
  if (hasArabic(text)) return ctx.measureText(text).width
  const glyphs = [...text]
  const widths = glyphs.map((g) => ctx.measureText(g).width)
  return widths.reduce((a, b) => a + b, 0) + size * tracking * (glyphs.length - 1)
}

/**
 * Draw Latin text with real letter-spacing by placing each glyph.
 * Arabic is never split — its glyphs must stay joined — so it is drawn whole.
 */
function drawTracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  tracking: number,
  size: number,
) {
  if (hasArabic(text)) {
    ctx.direction = 'rtl'
    ctx.textAlign = 'center'
    ctx.fillText(text, cx, y)
    ctx.direction = 'ltr'
    return
  }
  const gap = size * tracking
  const glyphs = [...text]
  const widths = glyphs.map((g) => ctx.measureText(g).width)
  const total = widths.reduce((a, b) => a + b, 0) + gap * (glyphs.length - 1)
  let x = cx - total / 2
  ctx.textAlign = 'left'
  glyphs.forEach((glyph, i) => {
    ctx.fillText(glyph, x, y)
    x += widths[i] + gap
  })
  ctx.textAlign = 'center'
}

/**
 * Set a font at the largest size that still fits the front face, and return
 * that size.
 */
function fitFont(
  ctx: CanvasRenderingContext2D,
  text: string,
  family: string,
  weight: number,
  tracking: number,
  preferred: number,
) {
  let size = preferred
  ctx.font = `${weight} ${size}px ${family}`
  let guard = 0
  while (trackedWidth(ctx, text, size, tracking) > FRONT_FACE && size > 26 && guard++ < 80) {
    size -= 4
    ctx.font = `${weight} ${size}px ${family}`
  }
  return size
}

/** The little symbols, drawn as line art so they print like the wordmark. */
function drawSymbol(ctx: CanvasRenderingContext2D, symbol: SymbolId, cx: number, cy: number, r: number, color: string) {
  if (symbol === 'none') return
  ctx.save()
  ctx.translate(cx, cy)
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = Math.max(3, r * 0.075)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = 0.92

  switch (symbol) {
    case 'leaf':
      ctx.beginPath()
      ctx.moveTo(-r * 0.7, r * 0.5)
      ctx.quadraticCurveTo(-r * 0.2, -r * 0.9, r * 0.75, -r * 0.5)
      ctx.quadraticCurveTo(r * 0.1, r * 0.75, -r * 0.7, r * 0.5)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(-r * 0.55, r * 0.4)
      ctx.quadraticCurveTo(r * 0.05, -r * 0.05, r * 0.6, -r * 0.42)
      ctx.stroke()
      break
    case 'sun':
      ctx.beginPath()
      ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2)
      ctx.stroke()
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62)
        ctx.lineTo(Math.cos(a) * r * 0.92, Math.sin(a) * r * 0.92)
        ctx.stroke()
      }
      break
    case 'ridge':
      ctx.beginPath()
      ctx.moveTo(-r, r * 0.55)
      ctx.lineTo(-r * 0.25, -r * 0.5)
      ctx.lineTo(r * 0.12, r * 0.05)
      ctx.lineTo(r * 0.5, -r * 0.75)
      ctx.lineTo(r, r * 0.55)
      ctx.stroke()
      break
    case 'seed':
      ctx.beginPath()
      ctx.ellipse(0, 0, r * 0.42, r * 0.72, 0.5, 0, Math.PI * 2)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(-r * 0.3, r * 0.45)
      ctx.lineTo(r * 0.3, -r * 0.45)
      ctx.stroke()
      break
    case 'wave':
      for (let row = -1; row <= 1; row++) {
        ctx.beginPath()
        for (let x = -r; x <= r; x += 4) {
          const y = row * r * 0.42 + Math.sin((x / r) * Math.PI) * r * 0.2
          if (x === -r) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      break
  }
  ctx.restore()
}

/** Preload the faces the sleeve needs, so the first frame is not a fallback. */
export async function ensureFonts(config: CupConfig) {
  if (typeof document === 'undefined' || !('fonts' in document)) return
  const face = markFonts.find((f) => f.id === config.markFont) ?? markFonts[0]
  // Each face is asked for at its own weight: a brush hand ships one weight,
  // and asking for 300 would have the browser synthesise it.
  const wanted: [string, number][] = [
    [cssVar('var(--font-display)'), 300],
    [cssVar(face.css), face.weight],
  ]
  try {
    await Promise.all(
      wanted.map(([family, weight]) =>
        document.fonts.load(`${weight} 160px ${family}`, `TERRA${config.mark}`),
      ),
    )
    await document.fonts.ready
  } catch {
    /* A slow font only means one late repaint. */
  }
}

export function drawSleeve(config: CupConfig) {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  ctx.textBaseline = 'middle'
  ctx.textAlign = 'center'

  const mark = config.mark.trim()

  // 1 — the pattern, wrapping the whole body
  paintPattern({
    ctx,
    width: W,
    height: H,
    color: config.patternColor,
    pattern: config.pattern,
    scale: 1,
    opacity: 0.5,
  })

  // 1b — clear space. A real print layout holds the pattern back from the
  // type; here the pattern is erased in a soft ellipse behind whatever is
  // about to be printed, so the wordmark and the mark always stay legible.
  if (config.pattern !== 'none') {
    const rows = [LAYOUT.wordmark]
    if (mark) rows.push(LAYOUT.mark)
    if (config.symbol !== 'none') rows.push(LAYOUT.symbol)
    const top = Math.min(...rows) * H
    const bottom = Math.max(...rows) * H
    const centreY = (top + bottom) / 2
    const rx = FRONT_FACE * 0.72
    const ry = (bottom - top) / 2 + H * 0.095

    ctx.save()
    ctx.globalCompositeOperation = 'destination-out'
    ctx.translate(W / 2, centreY)
    ctx.scale(1, ry / rx)
    const fade = ctx.createRadialGradient(0, 0, rx * 0.42, 0, 0, rx)
    fade.addColorStop(0, 'rgba(0,0,0,1)')
    fade.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = fade
    ctx.beginPath()
    ctx.arc(0, 0, rx, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // 2 — the TERRA wordmark, lower middle, tone on tone and quiet
  const displayFamily = cssVar('var(--font-display)')
  ctx.fillStyle = config.markColor
  ctx.globalAlpha = 0.86
  const wordmarkSize = fitFont(ctx, 'TERRA', displayFamily, 300, 0.34, 86)
  drawTracked(ctx, 'TERRA', W / 2, H * LAYOUT.wordmark, 0.34, wordmarkSize)
  ctx.globalAlpha = 1

  // 3 — the customer's own mark, above the wordmark
  if (mark) {
    const face = markFonts.find((f) => f.id === config.markFont) ?? markFonts[0]
    const family = cssVar(face.css)
    ctx.fillStyle = config.markColor
    const size = fitFont(ctx, mark, family, face.weight, face.tracking, 132)
    drawTracked(ctx, mark, W / 2, H * LAYOUT.mark, face.tracking, size)
  }

  // 4 — the symbol, above the mark
  if (config.symbol !== 'none') {
    drawSymbol(ctx, config.symbol, W / 2, H * LAYOUT.symbol, 60, config.markColor)
  }

  return canvas
}

export function makeSleeveTexture(config: CupConfig) {
  const texture = new THREE.CanvasTexture(drawSleeve(config))
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.needsUpdate = true
  return texture
}
