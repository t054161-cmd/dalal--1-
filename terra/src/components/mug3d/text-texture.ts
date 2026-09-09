/**
 * Curved text as a canvas texture.
 *
 * The engraving is drawn with the browser's own 2D text engine and mapped onto
 * a cylinder that hugs the mug body, so it curves with the mesh and rotates
 * with it. Doing it this way (rather than with a 3D font atlas) buys us two
 * things for free:
 *
 *  · correct Arabic shaping and right-to-left order, because the browser does
 *    the bidi and joining work itself;
 *  · exactly the same glyphs the customer saw in the font picker, because both
 *    use the same loaded webfont.
 */

import * as THREE from 'three'
import { getFont } from '@/data/product'

const CANVAS_W = 2048
const CANVAS_H = 512

export type TextTextureInput = {
  text: string
  fontId: string
  /** Hex colour of the engraving. */
  color: string
  /** 0.72 | 1 | 1.32 from the text-size choice. */
  sizeScale: number
  repeats: number
}

/** Resolve a CSS custom property to a usable font-family string. */
function resolveFamily(cssVar: string) {
  if (typeof window === 'undefined') return 'sans-serif'
  const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim()
  return value || 'sans-serif'
}

const isArabic = (text: string) => /[؀-ۿݐ-ݿࢠ-ࣿﭐ-﷿ﹰ-﻿]/.test(text)

/**
 * Make sure the webfont is actually available before we rasterise, otherwise
 * the first frame bakes a fallback face into the texture.
 */
export async function ensureFontReady(fontId: string, text: string) {
  if (typeof document === 'undefined' || !('fonts' in document)) return
  const font = getFont(fontId)
  const family = resolveFamily(font.cssVar)
  try {
    await document.fonts.load(`${font.weight} 120px ${family}`, text || 'Aا')
    await document.fonts.ready
  } catch {
    /* A failed preload only means a slightly late repaint. */
  }
}

export function drawTextCanvas({ text, fontId, color, sizeScale, repeats }: TextTextureInput) {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_W
  canvas.height = CANVAS_H
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  const font = getFont(fontId)
  const family = resolveFamily(font.cssVar)
  const rtl = isArabic(text)

  // Fit the text to the band: start from a generous size and shrink until the
  // longest line fits inside one repeat slot.
  const slotWidth = (CANVAS_W / repeats) * (repeats > 1 ? 0.78 : 0.62)
  let px = Math.round(CANVAS_H * 0.42 * sizeScale * font.scale)

  ctx.direction = rtl ? 'rtl' : 'ltr'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const setFont = () => {
    ctx.font = `${font.weight} ${px}px ${family}`
  }
  setFont()
  let guard = 0
  while (ctx.measureText(text).width > slotWidth && px > 18 && guard++ < 60) {
    px -= 6
    setFont()
  }

  // A hairline dark offset under the letters reads as depth — engraving, not
  // a sticker. It is subtle on purpose.
  const drawAt = (x: number) => {
    ctx.fillStyle = 'rgba(0,0,0,0.28)'
    ctx.fillText(text, x, CANVAS_H / 2 + Math.max(2, px * 0.03))
    ctx.fillStyle = color
    ctx.fillText(text, x, CANVAS_H / 2)
  }

  for (let i = 0; i < repeats; i++) {
    drawAt((CANVAS_W / repeats) * (i + 0.5))
  }

  return canvas
}

export function makeTextTexture(input: TextTextureInput) {
  const canvas = drawTextCanvas(input)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  texture.needsUpdate = true
  return texture
}
