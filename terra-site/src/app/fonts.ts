/**
 * ============================================================================
 * TYPEFACES
 * ============================================================================
 * Five voices. Playlist and Audrey are commercial licences we cannot vendor,
 * so each is paired with the closest free face and named SECOND in every font
 * stack — the licensed name always comes first:
 *
 *     font-family: Playlist, var(--font-script), cursive;
 *
 * Drop the licensed woff2 files into public/fonts/ and add one @font-face
 * block per family (family names `Playlist` and `Audrey`) at the top of
 * globals.css. Nothing else in the codebase changes.
 *
 *   PLAYLIST  → --font-script      the brush hand: TERRA, the hero title,
 *                                  major section titles, statements.
 *                                  Stand-in: Kaushan Script.
 *
 *   AUDREY    → --font-body        navigation, subheads, body, buttons,
 *               --font-display     labels — the whole interface.
 *                                  Stand-in: Jost. Chosen over a closer match
 *                                  to the reference sheet on purpose: the
 *                                  geometric faces that copy Audrey's shapes
 *                                  most exactly also copy its very small
 *                                  x-height, which is what made body copy hard
 *                                  to read here. Jost keeps the light, wide,
 *                                  editorial character and has a normal
 *                                  x-height, so a paragraph stays comfortable.
 *
 *   RUQ'AH    → --font-arabic      Arabic titles and key phrases ONLY.
 *                                  Aref Ruqaa is a true خط الرقعة face: it is
 *                                  calligraphy, and calligraphy is for the
 *                                  lines that carry weight, not for a checkout
 *                                  form.
 *
 *   ARABIC UI → --font-arabic-ui   every other word of Arabic: body, nav,
 *                                  buttons, descriptions, labels, prices.
 *                                  IBM Plex Sans Arabic — open counters, even
 *                                  strokes, very legible small.
 *
 *   EDITORIAL → --font-editorial   the long-passage serif.
 * ============================================================================
 */
import {
  Aref_Ruqaa,
  Cormorant_Garamond,
  IBM_Plex_Sans_Arabic,
  Jost,
  Kaushan_Script,
} from 'next/font/google'

/** PLAYLIST — the brush hand. One weight; a brush has one pressure. */
export const script = Kaushan_Script({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-script',
  display: 'swap',
})

/** AUDREY — the display cut: tracked caps, the wordmark, the cup print. */
export const display = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-display',
  display: 'swap',
})

/** AUDREY — the text cut. 400 is the working weight, not 300. */
export const body = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const editorial = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-editorial',
  display: 'swap',
})

/** خط الرقعة — headlines and key phrases. */
export const arabicDisplay = Aref_Ruqaa({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  variable: '--font-arabic',
  display: 'swap',
})

/** The Arabic reading face — everything that is not a headline. */
export const arabicUi = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500'],
  variable: '--font-arabic-ui',
  display: 'swap',
})

export const fontVariables = [
  script.variable,
  display.variable,
  body.variable,
  editorial.variable,
  arabicDisplay.variable,
  arabicUi.variable,
].join(' ')
