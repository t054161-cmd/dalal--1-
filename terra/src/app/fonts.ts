/**
 * Typefaces. Two carry the interface (a humanist Latin sans + a modern Arabic
 * face); the other six exist so the engraving fonts in the designer preview
 * with the customer's own text.
 *
 * Each one is exposed as a CSS custom property, which is what the engraving
 * data in src/data/product.ts refers to (`cssVar`) and what the 3D text canvas
 * resolves at draw time.
 */
import {
  Amiri,
  Caveat,
  IBM_Plex_Sans_Arabic,
  Manrope,
  Playfair_Display,
  Reem_Kufi,
  Space_Mono,
  Tajawal,
} from 'next/font/google'

export const latin = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-latin',
  display: 'swap',
})

export const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
})

export const tajawal = Tajawal({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-tajawal',
  display: 'swap',
})

export const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
  display: 'swap',
})

export const reemKufi = Reem_Kufi({
  subsets: ['arabic'],
  weight: ['400', '600'],
  variable: '--font-reem',
  display: 'swap',
})

export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-playfair',
  display: 'swap',
})

export const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-caveat',
  display: 'swap',
})

export const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

/** Display headings reuse the Latin sans, set tighter (see globals.css). */
export const fontVariables = [
  latin.variable,
  arabic.variable,
  tajawal.variable,
  amiri.variable,
  reemKufi.variable,
  playfair.variable,
  caveat.variable,
  spaceMono.variable,
].join(' ')
