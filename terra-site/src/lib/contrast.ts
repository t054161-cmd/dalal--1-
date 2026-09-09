/** WCAG relative luminance, used to stop printed ink disappearing into a body. */

const channel = (v: number) => {
  const c = v / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

export function hexToRgb(hex: string) {
  const clean = hex.replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  }
}

export function luminance(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

export function contrastRatio(a: string, b: string) {
  const la = luminance(a)
  const lb = luminance(b)
  const [hi, lo] = la > lb ? [la, lb] : [lb, la]
  return (hi + 0.05) / (lo + 0.05)
}

/** Print is physical, so the bar is lower than screen text — but not this low. */
export const MIN_PRINT_CONTRAST = 1.9

export const printReadable = (body: string, ink: string) =>
  contrastRatio(body, ink) >= MIN_PRINT_CONTRAST

/** The tone from a set with the most contrast against the body. */
export function bestInk<T extends { hex: string }>(body: string, options: T[]): T {
  return [...options]
    .map((o) => ({ o, ratio: contrastRatio(body, o.hex) }))
    .sort((a, b) => b.ratio - a.ratio)[0].o
}
