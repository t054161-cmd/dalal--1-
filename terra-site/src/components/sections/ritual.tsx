'use client'

import Image from 'next/image'
import { useI18n } from '@/i18n/provider'
import { Reveal } from '@/components/common/motion'
import { ritual } from '@/data/content'
import { cn } from '@/lib/utils'

/**
 * THE TERRA RITUAL — the cup inside ordinary days. An editorial grid, not a
 * product gallery: large frames, generous gutters, captions set small.
 */
export function Ritual() {
  const { t } = useI18n()

  return (
    <section className="band wrap">
      <Reveal>
        <p className="eyebrow">{t('ritual.eyebrow')}</p>
        <div className="mt-7 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <h2 className="text-title font-light">{t('ritual.heading')}</h2>
          <p className="passage max-w-measure md:pb-2">{t('ritual.body')}</p>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-6">
        {ritual.map((moment, index) => (
          <Reveal
            as="figure"
            key={moment.id}
            delay={(index % 3) * 110}
            className={cn(moment.wide ? 'md:col-span-4' : 'md:col-span-2')}
          >
            <div className="overflow-hidden bg-sunken">
              <Image
                src={moment.image}
                alt={t('ritual.imageAlt', { color: moment.tone, moment: t(moment.titleKey) })}
                width={1200}
                height={moment.wide ? 760 : 900}
                className={cn(
                  'w-full object-cover transition-transform duration-1400 ease-cinema hover:scale-[1.03] motion-reduce:transition-none',
                  moment.wide ? 'aspect-[16/10]' : 'aspect-[4/5]',
                )}
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
              />
            </div>
            <figcaption className="mt-5 flex items-baseline justify-between gap-4 border-t border-line pt-4">
              <span className="meta-lg text-ink">
                {t(moment.titleKey)}
              </span>
              <span className="text-sm text-ink-mute">{t(moment.noteKey)}</span>
            </figcaption>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
