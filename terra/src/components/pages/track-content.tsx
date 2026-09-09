'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, CircleDot, Package, Printer, Search, Truck, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mug2D } from '@/components/mug3d/mug-2d'
import { PageHeader } from '@/components/home/section-heading'
import { useI18n } from '@/i18n/provider'
import { demoOrder } from '@/data/content'
import { defaultDesign } from '@/data/product'
import type { DesignConfig } from '@/types/design'
import { cn } from '@/lib/utils'

const STAGES = [
  { id: 'ordered', icon: Package },
  { id: 'production', icon: Wrench },
  { id: 'printing', icon: Printer },
  { id: 'shipped', icon: Truck },
  { id: 'delivered', icon: Check },
] as const

const design: DesignConfig = { ...defaultDesign, ...demoOrder.design }

export function TrackContent() {
  const { t, pick, n } = useI18n()
  const params = useSearchParams()
  const [query, setQuery] = React.useState(params.get('order') ?? '')
  const [found, setFound] = React.useState<boolean | null>(
    params.get('order') ? params.get('order') === demoOrder.number : null,
  )

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    setFound(query.trim().toUpperCase() === demoOrder.number)
  }

  return (
    <>
      <PageHeader eyebrowKey="track.eyebrow" headingKey="track.heading" />

      <div className="container-terra pb-16">
        <form onSubmit={submit} className="flex max-w-md flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <Label htmlFor="order-number" className="sr-only">
              {t('track.inputLabel')}
            </Label>
            <Input
              id="order-number"
              dir="ltr"
              placeholder={t('track.inputPlaceholder')}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <Button type="submit" className="shrink-0">
            <Search className="size-4" aria-hidden />
            {t('track.trackCta')}
          </Button>
        </form>
        <p className="mt-2 text-xs text-ink-mute">{t('track.demoHint')}</p>

        {found === false ? (
          <p className="mt-6 rounded-2xl border border-accent/40 bg-accent-soft/50 px-4 py-3 text-sm" role="status">
            {t('track.notFound')}
          </p>
        ) : null}

        {found ? (
          <section className="mt-10" aria-live="polite">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="text-2xl">{t('track.orderNumber', { order: demoOrder.number })}</h2>
                <p className="mt-1 text-sm text-ink-mute">
                  {t('track.placedOn', { date: new Date(demoOrder.placedAt).toLocaleDateString() })}
                </p>
              </div>
              <Badge variant="sage">
                {t('track.etaLabel')}: {pick(demoOrder.eta)}
              </Badge>
            </div>

            <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-ink-mute">
              {t('track.stagesHeading')}
            </h3>

            <ol className="mt-4 space-y-4">
              {STAGES.map((stage, index) => {
                const done = index < demoOrder.currentStage
                const current = index === demoOrder.currentStage
                // The customer's own mug at each stage: bare steel before the
                // colour goes on, colour without text before printing, then
                // the finished design.
                const stageDesign: DesignConfig =
                  index === 0
                    ? { ...design, bodyColorId: 'steel', lidColorId: 'steel', text: '' }
                    : index === 1
                      ? { ...design, text: '' }
                      : design
                const Icon = stage.icon

                return (
                  <li
                    key={stage.id}
                    className={cn(
                      'flex flex-wrap items-center gap-4 rounded-3xl border p-4 sm:flex-nowrap',
                      current ? 'border-accent bg-accent-soft/40' : 'border-line bg-surface-raised',
                      !done && !current && 'opacity-70',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-11 shrink-0 place-items-center rounded-full',
                        done && 'bg-sage text-white',
                        current && 'bg-accent text-accent-ink',
                        !done && !current && 'bg-surface-sunken text-ink-mute',
                      )}
                    >
                      {done ? <Check className="size-5" aria-hidden /> : <Icon className="size-5" aria-hidden />}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold">{t(`track.stages.${stage.id}`)}</span>
                        <Badge variant={current ? 'clay' : done ? 'sage' : 'outline'}>
                          {done ? t('track.stageDone') : current ? t('track.stageCurrent') : t('track.stagePending')}
                        </Badge>
                        <span className="text-xs text-ink-mute">
                          {n(index + 1)}/{n(STAGES.length)}
                        </span>
                      </span>
                      <span className="mt-1 block text-sm text-ink-soft">
                        {t(`track.stages.${stage.id}Body`)}
                      </span>
                    </span>

                    <span className="grid w-24 shrink-0 place-items-center rounded-2xl bg-surface-sunken p-2">
                      <span className="sr-only">{t('track.yourDesignAt')}</span>
                      <Mug2D design={stageDesign} className="h-20 w-auto" />
                    </span>
                  </li>
                )
              })}
            </ol>

            <p className="mt-6 flex items-center gap-2 text-sm text-ink-mute">
              <CircleDot className="size-4 text-sage" aria-hidden />
              {t('track.yourDesignAt')}
            </p>
          </section>
        ) : null}
      </div>
    </>
  )
}
