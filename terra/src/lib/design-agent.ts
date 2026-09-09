/**
 * ============================================================================
 * TERRA — AI DESIGN AGENT
 * ============================================================================
 * Turns a sentence ("a sage 500 ml with my name in a handwritten font") into a
 * patch for the design configuration.
 *
 * Two engines, one output shape:
 *
 *  1. LOCAL  — the deterministic matcher in this file. Bilingual keyword and
 *              phrase matching, no network, no key, works offline, instant.
 *  2. REMOTE — POST /api/design-agent, which asks Claude when the site is
 *              configured with an ANTHROPIC_API_KEY. Its answer is passed
 *              through `normalizePatch` below, so a model can never introduce
 *              a colour, font or size that does not exist in our catalogue.
 *
 * The UI tries REMOTE first and silently falls back to LOCAL, so the feature
 * is never broken — only more or less clever.
 * ============================================================================
 */

import {
  bodyColors,
  fonts,
  getBodyColor,
  getFont,
  getLidColor,
  getTextColor,
  lidColors,
  MAX_TEXT_LENGTH,
  sizes,
  textColors,
} from '@/data/product'
import { accessories } from '@/data/accessories'
import type { Bilingual, DesignConfig, Placement, SizeId, TextSize } from '@/types/design'

export type DesignPatch = Partial<
  Pick<
    DesignConfig,
    | 'sizeId'
    | 'bodyColorId'
    | 'lidColorId'
    | 'text'
    | 'fontId'
    | 'textColorId'
    | 'textSize'
    | 'placement'
    | 'handle'
    | 'accessories'
  >
>

export type AgentChange = {
  field: keyof DesignPatch
  /** Human-readable value, ready to show in either language. */
  display: Bilingual
}

export type AgentResult = {
  patch: DesignPatch
  changes: AgentChange[]
  understood: boolean
  engine: 'local' | 'claude'
  /** Set when the remote engine was tried and failed. */
  note?: string
}

/* -------------------------------------------------------------------------- */
/* NORMALISATION — the safety gate for both engines                            */
/* -------------------------------------------------------------------------- */

const sizeIds = sizes.map((s) => s.id) as SizeId[]
const placementIds: Placement[] = ['center', 'lower', 'wrap']
const textSizeIds: TextSize[] = ['sm', 'md', 'lg']
const accessoryIds = accessories.map((a) => a.id)

/**
 * Drop anything that is not a real catalogue value. Unknown ids are removed
 * rather than corrected, so a confused model produces a smaller patch instead
 * of a wrong mug.
 */
export function normalizePatch(input: unknown): DesignPatch {
  const raw = (input ?? {}) as Record<string, unknown>
  const out: DesignPatch = {}

  const str = (v: unknown) => (typeof v === 'string' ? v.trim() : undefined)

  const size = str(raw.sizeId)
  if (size && (sizeIds as string[]).includes(size)) out.sizeId = size as SizeId

  const body = str(raw.bodyColorId)
  if (body && bodyColors.some((c) => c.id === body)) out.bodyColorId = body

  const lid = str(raw.lidColorId)
  if (lid && lidColors.some((c) => c.id === lid)) out.lidColorId = lid

  const textColor = str(raw.textColorId)
  if (textColor && textColors.some((c) => c.id === textColor)) out.textColorId = textColor

  const font = str(raw.fontId)
  if (font && fonts.some((f) => f.id === font)) out.fontId = font

  const placement = str(raw.placement)
  if (placement && (placementIds as string[]).includes(placement))
    out.placement = placement as Placement

  const textSize = str(raw.textSize)
  if (textSize && (textSizeIds as string[]).includes(textSize)) out.textSize = textSize as TextSize

  if (typeof raw.text === 'string') out.text = raw.text.slice(0, MAX_TEXT_LENGTH)

  if (typeof raw.handle === 'boolean') out.handle = raw.handle

  if (Array.isArray(raw.accessories)) {
    const list = raw.accessories
      .filter((a): a is string => typeof a === 'string')
      .filter((a) => accessoryIds.includes(a))
    out.accessories = Array.from(new Set(list))
  }

  return out
}

/** Describe a patch in both languages, for the "what changed" list. */
export function describePatch(patch: DesignPatch): AgentChange[] {
  const changes: AgentChange[] = []

  if (patch.sizeId) {
    const size = sizes.find((s) => s.id === patch.sizeId)!
    changes.push({ field: 'sizeId', display: size.name })
  }
  if (patch.bodyColorId) changes.push({ field: 'bodyColorId', display: getBodyColor(patch.bodyColorId).name })
  if (patch.lidColorId) changes.push({ field: 'lidColorId', display: getLidColor(patch.lidColorId).name })
  if (patch.text !== undefined) {
    const shown = patch.text.length ? `“${patch.text}”` : '—'
    changes.push({ field: 'text', display: { en: shown, ar: shown } })
  }
  if (patch.fontId) changes.push({ field: 'fontId', display: getFont(patch.fontId).name })
  if (patch.textColorId) changes.push({ field: 'textColorId', display: getTextColor(patch.textColorId).name })
  if (patch.textSize) {
    const map: Record<TextSize, Bilingual> = {
      sm: { en: 'Small', ar: 'صغير' },
      md: { en: 'Medium', ar: 'متوسط' },
      lg: { en: 'Large', ar: 'كبير' },
    }
    changes.push({ field: 'textSize', display: map[patch.textSize] })
  }
  if (patch.placement) {
    const map: Record<Placement, Bilingual> = {
      center: { en: 'Centre band', ar: 'الوسط' },
      lower: { en: 'Lower band', ar: 'الشريط السفلي' },
      wrap: { en: 'Wrap-around', ar: 'محيط كامل' },
    }
    changes.push({ field: 'placement', display: map[patch.placement] })
  }
  if (patch.handle !== undefined) {
    changes.push({
      field: 'handle',
      display: patch.handle ? { en: 'With handle', ar: 'مع مقبض' } : { en: 'No handle', ar: 'بدون مقبض' },
    })
  }
  if (patch.accessories) {
    const names = patch.accessories
      .map((id) => accessories.find((a) => a.id === id))
      .filter(Boolean)
    changes.push({
      field: 'accessories',
      display: names.length
        ? {
            en: names.map((a) => a!.name.en).join(' + '),
            ar: names.map((a) => a!.name.ar).join(' + '),
          }
        : { en: 'None', ar: 'بلا إضافات' },
    })
  }

  return changes
}

/* -------------------------------------------------------------------------- */
/* LOCAL ENGINE                                                               */
/* -------------------------------------------------------------------------- */

/** Convert Arabic-Indic digits so "٥٠٠" and "500" behave the same. */
function normalizeDigits(input: string) {
  return input.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
}

/** Words that select a body colour. Order matters: longest phrase first. */
const bodyColorRules: { id: string; words: string[] }[] = [
  { id: 'moss', words: ['dark green', 'deep green', 'moss', 'أخضر غامق', 'طحلب', 'زيتي'] },
  { id: 'sage', words: ['sage', 'olive', 'muted green', 'green', 'مريمية', 'أخضر'] },
  { id: 'indigo', words: ['indigo', 'navy', 'dark blue', 'blue', 'نيلي', 'كحلي', 'أزرق'] },
  { id: 'clay', words: ['clay', 'terracotta', 'terra cotta', 'burnt orange', 'طيني', 'طين', 'تراكوتا'] },
  { id: 'rust', words: ['rust', 'brick', 'maroon', 'deep red', 'red', 'صدأ', 'أحمر', 'عنابي'] },
  { id: 'saffron', words: ['saffron', 'mustard', 'amber', 'yellow', 'زعفران', 'أصفر', 'خردلي'] },
  { id: 'sand', words: ['sand', 'beige', 'tan', 'رملي', 'رمل', 'بيج'] },
  { id: 'cream', words: ['cream', 'off-white', 'ivory', 'white', 'كريمي', 'عاجي', 'أبيض'] },
  { id: 'stone', words: ['stone', 'taupe', 'warm grey', 'حجري', 'حجر'] },
  { id: 'ash', words: ['ash', 'charcoal', 'grey', 'gray', 'رمادي', 'فحمي'] },
  { id: 'bark', words: ['bark', 'dark brown', 'brown', 'espresso', 'dark', 'بني', 'غامق', 'لحاء'] },
  { id: 'steel', words: ['brushed steel', 'steel', 'metal', 'metallic', 'silver', 'raw', 'فولاذ', 'معدني', 'فضي'] },
]

const fontRules: { id: string; words: string[] }[] = [
  { id: 'caveat', words: ['handwritten', 'handwriting', 'script', 'cursive', 'خط اليد', 'بخط اليد', 'يدوي'] },
  { id: 'reem-kufi', words: ['kufic', 'kufi', 'square', 'كوفي', 'كوفية'] },
  { id: 'amiri', words: ['naskh', 'classical', 'traditional', 'serif arabic', 'نسخ', 'كلاسيكي', 'أميري'] },
  { id: 'tajawal', words: ['tajawal', 'geometric arabic', 'تجول', 'تجوّل', 'هندسي'] },
  { id: 'plex-arabic', words: ['plex', 'modern arabic', 'عربي حديث', 'بلكس'] },
  { id: 'playfair', words: ['serif', 'elegant', 'playfair', 'classic', 'أنيق', 'سيريف'] },
  { id: 'space-mono', words: ['mono', 'monospace', 'technical', 'typewriter', 'code', 'تقني', 'أحادي'] },
  { id: 'manrope', words: ['sans', 'clean', 'simple', 'modern', 'minimal', 'بسيط', 'نظيف', 'حديث'] },
]

const textColorRules: { id: string; words: string[] }[] = [
  { id: 'gold', words: ['brass', 'gold', 'golden', 'نحاسي', 'ذهبي', 'نحاس'] },
  { id: 'cream', words: ['cream', 'white', 'كريمي', 'أبيض'] },
  { id: 'bark', words: ['brown', 'dark', 'black', 'بني', 'غامق', 'أسود'] },
  { id: 'clay', words: ['clay', 'terracotta', 'طيني', 'طين'] },
  { id: 'sage', words: ['sage', 'green', 'مريمية', 'أخضر'] },
  { id: 'sand', words: ['sand', 'beige', 'رملي', 'بيج'] },
  { id: 'moss', words: ['moss', 'dark green', 'طحلب'] },
  { id: 'stone', words: ['stone', 'grey', 'gray', 'حجري', 'رمادي'] },
]

const includesAny = (haystack: string, words: string[]) => words.some((w) => haystack.includes(w))

/** Pull an explicitly quoted string out of the prompt. */
function extractQuoted(input: string): string | null {
  const patterns = [
    /[“"]([^”"]{1,60})[”"]/, // "text" or “text”
    /«([^»]{1,60})»/, // «نص»
    /['’]([^'’]{2,60})['’]/, // 'text'
  ]
  for (const re of patterns) {
    const m = input.match(re)
    if (m?.[1]?.trim()) return m[1].trim()
  }
  return null
}

/** Pull text out of "that says X" / "مكتوب عليه X" / "my name is X". */
function extractPhrasedText(input: string): string | null {
  const patterns = [
    /(?:that says|say|says|reading|write|writes|written|engrave[d]?|text[:]?)\s+(.{2,40})$/i,
    /(?:my name is|name)\s+([A-Za-z؀-ۿ]{2,20})/i,
    /(?:مكتوب عليه|يكتب|اكتب|مكتوب|نصه|باسم|اسمي)\s+(.{2,40})$/,
  ]
  for (const re of patterns) {
    const m = input.match(re)
    if (m?.[1]) {
      return m[1]
        .replace(/[.,!؟?]+$/, '')
        .replace(/\s+(in|بخط|بلون|on the|wrapped).*$/i, '')
        .trim()
    }
  }
  return null
}

/**
 * The offline engine. Deterministic, bilingual, and forgiving: anything it
 * cannot parse is simply left alone.
 */
export function parseLocally(promptRaw: string): AgentResult {
  const prompt = normalizeDigits(promptRaw).toLowerCase()
  const patch: DesignPatch = {}

  /* --- size ------------------------------------------------------------- */
  if (/\b700\b/.test(prompt) || includesAny(prompt, ['largest', 'biggest', 'gym', 'outdoors', 'hike', 'site', 'نادي', 'أكبر', 'كبير جدا'])) {
    patch.sizeId = '700'
  } else if (/\b350\b/.test(prompt) || includesAny(prompt, ['smallest', 'small', 'car', 'cup holder', 'espresso', 'سيارة', 'صغير', 'أصغر'])) {
    patch.sizeId = '350'
  } else if (/\b500\b/.test(prompt) || includesAny(prompt, ['desk', 'medium', 'office', 'مكتب', 'متوسط'])) {
    patch.sizeId = '500'
  }

  /* --- text (before colours, so the quoted words are not colour-matched) -- */
  const quoted = extractQuoted(promptRaw)
  const phrased = quoted ?? extractPhrasedText(promptRaw)
  if (phrased) patch.text = phrased.slice(0, MAX_TEXT_LENGTH)
  if (includesAny(prompt, ['no text', 'without text', 'blank', 'plain', 'بدون نص', 'بلا نص', 'سادة'])) {
    patch.text = ''
  }

  // Colour matching must not read the customer's own engraved words.
  const scan = phrased ? prompt.split(phrased.toLowerCase()).join(' ') : prompt

  /* --- body colour ------------------------------------------------------ */
  for (const rule of bodyColorRules) {
    if (includesAny(scan, rule.words)) {
      patch.bodyColorId = rule.id
      break
    }
  }

  /* --- lid -------------------------------------------------------------- */
  if (includesAny(scan, ['bamboo lid', 'wooden lid', 'bamboo', 'خيزران', 'غطاء خشب'])) {
    patch.lidColorId = includesAny(scan, ['smoked', 'dark bamboo', 'مدخن']) ? 'dark-bamboo' : 'bamboo'
  } else if (includesAny(scan, ['steel lid', 'metal lid', 'غطاء فولاذ', 'غطاء معدني'])) {
    patch.lidColorId = 'steel'
  }

  /* --- text colour ------------------------------------------------------ */
  const textColorZone = scan.match(
    /(?:text|letters|lettering|engraving|writing|نص|حروف|كتابة|نقش)[^.،,]{0,24}/g,
  )
  const colorZone = (textColorZone?.join(' ') ?? '') + ' ' + (scan.match(/\bin ([a-z]+)\b/g)?.join(' ') ?? '')
  for (const rule of textColorRules) {
    if (includesAny(colorZone, rule.words)) {
      patch.textColorId = rule.id
      break
    }
  }

  /* --- font ------------------------------------------------------------- */
  for (const rule of fontRules) {
    if (includesAny(scan, rule.words)) {
      patch.fontId = rule.id
      break
    }
  }
  // An Arabic engraving needs an Arabic face; a Latin one needs a Latin face.
  const isArabicText = patch.text ? /[؀-ۿ]/.test(patch.text) : false
  const chosenFont = patch.fontId ? getFont(patch.fontId) : null
  if (patch.text) {
    if (isArabicText && (!chosenFont || chosenFont.script !== 'arabic')) {
      // Keep the *style* the customer asked for where we can.
      patch.fontId = includesAny(scan, ['kufic', 'kufi', 'كوفي'])
        ? 'reem-kufi'
        : includesAny(scan, ['naskh', 'classical', 'نسخ'])
          ? 'amiri'
          : includesAny(scan, ['geometric', 'هندسي'])
            ? 'tajawal'
            : 'plex-arabic'
    }
    if (!isArabicText && chosenFont?.script === 'arabic') {
      patch.fontId = 'manrope'
    }
  }

  /* --- placement -------------------------------------------------------- */
  if (includesAny(scan, ['wrap', 'around', 'all the way round', 'ملفوف', 'حول الكوب', 'محيط'])) {
    patch.placement = 'wrap'
  } else if (includesAny(scan, ['lower', 'bottom', 'near the base', 'أسفل', 'سفلي', 'قرب القاعدة'])) {
    patch.placement = 'lower'
  } else if (includesAny(scan, ['centre', 'center', 'middle', 'وسط', 'منتصف'])) {
    patch.placement = 'center'
  }

  /* --- text size -------------------------------------------------------- */
  if (includesAny(scan, ['large text', 'big text', 'bold text', 'نص كبير', 'خط كبير'])) {
    patch.textSize = 'lg'
  } else if (includesAny(scan, ['small text', 'subtle', 'discreet', 'tiny', 'نص صغير', 'خط صغير', 'خفي'])) {
    patch.textSize = 'sm'
  }

  /* --- handle ----------------------------------------------------------- */
  if (includesAny(scan, ['with a handle', 'with handle', 'handle', 'بمقبض', 'مع مقبض'])) patch.handle = true
  if (includesAny(scan, ['no handle', 'without a handle', 'without handle', 'بدون مقبض', 'بلا مقبض'])) patch.handle = false
  // The 350 ml has no handle option at all.
  if (patch.sizeId === '350') patch.handle = false

  /* --- accessories ------------------------------------------------------ */
  const wanted: string[] = []
  if (includesAny(scan, ['holder', 'sleeve', 'cork', 'grip', 'حاضن', 'فلين', 'فلّين'])) wanted.push('holder')
  if (includesAny(scan, ['chain', 'strap', 'clip', 'hang', 'سلسلة', 'تعليق'])) wanted.push('chain')
  if (includesAny(scan, ['brush', 'cleaning', 'فرشاة', 'تنظيف'])) wanted.push('brush')
  if (includesAny(scan, ['spare lid', 'extra lid', 'غطاء إضافي', 'غطاء اضافي'])) wanted.push('spare-lid')
  if (wanted.length) patch.accessories = wanted

  const normalized = normalizePatch(patch)
  const changes = describePatch(normalized)

  return {
    patch: normalized,
    changes,
    understood: changes.length > 0,
    engine: 'local',
  }
}

/* -------------------------------------------------------------------------- */
/* REMOTE ENGINE (client side of /api/design-agent)                            */
/* -------------------------------------------------------------------------- */

/**
 * Ask the server (and therefore Claude) first; fall back to the local matcher
 * on any failure, including "the site has no API key configured".
 */
export async function runDesignAgent(prompt: string, locale: 'en' | 'ar'): Promise<AgentResult> {
  const local = parseLocally(prompt)

  try {
    const response = await fetch('/api/design-agent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt, locale }),
    })
    if (!response.ok) return local

    const data = (await response.json()) as { patch?: unknown }
    const patch = normalizePatch(data.patch)
    const changes = describePatch(patch)
    if (changes.length === 0) return local

    return { patch, changes, understood: true, engine: 'claude' }
  } catch {
    return local
  }
}
