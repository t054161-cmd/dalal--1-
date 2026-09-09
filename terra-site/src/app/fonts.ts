/**
 * Typefaces.
 * ---------------------------------------------------------------------------
 * The brief specifies **Playlist** (display) and **Audrey** (everything else).
 * Both are commercial licences, so they are not vendored here. Every rule in
 * globals.css and tailwind.config.ts names them FIRST:
 *
 *     font-family: Playlist, var(--font-display), sans-serif;
 *
 * To switch the site to the real faces, drop the licensed woff2 files into
 * public/fonts/ and add one @font-face block per family (family names
 * `Playlist` and `Audrey`) at the top of globals.css. Nothing else changes.
 *
 * Until then these three do the work, chosen to match the reference sheet:
 *  · Jost         — light geometric sans, wide-trackable: the wordmark and UI
 *  · Cormorant    — light serif for editorial passages
 *  · Plex Arabic  — the Arabic face
 */
import { Cormorant_Garamond, IBM_Plex_Sans_Arabic, Jost } from 'next/font/google'

export const display = Jost({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-display',
  display: 'swap',
})

export const body = Jost({
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

export const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['200', '300', '400', '500'],
  variable: '--font-arabic',
  display: 'swap',
})

export const fontVariables = [
  display.variable,
  body.variable,
  editorial.variable,
  arabic.variable,
].join(' ')
