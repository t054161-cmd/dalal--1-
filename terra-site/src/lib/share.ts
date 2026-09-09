/**
 * A design encoded into a readable query string, so "share" produces a link
 * that opens the exact cup for anyone:
 *
 *   /customize?c=sage&b=A9B29F&l=A2AB98&s=A2AB98&p=olive&pi=F0ECE3&m=Layla&mf=wordmark&mi=F0ECE3&sy=leaf
 */

import { defaultConfig, MAX_MARK_LENGTH, patterns, symbols, markFonts } from '@/data/product'
import type { CupConfig, MarkFont, PatternId, SymbolId } from '@/types'

const hex = (value: string) => value.replace('#', '')
const unhex = (value: string | null) => (value ? `#${value.replace('#', '')}` : null)

export function encodeConfig(config: CupConfig) {
  const p = new URLSearchParams()
  p.set('c', config.colorway)
  p.set('b', hex(config.bodyColor))
  p.set('l', hex(config.lidColor))
  p.set('s', hex(config.strawColor))
  if (config.pattern !== 'none') {
    p.set('p', config.pattern)
    p.set('pi', hex(config.patternColor))
  }
  if (config.mark) {
    p.set('m', config.mark)
    p.set('mf', config.markFont)
    p.set('mi', hex(config.markColor))
  }
  if (config.symbol !== 'none') p.set('sy', config.symbol)
  return p.toString()
}

export function decodeConfig(params: URLSearchParams): CupConfig | null {
  const keys = ['c', 'b', 'l', 's', 'p', 'm', 'sy']
  if (!keys.some((k) => params.has(k))) return null

  const patternId = params.get('p')
  const symbolId = params.get('sy')
  const fontId = params.get('mf')

  return {
    ...defaultConfig,
    colorway: params.get('c') ?? defaultConfig.colorway,
    bodyColor: unhex(params.get('b')) ?? defaultConfig.bodyColor,
    lidColor: unhex(params.get('l')) ?? defaultConfig.lidColor,
    strawColor: unhex(params.get('s')) ?? defaultConfig.strawColor,
    pattern: patterns.some((x) => x.id === patternId) ? (patternId as PatternId) : 'none',
    patternColor: unhex(params.get('pi')) ?? defaultConfig.patternColor,
    mark: (params.get('m') ?? '').slice(0, MAX_MARK_LENGTH),
    markFont: markFonts.some((f) => f.id === fontId) ? (fontId as MarkFont) : 'wordmark',
    markColor: unhex(params.get('mi')) ?? defaultConfig.markColor,
    symbol: symbols.some((x) => x.id === symbolId) ? (symbolId as SymbolId) : 'none',
  }
}

export const shareUrl = (config: CupConfig, origin?: string) =>
  `${origin ?? (typeof window !== 'undefined' ? window.location.origin : 'https://terra.example')}/customize?${encodeConfig(config)}`
