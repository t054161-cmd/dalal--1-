/**
 * ============================================================================
 * TYPEFACES
 * ============================================================================
 * The brief names four voices. Two of them are commercial licences we cannot
 * vendor, so each one is paired with the closest free face and named SECOND in
 * every font stack — the licensed name always comes first:
 *
 *     font-family: Playlist, var(--font-script), cursive;
 *
 * Drop the licensed woff2 files into public/fonts/ and add one @font-face
 * block per family (family names `Playlist` and `Audrey`) at the top of
 * globals.css. Nothing else in the codebase changes.
 *
 *   PLAYLIST  → --font-script   the expressive brush hand: TERRA, hero title,
 *                               major section titles, artistic statements.
 *                               Stand-in: Kaushan Script — a real brush face
 *                               with the same bounce and dry-brush contrast as
 *                               the `gellato` sample on the reference sheet.
 *
 *   AUDREY    → --font-body     the elegant thin editorial voice: navigation,
 *               --font-display  subheads, body, buttons, labels, the whole UI.
 *                               Stand-in: Josefin Sans — geometric, high-waisted
 *                               and very light, closest to the `vanilla` sample.
 *
 *   RUQ'AH    → --font-arabic   every word of Arabic, headings to checkout.
 *                               Aref Ruqaa is a true خط الرقعة face, so Arabic
 *                               carries the same handwritten warmth the brush
 *                               gives English rather than a separate identity.
 *
 *   EDITORIAL → --font-editorial  the long-passage serif, unchanged.
 * ============================================================================
 */
import {
  Aref_Ruqaa,
  Cormorant_Garamond,
  Josefin_Sans,
  Kaushan_Script,
} from 'next/font/google'

/** PLAYLIST — the brush hand. One weight; a brush has one pressure. */
export const script = Kaushan_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script',
  display: 'swap',
})

/** AUDREY — the display cut, used for tracked caps and the cup print. */
export const display = Josefin_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400'],
  variable: '--font-display',
  display: 'swap',
})

/** AUDREY — the text cut. */
export const body = Josefin_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

/** خط الرقعة */
export const arabic = Aref_Ruqaa({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-arabic',
  display: 'swap',
})

export const fontVariables = [
  script.variable,
  display.variable,
  body.variable,
  editorial.variable,
  arabic.variable,
].join(' ')
