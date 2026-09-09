'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Factory, Hammer, Leaf, PackageCheck, Recycle, ShieldCheck, Sparkles, Thermometer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/common/reveal'
import { CurveDivider, SoilLayers } from '@/components/common/dividers'
import { useI18n } from '@/i18n/provider'

export function AboutContent() {
  const { t } = useI18n()

  return (
    <article>
      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-sand/60 to-transparent"
        />
        <div className="container-terra grid gap-10 pb-10 pt-12 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow">
              <Leaf className="size-3.5" aria-hidden />
              {t('about.heroEyebrow')}
            </p>
            <h1 className="mt-4 text-display-lg text-balance">{t('about.heroHeading')}</h1>
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-soft">
              {t('about.heroBody')}
            </p>
          </div>
          <Image
            src="/images/about/about-workshop-shuwaikh-bench.svg"
            alt="The TERRA workshop bench in Shuwaikh: steel bodies waiting to be engraved, next to a stack of unbleached boxes"
            width={640}
            height={420}
            className="w-full rounded-3xl border border-line object-cover"
            priority={false}
          />
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* Our name — the typographic centrepiece                            */}
      {/* ---------------------------------------------------------------- */}
      <CurveDivider fill="rgb(var(--sand) / 0.55)" />
      <section className="surface-clay" aria-labelledby="our-name">
        <div className="container-terra py-16 sm:py-24">
          <div className="mx-auto max-w-4xl">
            <p className="eyebrow justify-center">{t('about.nameHeading')}</p>

            {/* The word itself, given room to breathe. */}
            <div className="mt-8 text-center">
              <p
                className="font-display text-[clamp(4rem,18vw,10rem)] font-semibold leading-[0.9] tracking-[-0.04em] text-clay"
                lang="la"
              >
                {t('about.nameLatin')}
              </p>
              <p className="mt-4 font-mono text-sm text-ink-mute">{t('about.namePronunciation')}</p>
              <p className="mt-6 text-2xl font-semibold text-bark dark:text-ink sm:text-3xl">
                {t('about.nameDefinition')}
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-prose space-y-6 text-lg leading-[1.75] text-ink-soft">
              <p>{t('about.nameBody1')}</p>
              <p>{t('about.nameBody2')}</p>
              <p className="text-xl font-semibold text-ink">{t('about.nameBody3')}</p>
            </div>

            {/* The etymology, as a quiet caption */}
            <p className="mt-12 text-center font-mono text-sm tracking-wide text-clay">
              {t('about.nameCaption')}
            </p>

            <SoilLayers className="mx-auto mt-12 h-28 w-full max-w-md opacity-90" />
          </div>
        </div>
      </section>
      <CurveDivider flip fill="rgb(var(--sand) / 0.55)" />

      {/* ---------------------------------------------------------------- */}
      {/* Why we started                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="section container-terra" aria-labelledby="why-we-started">
        <h2 id="why-we-started" className="text-display-sm">
          {t('about.whyHeading')}
        </h2>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="max-w-prose space-y-5 text-lg leading-relaxed text-ink-soft">
            <p>{t('about.whyBody1')}</p>
            <p>{t('about.whyBody2')}</p>
            <p className="font-semibold text-ink">{t('about.whyBody3')}</p>
          </div>

          <ul className="grid gap-4 self-start">
            {[
              { value: '500,000,000,000', labelKey: 'about.whyStat1' },
              { value: '13', labelKey: 'about.whyStat2' },
              { value: '730', labelKey: 'about.whyStat3' },
            ].map((stat, index) => (
              <Reveal as="li" key={stat.labelKey} delay={index * 90} className="card-terra p-5">
                <p className="text-3xl font-bold tabular-nums text-clay">{stat.value}</p>
                <p className="mt-1 text-sm leading-snug text-ink-soft">{t(stat.labelKey)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* What we believe                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-surface-raised py-16" aria-labelledby="what-we-believe">
        <div className="container-terra">
          <h2 id="what-we-believe" className="text-display-sm">
            {t('about.believeHeading')}
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'about.believe1Title', body: 'about.believe1Body' },
              { icon: Recycle, title: 'about.believe2Title', body: 'about.believe2Body' },
              { icon: Sparkles, title: 'about.believe3Title', body: 'about.believe3Body' },
            ].map((item, index) => (
              <Reveal as="li" key={item.title} delay={index * 90} className="rounded-3xl border border-line p-6">
                <span className="grid size-12 place-items-center rounded-2xl bg-sage/15 text-sage">
                  <item.icon className="size-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-xl">{t(item.title)}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{t(item.body)}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* How a TERRA is made — 4-step timeline                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="section container-terra" aria-labelledby="how-made">
        <h2 id="how-made" className="text-display-sm">
          {t('about.madeHeading')}
        </h2>
        <p className="mt-3 max-w-prose text-ink-soft">{t('about.madeBody')}</p>

        <ol className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Recycle, title: 'about.step1Title', body: 'about.step1Body' },
            { icon: Thermometer, title: 'about.step2Title', body: 'about.step2Body' },
            { icon: Hammer, title: 'about.step3Title', body: 'about.step3Body' },
            { icon: PackageCheck, title: 'about.step4Title', body: 'about.step4Body' },
          ].map((stage, index) => (
            <Reveal as="li" key={stage.title} delay={index * 100} className="relative">
              {/* connector */}
              <span
                aria-hidden
                className="absolute -top-3 start-0 hidden h-px w-full bg-line lg:block"
              />
              <span className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-sm font-bold text-accent-ink">
                  {index + 1}
                </span>
                <stage.icon className="size-5 text-sage" aria-hidden />
              </span>
              <h3 className="mt-4 text-lg">{t(stage.title)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(stage.body)}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Our promise                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section className="surface-moss" aria-labelledby="our-promise">
        <div className="container-terra py-16">
          <h2 id="our-promise" className="text-display-sm text-cream">
            {t('about.promiseHeading')}
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: 'about.promise1Title', body: 'about.promise1Body' },
              { icon: Recycle, title: 'about.promise2Title', body: 'about.promise2Body' },
              { icon: Factory, title: 'about.promise3Title', body: 'about.promise3Body' },
            ].map((item) => (
              <li key={item.title} className="rounded-3xl bg-cream/10 p-6">
                <item.icon className="size-6 text-sand" aria-hidden />
                <h3 className="mt-4 text-lg text-cream">{t(item.title)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/80">{t(item.body)}</p>
              </li>
            ))}
          </ul>

          <p className="mt-12 font-display text-xl text-sand">{t('about.signature')}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="quiet">
              <Link href="/customize">{t('about.cta')}</Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="text-cream hover:bg-cream/10">
              <Link href="/impact">{t('nav.impact')}</Link>
            </Button>
          </div>
        </div>
      </section>
    </article>
  )
}
