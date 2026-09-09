'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Check, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { MugViewer } from '@/components/mug3d/mug-viewer'
import { useI18n } from '@/i18n/provider'
import { useStore } from '@/lib/store'
import { decodeDesign } from '@/lib/share'
import { cn } from '@/lib/utils'
import { AgentPanel } from './agent-panel'
import { StepSize } from './step-size'
import { StepColor } from './step-color'
import { StepText } from './step-text'
import { StepReview } from './step-review'

const STEPS = [
  { id: 1, nameKey: 'designer.step1.name', Component: StepSize },
  { id: 2, nameKey: 'designer.step2.name', Component: StepColor },
  { id: 3, nameKey: 'designer.step3.name', Component: StepText },
  { id: 4, nameKey: 'designer.step4.name', Component: StepReview },
]

export function Designer() {
  const { t, n } = useI18n()
  const params = useSearchParams()
  const design = useStore((s) => s.design)
  const step = useStore((s) => s.step)
  const setStep = useStore((s) => s.setStep)
  const loadDesign = useStore((s) => s.loadDesign)
  const setSnapshot = useStore((s) => s.setSnapshot)

  /**
   * A shared link carries the whole configuration in the query string. Load it
   * once, on mount, so a shared mug opens exactly as its designer left it —
   * and so a reload of the plain /customize URL keeps whatever the customer
   * had in progress (that lives in localStorage).
   */
  const loadedFromUrl = React.useRef(false)
  React.useEffect(() => {
    if (loadedFromUrl.current) return
    loadedFromUrl.current = true
    const fromUrl = decodeDesign(new URLSearchParams(params.toString()))
    if (fromUrl) loadDesign(fromUrl, { step: 1 })
  }, [params, loadDesign])

  const Current = STEPS[step - 1]?.Component ?? StepSize
  const isLast = step === STEPS.length

  const goTo = (next: number) => {
    setStep(Math.min(STEPS.length, Math.max(1, next)))
    // Bring the panel back into view on mobile, where the viewer is sticky.
    document.getElementById('designer-steps')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }

  return (
    <div className="container-terra pb-16 pt-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-display-sm">{t('designer.heading')}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-ink-mute">
            <Save className="size-3.5" aria-hidden />
            {t('designer.savedNote')}
          </p>
        </div>
        {/* Escape hatch for anyone in a hurry — visible from step 1. */}
        <Button asChild variant="ghost">
          <Link href="/shop">{t('designer.skipToReadyMade')}</Link>
        </Button>
      </div>

      {/* Progress ------------------------------------------------------- */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm font-semibold text-ink-mute">
          <span>{t('designer.stepOf', { current: n(step), total: n(STEPS.length) })}</span>
          <span className="text-accent">{t(STEPS[step - 1].nameKey)}</span>
        </div>
        <Progress
          className="mt-2"
          value={(step / STEPS.length) * 100}
          aria-label={t('designer.progressLabel')}
        />
        {/* Every step is freely revisitable. */}
        <ol className="mt-3 grid grid-cols-4 gap-1.5">
          {STEPS.map((s) => {
            const done = s.id < step
            const active = s.id === step
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => goTo(s.id)}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'tap flex w-full flex-col items-center gap-1 rounded-xl border px-2 py-2 text-xs font-semibold transition-colors',
                    active && 'border-accent bg-accent-soft/60 text-accent',
                    done && !active && 'border-sage/50 bg-sage/10 text-sage',
                    !done && !active && 'border-line text-ink-mute hover:bg-surface-sunken',
                  )}
                >
                  <span className="flex size-5 items-center justify-center rounded-full bg-current/15">
                    {done ? <Check className="size-3.5" aria-hidden /> : n(s.id)}
                  </span>
                  <span className="line-clamp-1">{t(s.nameKey)}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start">
        {/* Steps ------------------------------------------------------- */}
        <div id="designer-steps" className="order-2 lg:order-1">
          <AgentPanel />

          <div className="mt-8">
            <Current />
          </div>

          {/* Step nav */}
          <div className="mt-10 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => goTo(step - 1)}
              disabled={step === 1}
              className={cn(step === 1 && 'invisible')}
            >
              <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
              {t('common.back')}
            </Button>
            {!isLast ? (
              <Button size="lg" onClick={() => goTo(step + 1)}>
                {t('common.next')}
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </Button>
            ) : null}
          </div>
        </div>

        {/* Viewer — sticky beside the steps on desktop, sticky to the top
            of the screen on mobile so it is always visible while choosing. */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-24">
          <div className="sticky top-16 z-20 -mx-5 bg-surface/95 px-5 py-3 backdrop-blur lg:static lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div className="h-60 sm:h-80 lg:h-[30rem]">
              <MugViewer design={design} onSnapshot={setSnapshot} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
