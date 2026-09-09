'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, Bookmark, Check, Loader2, RotateCcw, Undo2 } from 'lucide-react'
import { useI18n } from '@/i18n/provider'
import { CupViewer } from '@/components/three/viewer'
import { Reveal } from '@/components/common/motion'
import {
  MAX_MARK_LENGTH,
  applyColorway,
  colorways,
  markFonts,
  partTones,
  patterns,
  priceOf,
  product,
  symbols,
} from '@/data/product'
import { useStore } from '@/lib/store'
import { useCopy } from '@/lib/hooks'
import { decodeConfig, shareUrl } from '@/lib/share'
import { bestInk, printReadable } from '@/lib/contrast'
import { runAgent, type AgentResult } from '@/lib/design-agent'
import type { CupConfig, MarkFont, PatternId, SymbolId } from '@/types'
import { cn } from '@/lib/utils'
import { PatternSwatch } from './pattern-swatch'

const FIELD_LABELS: Record<string, string> = {
  bodyColor: 'designer.bodyTone',
  lidColor: 'designer.lidTone',
  strawColor: 'designer.strawTone',
  pattern: 'designer.pattern',
  patternColor: 'designer.patternInk',
  mark: 'designer.markLabel',
  markFont: 'designer.markFont',
  markColor: 'designer.markInk',
  symbol: 'designer.symbol',
}

/**
 * DESIGN YOUR TERRA — one prompt box, then the cup.
 *
 * The flow the brief asks for: generate → preview → edit → save → add to cart.
 * Everything the agent decides can be adjusted by hand underneath, and every
 * change lands on the 3D model in the same frame.
 */
export function Designer() {
  const { t, pick, n, price, locale } = useI18n()
  const router = useRouter()
  const params = useSearchParams()

  const config = useStore((s) => s.config)
  const setConfig = useStore((s) => s.setConfig)
  const loadConfig = useStore((s) => s.loadConfig)
  const resetConfig = useStore((s) => s.resetConfig)
  const addToCart = useStore((s) => s.addToCart)
  const saveDesign = useStore((s) => s.saveDesign)
  const setSnapshot = useStore((s) => s.setSnapshot)
  const snapshot = useStore((s) => s.snapshot)

  const [prompt, setPrompt] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [result, setResult] = React.useState<AgentResult | null>(null)
  const [previous, setPrevious] = React.useState<CupConfig | null>(null)
  const [saved, setSaved] = React.useState(false)
  const [copied, copy] = useCopy()

  const ask = React.useCallback(
    async (text: string, base?: CupConfig) => {
      const value = text.trim()
      if (!value || busy) return
      setBusy(true)
      setResult(null)
      try {
        const current = base ?? config
        const outcome = await runAgent(value, locale, current)
        if (outcome.understood) {
          setPrevious(current)
          setConfig(outcome.patch)
        }
        setResult(outcome)
      } finally {
        setBusy(false)
      }
    },
    [busy, config, locale, setConfig],
  )

  /**
   * A shared link carries a whole design; ?ask= carries a sentence from the
   * home page. Both are handled once, on mount.
   */
  const started = React.useRef(false)
  React.useEffect(() => {
    if (started.current) return
    started.current = true

    const shared = decodeConfig(new URLSearchParams(params.toString()))
    if (shared) {
      loadConfig(shared)
      return
    }
    const question = params.get('ask')
    if (question) {
      setPrompt(question)
      void ask(question)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const unit = priceOf(config)
  const inkOk = printReadable(config.bodyColor, config.markColor)
  const suggestion = bestInk(config.bodyColor, partTones)
  const suggestions = ['designer.try1', 'designer.try2', 'designer.try3', 'designer.try4']
  const link = shareUrl(config)

  return (
    <div className="wrap pb-32 pt-28 lg:pt-36">
      <Reveal>
        <p className="eyebrow">{t('designer.eyebrow')}</p>
        <h1 className="mt-6 text-title font-light">{t('designer.heading')}</h1>
      </Reveal>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-16">
        {/* ---- the cup, pinned ------------------------------------------- */}
        <div className="order-1 lg:sticky lg:top-28">
          <div className="h-[24rem] sm:h-[30rem] lg:h-[38rem]">
            <CupViewer config={config} onSnapshot={setSnapshot} />
          </div>

          {/* Steps, as a quiet legend of where you are. */}
          <ol className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 meta text-ink-mute">
            {(['generate', 'preview', 'edit', 'save', 'cart'] as const).map((step, i) => (
              <li key={step} className="flex items-center gap-4">
                {i > 0 ? <span aria-hidden className="h-px w-4 bg-line" /> : null}
                <span className={cn(i === 0 && result ? 'text-ink' : undefined)}>
                  {t(`designer.steps.${step}`)}
                </span>
              </li>
            ))}
          </ol>
        </div>

        {/* ---- controls -------------------------------------------------- */}
        <div className="order-2 space-y-14">
          {/* The prompt */}
          <section>
            <p className="passage max-w-prose">{t('designer.body')}</p>

            <form
              className="mt-8"
              onSubmit={(event) => {
                event.preventDefault()
                void ask(prompt)
              }}
            >
              <label htmlFor="ai-prompt" className="eyebrow">
                {t('designer.inputLabel')}
              </label>
              <div className="mt-4 flex items-end gap-4 border-b border-ink/25 pb-3 transition-colors focus-within:border-ink">
                <textarea
                  id="ai-prompt"
                  rows={2}
                  value={prompt}
                  dir="auto"
                  onChange={(event) => setPrompt(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      void ask(prompt)
                    }
                  }}
                  placeholder={t('designer.placeholder')}
                  className="w-full resize-none bg-transparent text-base leading-relaxed text-ink placeholder:text-ink-mute/70 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={busy || prompt.trim().length < 2}
                  aria-label={t('designer.generate')}
                  className="tap shrink-0 text-ink-soft transition-colors hover:text-ink disabled:opacity-40"
                >
                  {busy ? (
                    <Loader2 className="size-5 animate-spin" aria-hidden />
                  ) : (
                    <ArrowRight className="size-5 flip-rtl" aria-hidden />
                  )}
                </button>
              </div>
            </form>

            <ul className="mt-5 flex flex-wrap gap-2">
              {suggestions.map((key) => (
                <li key={key}>
                  <button
                    type="button"
                    dir="auto"
                    onClick={() => {
                      setPrompt(t(key))
                      void ask(t(key))
                    }}
                    className="tap border border-line px-4 py-2 text-start text-[0.68rem] text-ink-soft transition-colors duration-500 ease-cinema hover:border-ink/40 hover:text-ink"
                  >
                    {t(key)}
                  </button>
                </li>
              ))}
            </ul>

            {/* What the agent did */}
            {busy ? (
              <p className="mt-6 text-sm text-ink-mute" aria-live="polite">
                {t('designer.thinking')}…
              </p>
            ) : result ? (
              <div className="mt-6 border-t border-line pt-5" aria-live="polite">
                {result.understood ? (
                  <>
                    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 meta">
                      <span className="text-ink">{t('designer.applied')}</span>
                      <span className="text-ink-mute">
                        {result.engine === 'claude' ? t('designer.aiMode') : t('designer.localMode')}
                      </span>
                    </p>
                    <dl className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                      {result.changes.map((change) => (
                        <div key={change.field} className="flex items-baseline justify-between gap-4 border-b border-line pb-2 text-sm">
                          <dt className="text-ink-mute">{t(FIELD_LABELS[change.field] ?? change.field)}</dt>
                          <dd className="text-end text-ink" dir="auto">
                            {pick(change.display)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button type="button" onClick={() => void ask(prompt)} className="btn btn-quiet tap">
                        <span className="flex items-center gap-2">
                          <RotateCcw className="size-3.5" aria-hidden />
                          {t('designer.regenerate')}
                        </span>
                      </button>
                      {previous ? (
                        <button
                          type="button"
                          onClick={() => {
                            loadConfig(previous)
                            setPrevious(null)
                            setResult(null)
                          }}
                          className="btn btn-quiet tap"
                        >
                          <span className="flex items-center gap-2">
                            <Undo2 className="size-3.5" aria-hidden />
                            {t('designer.undo')}
                          </span>
                        </button>
                      ) : null}
                    </div>
                    {result.engine === 'local' ? (
                      <p className="mt-4 max-w-prose text-[0.68rem] leading-relaxed text-ink-mute">
                        {t('designer.offline')}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <p className="max-w-prose text-sm text-ink-soft">{t('designer.nothing')}</p>
                )}
              </div>
            ) : null}
          </section>

          {/* ---- by hand ------------------------------------------------- */}
          <section>
            <h2 className="text-title-sm font-light">{t('designer.editHeading')}</h2>

            {/* Colourways */}
            <div className="mt-8">
              <p className="eyebrow">{t('colors.eyebrow')}</p>
              <ul className="mt-4 flex flex-wrap gap-3">
                {colorways.map((way) => (
                  <li key={way.id}>
                    <button
                      type="button"
                      onClick={() => loadConfig(applyColorway(config, way.id))}
                      aria-pressed={config.colorway === way.id}
                      aria-label={t('colors.choose', { name: pick(way.name) })}
                      className={cn(
                        'tap flex items-center gap-3 border px-4 py-2 meta transition-colors duration-500',
                        config.colorway === way.id
                          ? 'border-ink text-ink'
                          : 'border-line text-ink-soft hover:border-ink/40',
                      )}
                    >
                      <span
                        className="size-4 rounded-full ring-1 ring-inset ring-black/10"
                        style={{ background: way.body }}
                      />
                      {pick(way.name)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Per-part tones */}
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {(
                [
                  { key: 'bodyColor', label: 'designer.bodyTone' },
                  { key: 'lidColor', label: 'designer.lidTone' },
                  { key: 'strawColor', label: 'designer.strawTone' },
                ] as const
              ).map((part) => (
                <div key={part.key}>
                  <p className="eyebrow">{t(part.label)}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {partTones.map((tone) => (
                      <li key={tone.id}>
                        <button
                          type="button"
                          onClick={() => setConfig({ [part.key]: tone.hex } as Partial<CupConfig>)}
                          aria-pressed={config[part.key] === tone.hex}
                          aria-label={`${t(part.label)}: ${pick(tone.name)}`}
                          title={pick(tone.name)}
                          className={cn(
                            'tap grid place-items-center rounded-full transition-all duration-500',
                            config[part.key] === tone.hex
                              ? 'outline outline-1 outline-offset-[5px] outline-ink/45'
                              : 'hover:outline hover:outline-1 hover:outline-offset-[5px] hover:outline-ink/15',
                          )}
                        >
                          <span
                            className="block size-8 rounded-full ring-1 ring-inset ring-black/10"
                            style={{ background: tone.hex }}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Pattern */}
            <div className="mt-12">
              <p className="eyebrow">{t('designer.pattern')}</p>
              <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                {patterns.map((pattern) => (
                  <li key={pattern.id}>
                    <button
                      type="button"
                      onClick={() => setConfig({ pattern: pattern.id as PatternId })}
                      aria-pressed={config.pattern === pattern.id}
                      className={cn(
                        'tap w-full border p-2 transition-colors duration-500',
                        config.pattern === pattern.id
                          ? 'border-ink'
                          : 'border-line hover:border-ink/40',
                      )}
                    >
                      <PatternSwatch
                        pattern={pattern.id}
                        ink={config.patternColor}
                        body={config.bodyColor}
                      />
                      <span className="mt-2 block meta text-ink-soft">
                        {pick(pattern.name)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {config.pattern !== 'none' ? (
                <div className="mt-6">
                  <p className="eyebrow">{t('designer.patternInk')}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {partTones.map((tone) => (
                      <li key={tone.id}>
                        <button
                          type="button"
                          onClick={() => setConfig({ patternColor: tone.hex })}
                          aria-pressed={config.patternColor === tone.hex}
                          aria-label={`${t('designer.patternInk')}: ${pick(tone.name)}`}
                          title={pick(tone.name)}
                          className={cn(
                            'tap grid place-items-center rounded-full transition-all duration-500',
                            config.patternColor === tone.hex
                              ? 'outline outline-1 outline-offset-[5px] outline-ink/45'
                              : 'hover:outline hover:outline-1 hover:outline-offset-[5px] hover:outline-ink/15',
                          )}
                        >
                          <span
                            className="block size-8 rounded-full ring-1 ring-inset ring-black/10"
                            style={{ background: tone.hex }}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {/* The mark */}
            <div className="mt-12">
              <p className="eyebrow">{t('designer.markHeading')}</p>

              <div className="mt-4 max-w-sm">
                <label htmlFor="mark" className="sr-only">
                  {t('designer.markLabel')}
                </label>
                <input
                  id="mark"
                  value={config.mark}
                  maxLength={MAX_MARK_LENGTH}
                  dir="auto"
                  onChange={(event) => setConfig({ mark: event.target.value.slice(0, MAX_MARK_LENGTH) })}
                  placeholder={t('designer.markPlaceholder')}
                  className="tap w-full border-b border-ink/25 bg-transparent pb-2 text-lg text-ink placeholder:text-ink-mute/70 focus:border-ink focus:outline-none"
                  aria-describedby="mark-count"
                />
                <p id="mark-count" className="mt-2 meta text-ink-mute">
                  {t('designer.markCounter', { count: n(config.mark.length), max: n(MAX_MARK_LENGTH) })}
                </p>
              </div>

              {/* Letterform — previewing the customer's own text */}
              <ul className="mt-6 flex flex-wrap gap-2">
                {markFonts.map((face) => (
                  <li key={face.id}>
                    <button
                      type="button"
                      onClick={() => setConfig({ markFont: face.id as MarkFont })}
                      aria-pressed={config.markFont === face.id}
                      className={cn(
                        'tap border px-4 py-2 transition-colors duration-500',
                        config.markFont === face.id ? 'border-ink' : 'border-line hover:border-ink/40',
                      )}
                    >
                      <span
                        className="block text-lg leading-none text-ink"
                        style={{
                          fontFamily: `${face.css}, sans-serif`,
                          fontWeight: face.weight,
                          letterSpacing: `${face.tracking}em`,
                        }}
                        dir="auto"
                      >
                        {config.mark.trim() || 'TERRA'}
                      </span>
                      <span className="mt-1.5 block meta text-ink-mute">
                        {pick(face.name)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Ink + contrast guard */}
              <div className="mt-6">
                <p className="eyebrow">{t('designer.markInk')}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {partTones.map((tone) => (
                    <li key={tone.id}>
                      <button
                        type="button"
                        onClick={() => setConfig({ markColor: tone.hex })}
                        aria-pressed={config.markColor === tone.hex}
                        aria-label={`${t('designer.markInk')}: ${pick(tone.name)}`}
                        title={pick(tone.name)}
                        className={cn(
                          'tap grid place-items-center rounded-full transition-all duration-500',
                          config.markColor === tone.hex
                            ? 'outline outline-1 outline-offset-[5px] outline-ink/45'
                            : 'hover:outline hover:outline-1 hover:outline-offset-[5px] hover:outline-ink/15',
                        )}
                      >
                        <span
                          className="block size-8 rounded-full ring-1 ring-inset ring-black/10"
                          style={{ background: tone.hex }}
                        />
                      </button>
                    </li>
                  ))}
                </ul>

                {!inkOk ? (
                  <p className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink" role="status">
                    {t('designer.contrastWarning', { suggestion: pick(suggestion.name) })}
                    <button
                      type="button"
                      onClick={() => setConfig({ markColor: suggestion.hex, patternColor: suggestion.hex })}
                      className="btn btn-quiet tap"
                    >
                      <span>{t('designer.contrastFix')}</span>
                    </button>
                  </p>
                ) : null}
              </div>

              {/* Symbol */}
              <div className="mt-10">
                <p className="eyebrow">{t('designer.symbol')}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {symbols.map((symbol) => (
                    <li key={symbol.id}>
                      <button
                        type="button"
                        onClick={() => setConfig({ symbol: symbol.id as SymbolId })}
                        aria-pressed={config.symbol === symbol.id}
                        className={cn(
                          'tap border px-4 py-2 meta transition-colors duration-500',
                          config.symbol === symbol.id
                            ? 'border-ink text-ink'
                            : 'border-line text-ink-soft hover:border-ink/40',
                        )}
                      >
                        {pick(symbol.name)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* ---- save / share / cart ------------------------------------- */}
          <section className="border-t border-line pt-10">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <p className="flex items-baseline gap-3">
                <span className="text-2xl font-light tabular-nums">{price(unit)}</span>
                <span className="meta text-ink-mute">
                  {pick(product.currency)}
                </span>
              </p>
              <button
                type="button"
                onClick={resetConfig}
                className="link-draw meta text-ink-mute hover:text-ink"
              >
                {t('common.reset')}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  addToCart({ config, snapshot })
                  router.push('/cart')
                }}
                className="btn btn-solid tap"
              >
                <span>{t('common.addToCart')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  saveDesign()
                  setSaved(true)
                }}
                className="btn tap"
              >
                <span className="flex items-center gap-2">
                  {saved ? <Check className="size-3.5" aria-hidden /> : <Bookmark className="size-3.5" aria-hidden />}
                  {saved ? t('common.saved') : t('common.save')}
                </span>
              </button>
              <button type="button" onClick={() => void copy(link)} className="btn tap">
                <span>{copied ? t('common.copied') : t('common.share')}</span>
              </button>
            </div>

            <p className="mt-5 text-[0.66rem] leading-relaxed text-ink-mute">
              {t('designer.savedNote')} {t('designer.shareNote')}
            </p>
            <p className="mt-2 text-[0.66rem] leading-relaxed text-ink-mute">
              {t('designer.disclaimer')}
            </p>

            <Link href="/shop" className="link-draw mt-6 inline-block meta text-ink-soft hover:text-ink">
              {t('common.shopTerra')}
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}
