/**
 * ============================================================================
 * TERRA — THE PRODUCT
 * ============================================================================
 * One object, made in four tones. Everything a non-developer needs to change
 * — colours, prices, the words on the anatomy diagram — lives in this file.
 * Ids are permanent: never rename one that has been ordered.
 * ============================================================================
 */

import type { Bilingual, CupConfig, MarkFont, PatternId, SymbolId } from '@/types'

/* -------------------------------------------------------------------------- */
/* THE OBJECT                                                                 */
/* -------------------------------------------------------------------------- */

export const product = {
  id: 'terra-tumbler',
  name: { en: 'The TERRA Tumbler', ar: 'كوب تيرّا' } as Bilingual,
  tagline: {
    en: 'A cleaner tomorrow in your hands.',
    ar: 'غدٌ أنظف بين يديك.',
  } as Bilingual,
  short: {
    en: 'A reusable cup for brighter days. Designed with purpose, made for a kinder planet.',
    ar: 'كوب قابل لإعادة الاستخدام لأيامٍ أصفى. صُمِّم بنيّة، وصُنع لكوكبٍ أرحم.',
  } as Bilingual,
  /** Kuwaiti dinar. */
  price: 14.5,
  /** Personalisation — a name, initials or a symbol on the body. */
  personalisationPrice: 2.5,
  capacityMl: 500,
  heightMm: 205,
  diameterMm: 72,
  currency: { en: 'KWD', ar: 'د.ك' } as Bilingual,
}

/* -------------------------------------------------------------------------- */
/* COLOURWAYS — the four tones on the reference sheet                          */
/* -------------------------------------------------------------------------- */

export type Colorway = {
  id: string
  name: Bilingual
  /** Body, lid and straw, in that order. */
  body: string
  lid: string
  straw: string
  /** The tone the printed mark takes by default on this body. */
  ink: string
  /** True when the body is dark enough to need light ink. */
  dark: boolean
  note: Bilingual
}

export const colorways: Colorway[] = [
  {
    id: 'linen',
    name: { en: 'Linen', ar: 'كتّان' },
    body: '#E7E1D4',
    lid: '#E2DBCC',
    straw: '#E2DBCC',
    ink: '#6E7566',
    dark: false,
    note: { en: 'Undyed, warm, quiet.', ar: 'بلا صبغة، دافئ، هادئ.' },
  },
  {
    id: 'sage',
    name: { en: 'Sage', ar: 'مريمية' },
    body: '#A9B29F',
    lid: '#A2AB98',
    straw: '#A2AB98',
    ink: '#F0ECE3',
    dark: false,
    note: { en: 'The colour of an olive leaf in shade.', ar: 'لون ورقة الزيتون في الظل.' },
  },
  {
    id: 'sandi',
    name: { en: 'Sandi', ar: 'ساندي' },
    body: '#DFC9C0',
    lid: '#D8C1B8',
    straw: '#D8C1B8',
    ink: '#6B5C56',
    dark: false,
    note: { en: 'Blush, like clay before firing.', ar: 'ورديّ كالطين قبل الشيّ.' },
  },
  {
    id: 'forest',
    name: { en: 'Forest', ar: 'غابة' },
    body: '#2E3A31',
    lid: '#28332B',
    straw: '#28332B',
    ink: '#E7E1D4',
    dark: true,
    note: { en: 'Deep, still, evening green.', ar: 'أخضر عميق ساكن كالمساء.' },
  },
]

export const getColorway = (id: string) => colorways.find((c) => c.id === id) ?? colorways[1]

/** Every tone a single part can be set to, when mixing parts. */
export const partTones: { id: string; name: Bilingual; hex: string }[] = [
  { id: 'linen', name: { en: 'Linen', ar: 'كتّان' }, hex: '#E7E1D4' },
  { id: 'sage', name: { en: 'Sage', ar: 'مريمية' }, hex: '#A9B29F' },
  { id: 'sandi', name: { en: 'Sandi', ar: 'ساندي' }, hex: '#DFC9C0' },
  { id: 'forest', name: { en: 'Forest', ar: 'غابة' }, hex: '#2E3A31' },
  { id: 'smoke', name: { en: 'Smoked green', ar: 'أخضر مدخّن' }, hex: '#5E6B58' },
  { id: 'clay', name: { en: 'Putty', ar: 'صلصال' }, hex: '#C8BEAF' },
]

export const toneHex = (id: string) => partTones.find((t) => t.id === id)?.hex ?? id

/* -------------------------------------------------------------------------- */
/* THE ANATOMY — the five labelled parts                                       */
/* -------------------------------------------------------------------------- */

export type Component = {
  id: 'straw' | 'lid' | 'ring' | 'inner' | 'body'
  name: Bilingual
  note: Bilingual
  /** Only these three separate in the exploded view. */
  explodes: boolean
}

export const components: Component[] = [
  {
    id: 'straw',
    name: { en: 'Straw', ar: 'الماصّة' },
    note: { en: 'Reusable & durable', ar: 'قابلة لإعادة الاستخدام ومتينة' },
    explodes: true,
  },
  {
    id: 'lid',
    name: { en: 'Lid', ar: 'الغطاء' },
    note: { en: 'Leak-resistant', ar: 'مقاوم للتسريب' },
    explodes: true,
  },
  {
    id: 'ring',
    name: { en: 'Silicone ring', ar: 'حلقة إحكام' },
    note: { en: 'For a secure fit', ar: 'لإغلاق محكم' },
    explodes: false,
  },
  {
    id: 'inner',
    name: { en: 'Inner layer', ar: 'الطبقة الداخلية' },
    note: { en: 'Stainless steel', ar: 'فولاذ مقاوم للصدأ' },
    explodes: false,
  },
  {
    id: 'body',
    name: { en: 'Outer body', ar: 'الجسم الخارجي' },
    note: { en: 'Made for everyday', ar: 'مصنوع ليومك' },
    explodes: true,
  },
]

/* -------------------------------------------------------------------------- */
/* PATTERNS — drawn in code, so any colour works (see src/lib/patterns.ts)      */
/* -------------------------------------------------------------------------- */

export const patterns: { id: PatternId; name: Bilingual; note: Bilingual }[] = [
  { id: 'none', name: { en: 'None', ar: 'بلا نقش' }, note: { en: 'Bare body', ar: 'جسم سادة' } },
  { id: 'olive', name: { en: 'Olive branch', ar: 'غصن زيتون' }, note: { en: 'Botanical, sparse', ar: 'نباتي متباعد' } },
  { id: 'sprig', name: { en: 'Sprig', ar: 'غصين' }, note: { en: 'A single stem, repeated', ar: 'ساق واحدة تتكرر' } },
  { id: 'arch', name: { en: 'Arches', ar: 'أقواس' }, note: { en: 'Architectural, monochrome', ar: 'معماري أحادي' } },
  { id: 'field', name: { en: 'Seed field', ar: 'حقل بذور' }, note: { en: 'Quiet dot field', ar: 'حقل نقاط هادئ' } },
  { id: 'ridge', name: { en: 'Ridges', ar: 'تضاريس' }, note: { en: 'Contour lines', ar: 'خطوط كنتور' } },
  { id: 'terrazzo', name: { en: 'Terrazzo', ar: 'تيرازو' }, note: { en: 'Fleck, mineral', ar: 'رقائق معدنية' } },
]

export const markFonts: { id: MarkFont; name: Bilingual; css: string; weight: number; tracking: number }[] = [
  { id: 'wordmark', name: { en: 'Wordmark', ar: 'شعار' }, css: 'var(--font-display)', weight: 300, tracking: 0.4 },
  // A brush hand needs its letters joined, so this one is never tracked.
  { id: 'script', name: { en: 'Brush', ar: 'خط اليد' }, css: 'var(--font-script)', weight: 400, tracking: 0 },
  { id: 'editorial', name: { en: 'Editorial', ar: 'تحريري' }, css: 'var(--font-editorial)', weight: 400, tracking: 0.06 },
  { id: 'initials', name: { en: 'Initials', ar: 'أحرف أولى' }, css: 'var(--font-display)', weight: 400, tracking: 0.18 },
]

export const symbols: { id: SymbolId; name: Bilingual }[] = [
  { id: 'none', name: { en: 'None', ar: 'بلا رمز' } },
  { id: 'leaf', name: { en: 'Leaf', ar: 'ورقة' } },
  { id: 'sun', name: { en: 'Sun', ar: 'شمس' } },
  { id: 'ridge', name: { en: 'Hills', ar: 'تلال' } },
  { id: 'seed', name: { en: 'Seed', ar: 'بذرة' } },
  { id: 'wave', name: { en: 'Wave', ar: 'موجة' } },
]

export const MAX_MARK_LENGTH = 14

/* -------------------------------------------------------------------------- */
/* DEFAULT + PRICING                                                          */
/* -------------------------------------------------------------------------- */

export const defaultConfig: CupConfig = {
  colorway: 'sage',
  bodyColor: '#A9B29F',
  lidColor: '#A2AB98',
  strawColor: '#A2AB98',
  pattern: 'none',
  patternColor: '#F0ECE3',
  mark: '',
  markFont: 'wordmark',
  markColor: '#F0ECE3',
  symbol: 'none',
}

/** Apply a whole colourway, keeping any personalisation. */
export function applyColorway(config: CupConfig, id: string): CupConfig {
  const way = getColorway(id)
  return {
    ...config,
    colorway: way.id,
    bodyColor: way.body,
    lidColor: way.lid,
    strawColor: way.straw,
    markColor: way.ink,
    patternColor: way.ink,
  }
}

export function priceOf(config: CupConfig) {
  const personalised = config.mark.trim().length > 0 || config.pattern !== 'none' || config.symbol !== 'none'
  return Math.round((product.price + (personalised ? product.personalisationPrice : 0)) * 1000) / 1000
}

export const freeShippingOver = 25
export const shippingFlat = 1.5
