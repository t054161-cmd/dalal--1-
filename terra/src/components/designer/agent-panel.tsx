'use client'

import * as React from 'react'
import { Bot, CornerDownLeft, Loader2, Sparkles, Undo2, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/input'
import { useI18n } from '@/i18n/provider'
import { useStore } from '@/lib/store'
import { runDesignAgent, type AgentResult } from '@/lib/design-agent'
import type { DesignConfig } from '@/types/design'

const FIELD_LABEL_KEYS: Record<string, string> = {
  sizeId: 'common.size',
  bodyColorId: 'common.bodyColor',
  lidColorId: 'common.lidColor',
  text: 'common.text',
  fontId: 'common.font',
  textColorId: 'common.textColor',
  textSize: 'designer.step3.sizeHeading',
  placement: 'common.placement',
  handle: 'common.handle',
  accessories: 'accessories.stepName',
}

/**
 * The AI design agent. The customer describes the mug in a sentence and the
 * agent fills in the designer.
 *
 * It asks the server first (Claude, when the site is configured with an API
 * key) and falls back to a deterministic bilingual matcher that runs entirely
 * on the device — so the panel is never dead, only more or less clever.
 */
export function AgentPanel() {
  const { t, pick, locale } = useI18n()
  const design = useStore((s) => s.design)
  const setDesign = useStore((s) => s.setDesign)
  const loadDesign = useStore((s) => s.loadDesign)

  const [prompt, setPrompt] = React.useState('')
  const [busy, setBusy] = React.useState(false)
  const [result, setResult] = React.useState<AgentResult | null>(null)
  const [previous, setPrevious] = React.useState<DesignConfig | null>(null)

  const examples = [t('agent.example1'), t('agent.example2'), t('agent.example3')]

  const submit = async (text: string) => {
    const value = text.trim()
    if (!value || busy) return
    setBusy(true)
    setResult(null)
    try {
      const outcome = await runDesignAgent(value, locale)
      if (outcome.understood) {
        setPrevious(design)
        setDesign(outcome.patch)
      }
      setResult(outcome)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="rounded-3xl border border-sage/40 bg-sage/[0.07] p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="grid size-9 place-items-center rounded-xl bg-sage/20 text-sage">
          <Bot className="size-5" aria-hidden />
        </span>
        <h2 className="text-lg font-semibold">{t('agent.heading')}</h2>
        <Badge variant="sage" className="ms-auto">
          <Sparkles className="size-3" aria-hidden />
          {t('agent.eyebrow')}
        </Badge>
      </div>

      <p className="mt-2 max-w-prose text-sm leading-relaxed text-ink-soft">{t('agent.body')}</p>

      <form
        className="mt-4"
        onSubmit={(event) => {
          event.preventDefault()
          void submit(prompt)
        }}
      >
        <Label htmlFor="agent-prompt" className="sr-only">
          {t('agent.inputLabel')}
        </Label>
        <Textarea
          id="agent-prompt"
          rows={2}
          value={prompt}
          dir="auto"
          placeholder={t('agent.placeholder')}
          onChange={(event) => setPrompt(event.target.value)}
          onKeyDown={(event) => {
            // Enter sends, Shift+Enter makes a new line.
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault()
              void submit(prompt)
            }
          }}
          className="resize-none bg-surface-raised"
        />
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Button type="submit" disabled={busy || prompt.trim().length < 2}>
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Wand2 className="size-4" aria-hidden />
            )}
            {busy ? t('agent.thinking') : t('agent.send')}
          </Button>
          <span className="flex items-center gap-1 text-xs text-ink-mute">
            <CornerDownLeft className="size-3.5" aria-hidden />
            Enter
          </span>
        </div>
      </form>

      {/* Examples */}
      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
          {t('agent.tryHeading')}
        </p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {examples.map((example) => (
            <li key={example}>
              <button
                type="button"
                dir="auto"
                onClick={() => {
                  setPrompt(example)
                  void submit(example)
                }}
                className="tap rounded-full border border-line bg-surface-raised px-3 py-1.5 text-start text-xs font-medium text-ink-soft transition-colors hover:bg-surface-sunken"
              >
                {example}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Outcome */}
      {result ? (
        <div className="mt-4 rounded-2xl border border-line bg-surface-raised p-4" aria-live="polite">
          {result.understood ? (
            <>
              <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-sage">
                {t('agent.applied')}
                <Badge variant="outline">
                  {result.engine === 'claude' ? t('agent.aiMode') : t('agent.localMode')}
                </Badge>
              </p>
              <dl className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
                {result.changes.map((change) => (
                  <div key={change.field} className="flex items-baseline gap-2">
                    <dt className="text-ink-mute">{t(FIELD_LABEL_KEYS[change.field] ?? change.field)}:</dt>
                    <dd className="font-semibold" dir="auto">
                      {pick(change.display)}
                    </dd>
                  </div>
                ))}
              </dl>
              {previous ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-3"
                  onClick={() => {
                    loadDesign(previous)
                    setPrevious(null)
                    setResult(null)
                  }}
                >
                  <Undo2 className="size-4" aria-hidden />
                  {t('agent.undo')}
                </Button>
              ) : null}
              {result.engine === 'local' ? (
                <p className="mt-2 text-xs text-ink-mute">{t('agent.offlineNote')}</p>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-ink-soft">{t('agent.nothingUnderstood')}</p>
          )}
        </div>
      ) : null}

      <p className="mt-3 text-xs text-ink-mute">{t('agent.disclaimer')}</p>
    </section>
  )
}
