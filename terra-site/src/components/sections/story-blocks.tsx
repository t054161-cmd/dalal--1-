'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useI18n } from '@/i18n/provider'
import { Magnetic, Parallax, Reveal } from '@/components/common/motion'

/** The quiet type block that follows the hero. */
export function Manifesto() {
  const { t } = useI18n()
  return (
    <section className="band wrap">
      <Reveal>
        <p className="eyebrow">{t('manifesto.eyebrow')}</p>
      </Reveal>
      <Reveal delay={120}>
        <h2 className="mt-8 text-title-lg font-light">
          <span className="block">{t('manifesto.line1')}</span>
          <span className="block text-ink-mute">{t('manifesto.line2')}</span>
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <Reveal delay={200}>
          <p className="passage max-w-prose">{t('manifesto.body')}</p>
        </Reveal>
        <Reveal delay={280} className="md:pt-2">
          <p className="text-[0.7rem] uppercase tracking-[0.26em] text-ink-mute">
            {t('manifesto.note')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/** Packaging: unbleached board, pulp, paper tape. */
export function Packaging() {
  const { t } = useI18n()
  const details = ['packaging.detail1', 'packaging.detail2', 'packaging.detail3', 'packaging.detail4']

  return (
    <section className="band wrap grid items-center gap-14 lg:grid-cols-2">
      <Reveal>
        <p className="eyebrow">{t('packaging.eyebrow')}</p>
        <h2 className="mt-7 text-title font-light">{t('packaging.heading')}</h2>
        <p className="passage mt-7 max-w-prose">{t('packaging.body')}</p>
        <ul className="mt-9 space-y-3">
          {details.map((key) => (
            <li key={key} className="flex items-baseline gap-4 border-b border-line pb-3 text-sm text-ink-soft">
              <span aria-hidden className="h-px w-5 shrink-0 bg-ink-mute" />
              {t(key)}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={140}>
        <Parallax amount={26}>
          <Image
            src="/images/packaging/packaging-unbleached-box-botanical-line.svg"
            alt={t('packaging.imageAlt')}
            width={900}
            height={1100}
            className="w-full"
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Parallax>
      </Reveal>
    </section>
  )
}

/** The closing invitation. */
export function ClosingCta() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden border-t border-line">
      <div className="wrap flex flex-col items-center py-24 text-center sm:py-32">
        <Reveal>
          <p className="eyebrow justify-center">{t('community.eyebrow')}</p>
          <h2 className="mt-8 text-title-lg font-light">{t('packaging.heading')}</h2>
        </Reveal>
        <Reveal delay={160} className="mt-12 flex flex-col gap-4 sm:flex-row">
          <Magnetic>
            <Link href="/customize" className="btn btn-solid tap">
              <span>{t('common.designYours')}</span>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/shop" className="btn tap">
              <span>{t('common.shopTerra')}</span>
            </Link>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  )
}
