/**
 * WCAG relative-luminance contrast, used to warn a customer when their text
 * colour will disappear into the body colour — and to suggest a fix.
 */

import { textColors, type ColorOption } from '@/data/product'

export function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

function channel(value: number) {
  const c = value / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

/** Contrast ratio between two hex colours: 1 (identical) → 21 (black/white). */
export function contrastRatio(a: string, b: string) {
  const la = luminance(a)
  const lb = luminance(b)
  const [light, dark] = la > lb ? [la, lb] : [lb, la]
  return (light + 0.05) / (dark + 0.05)
}

/**
 * Engraved text is physical, not a screen, so we use a lower bar than WCAG's
 * 4.5:1 — but below 2.4:1 it genuinely disappears on a curved body.
 */
export const MIN_ENGRAVING_CONTRAST = 2.4

export function checkContrast(bodyHex: string, textHex: string) {
  const ratio = contrastRatio(bodyHex, textHex)
  const ok = ratio >= MIN_ENGRAVING_CONTRAST
  return { ratio: Math.round(ratio * 100) / 100, ok }
}

/** The available text colour with the highest contrast against the body. */
export function suggestTextColor(bodyHex: string): ColorOption {
  return [...textColors]
    .map((c) => ({ c, ratio: contrastRatio(bodyHex, c.hex) }))
    .sort((a, b) => b.ratio - a.ratio)[0].c
}
