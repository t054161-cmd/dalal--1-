/**
 * POST /api/design-agent
 * ---------------------------------------------------------------------------
 * Turns a sentence into a TERRA cup configuration using Claude.
 *
 * Configuration: set ANTHROPIC_API_KEY. Without it this route answers 503 and
 * the browser falls back to the deterministic matcher in
 * src/lib/design-agent.ts — the feature degrades, it never breaks.
 *
 * The model's answer is never trusted as-is: `normalize` on the client drops
 * any value that is not in our own catalogue, and re-checks print contrast.
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { MAX_MARK_LENGTH, colorways, markFonts, partTones, patterns, symbols } from '@/data/product'
import { normalize } from '@/lib/design-agent'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MODEL = 'claude-opus-5'

const catalogue = () => ({
  colorway: colorways.map((c) => `${c.id} (${c.name.en})`),
  tones: partTones.map((t) => `${t.id} (${t.name.en}, ${t.hex})`),
  pattern: patterns.map((p) => `${p.id} (${p.name.en} — ${p.note.en})`),
  symbol: symbols.map((s) => `${s.id} (${s.name.en})`),
  markFont: markFonts.map((f) => `${f.id} (${f.name.en})`),
})

const system = `You configure a single product: the TERRA tumbler, a tall slim
reusable cup with a lid and a straw, from a Kuwaiti studio.

A customer describes the cup they want, in Arabic or English. Answer with the
options that match their description.

Rules:
- Use ONLY ids from the catalogue in the user message. Never invent one.
- bodyColor, lidColor, strawColor, patternColor and markColor take a tone id
  (preferred) or a #RRGGBB hex.
- Include ONLY the fields the customer actually implied. Omit the rest.
- "mark" is what gets printed on the body: at most ${MAX_MARK_LENGTH}
  characters, in the customer's own words and script. Use "" for a plain cup.
- Pick a patternColor and markColor that stay clearly readable on the body.
- Restraint is the house style: prefer one pattern, one symbol, quiet ink.
- Reply with a single JSON object and nothing else — no prose, no code fences.`

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'not_configured', message: 'Set ANTHROPIC_API_KEY to enable the AI designer.' },
      { status: 503 },
    )
  }

  let prompt = ''
  let locale = 'en'
  try {
    const body = (await request.json()) as { prompt?: unknown; locale?: unknown }
    prompt = typeof body.prompt === 'string' ? body.prompt.slice(0, 600) : ''
    locale = body.locale === 'ar' ? 'ar' : 'en'
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 })
  }

  if (prompt.trim().length < 2) {
    return NextResponse.json({ error: 'empty_prompt' }, { status: 400 })
  }

  const client = new Anthropic()

  try {
    const message = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      // A small extraction task — keep it quick and cheap.
      output_config: { effort: 'low' },
      system,
      messages: [
        {
          role: 'user',
          content: [
            `Catalogue (JSON):\n${JSON.stringify(catalogue(), null, 2)}`,
            `Customer language: ${locale}`,
            `Customer description:\n${prompt}`,
          ].join('\n\n'),
        },
      ],
    })

    if (message.stop_reason === 'refusal') {
      return NextResponse.json({ error: 'refused' }, { status: 422 })
    }

    const text = message.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')
      .trim()

    return NextResponse.json({ patch: normalize(parseJson(text)), engine: 'claude' })
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return NextResponse.json({ error: 'auth' }, { status: 503 })
    }
    if (error instanceof Anthropic.RateLimitError) {
      return NextResponse.json({ error: 'rate_limited' }, { status: 429 })
    }
    if (error instanceof Anthropic.APIError) {
      return NextResponse.json({ error: 'upstream', status: error.status }, { status: 502 })
    }
    return NextResponse.json({ error: 'unknown' }, { status: 500 })
  }
}

/** Tolerate a stray fence or a sentence wrapped around the JSON. */
function parseJson(text: string): unknown {
  const direct = tryParse(text)
  if (direct) return direct
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end > start) return tryParse(text.slice(start, end + 1))
  return {}
}

function tryParse(candidate: string): unknown | null {
  try {
    const value = JSON.parse(candidate)
    return typeof value === 'object' && value !== null ? value : null
  } catch {
    return null
  }
}
