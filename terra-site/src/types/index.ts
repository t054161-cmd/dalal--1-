export type Locale = 'en' | 'ar'

/** A label that always exists in both languages. */
export type Bilingual = Record<Locale, string>

export type PatternId =
  | 'none'
  | 'olive'
  | 'sprig'
  | 'arch'
  | 'field'
  | 'ridge'
  | 'terrazzo'

export type MarkFont = 'wordmark' | 'editorial' | 'initials'
export type SymbolId = 'none' | 'leaf' | 'sun' | 'ridge' | 'seed' | 'wave'

/** Everything that makes one TERRA yours. */
export type CupConfig = {
  /** Colourway id — sets the three tones unless they are overridden. */
  colorway: string
  /** Per-part overrides, so a customer can mix (e.g. linen body, forest straw). */
  bodyColor: string
  lidColor: string
  strawColor: string
  pattern: PatternId
  /** Pattern ink; defaults to a tone that sits quietly on the body. */
  patternColor: string
  /** Up to 14 characters printed under the wordmark. */
  mark: string
  markFont: MarkFont
  markColor: string
  symbol: SymbolId
}

export type CartLine = {
  lineId: string
  config: CupConfig
  quantity: number
  unitPrice: number
  /** PNG data URL of the 3D view at the moment it was added. */
  snapshot?: string
  /** Set when the line came from a named colourway rather than the designer. */
  name?: Bilingual
}
