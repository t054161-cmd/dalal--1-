/**
 * ============================================================================
 * THE DESIGN AGENT
 * ============================================================================
 * A sentence in, a cup out.
 *
 * Two engines, one shape of answer:
 *
 *  1. CLAUDE  — POST /api/design-agent, used when the site is configured with
 *               an ANTHROPIC_API_KEY.
 *  2. LOCAL   — the deterministic bilingual matcher below: no network, no key,
 *               instant, and it still understands tones, patterns, symbols,
 *               letterforms and quoted text.
 *
 * The browser asks the server first and falls back silently, so the feature is
 * never broken — only more or less clever. Both engines pass through
 * `normalize`, which drops anything that is not a real catalogue value, so a
 * model can never invent a tone or a pattern.
 * ============================================================================
 */

import {
  MAX_MARK_LENGTH,
  colorways,
  markFonts,
  partTones,
  patterns,
  symbols,
  toneHex,
} from '@/data/product'
import { bestInk, printReadable } from './contrast'
import type { Bilingual, CupConfig, Locale, MarkFont, PatternId, SymbolId } from '@/types'

export type ConfigPatch = Partial<
  Pick<
    CupConfig,
    | 'colorway'
    | 'bodyColor'
    | 'lidColor'
    | 'strawColor'
    | 'pattern'
    | 'patternColor'
    | 'mark'
    | 'markFont'
    | 'markColor'
    | 'symbol'
  >
>

export type AgentChange = { field: keyof ConfigPatch; display: Bilingual }

export type AgentResult = {
  patch: ConfigPatch
  changes: AgentChange[]
  understood: boolean
  engine: 'local' | 'claude'
}

/* -------------------------------------------------------------------------- */
/* NORMALISATION — the gate both engines pass through                          */
/* -------------------------------------------------------------------------- */

const HEX = /^#?[0-9a-fA-F]{6}$/
const toneIds = partTones.map((t) => t.id)
const patternIds = patterns.map((p) => p.id)
const symbolIds = symbols.map((s) => s.id)
const fontIds = markFonts.map((f) => f.id)

/** Accept either a tone id ("sage") or a plain hex, and always return hex. */
function toColor(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const raw = value.trim()
  if (toneIds.includes(raw)) return toneHex(raw)
  if (HEX.test(raw)) return raw.startsWith('#') ? raw : `#${raw}`
  return undefined
}

export function normalize(input: unknown, current?: CupConfig): ConfigPatch {
  const raw = (input ?? {}) as Record<string, unknown>
  const out: ConfigPatch = {}

  if (typeof raw.colorway === 'string' && colorways.some((c) => c.id === raw.colorway)) {
    out.colorway = raw.colorway
  }

  const body = toColor(raw.bodyColor)
  const lid = toColor(raw.lidColor)
  const straw = toColor(raw.strawColor)
  if (body) out.bodyColor = body
  if (lid) out.lidColor = lid
  if (straw) out.strawColor = straw

  if (typeof raw.pattern === 'string' && patternIds.includes(raw.pattern as PatternId)) {
    out.pattern = raw.pattern as PatternId
  }
  if (typeof raw.symbol === 'string' && symbolIds.includes(raw.symbol as SymbolId)) {
    out.symbol = raw.symbol as SymbolId
  }
  if (typeof raw.markFont === 'string' && fontIds.includes(raw.markFont as MarkFont)) {
    out.markFont = raw.markFont as MarkFont
  }
  if (typeof raw.mark === 'string') out.mark = raw.mark.slice(0, MAX_MARK_LENGTH)

  const patternInk = toColor(raw.patternColor)
  const markInk = toColor(raw.markColor)
  if (patternInk) out.patternColor = patternInk
  if (markInk) out.markColor = markInk

  // Whatever the body ends up being, the print has to be readable on it.
  const finalBody = out.bodyColor ?? current?.bodyColor
  if (finalBody) {
    const fallback = bestInk(finalBody, partTones)
    const fixInk = (ink?: string) => (ink && printReadable(finalBody, ink) ? ink : fallback.hex)
    if (out.markColor || out.bodyColor) out.markColor = fixInk(out.markColor ?? current?.markColor)
    if (out.patternColor || out.bodyColor) {
      out.patternColor = fixInk(out.patternColor ?? current?.patternColor)
    }
  }

  return out
}

export function describe(patch: ConfigPatch): AgentChange[] {
  const changes: AgentChange[] = []
  const toneName = (hex: string): Bilingual => {
    const tone = partTones.find((t) => t.hex.toLowerCase() === hex.toLowerCase())
    return tone ? tone.name : { en: hex.toUpperCase(), ar: hex.toUpperCase() }
  }

  if (patch.bodyColor) changes.push({ field: 'bodyColor', display: toneName(patch.bodyColor) })
  if (patch.lidColor) changes.push({ field: 'lidColor', display: toneName(patch.lidColor) })
  if (patch.strawColor) changes.push({ field: 'strawColor', display: toneName(patch.strawColor) })
  if (patch.pattern) {
    const p = patterns.find((x) => x.id === patch.pattern)!
    changes.push({ field: 'pattern', display: p.name })
  }
  if (patch.patternColor) changes.push({ field: 'patternColor', display: toneName(patch.patternColor) })
  if (patch.mark !== undefined) {
    const shown = patch.mark ? `“${patch.mark}”` : '—'
    changes.push({ field: 'mark', display: { en: shown, ar: shown } })
  }
  if (patch.markFont) {
    const f = markFonts.find((x) => x.id === patch.markFont)!
    changes.push({ field: 'markFont', display: f.name })
  }
  if (patch.markColor) changes.push({ field: 'markColor', display: toneName(patch.markColor) })
  if (patch.symbol) {
    const s = symbols.find((x) => x.id === patch.symbol)!
    changes.push({ field: 'symbol', display: s.name })
  }
  return changes
}

/* -------------------------------------------------------------------------- */
/* LOCAL ENGINE                                                               */
/* -------------------------------------------------------------------------- */

const digits = (s: string) => s.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))

/** Tone words, longest phrase first so "dark green" beats "green". */
const TONES: { id: string; words: string[] }[] = [
  { id: 'forest', words: ['forest', 'dark green', 'deep green', 'evening green', 'black', 'أخضر غامق', 'غابة', 'أسود'] },
  { id: 'smoke', words: ['smoked green', 'smoke', 'smoky', 'olive green', 'أخضر مدخن', 'مدخّن', 'زيتي'] },
  { id: 'sage', words: ['sage', 'muted green', 'soft green', 'green', 'مريمية', 'أخضر'] },
  { id: 'sandi', words: ['sandi', 'blush', 'pink', 'rose', 'clay pink', 'ساندي', 'وردي', 'زهري'] },
  { id: 'linen', words: ['linen', 'off-white', 'oat', 'ivory', 'cream', 'white', 'كتان', 'كتّان', 'عاجي', 'أبيض', 'كريمي'] },
  { id: 'clay', words: ['putty', 'stone', 'greige', 'taupe', 'sand', 'beige', 'grey', 'gray', 'صلصال', 'حجري', 'رملي', 'بيج', 'رمادي'] },
]

const PATTERNS: { id: PatternId; words: string[] }[] = [
  { id: 'olive', words: ['olive', 'olive leaves', 'olive branch', 'botanical', 'leaves', 'leaf pattern', 'زيتون', 'نباتي', 'أوراق'] },
  { id: 'sprig', words: ['sprig', 'stem', 'herb', 'delicate plant', 'غصين', 'ساق', 'عشبة'] },
  { id: 'arch', words: ['architectural', 'architecture', 'arch', 'arches', 'geometric', 'monochrome pattern', 'معماري', 'أقواس', 'هندسي'] },
  { id: 'field', words: ['dots', 'dotted', 'speckle', 'seed', 'field', 'نقاط', 'بذور', 'منقط'] },
  { id: 'ridge', words: ['contour', 'contours', 'topographic', 'ridge', 'lines', 'كنتور', 'تضاريس', 'خطوط'] },
  { id: 'terrazzo', words: ['terrazzo', 'fleck', 'flecked', 'mineral', 'تيرازو', 'رقائق'] },
]

const SYMBOLS: { id: SymbolId; words: string[] }[] = [
  { id: 'leaf', words: ['leaf', 'leaf symbol', 'ورقة', 'رمز ورقة'] },
  { id: 'sun', words: ['sun', 'sunrise', 'شمس', 'شروق'] },
  { id: 'ridge', words: ['mountain', 'mountains', 'hills', 'peaks', 'جبل', 'جبال', 'تلال'] },
  { id: 'seed', words: ['seed', 'grain', 'بذرة', 'حبة'] },
  { id: 'wave', words: ['wave', 'waves', 'sea', 'موجة', 'أمواج', 'بحر'] },
]

const has = (haystack: string, words: string[]) => words.some((w) => haystack.includes(w))

function findTone(text: string) {
  for (const tone of TONES) if (has(text, tone.words)) return tone.id
  return undefined
}

/** Quoted text, in any of the quote marks people actually type. */
function quoted(input: string) {
  for (const re of [/[“"]([^”"]{1,40})[”"]/, /«([^»]{1,40})»/, /['’]([^'’]{2,40})['’]/]) {
    const m = input.match(re)
    if (m?.[1]?.trim()) return m[1].trim()
  }
  return null
}

function phrasedMark(input: string) {
  const patternsToTry = [
    /(?:my initials(?: are)?|initials)\s+([A-Za-z][A-Za-z.\s&]{0,13})/i,
    /(?:my name(?: is)?|name)\s+([A-Za-z؀-ۿ][A-Za-z؀-ۿ\s]{1,13})/i,
    /(?:that says|says|printed with|write|written)\s+(.{2,20})/i,
    /(?:أحرف اسمي|اسمي|مكتوب عليه|اكتب)\s+(.{2,20})/,
  ]
  for (const re of patternsToTry) {
    const m = input.match(re)
    if (m?.[1]) {
      return m[1]
        .replace(/[.,!؟?]+$/, '')
        .replace(/\s+(in|on|with|بلون|بخط).*$/i, '')
        .trim()
    }
  }
  return null
}

/**
 * Split a sentence into clauses. Tones are then read inside a clause and never
 * across one, so "a forest cup with a linen straw" cannot leak the straw's
 * tone onto the body.
 */
function clauses(text: string) {
  return text
    .split(/,|;|\.|، |؛| and | with | plus | & | و /g)
    .map((part) => part.trim())
    .filter(Boolean)
}

const LID_WORDS = ['lid', 'cap', 'غطاء', 'الغطاء']
const STRAW_WORDS = ['straw', 'ماصة', 'ماصّة', 'مصاصة', 'المصاصة']
const INK_WORDS = ['ink', 'print', 'printed', 'letters', 'lettering', 'initials', 'name', 'text', 'حبر', 'حروف', 'كتابة', 'طباعة', 'اسم']

/**
 * The offline engine. Deterministic and forgiving: whatever it cannot read it
 * simply leaves alone.
 */
export function parseLocally(promptRaw: string, current?: CupConfig): AgentResult {
  const text = digits(promptRaw).toLowerCase()
  const patch: ConfigPatch = {}

  /* --- the printed mark first, so its letters are not read as colours ---- */
  const mark = quoted(promptRaw) ?? phrasedMark(promptRaw)
  if (mark) patch.mark = mark.slice(0, MAX_MARK_LENGTH)
  if (has(text, ['no text', 'no name', 'nothing printed', 'blank', 'بدون نص', 'بلا اسم'])) patch.mark = ''

  const scan = mark ? text.split(mark.toLowerCase()).join(' ') : text

  /* --- per-part tones, clause by clause ---------------------------------- */
  const parts = clauses(scan)
  let lidTone: string | undefined
  let strawTone: string | undefined
  let inkTone: string | undefined
  let bodyTone: string | undefined

  for (const clause of parts) {
    const tone = findTone(clause)
    if (!tone) continue
    if (has(clause, LID_WORDS)) lidTone ??= tone
    else if (has(clause, STRAW_WORDS)) strawTone ??= tone
    else if (has(clause, INK_WORDS)) inkTone ??= tone
    else bodyTone ??= tone
  }

  // "…in linen" trailing a mark clause is an ink instruction too.
  if (!inkTone) {
    const inkClause = parts.find((clause) => has(clause, INK_WORDS))
    if (inkClause) inkTone = findTone(inkClause)
  }

  if (lidTone) patch.lidColor = toneHex(lidTone)
  if (strawTone) patch.strawColor = toneHex(strawTone)

  if (bodyTone) {
    patch.bodyColor = toneHex(bodyTone)
    const way = colorways.find((c) => c.id === bodyTone)
    if (way) {
      patch.colorway = way.id
      // A named colourway fills in the parts the sentence did not mention.
      if (!lidTone) patch.lidColor = way.lid
      if (!strawTone) patch.strawColor = way.straw
    }
  }

  /* --- pattern ----------------------------------------------------------- */
  for (const p of PATTERNS) {
    if (has(scan, p.words)) {
      patch.pattern = p.id
      break
    }
  }
  if (
    patch.pattern === undefined &&
    has(scan, ['no pattern', 'plain', 'bare', 'unprinted', 'بلا نقش', 'سادة'])
  ) {
    patch.pattern = 'none'
  }
  // "minimal" on its own means restraint, not a motif.
  if (patch.pattern === undefined && has(scan, ['minimal', 'simple', 'quiet', 'بسيط', 'هادئ'])) {
    patch.pattern = 'none'
  }

  /* --- symbol ------------------------------------------------------------ */
  for (const s of SYMBOLS) {
    if (has(scan, s.words)) {
      patch.symbol = s.id
      break
    }
  }

  /* --- letterform -------------------------------------------------------- */
  if (has(scan, ['initials', 'monogram', 'أحرف أولى'])) patch.markFont = 'initials'
  else if (has(scan, ['serif', 'editorial', 'classic', 'elegant type', 'تحريري', 'سيريف'])) {
    patch.markFont = 'editorial'
  } else if (has(scan, ['wordmark', 'like the logo', 'wide letters', 'شعار'])) patch.markFont = 'wordmark'

  /* --- ink --------------------------------------------------------------- */
  if (inkTone) {
    patch.markColor = toneHex(inkTone)
    patch.patternColor = toneHex(inkTone)
  }

  const patch2 = normalize(patch, current)
  const changes = describe(patch2)

  return { patch: patch2, changes, understood: changes.length > 0, engine: 'local' }
}

/* -------------------------------------------------------------------------- */
/* CLIENT SIDE OF THE REMOTE ENGINE                                            */
/* -------------------------------------------------------------------------- */

export async function runAgent(
  prompt: string,
  locale: Locale,
  current?: CupConfig,
): Promise<AgentResult> {
  const local = parseLocally(prompt, current)

  try {
    const response = await fetch('/api/design-agent', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt, locale }),
    })
    if (!response.ok) return local

    const data = (await response.json()) as { patch?: unknown }
    const patch = normalize(data.patch, current)
    const changes = describe(patch)
    if (changes.length === 0) return local

    return { patch, changes, understood: true, engine: 'claude' }
  } catch {
    return local
  }
}
