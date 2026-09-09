import type { Locale } from '@/i18n/translations'

/** A bilingual label. Both languages are always required. */
export type Bilingual = Record<Locale, string>

export type SizeId = '350' | '500' | '700'
export type Placement = 'center' | 'lower' | 'wrap'
export type TextSize = 'sm' | 'md' | 'lg'

/** The single source of truth for "what mug is this". */
export type DesignConfig = {
  sizeId: SizeId
  bodyColorId: string
  lidColorId: string
  text: string
  fontId: string
  textColorId: string
  textSize: TextSize
  placement: Placement
  handle: boolean
  /** Add-on ids from src/data/accessories.ts (cup holder, carry chain, …). */
  accessories: string[]
  /** Set when the design came from a preset or a shop design. */
  presetId?: string
  /** Cup-of-the-Day discount carried into the cart, in percent. */
  discountPercent?: number
}

export type CartLine = {
  lineId: string
  design: DesignConfig
  quantity: number
  /** data: URL PNG of the 3D view, attached at review time. */
  snapshot?: string
  giftWrap: boolean
  handwrittenCard: boolean
  cardMessage?: string
  /** Bilingual label when the line came from a named design. */
  designName?: Bilingual
  /** Mug price only, per unit. Accessories are priced separately. */
  unitPrice: number
  /** Points this line earns, frozen at the moment it was added. */
  points: number
}
