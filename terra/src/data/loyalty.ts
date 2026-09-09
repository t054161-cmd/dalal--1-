/**
 * ============================================================================
 * TERRA — SOIL CLUB (loyalty programme)
 * ============================================================================
 * Points are earned on orders and on a few actions that cost us nothing but
 * mean something (voting in the gallery, sending a cup back for recycling).
 * Tiers unlock a standing discount and one reward each.
 *
 * Everything here is editable data: point rates, tier thresholds, and the
 * reward catalogue.
 * ============================================================================
 */

import type { Bilingual } from '@/types/design'

/** Points per 1 KWD spent. */
export const POINTS_PER_KWD = 10

/** One-off point awards for non-purchase actions. */
export const pointEvents = {
  signup: 100,
  firstDesignSaved: 50,
  galleryVote: 5,
  takeBackCup: 250,
  reviewWithPhoto: 75,
  refillPlanStarted: 120,
} as const

export type PointEvent = keyof typeof pointEvents

export type Tier = {
  id: string
  name: Bilingual
  /** Points needed to reach this tier. */
  threshold: number
  /** Standing discount on every order, in percent. */
  discountPercent: number
  perks: Bilingual[]
  /** Ring colour in the UI. */
  hex: string
}

export const tiers: Tier[] = [
  {
    id: 'soil',
    name: { en: 'Soil', ar: 'تُراب' },
    threshold: 0,
    discountPercent: 0,
    hex: '#A89F91',
    perks: [
      { en: 'Points on every order', ar: 'نقاط على كل طلب' },
      { en: 'Cup of the Day discounts', ar: 'خصومات كوب اليوم' },
    ],
  },
  {
    id: 'clay',
    name: { en: 'Clay', ar: 'طين' },
    threshold: 500,
    discountPercent: 5,
    hex: '#B4654A',
    perks: [
      { en: '5% off every order, always', ar: 'خصم ٥٪ على كل طلب، دائماً' },
      { en: 'Free engraving on your next mug', ar: 'نقش مجاني على كوبك القادم' },
    ],
  },
  {
    id: 'grove',
    name: { en: 'Grove', ar: 'بستان' },
    threshold: 1500,
    discountPercent: 8,
    hex: '#7C8B6B',
    perks: [
      { en: '8% off every order', ar: 'خصم ٨٪ على كل طلب' },
      { en: 'Free delivery, no minimum', ar: 'توصيل مجاني بلا حدّ أدنى' },
      { en: 'A spare bamboo lid, on us', ar: 'غطاء خيزران إضافي على حسابنا' },
    ],
  },
  {
    id: 'terra',
    name: { en: 'Terra', ar: 'تيرّا' },
    threshold: 4000,
    discountPercent: 12,
    hex: '#4E5D43',
    perks: [
      { en: '12% off every order', ar: 'خصم ١٢٪ على كل طلب' },
      { en: 'Early access to every new colour', ar: 'أسبقية على كل لون جديد' },
      { en: 'One mug gifted to a friend, free, each year', ar: 'كوب هدية لصديق، مجاناً، كل سنة' },
      { en: 'Your name on the workshop wall', ar: 'اسمك على حائط الورشة' },
    ],
  },
]

/** Rewards a member can redeem with points. */
export type Reward = {
  id: string
  name: Bilingual
  cost: number
  blurb: Bilingual
  /** 'discount' applies at checkout; 'item' ships with the next order. */
  kind: 'discount' | 'item' | 'prize'
  /** For discount rewards: value in KWD taken off the order. */
  value?: number
}

export const rewards: Reward[] = [
  {
    id: 'kwd2',
    name: { en: '2 KWD off your order', ar: 'خصم ٢ د.ك من طلبك' },
    cost: 200,
    kind: 'discount',
    value: 2,
    blurb: { en: 'Applies at checkout, on any order.', ar: 'يُطبَّق عند الدفع، على أي طلب.' },
  },
  {
    id: 'kwd5',
    name: { en: '5 KWD off your order', ar: 'خصم ٥ د.ك من طلبك' },
    cost: 450,
    kind: 'discount',
    value: 5,
    blurb: { en: 'Our best-value redemption.', ar: 'أفضل استبدال من حيث القيمة.' },
  },
  {
    id: 'free-brush',
    name: { en: 'Sisal cleaning brush', ar: 'فرشاة سيزال' },
    cost: 150,
    kind: 'item',
    blurb: { en: 'Ships free with your next mug.', ar: 'تُشحن مجاناً مع كوبك القادم.' },
  },
  {
    id: 'free-holder',
    name: { en: 'Cork cup holder', ar: 'حاضن فلّيني' },
    cost: 300,
    kind: 'item',
    blurb: { en: 'Any size, any colour.', ar: 'لأي حجم وأي لون.' },
  },
  {
    id: 'free-chain',
    name: { en: 'Carry chain', ar: 'سلسلة حمل' },
    cost: 400,
    kind: 'item',
    blurb: { en: 'Recycled steel, clips to any lid.', ar: 'فولاذ معاد تدويره، تُثبَّت في أي غطاء.' },
  },
  {
    id: 'free-mug',
    name: { en: 'A free 350 ml TERRA', ar: 'كوب تيرّا ٣٥٠ مل مجاناً' },
    cost: 1200,
    kind: 'prize',
    blurb: { en: 'Fully customized, engraving included.', ar: 'مخصَّص بالكامل، والنقش مشمول.' },
  },
  {
    id: 'workshop-day',
    name: { en: 'A day in the workshop', ar: 'يوم في الورشة' },
    cost: 2500,
    kind: 'prize',
    blurb: {
      en: 'Come and engrave your own mug with us. Four seats a month.',
      ar: 'تعال وانقش كوبك بيدك معنا. أربعة مقاعد في الشهر.',
    },
  },
]

/** Points earned by an order total. */
export const pointsForSpend = (kwd: number) => Math.round(kwd * POINTS_PER_KWD)

/** The tier a point balance sits in, and the next one up. */
export function tierFor(points: number) {
  const sorted = [...tiers].sort((a, b) => a.threshold - b.threshold)
  let current = sorted[0]
  for (const tier of sorted) if (points >= tier.threshold) current = tier
  const next = sorted.find((t) => t.threshold > current.threshold)
  const span = next ? next.threshold - current.threshold : 1
  const progress = next ? Math.min(100, ((points - current.threshold) / span) * 100) : 100
  return { current, next, progress, toNext: next ? next.threshold - points : 0 }
}
