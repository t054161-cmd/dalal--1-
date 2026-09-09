/**
 * ============================================================================
 * TERRA — READY-MADE DESIGNS (the /shop grid)
 * ============================================================================
 * Curated, orderable designs. Each one can also be opened in the designer as
 * a starting point. `occasions` and `colorFamily` drive the shop filters.
 * ============================================================================
 */

import type { Bilingual, Placement, SizeId, TextSize } from '@/types/design'

export type Occasion = 'everyday' | 'gift' | 'office' | 'outdoors' | 'ramadan' | 'wedding'

export type ShopDesign = {
  id: string
  name: Bilingual
  blurb: Bilingual
  bodyColorId: string
  lidColorId: string
  text: string
  fontId: string
  textColorId: string
  placement: Placement
  sizeId: SizeId
  textSize: TextSize
  handle: boolean
  occasions: Occasion[]
  /** Filter bucket, kept separate from the exact body colour id. */
  colorFamily: 'warm' | 'green' | 'neutral' | 'dark' | 'metal'
  bestseller?: boolean
  /** Some designs run out — drives "notify me when back in stock". */
  inStock: boolean
}

export const shopDesigns: ShopDesign[] = [
  {
    id: 'sd-morning',
    name: { en: 'Morning Person', ar: 'إنسان الصباح' },
    blurb: { en: 'A lie, printed permanently.', ar: 'كذبة، مطبوعة إلى الأبد.' },
    bodyColorId: 'clay', lidColorId: 'bamboo', text: 'morning person', fontId: 'caveat',
    textColorId: 'cream', placement: 'center', sizeId: '500', textSize: 'md', handle: false,
    occasions: ['everyday', 'gift'], colorFamily: 'warm', bestseller: true, inStock: true,
  },
  {
    id: 'sd-sabah',
    name: { en: 'Sabah Al-Khair', ar: 'صباح الخير' },
    blurb: { en: 'Tajawal, clean and geometric.', ar: 'خط تجوّل، نظيف وهندسي.' },
    bodyColorId: 'sand', lidColorId: 'bamboo', text: 'صباح الخير', fontId: 'tajawal',
    textColorId: 'bark', placement: 'center', sizeId: '350', textSize: 'md', handle: false,
    occasions: ['everyday', 'gift'], colorFamily: 'neutral', bestseller: true, inStock: true,
  },
  {
    id: 'sd-desk',
    name: { en: 'Desk Companion', ar: 'رفيق المكتب' },
    blurb: { en: '500 ml with a handle. Never leaves the desk.', ar: '٥٠٠ مل بمقبض. لا يترك المكتب.' },
    bodyColorId: 'sage', lidColorId: 'cream', text: 'do not disturb', fontId: 'manrope',
    textColorId: 'cream', placement: 'lower', sizeId: '500', textSize: 'sm', handle: true,
    occasions: ['office', 'everyday'], colorFamily: 'green', inStock: true,
  },
  {
    id: 'sd-site',
    name: { en: 'Site Visit', ar: 'زيارة ميدانية' },
    blurb: { en: 'The 700 ml, for long days outdoors.', ar: '٧٠٠ مل، للأيام الطويلة في الخارج.' },
    bodyColorId: 'ash', lidColorId: 'steel', text: 'measure twice', fontId: 'space-mono',
    textColorId: 'sand', placement: 'wrap', sizeId: '700', textSize: 'sm', handle: true,
    occasions: ['outdoors', 'office'], colorFamily: 'dark', inStock: true,
  },
  {
    id: 'sd-ramadan',
    name: { en: 'Ramadan Kareem', ar: 'رمضان كريم' },
    blurb: { en: 'Kufic in brass on deep indigo.', ar: 'كوفي نحاسي على نيلي عميق.' },
    bodyColorId: 'indigo', lidColorId: 'dark-bamboo', text: 'رمضان كريم', fontId: 'reem-kufi',
    textColorId: 'gold', placement: 'center', sizeId: '500', textSize: 'md', handle: false,
    occasions: ['ramadan', 'gift'], colorFamily: 'dark', bestseller: true, inStock: true,
  },
  {
    id: 'sd-wedding',
    name: { en: 'Two Names', ar: 'اسمان' },
    blurb: { en: 'Wedding favours, from 25 pieces.', ar: 'تذكارات أعراس، من ٢٥ قطعة.' },
    bodyColorId: 'cream', lidColorId: 'bamboo', text: 'A & M · 2026', fontId: 'playfair',
    textColorId: 'clay', placement: 'center', sizeId: '350', textSize: 'md', handle: false,
    occasions: ['wedding', 'gift'], colorFamily: 'neutral', inStock: true,
  },
  {
    id: 'sd-gahwa',
    name: { en: 'Gahwa & Hail', ar: 'قهوة وهال' },
    blurb: { en: 'Saffron body, naskh letters.', ar: 'جسم زعفراني وحروف نسخ.' },
    bodyColorId: 'saffron', lidColorId: 'dark-bamboo', text: 'قهوة وهال', fontId: 'amiri',
    textColorId: 'bark', placement: 'center', sizeId: '350', textSize: 'md', handle: false,
    occasions: ['everyday', 'gift'], colorFamily: 'warm', inStock: true,
  },
  {
    id: 'sd-steel',
    name: { en: 'Bare Steel', ar: 'فولاذ عارٍ' },
    blurb: { en: 'No colour at all. Nothing to chip.', ar: 'بلا لون. لا شيء يتقشّر.' },
    bodyColorId: 'steel', lidColorId: 'bamboo', text: '', fontId: 'manrope',
    textColorId: 'bark', placement: 'center', sizeId: '500', textSize: 'md', handle: false,
    occasions: ['everyday', 'office'], colorFamily: 'metal', inStock: true,
  },
  {
    id: 'sd-gym',
    name: { en: 'One More Set', ar: 'جولة أخرى' },
    blurb: { en: 'Wrap-around text, 700 ml, cold 24h.', ar: 'نص ملفوف، ٧٠٠ مل، بارد ٢٤ ساعة.' },
    bodyColorId: 'bark', lidColorId: 'steel', text: 'one more set', fontId: 'manrope',
    textColorId: 'sand', placement: 'wrap', sizeId: '700', textSize: 'sm', handle: true,
    occasions: ['outdoors'], colorFamily: 'dark', inStock: false,
  },
  {
    id: 'sd-moss',
    name: { en: 'Grow Something', ar: 'ازرع شيئاً' },
    blurb: { en: 'Handwritten, low on the body.', ar: 'بخطّ اليد، أسفل الجسم.' },
    bodyColorId: 'moss', lidColorId: 'bamboo', text: 'grow something', fontId: 'caveat',
    textColorId: 'sand', placement: 'lower', sizeId: '500', textSize: 'md', handle: true,
    occasions: ['gift', 'everyday'], colorFamily: 'green', inStock: true,
  },
  {
    id: 'sd-shukran',
    name: { en: 'Shukran', ar: 'شكراً' },
    blurb: { en: 'The easiest gift to get right.', ar: 'أسهل هدية تصيب.' },
    bodyColorId: 'clay', lidColorId: 'cream', text: 'شكراً', fontId: 'tajawal',
    textColorId: 'cream', placement: 'center', sizeId: '350', textSize: 'lg', handle: false,
    occasions: ['gift'], colorFamily: 'warm', bestseller: true, inStock: true,
  },
  {
    id: 'sd-nightshift',
    name: { en: 'Night Shift', ar: 'دوام الليل' },
    blurb: { en: 'Mono type, small, near the base.', ar: 'خط أحادي صغير قرب القاعدة.' },
    bodyColorId: 'indigo', lidColorId: 'steel', text: '03:00 · still up', fontId: 'space-mono',
    textColorId: 'sand', placement: 'lower', sizeId: '700', textSize: 'sm', handle: true,
    occasions: ['office', 'everyday'], colorFamily: 'dark', inStock: true,
  },
  {
    id: 'sd-albahr',
    name: { en: 'Al Bahr', ar: 'البحر' },
    blurb: { en: 'One word, large, centred.', ar: 'كلمة واحدة، كبيرة، في الوسط.' },
    bodyColorId: 'indigo', lidColorId: 'cream', text: 'البحر', fontId: 'plex-arabic',
    textColorId: 'cream', placement: 'center', sizeId: '700', textSize: 'lg', handle: true,
    occasions: ['outdoors', 'gift'], colorFamily: 'dark', inStock: true,
  },
  {
    id: 'sd-saltflat',
    name: { en: 'Quiet', ar: 'هدوء' },
    blurb: { en: 'Cream on cream, almost nothing.', ar: 'كريمي على كريمي، لا شيء تقريباً.' },
    bodyColorId: 'cream', lidColorId: 'steel', text: 'quiet', fontId: 'manrope',
    textColorId: 'clay', placement: 'lower', sizeId: '500', textSize: 'md', handle: false,
    occasions: ['everyday', 'office'], colorFamily: 'neutral', inStock: true,
  },
  {
    id: 'sd-rust',
    name: { en: 'Terra', ar: 'تيرّا' },
    blurb: { en: 'Our name, in the colour it means.', ar: 'اسمنا، بلون معناه.' },
    bodyColorId: 'rust', lidColorId: 'bamboo', text: 'terra', fontId: 'playfair',
    textColorId: 'cream', placement: 'center', sizeId: '350', textSize: 'lg', handle: false,
    occasions: ['everyday', 'gift'], colorFamily: 'warm', inStock: true,
  },
  {
    id: 'sd-stone',
    name: { en: 'First Rain', ar: 'أول المطر' },
    blurb: { en: 'Naskh in moss on warm stone.', ar: 'نسخ بلون الطحلب على حجر دافئ.' },
    bodyColorId: 'stone', lidColorId: 'dark-bamboo', text: 'أول المطر', fontId: 'amiri',
    textColorId: 'moss', placement: 'center', sizeId: '500', textSize: 'md', handle: false,
    occasions: ['gift', 'everyday'], colorFamily: 'neutral', inStock: true,
  },
]

export const occasionOptions: Occasion[] = ['everyday', 'gift', 'office', 'outdoors', 'ramadan', 'wedding']

export const colorFamilies = ['warm', 'green', 'neutral', 'dark', 'metal'] as const

export const colorFamilyLabels: Record<(typeof colorFamilies)[number], Bilingual> = {
  warm: { en: 'Warm', ar: 'دافئة' },
  green: { en: 'Green', ar: 'خضراء' },
  neutral: { en: 'Neutral', ar: 'محايدة' },
  dark: { en: 'Dark', ar: 'غامقة' },
  metal: { en: 'Metal', ar: 'معدنية' },
}

export const getShopDesign = (id: string) => shopDesigns.find((d) => d.id === id)
