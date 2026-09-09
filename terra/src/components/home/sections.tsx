'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Heart,
  Leaf,
  PackageCheck,
  Recycle,
  RotateCcw,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  Thermometer,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Reveal } from '@/components/common/reveal'
import { CountUp } from '@/components/common/count-up'
import { Mug2D } from '@/components/mug3d/mug-2d'
import { MugViewer } from '@/components/mug3d/mug-viewer'
import { useI18n } from '@/i18n/provider'
import { useStore } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { defaultDesign } from '@/data/product'
import { galleryEntries, reviews, IMPACT_BASE_CUPS, IMPACT_CUPS_PER_SECOND } from '@/data/content'
import type { DesignConfig } from '@/types/design'
import { cn } from '@/lib/utils'

/* ========================================================================== */
/* HERO                                                                       */
/* ========================================================================== */

const HERO_DESIGN: DesignConfig = {
  ...defaultDesign,
  bodyColorId: 'clay',
  lidColorId: 'bamboo',
  text: 'terra',
  fontId: 'playfair',
  textColorId: 'sand',
  placement: 'center',
}

export function Hero() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden">
      {/* Organic ground shape behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[70%] bg-gradient-to-b from-sand/50 to-transparent"
      />
      <div className="container-terra grid items-center gap-8 pb-8 pt-10 lg:grid-cols-2 lg:gap-12 lg:pb-16 lg:pt-16">
        <Reveal>
          <p className="eyebrow">
            <Leaf className="size-3.5" aria-hidden />
            {t('home.hero.eyebrow')}
          </p>
          <h1 className="mt-4 text-display-lg text-balance">{t('home.hero.title')}</h1>
          <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-soft">
            {t('home.hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/customize">{t('common.designYours')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/cup-of-the-day">{t('common.seeTodaysCup')}</Link>
            </Button>
          </div>
        </Reveal>

        <div className="order-first h-[24rem] sm:h-[30rem] lg:order-last lg:h-[36rem]">
          {/* The hero mug is a showpiece: it rotates and responds to drag,
              but it carries no toolbar — the designer is where you work. */}
          <MugViewer design={HERO_DESIGN} showToolbar={false} />
        </div>
      </div>
    </section>
  )
}

/* ========================================================================== */
/* TRUST STRIP                                                                */
/* ========================================================================== */

export function TrustStrip() {
  const { t } = useI18n()
  const items = [
    { icon: Truck, key: 'home.trust.delivery' },
    { icon: ShieldCheck, key: 'home.trust.warranty' },
    { icon: RotateCcw, key: 'home.trust.returns' },
    { icon: PackageCheck, key: 'home.trust.plasticFree' },
  ]
  return (
    <section className="border-y border-line bg-surface-raised">
      <ul className="container-terra grid grid-cols-2 gap-4 py-6 lg:grid-cols-4">
        {items.map(({ icon: Icon, key }) => (
          <li key={key} className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-sage/15 text-sage">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="text-sm font-semibold leading-snug text-ink-soft">{t(key)}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ========================================================================== */
/* FEATURE CARDS                                                              */
/* ========================================================================== */

export function FeatureCards() {
  const { t } = useI18n()
  const cards = [
    { icon: Recycle, title: 'home.features.earth.title', body: 'home.features.earth.body', tone: 'sage' },
    { icon: Thermometer, title: 'home.features.temperature.title', body: 'home.features.temperature.body', tone: 'clay' },
    { icon: Sparkles, title: 'home.features.yours.title', body: 'home.features.yours.body', tone: 'stone' },
  ] as const

  return (
    <section className="section container-terra">
      <h2 className="text-display-sm">{t('home.features.heading')}</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {cards.map((card, index) => (
          <Reveal key={card.title} delay={index * 90} as="article" className="card-terra grain relative p-6">
            <span
              className={cn(
                'grid size-12 place-items-center rounded-2xl',
                card.tone === 'sage' && 'bg-sage/15 text-sage',
                card.tone === 'clay' && 'bg-accent-soft text-accent',
                card.tone === 'stone' && 'bg-stone/20 text-stone',
              )}
            >
              <card.icon className="size-6" aria-hidden />
            </span>
            <h3 className="mt-5 text-xl">{t(card.title)}</h3>
            <p className="mt-2 leading-relaxed text-ink-soft">{t(card.body)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

/* ========================================================================== */
/* TEMPERATURE PROOF                                                          */
/* ========================================================================== */

/** Workshop measurements: 500 ml, lid on, 22°C ambient. */
const TEMPERATURE_STEPS = [
  { hours: 1, hot: 92, cold: 3 },
  { hours: 6, hot: 78, cold: 4 },
  { hours: 12, hot: 61, cold: 5 },
  { hours: 24, hot: 42, cold: 8 },
]

export function TemperatureProof() {
  const { t, n } = useI18n()
  const [index, setIndex] = React.useState(2)
  const step = TEMPERATURE_STEPS[index]

  return (
    <section className="section container-terra">
      <div className="rounded-3xl surface-clay p-6 sm:p-10">
        <p className="eyebrow">
          <Thermometer className="size-3.5" aria-hidden />
          {t('home.temperature.eyebrow')}
        </p>
        <h2 className="mt-3 text-display-sm">{t('home.temperature.heading')}</h2>
        <p className="mt-3 max-w-prose text-ink-soft">{t('home.temperature.body')}</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {/* Hot */}
          <div className="rounded-2xl bg-surface-raised p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-accent">
              <Thermometer className="size-4" aria-hidden />
              {t('home.temperature.hot')}
            </p>
            <p className="mt-2 text-4xl font-bold tabular-nums">{n(step.hot)}°C</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-gradient-to-r from-saffron to-clay transition-[width] duration-500 ease-organic"
                style={{ width: `${(step.hot / 96) * 100}%`, background: 'linear-gradient(90deg, #C98A3C, #B4654A)' }}
              />
            </div>
            <p className="mt-2 text-xs text-ink-mute">{t('home.temperature.hotCaption')}</p>
          </div>

          {/* Cold */}
          <div className="rounded-2xl bg-surface-raised p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-sage">
              <Snowflake className="size-4" aria-hidden />
              {t('home.temperature.cold')}
            </p>
            <p className="mt-2 text-4xl font-bold tabular-nums">{n(step.cold)}°C</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-organic"
                style={{ width: `${(step.cold / 22) * 100}%`, background: 'linear-gradient(90deg, #7C8B6B, #4E5D43)' }}
              />
            </div>
            <p className="mt-2 text-xs text-ink-mute">{t('home.temperature.coldCaption')}</p>
          </div>
        </div>

        {/* Hour slider */}
        <div className="mt-8">
          <label htmlFor="temp-hours" className="text-sm font-semibold text-ink-soft">
            {t('home.temperature.atHour', { hours: n(step.hours) })}
          </label>
          <Slider
            id="temp-hours"
            className="mt-2"
            min={0}
            max={TEMPERATURE_STEPS.length - 1}
            step={1}
            value={[index]}
            onValueChange={([value]) => setIndex(value)}
            aria-label={t('home.temperature.heading')}
            aria-valuetext={t('home.temperature.atHour', { hours: n(step.hours) })}
          />
          <ol className="mt-2 flex justify-between text-xs font-medium text-ink-mute">
            {TEMPERATURE_STEPS.map((s, i) => (
              <li key={s.hours}>
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className={cn('tap rounded-lg px-2 py-1', i === index && 'text-accent')}
                >
                  {n(s.hours)}
                  {t('cotd.hours')}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/* ========================================================================== */
/* LIVE IMPACT COUNTER                                                        */
/* ========================================================================== */

export function ImpactCounter() {
  const { t } = useI18n()
  return (
    <section className="surface-moss">
      <div className="container-terra section text-center">
        <p className="eyebrow text-sand">
          <Recycle className="size-3.5" aria-hidden />
          {t('home.impact.eyebrow')}
        </p>
        <h2 className="mt-3 text-2xl font-semibold text-cream/90">{t('home.impact.heading')}</h2>
        <p className="mt-4 text-[clamp(2.5rem,10vw,5.5rem)] font-bold leading-none tracking-tight text-sand tabular-nums">
          <CountUp to={IMPACT_BASE_CUPS} perSecond={Math.max(1, Math.round(IMPACT_CUPS_PER_SECOND))} />
        </p>
        <p className="mt-2 text-lg text-cream/80">{t('home.impact.unit')}</p>
        <p className="mx-auto mt-5 max-w-prose text-sm text-cream/70">{t('home.impact.body')}</p>
        <Button asChild variant="quiet" size="lg" className="mt-7">
          <Link href="/impact">
            {t('home.impact.cta')}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  )
}

/* ========================================================================== */
/* COMMUNITY GALLERY STRIP                                                    */
/* ========================================================================== */

export function GalleryStrip() {
  const { t, pick, n } = useI18n()
  const votes = useStore((s) => s.votes)
  const toggleVote = useStore((s) => s.toggleVote)
  const hydrated = useHydrated()

  return (
    <section className="section container-terra">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">{t('home.gallery.eyebrow')}</p>
          <h2 className="mt-3 text-display-sm">{t('home.gallery.heading')}</h2>
          <p className="mt-3 max-w-prose text-ink-soft">{t('home.gallery.body')}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/gallery">{t('home.gallery.cta')}</Link>
        </Button>
      </div>

      <ul className="mt-8 flex snap-x gap-4 overflow-x-auto pb-4 no-scrollbar">
        {galleryEntries.slice(0, 6).map((entry, index) => {
          const voted = hydrated && votes.includes(entry.id)
          return (
            <Reveal
              as="li"
              key={entry.id}
              delay={index * 60}
              className="card-terra w-[15rem] shrink-0 snap-start p-4"
            >
              <div className="relative grid h-44 place-items-center rounded-2xl bg-surface-sunken">
                <Mug2D
                  design={{ ...defaultDesign, ...entry.design, accessories: [] }}
                  className="h-40 w-auto"
                />
                {entry.designOfMonth ? (
                  <Badge variant="clay" className="absolute start-2 top-2">
                    {t('home.gallery.designOfMonth')}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-3 text-sm font-semibold">{t('gallery.by', { name: pick(entry.author) })}</p>
              <p className="mt-1 line-clamp-2 text-sm text-ink-mute">{pick(entry.caption)}</p>
              <button
                type="button"
                onClick={() => toggleVote(entry.id)}
                aria-pressed={voted}
                className={cn(
                  'tap mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-line px-3 text-sm font-semibold transition-colors',
                  voted ? 'border-accent bg-accent-soft text-accent' : 'text-ink-soft hover:bg-surface-sunken',
                )}
              >
                <Heart className={cn('size-4', voted && 'fill-current')} aria-hidden />
                {t('home.gallery.votes', { count: n(entry.votes + (voted ? 1 : 0)) })}
              </button>
            </Reveal>
          )
        })}
      </ul>
    </section>
  )
}

/* ========================================================================== */
/* REVIEWS                                                                    */
/* ========================================================================== */

export function Reviews() {
  const { t, pick, n } = useI18n()
  return (
    <section className="section container-terra">
      <p className="eyebrow">{t('home.reviews.eyebrow')}</p>
      <h2 className="mt-3 text-display-sm">{t('home.reviews.heading')}</h2>

      <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review, index) => (
          <Reveal as="li" key={review.id} delay={index * 70} className="card-terra overflow-hidden">
            <Image
              src={review.photo}
              alt={t('home.reviews.photoAlt', {
                color: pick(review.photoAltVars.color),
                context: pick(review.photoAltVars.context),
              })}
              width={640}
              height={420}
              className="h-44 w-full object-cover"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="p-5">
              <div className="flex items-center gap-1 text-accent" aria-label={`${review.rating}/5`}>
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" aria-hidden />
                ))}
              </div>
              <p className="mt-3 leading-relaxed text-ink-soft">{pick(review.body)}</p>
              <p className="mt-4 text-sm font-semibold">{pick(review.author)}</p>
              <p className="text-xs text-ink-mute">
                {t('home.reviews.verified')} · {t('home.reviews.months', { count: n(review.months) })}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

/* ========================================================================== */
/* FINAL CTA                                                                  */
/* ========================================================================== */

export function FinalCta() {
  const { t } = useI18n()
  return (
    <section className="container-terra pb-4">
      <div className="rounded-3xl bg-accent px-6 py-12 text-center text-accent-ink sm:px-12">
        <h2 className="text-display-sm text-balance">{t('home.finalCta.heading')}</h2>
        <p className="mx-auto mt-4 max-w-prose text-lg text-accent-ink/85">{t('home.finalCta.body')}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" variant="quiet">
            <Link href="/customize">{t('home.finalCta.primary')}</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="text-accent-ink hover:bg-accent-ink/10"
          >
            <Link href="/shop">{t('home.finalCta.secondary')}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
