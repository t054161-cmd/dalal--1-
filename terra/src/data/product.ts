/**
 * ============================================================================
 * TERRA — PRODUCT DATA
 * ============================================================================
 * Sizes, colours, lids, fonts, placements, palettes and prices.
 * This file is written to be edited by a non-developer:
 *  · every entry has a stable `id` (never change an id once orders exist),
 *  · every human-readable label is bilingual { en, ar },
 *  · colours are plain hex, and the 3D viewer reads them directly.
 * ============================================================================
 */

import type { Bilingual, Placement, SizeId, TextSize } from '@/types/design'

/* -------------------------------------------------------------------------- */
/* PRICES (Kuwaiti dinar, 3 decimals)                                          */
/* -------------------------------------------------------------------------- */

export const pricing = {
  /** Base price per size, before options. */
  base: { '350': 8.5, '500': 10.5, '700': 12.5 } as Record<SizeId, number>,
  /** Laser engraving / ceramic print of custom text. */
  engraving: 1.5,
  /** Upgrade from the steel lid to the bamboo one. */
  bambooLid: 1.25,
  giftWrap: 0.75,
  handwrittenCard: 0.5,
  /** Flat delivery inside Kuwait; waived above the threshold. */
  delivery: 1.5,
  freeDeliveryThreshold: 20,
}

/* -------------------------------------------------------------------------- */
/* SIZES                                                                      */
/* -------------------------------------------------------------------------- */

export type Size = {
  id: SizeId
  volumeMl: number
  name: Bilingual
  /** Short use-case hint shown under the size name. */
  hint: Bilingual
  /** Height & diameter in mm — also drives the 3D proportions. */
  heightMm: number
  diameterMm: number
  handleAvailable: boolean
  /** Disposable cups this size replaces per year at 2 fills a day. */
  cupsPerYear: number
}

export const sizes: Size[] = [
  {
    id: '350',
    volumeMl: 350,
    name: { en: '350 ml', ar: '٣٥٠ مل' },
    hint: {
      en: 'Fits any car cup holder. A single flat white, or tea for one.',
      ar: 'يناسب أي حاضن أكواب في السيارة. فلات وايت واحد، أو شاي لشخص.',
    },
    heightMm: 155,
    diameterMm: 72,
    handleAvailable: false,
    cupsPerYear: 730,
  },
  {
    id: '500',
    volumeMl: 500,
    name: { en: '500 ml', ar: '٥٠٠ مل' },
    hint: {
      en: 'The desk size. One fill lasts a morning of meetings.',
      ar: 'حجم المكتب. تعبئة واحدة تكفي صباحاً كاملاً من الاجتماعات.',
    },
    heightMm: 185,
    diameterMm: 78,
    handleAvailable: true,
    cupsPerYear: 730,
  },
  {
    id: '700',
    volumeMl: 700,
    name: { en: '700 ml', ar: '٧٠٠ مل' },
    hint: {
      en: 'Gym, site work, long drives. Ice still there when you get back.',
      ar: 'النادي، والعمل الميداني، والطرق الطويلة. الثلج ما زال موجوداً عند رجوعك.',
    },
    heightMm: 215,
    diameterMm: 84,
    handleAvailable: true,
    cupsPerYear: 730,
  },
]

/* -------------------------------------------------------------------------- */
/* BODY COLOURS — 12                                                          */
/* -------------------------------------------------------------------------- */

export type ColorOption = {
  id: string
  name: Bilingual
  hex: string
  /** How the 3D material behaves: matte powder coat or bare brushed steel. */
  finish: 'matte' | 'brushed'
  /** True for colours dark enough that light text reads best on them. */
  dark: boolean
}

export const bodyColors: ColorOption[] = [
  { id: 'clay', name: { en: 'Clay', ar: 'طين' }, hex: '#B4654A', finish: 'matte', dark: true },
  { id: 'sand', name: { en: 'Sand', ar: 'رمل' }, hex: '#D9C7A7', finish: 'matte', dark: false },
  { id: 'sage', name: { en: 'Sage', ar: 'مريمية' }, hex: '#7C8B6B', finish: 'matte', dark: true },
  { id: 'moss', name: { en: 'Moss', ar: 'طحلب' }, hex: '#4E5D43', finish: 'matte', dark: true },
  { id: 'bark', name: { en: 'Bark', ar: 'لحاء' }, hex: '#3E3229', finish: 'matte', dark: true },
  { id: 'stone', name: { en: 'Stone', ar: 'حجر' }, hex: '#A89F91', finish: 'matte', dark: false },
  { id: 'cream', name: { en: 'Cream', ar: 'كريمي' }, hex: '#F0E9DA', finish: 'matte', dark: false },
  { id: 'steel', name: { en: 'Brushed steel', ar: 'فولاذ مصقول' }, hex: '#B9BDBC', finish: 'brushed', dark: false },
  { id: 'rust', name: { en: 'Rust', ar: 'صدأ' }, hex: '#9A4B2C', finish: 'matte', dark: true },
  { id: 'indigo', name: { en: 'Desert indigo', ar: 'نيلي صحراوي' }, hex: '#3C4859', finish: 'matte', dark: true },
  { id: 'saffron', name: { en: 'Saffron', ar: 'زعفران' }, hex: '#C98A3C', finish: 'matte', dark: false },
  { id: 'ash', name: { en: 'Volcanic ash', ar: 'رماد بركاني' }, hex: '#57534E', finish: 'matte', dark: true },
]

/* -------------------------------------------------------------------------- */
/* LID COLOURS / MATERIALS — 6                                                */
/* -------------------------------------------------------------------------- */

export type LidOption = ColorOption & {
  /** Bamboo lids are an upgrade and render with a wood material. */
  material: 'steel' | 'bamboo'
}

export const lidColors: LidOption[] = [
  { id: 'bamboo', name: { en: 'Bamboo', ar: 'خيزران' }, hex: '#C69A6B', finish: 'matte', dark: false, material: 'bamboo' },
  { id: 'dark-bamboo', name: { en: 'Smoked bamboo', ar: 'خيزران مدخّن' }, hex: '#8A6244', finish: 'matte', dark: true, material: 'bamboo' },
  { id: 'steel', name: { en: 'Brushed steel', ar: 'فولاذ مصقول' }, hex: '#B9BDBC', finish: 'brushed', dark: false, material: 'steel' },
  { id: 'bark', name: { en: 'Bark', ar: 'لحاء' }, hex: '#3E3229', finish: 'matte', dark: true, material: 'steel' },
  { id: 'clay', name: { en: 'Clay', ar: 'طين' }, hex: '#B4654A', finish: 'matte', dark: true, material: 'steel' },
  { id: 'cream', name: { en: 'Cream', ar: 'كريمي' }, hex: '#F0E9DA', finish: 'matte', dark: false, material: 'steel' },
]

/* -------------------------------------------------------------------------- */
/* TEXT COLOURS — 8                                                           */
/* -------------------------------------------------------------------------- */

export const textColors: ColorOption[] = [
  { id: 'cream', name: { en: 'Cream', ar: 'كريمي' }, hex: '#F6F1E7', finish: 'matte', dark: false },
  { id: 'bark', name: { en: 'Bark', ar: 'لحاء' }, hex: '#3E3229', finish: 'matte', dark: true },
  { id: 'clay', name: { en: 'Clay', ar: 'طين' }, hex: '#B4654A', finish: 'matte', dark: true },
  { id: 'sage', name: { en: 'Sage', ar: 'مريمية' }, hex: '#7C8B6B', finish: 'matte', dark: true },
  { id: 'sand', name: { en: 'Sand', ar: 'رمل' }, hex: '#D9C7A7', finish: 'matte', dark: false },
  { id: 'gold', name: { en: 'Brass', ar: 'نحاس' }, hex: '#C9A227', finish: 'brushed', dark: false },
  { id: 'moss', name: { en: 'Moss', ar: 'طحلب' }, hex: '#4E5D43', finish: 'matte', dark: true },
  { id: 'stone', name: { en: 'Stone', ar: 'حجر' }, hex: '#A89F91', finish: 'matte', dark: false },
]

/* -------------------------------------------------------------------------- */
/* CURATED PALETTES — 6 one-tap body + lid pairings                           */
/* -------------------------------------------------------------------------- */

export type Palette = {
  id: string
  name: Bilingual
  bodyColorId: string
  lidColorId: string
  textColorId: string
}

export const palettes: Palette[] = [
  { id: 'dunes', name: { en: 'Dunes', ar: 'الكثبان' }, bodyColorId: 'sand', lidColorId: 'bamboo', textColorId: 'bark' },
  { id: 'kiln', name: { en: 'Kiln', ar: 'الفرن' }, bodyColorId: 'clay', lidColorId: 'dark-bamboo', textColorId: 'cream' },
  { id: 'orchard', name: { en: 'Orchard', ar: 'البستان' }, bodyColorId: 'sage', lidColorId: 'bamboo', textColorId: 'cream' },
  { id: 'nightfall', name: { en: 'Nightfall', ar: 'المغيب' }, bodyColorId: 'indigo', lidColorId: 'steel', textColorId: 'sand' },
  { id: 'roasted', name: { en: 'Roasted', ar: 'محمّص' }, bodyColorId: 'bark', lidColorId: 'bamboo', textColorId: 'sand' },
  { id: 'saltflat', name: { en: 'Salt flat', ar: 'سبخة' }, bodyColorId: 'cream', lidColorId: 'steel', textColorId: 'clay' },
]

/* -------------------------------------------------------------------------- */
/* ENGRAVING FONTS — 8 (4 Arabic, 4 Latin)                                    */
/* -------------------------------------------------------------------------- */

export type FontOption = {
  id: string
  name: Bilingual
  /** Which script the face is designed for. Both lists are always selectable. */
  script: 'arabic' | 'latin'
  /**
   * CSS custom property holding the loaded family (see src/app/fonts.ts).
   * The 3D text canvas resolves this at draw time so the engraving matches
   * the preview exactly.
   */
  cssVar: string
  weight: number
  /** Per-font optical size correction so all 8 look the same size on the mug. */
  scale: number
  /** Sample word shown when the customer has not typed anything yet. */
  sample: Bilingual
}

export const fonts: FontOption[] = [
  // — Arabic —
  {
    id: 'plex-arabic',
    name: { en: 'Plex Arabic — modern', ar: 'بلكس عربي — حديث' },
    script: 'arabic',
    cssVar: '--font-arabic',
    weight: 600,
    scale: 1,
    sample: { en: 'صباح', ar: 'صباح' },
  },
  {
    id: 'tajawal',
    name: { en: 'Tajawal — geometric', ar: 'تجوّل — هندسي' },
    script: 'arabic',
    cssVar: '--font-tajawal',
    weight: 700,
    scale: 1,
    sample: { en: 'قهوة', ar: 'قهوة' },
  },
  {
    id: 'amiri',
    name: { en: 'Amiri — classical naskh', ar: 'أميري — نسخ كلاسيكي' },
    script: 'arabic',
    cssVar: '--font-amiri',
    weight: 700,
    scale: 1.08,
    sample: { en: 'حياة', ar: 'حياة' },
  },
  {
    id: 'reem-kufi',
    name: { en: 'Reem Kufi — kufic', ar: 'ريم كوفي — كوفي' },
    script: 'arabic',
    cssVar: '--font-reem',
    weight: 600,
    scale: 0.96,
    sample: { en: 'أرض', ar: 'أرض' },
  },
  // — Latin —
  {
    id: 'manrope',
    name: { en: 'Manrope — clean sans', ar: 'مانروب — سانس نظيف' },
    script: 'latin',
    cssVar: '--font-latin',
    weight: 600,
    scale: 1,
    sample: { en: 'Morning', ar: 'Morning' },
  },
  {
    id: 'playfair',
    name: { en: 'Playfair — serif', ar: 'بلايفير — سيريف' },
    script: 'latin',
    cssVar: '--font-playfair',
    weight: 600,
    scale: 1.02,
    sample: { en: 'Terra', ar: 'Terra' },
  },
  {
    id: 'caveat',
    name: { en: 'Caveat — handwritten', ar: 'كافيات — بخطّ اليد' },
    script: 'latin',
    cssVar: '--font-caveat',
    weight: 700,
    scale: 1.22,
    sample: { en: 'stay warm', ar: 'stay warm' },
  },
  {
    id: 'space-mono',
    name: { en: 'Space Mono — technical', ar: 'سبيس مونو — تقني' },
    script: 'latin',
    cssVar: '--font-mono',
    weight: 700,
    scale: 0.92,
    sample: { en: '12h · 24h', ar: '12h · 24h' },
  },
]

/* -------------------------------------------------------------------------- */
/* TEXT SIZE + PLACEMENT                                                      */
/* -------------------------------------------------------------------------- */

export const textSizes: { id: TextSize; labelKey: string; scale: number }[] = [
  { id: 'sm', labelKey: 'designer.step3.sizeSmall', scale: 0.72 },
  { id: 'md', labelKey: 'designer.step3.sizeMedium', scale: 1 },
  { id: 'lg', labelKey: 'designer.step3.sizeLarge', scale: 1.32 },
]

export const placements: { id: Placement; labelKey: string; hintKey: string }[] = [
  { id: 'center', labelKey: 'designer.placements.center', hintKey: 'designer.placements.centerHint' },
  { id: 'lower', labelKey: 'designer.placements.lower', hintKey: 'designer.placements.lowerHint' },
  { id: 'wrap', labelKey: 'designer.placements.wrap', hintKey: 'designer.placements.wrapHint' },
]

/** Hard cap on engraved characters — 20 keeps text readable on the curve. */
export const MAX_TEXT_LENGTH = 20

/* -------------------------------------------------------------------------- */
/* LOOKUP HELPERS                                                             */
/* -------------------------------------------------------------------------- */

export const getSize = (id: SizeId) => sizes.find((s) => s.id === id) ?? sizes[1]
export const getBodyColor = (id: string) => bodyColors.find((c) => c.id === id) ?? bodyColors[0]
export const getLidColor = (id: string) => lidColors.find((c) => c.id === id) ?? lidColors[0]
export const getTextColor = (id: string) => textColors.find((c) => c.id === id) ?? textColors[0]
export const getFont = (id: string) => fonts.find((f) => f.id === id) ?? fonts[4]

/** The design a first-time visitor sees. */
export const defaultDesign = {
  sizeId: '500' as SizeId,
  bodyColorId: 'clay',
  lidColorId: 'bamboo',
  text: '',
  fontId: 'manrope',
  textColorId: 'cream',
  textSize: 'md' as TextSize,
  placement: 'center' as Placement,
  handle: false,
  accessories: [] as string[],
}

/** Price of one mug for a given configuration. */
export function priceOf(design: {
  sizeId: SizeId
  text: string
  lidColorId: string
  discountPercent?: number
}) {
  let total = pricing.base[design.sizeId]
  if (design.text.trim().length > 0) total += pricing.engraving
  if (getLidColor(design.lidColorId).material === 'bamboo') total += pricing.bambooLid
  if (design.discountPercent) total = total * (1 - design.discountPercent / 100)
  return Math.round(total * 1000) / 1000
}
