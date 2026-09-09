'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Clock, Mail, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Price } from '@/components/common/price'
import { MugViewer } from '@/components/mug3d/mug-viewer'
import { Mug2D } from '@/components/mug3d/mug-2d'
import { ViewerSkeleton } from '@/components/mug3d/viewer-skeleton'
import { Countdown } from './countdown'
import { useI18n } from '@/i18n/provider'
import { useCupOfTheDay } from '@/lib/cup-of-the-day'
import { presets, PRESET_COUNT } from '@/data/presets'
import { defaultDesign, priceOf } from '@/data/product'
import { useStore } from '@/lib/store'
import type { Preset } from '@/data/presets'
import type { DesignConfig } from '@/types/design'
import { cn } from '@/lib/utils'

/** A preset becomes a full design configuration. */
export function designFromPreset(preset: Preset, withDiscount = true): DesignConfig {
  return {
    ...defaultDesign,
    sizeId: preset.sizeId,
    bodyColorId: preset.bodyColorId,
    lidColorId: preset.lidColorId,
    text: preset.text,
    fontId: preset.fontId,
    textColorId: preset.textColorId,
    textSize: preset.textSize,
    placement: preset.placement,
    handle: preset.handle,
    accessories: [],
    presetId: preset.id,
    discountPercent: withDiscount ? preset.discountPercent : undefined,
  }
}

export function CupOfTheDay({ variant = 'section' }: { variant?: 'section' | 'page' }) {
  const { t, pick, n } = useI18n()
  const router = useRouter()
  const { mounted, today, yesterday, tomorrow, parts, justChanged } = useCupOfTheDay()
  const addToCart = useStore((s) => s.addToCart)
  const loadDesign = useStore((s) => s.loadDesign)
  const [emailSent, setEmailSent] = React.useState(false)

  // Until the client clock has been read there is no correct answer to show,
  // so the viewer area holds a skeleton rather than guessing a day.
  if (!mounted || !today) {
    return (
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-[4/5] w-full sm:aspect-square">
          <ViewerSkeleton />
        </div>
        <div className="space-y-4" aria-hidden>
          <div className="h-4 w-24 animate-soft-pulse rounded-full bg-stone/30" />
          <div className="h-10 w-64 animate-soft-pulse rounded-xl bg-stone/30" />
          <div className="h-20 w-full animate-soft-pulse rounded-xl bg-stone/20" />
        </div>
      </div>
    )
  }

  const design = designFromPreset(today)
  const fullPrice = priceOf({ ...design, discountPercent: undefined })
  const salePrice = priceOf(design)

  const orderThis = () => {
    addToCart({ design, designName: today.name })
    router.push('/cart')
  }

  const customizeThis = () => {
    loadDesign({ ...design, discountPercent: undefined, presetId: today.id }, { step: 1 })
    router.push('/customize')
  }

  return (
    <div className={cn('grid items-center gap-8 lg:grid-cols-2 lg:gap-14')}>
      {/* Viewer -------------------------------------------------------- */}
      <div
        className={cn(
          'transition-opacity duration-700',
          justChanged ? 'opacity-0' : 'opacity-100',
        )}
      >
        <div className="h-[22rem] sm:h-[26rem] lg:h-[32rem]">
          <MugViewer design={design} />
        </div>
      </div>

      {/* Copy ---------------------------------------------------------- */}
      <div className={cn('transition-opacity duration-700', justChanged ? 'opacity-0' : 'opacity-100')}>
        <p className="eyebrow">
          <Sparkles className="size-3.5" aria-hidden />
          {t('cotd.eyebrow')}
        </p>

        <h2
          className={cn(
            'mt-3 text-balance',
            variant === 'page' ? 'text-display' : 'text-display-sm sm:text-display',
          )}
        >
          {t('cotd.todayIs', { name: pick(today.name) })}
        </h2>

        <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-soft">
          {pick(today.story)}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge variant="clay" className="px-3 py-1.5 text-sm">
            {t('cotd.todayOnly', { percent: n(today.discountPercent) })}
          </Badge>
          <Price value={salePrice} strike={fullPrice} className="text-lg font-semibold" />
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-surface-raised p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
            <Clock className="size-4 text-sage" aria-hidden />
            {t('cotd.countdown')}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Countdown parts={parts} />
            <p className="text-xs text-ink-mute">{t('cotd.changesAtMidnight')}</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={orderThis}>
            {t('cotd.orderThis')}
          </Button>
          <Button size="lg" variant="outline" onClick={customizeThis}>
            {t('cotd.customizeThis')}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Button>
        </div>

        {variant === 'section' ? (
          <Link
            href="/cup-of-the-day"
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-accent hover:underline"
          >
            {t('cotd.archiveHeading')}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        ) : null}
      </div>

      {/* Archive strip + email capture (full page only) ----------------- */}
      {variant === 'page' ? (
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold">{t('cotd.archiveHeading')}</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {/* Yesterday */}
            {yesterday ? (
              <article className="card-terra flex items-center gap-4 p-4">
                <div className="grid size-24 shrink-0 place-items-center rounded-2xl bg-surface-sunken">
                  <Mug2D design={designFromPreset(yesterday, false)} className="h-20 w-auto" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
                    {t('cotd.yesterday')}
                  </p>
                  <p className="mt-1 font-semibold">{pick(yesterday.name)}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-mute">{pick(yesterday.story)}</p>
                </div>
              </article>
            ) : null}

            {/* Tomorrow — deliberately hidden */}
            {tomorrow ? (
              <article
                className="card-terra flex items-center gap-4 p-4"
                aria-label={t('cotd.tomorrowAria')}
              >
                <div className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-surface-sunken">
                  <div className="blur-md saturate-50" aria-hidden>
                    <Mug2D design={designFromPreset(tomorrow, false)} className="h-20 w-auto" showText={false} />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
                    {t('cotd.tomorrow')}
                  </p>
                  <p className="mt-1 font-semibold text-ink-mute">{t('cotd.tomorrowTeaser')}</p>
                  <p className="mt-1 text-sm text-ink-mute">
                    {t('cotd.howItWorksBody', { count: n(PRESET_COUNT) })}
                  </p>
                </div>
              </article>
            ) : null}
          </div>

          {/* Email capture */}
          <div className="mt-8 rounded-3xl surface-clay p-6 sm:p-8">
            <h3 className="text-xl font-semibold">{t('cotd.emailHeading')}</h3>
            <p className="mt-2 max-w-prose text-sm text-ink-soft">{t('cotd.emailBody')}</p>
            {emailSent ? (
              <p className="mt-4 rounded-xl bg-sage/15 px-4 py-3 text-sm font-medium text-moss" role="status">
                {t('cotd.emailDone')}
              </p>
            ) : (
              <form
                className="mt-4 flex max-w-md flex-col gap-3 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault()
                  setEmailSent(true)
                }}
              >
                <div className="flex-1">
                  <Label htmlFor="cotd-email" className="sr-only">
                    {t('common.email')}
                  </Label>
                  <Input
                    id="cotd-email"
                    type="email"
                    required
                    placeholder={t('common.emailPlaceholder')}
                  />
                </div>
                <Button type="submit" className="shrink-0">
                  <Mail className="size-4" aria-hidden />
                  {t('cotd.emailCta')}
                </Button>
              </form>
            )}
          </div>

          <p className="mt-6 max-w-prose text-sm text-ink-mute">
            <strong className="font-semibold text-ink-soft">{t('cotd.howItWorks')}:</strong>{' '}
            {t('cotd.howItWorksBody', { count: n(presets.length) })} {t('cotd.discountNote')}
          </p>
        </div>
      ) : null}
    </div>
  )
}
