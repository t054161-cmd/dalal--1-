'use client'

import * as React from 'react'
import { Brush, CheckCircle2, Package, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/home/section-heading'
import { Price } from '@/components/common/price'
import { useI18n } from '@/i18n/provider'
import { accessories } from '@/data/accessories'
import { pointEvents } from '@/data/loyalty'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const CADENCES = [
  { months: 3, key: 'subscribe.cadence3' },
  { months: 6, key: 'subscribe.cadence6' },
  { months: 12, key: 'subscribe.cadence12' },
] as const

const ITEMS = [
  { id: 'lid', labelKey: 'subscribe.lidItem', price: 2.9, icon: Package },
  { id: 'seal', labelKey: 'subscribe.sealItem', price: 1.2, icon: RefreshCw },
  { id: 'brush', labelKey: 'subscribe.brushItem', price: accessories.find((a) => a.id === 'brush')!.price, icon: Brush },
]

export function SubscribeContent() {
  const { t, n } = useI18n()
  const member = useStore((s) => s.member)
  const award = useStore((s) => s.award)

  const [cadence, setCadence] = React.useState(6)
  const [selected, setSelected] = React.useState<string[]>(['seal', 'brush'])
  const [started, setStarted] = React.useState(false)

  const total = ITEMS.filter((item) => selected.includes(item.id)).reduce((sum, i) => sum + i.price, 0)

  return (
    <>
      <PageHeader eyebrowKey="subscribe.eyebrow" headingKey="subscribe.heading" bodyKey="subscribe.intro" />

      <div className="container-terra pb-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
          <section className="card-terra p-6">
            <h2 className="text-lg font-semibold">{t('subscribe.itemsHeading')}</h2>
            <ul className="mt-4 space-y-3">
              {ITEMS.map((item) => {
                const on = selected.includes(item.id)
                return (
                  <li key={item.id}>
                    <label
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors',
                        on ? 'border-accent bg-accent-soft/50' : 'border-line hover:bg-surface-sunken',
                      )}
                    >
                      <Checkbox
                        checked={on}
                        onCheckedChange={(value) =>
                          setSelected((prev) =>
                            value === true ? [...prev, item.id] : prev.filter((id) => id !== item.id),
                          )
                        }
                        aria-label={t(item.labelKey)}
                      />
                      <item.icon className="size-5 text-sage" aria-hidden />
                      <span className="flex-1 font-semibold">{t(item.labelKey)}</span>
                      <Price value={item.price} />
                    </label>
                  </li>
                )
              })}
            </ul>

            <h2 className="mt-8 text-lg font-semibold">{t('subscribe.everyMonths', { count: n(cadence) })}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {CADENCES.map((option) => (
                <button
                  key={option.months}
                  type="button"
                  onClick={() => setCadence(option.months)}
                  aria-pressed={cadence === option.months}
                  className={cn(
                    'tap rounded-full border px-4 text-sm font-semibold transition-colors',
                    cadence === option.months
                      ? 'border-accent bg-accent text-accent-ink'
                      : 'border-line text-ink-soft hover:bg-surface-sunken',
                  )}
                >
                  {t(option.key)}
                </button>
              ))}
            </div>
          </section>

          <aside className="card-terra p-5 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">{t('checkout.summaryHeading')}</h2>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-3 text-lg font-bold">
              <span>{t('common.total')}</span>
              <Price value={total} />
            </div>
            <p className="mt-1 text-xs text-ink-mute">
              {t('subscribe.everyMonths', { count: n(cadence) })}
            </p>
            <Badge variant="sage" className="mt-3">
              +{n(pointEvents.refillPlanStarted)} {t('loyalty.pointsUnit')}
            </Badge>

            {started ? (
              <p className="mt-4 flex items-center gap-2 rounded-2xl bg-sage/15 px-3 py-2 text-sm font-medium text-moss dark:text-sage" role="status">
                <CheckCircle2 className="size-4" aria-hidden />
                {t('subscribe.started')}
              </p>
            ) : (
              <form
                className="mt-4 space-y-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  setStarted(true)
                  if (member) award('refillPlanStarted')
                }}
              >
                <div>
                  <Label htmlFor="sub-email" className="sr-only">
                    {t('common.email')}
                  </Label>
                  <Input
                    id="sub-email"
                    type="email"
                    required
                    dir="ltr"
                    placeholder={t('common.emailPlaceholder')}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={selected.length === 0}>
                  {t('subscribe.cta')}
                </Button>
              </form>
            )}
            <p className="mt-3 text-xs text-ink-mute">{t('subscribe.priceNote')}</p>
          </aside>
        </div>
      </div>
    </>
  )
}
