/**
 * POST /api/design-agent
 * ---------------------------------------------------------------------------
 * Turns a sentence into a TERRA design patch using Claude.
 *
 * Configuration: set ANTHROPIC_API_KEY in the environment. Without it the
 * route answers 503 and the client silently falls back to the deterministic
 * local matcher in src/lib/design-agent.ts — the feature degrades, it never
 * breaks.
 *
 * The model's answer is never trusted directly: `normalizePatch` drops any id
 * that is not in our own catalogue before it reaches the browser.
 */

import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { bodyColors, fonts, lidColors, sizes, textColors, MAX_TEXT_LENGTH } from '@/data/product'
import { accessories } from '@/data/accessories'
import { normalizePatch } from '@/lib/design-agent'

export const runtime = 'nodejs'
/** Nothing here is cacheable — each prompt is different. */
export const dynamic = 'force-dynamic'

const MODEL = 'claude-opus-5'

const catalogue = () => ({
  sizeId: sizes.map((s) => `${s.id} (${s.volumeMl} ml — ${s.hint.en})`),
  bodyColorId: bodyColors.map((c) => `${c.id} (${c.name.en}, ${c.hex})`),
  lidColorId: lidColors.map((c) => `${c.id} (${c.name.en}, ${c.material})`),
  textColorId: textColors.map((c) => `${c.id} (${c.name.en})`),
  fontId: fonts.map((f) => `${f.id} (${f.name.en}, ${f.script} script)`),
  placement: ['center', 'lower', 'wrap'],
  textSize: ['sm', 'md', 'lg'],
  handle: 'boolean — only 500 and 700 can have a handle',
  accessories: accessories.map((a) => `${a.id} (${a.name.en})`),
})

const systemPrompt = `You configure a customizable insulated mug for TERRA, a Kuwaiti brand.

The customer describes the mug they want, in Arabic or English. Reply with the
design options that match their description.

Rules:
- Only use ids from the catalogue given in the user message. Never invent one.
- Include ONLY the fields the customer actually implied. Omit everything else.
- "text" is what gets engraved: at most ${MAX_TEXT_LENGTH} characters, in the
  customer's own words and script. Use "" when they ask for a plain mug.
- Arabic engraving requires an Arabic-script fontId; Latin engraving requires a
  Latin-script fontId.
- Pick a textColorId that is clearly readable on the chosen bodyColorId.
- The 350 ml size has no handle: handle must be false for it.
- Reply with a single JSON object and nothing else — no prose, no code fences.`

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'agent_not_configured', message: 'Set ANTHROPIC_API_KEY to enable the AI agent.' },
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
      // A small extraction task: keep it quick and cheap.
      output_config: { effort: 'low' },
      system: systemPrompt,
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

    const patch = normalizePatch(parseJsonObject(text))

    return NextResponse.json({ patch, engine: 'claude' })
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

/** Tolerate a stray code fence or a sentence around the JSON. */
function parseJsonObject(text: string): unknown {
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
