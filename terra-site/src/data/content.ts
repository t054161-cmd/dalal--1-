/**
 * ============================================================================
 * EDITORIAL DATA
 * ============================================================================
 * Community designs, reviews, and the seven moments of the ritual.
 * Bilingual and safe for a non-developer to edit. The ritual copy itself lives
 * in the translations file; only the imagery and tone live here.
 * ============================================================================
 */

import type { Bilingual, CupConfig } from '@/types'
import { defaultConfig } from './product'

/* -------------------------------------------------------------------------- */
/* THE RITUAL — seven moments, one cup                                         */
/* -------------------------------------------------------------------------- */

export const ritual: {
  id: string
  /** i18n keys for the title and the note. */
  titleKey: string
  noteKey: string
  tone: string
  /** Placeholder image; the filename describes the photograph to shoot. */
  image: string
  /** Column span on the editorial grid. */
  wide?: boolean
}[] = [
  {
    id: 'coffee',
    titleKey: 'ritual.m1',
    noteKey: 'ritual.m1Note',
    tone: 'linen',
    image: '/images/ritual/ritual-linen-morning-coffee-window-light.svg',
    wide: true,
  },
  {
    id: 'university',
    titleKey: 'ritual.m2',
    noteKey: 'ritual.m2Note',
    tone: 'sage',
    image: '/images/ritual/ritual-sage-university-desk-notebook.svg',
  },
  {
    id: 'work',
    titleKey: 'ritual.m3',
    noteKey: 'ritual.m3Note',
    tone: 'forest',
    image: '/images/ritual/ritual-forest-office-desk-afternoon.svg',
  },
  {
    id: 'reading',
    titleKey: 'ritual.m4',
    noteKey: 'ritual.m4Note',
    tone: 'sandi',
    image: '/images/ritual/ritual-sandi-reading-chair-book.svg',
    wide: true,
  },
  {
    id: 'walking',
    titleKey: 'ritual.m5',
    noteKey: 'ritual.m5Note',
    tone: 'sage',
    image: '/images/ritual/ritual-sage-walking-seafront-hand.svg',
  },
  {
    id: 'creative',
    titleKey: 'ritual.m6',
    noteKey: 'ritual.m6Note',
    tone: 'forest',
    image: '/images/ritual/ritual-forest-studio-night-iced.svg',
  },
  {
    id: 'slow',
    titleKey: 'ritual.m7',
    noteKey: 'ritual.m7Note',
    tone: 'linen',
    image: '/images/ritual/ritual-linen-slow-morning-linen-sheets.svg',
    wide: true,
  },
]

/* -------------------------------------------------------------------------- */
/* THE COMMUNITY — designs made in the designer                                */
/* -------------------------------------------------------------------------- */

export type CommunityDesign = {
  id: string
  author: Bilingual
  caption: Bilingual
  config: CupConfig
}

const design = (config: Partial<CupConfig>): CupConfig => ({ ...defaultConfig, ...config })

export const community: CommunityDesign[] = [
  {
    id: 'c1',
    author: { en: 'Layla', ar: 'ليلى' },
    caption: { en: 'Olive leaves, for my mother.', ar: 'ورق زيتون، لأمي.' },
    config: design({
      colorway: 'linen',
      bodyColor: '#E7E1D4',
      lidColor: '#A2AB98',
      strawColor: '#A2AB98',
      pattern: 'olive',
      patternColor: '#5E6B58',
      mark: 'لأمي',
      markFont: 'editorial',
      markColor: '#5E6B58',
      symbol: 'leaf',
    }),
  },
  {
    id: 'c2',
    author: { en: 'Hamad', ar: 'حمد' },
    caption: { en: 'Contour lines from a map of Wafra.', ar: 'خطوط كنتور من خريطة الوفرة.' },
    config: design({
      colorway: 'forest',
      bodyColor: '#2E3A31',
      lidColor: '#28332B',
      strawColor: '#C8BEAF',
      pattern: 'ridge',
      patternColor: '#E7E1D4',
      mark: 'H.A',
      markFont: 'initials',
      markColor: '#E7E1D4',
      symbol: 'ridge',
    }),
  },
  {
    id: 'c3',
    author: { en: 'Sara', ar: 'سارة' },
    caption: { en: 'Arches, like the old souq roof.', ar: 'أقواس، كسقف السوق القديم.' },
    config: design({
      colorway: 'sandi',
      bodyColor: '#DFC9C0',
      lidColor: '#D8C1B8',
      strawColor: '#6B5C56',
      pattern: 'arch',
      patternColor: '#6B5C56',
      mark: 'SARA',
      markColor: '#6B5C56',
      symbol: 'none',
    }),
  },
  {
    id: 'c4',
    author: { en: 'Omar', ar: 'عمر' },
    caption: { en: 'Nothing on it but my initials.', ar: 'لا شيء عليه سوى أحرفي.' },
    config: design({
      colorway: 'sage',
      bodyColor: '#A9B29F',
      lidColor: '#E7E1D4',
      strawColor: '#E7E1D4',
      pattern: 'none',
      mark: 'O.K',
      markFont: 'initials',
      markColor: '#F0ECE3',
    }),
  },
  {
    id: 'c5',
    author: { en: 'Mariam', ar: 'مريم' },
    caption: { en: 'A seed field, and one word.', ar: 'حقل بذور، وكلمة واحدة.' },
    config: design({
      colorway: 'linen',
      bodyColor: '#E7E1D4',
      lidColor: '#DFC9C0',
      strawColor: '#DFC9C0',
      pattern: 'field',
      patternColor: '#A9B29F',
      mark: 'صباح',
      markFont: 'editorial',
      markColor: '#5E6B58',
      symbol: 'seed',
    }),
  },
  {
    id: 'c6',
    author: { en: 'Faisal', ar: 'فيصل' },
    caption: { en: 'Terrazzo. It hides everything.', ar: 'تيرازو. يخفي كل شيء.' },
    config: design({
      colorway: 'smoke',
      bodyColor: '#5E6B58',
      lidColor: '#5E6B58',
      strawColor: '#E7E1D4',
      pattern: 'terrazzo',
      patternColor: '#E7E1D4',
      mark: '',
      symbol: 'none',
    }),
  },
]

/* -------------------------------------------------------------------------- */
/* REVIEWS — short, editorial, no walls of text                                */
/* -------------------------------------------------------------------------- */

export const reviews: {
  id: string
  author: Bilingual
  months: number
  quote: Bilingual
  tone: Bilingual
}[] = [
  {
    id: 'r1',
    author: { en: 'Noura A.', ar: 'نورة ع.' },
    months: 9,
    quote: {
      en: 'Ice at seven in the morning is still ice at four in the afternoon. I stopped noticing, which is the point.',
      ar: 'الثلج في السابعة صباحاً يبقى ثلجاً في الرابعة عصراً. توقّفت عن ملاحظته، وهذا هو المقصد.',
    },
    tone: { en: 'Sage', ar: 'مريمية' },
  },
  {
    id: 'r2',
    author: { en: 'Yousef M.', ar: 'يوسف م.' },
    months: 7,
    quote: {
      en: 'The straw is the part I expected to lose. It has a home in the lid, so it never leaves.',
      ar: 'الماصّة هي الجزء الذي توقّعت فقدانه. لها مكان في الغطاء، فلا تفارقه.',
    },
    tone: { en: 'Forest', ar: 'غابة' },
  },
  {
    id: 'r3',
    author: { en: 'Dana K.', ar: 'دانة ك.' },
    months: 5,
    quote: {
      en: 'I typed one sentence into the designer and it chose better than I would have.',
      ar: 'كتبت جملة واحدة في المصمّم فاختار أفضل مما كنت سأختار.',
    },
    tone: { en: 'Linen', ar: 'كتّان' },
  },
  {
    id: 'r4',
    author: { en: 'Abdullah S.', ar: 'عبدالله س.' },
    months: 12,
    quote: {
      en: 'A year in, the coating has no marks on it. I have been careless with it and it does not show.',
      ar: 'بعد سنة، لا أثر على الطلاء. كنت مهملاً معه ولا يظهر ذلك.',
    },
    tone: { en: 'Sandi', ar: 'ساندي' },
  },
]
