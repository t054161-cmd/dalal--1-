'use client'

import * as React from 'react'
import { useI18n } from '@/i18n/provider'
import { CupViewer } from '@/components/three/viewer'
import { Reveal } from '@/components/common/motion'
import { useScrollProgress } from '@/lib/hooks'
import { colorways, components, product } from '@/data/product'
import { defaultConfig } from '@/data/product'
import { cn } from '@/lib/utils'

/**
 * The object, introduced. The cup turns as the section passes the viewport —
 * scroll-linked, not on a timer, so the motion belongs to the reader.
 */
export function ProductReveal() {
  const { t, pick, n } = useI18n()
  const [ref, progress] = useScrollProgress<HTMLDivElement>()

  const config = React.useMemo(() => ({ ...defaultConfig }), [])
  const specs = ['reveal.spec1', 'reveal.spec2', 'reveal.spec3', 'reveal.spec4']

  return (
    <section ref={ref} className="border-y border-line bg-raised">
      <div className="wrap grid items-center gap-12 py-20 lg:grid-cols-[1fr_1.1fr] lg:gap-20 lg:py-28">
        <Reveal className="order-2 lg:order-1">
          <p className="eyebrow">{t('reveal.eyebrow')}</p>
          <h2 className="mt-7 text-title font-light">{t('reveal.heading')}</h2>
          <p className="passage mt-7 max-w-prose">{t('reveal.body')}</p>

          <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4">
            {specs.map((key) => (
              <li key={key} className="border-t border-line pt-3 meta-lg text-ink-soft">
                {t(key)}
              </li>
            ))}
          </ul>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            {[
              { label: t('common.capacity'), value: `${n(product.capacityMl)} ml` },
              { label: t('common.height'), value: `${n(product.heightMm)} mm` },
              { label: t('common.diameter'), value: `${n(product.diameterMm)} mm` },
            ].map((row) => (
              <div key={row.label}>
                <dt className="meta text-ink-mute">{row.label}</dt>
                <dd className="mt-1 tabular-nums text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="order-1 h-[26rem] sm:h-[32rem] lg:order-2 lg:h-[40rem]">
          {/* One full, slow turn across the section. */}
          <CupViewer
            config={config}
            spin={progress * Math.PI * 2}
            toolbar="none"
            interactive={false}
            autoTurn={false}
          />
          <p className="mt-2 text-center meta text-ink-mute">
            {t('reveal.scrollToTurn')}
          </p>
        </div>
      </div>
    </section>
  )
}

/**
 * EXPLORE THE CUP — the exploded view. Straw, lid, ring and body separate
 * straight up with even spacing; every part can be hovered for its name, and
 * the whole assembly still turns.
 */
export function Anatomy() {
  const { t, pick } = useI18n()
  const [exploded, setExploded] = React.useState(false)
  const config = React.useMemo(() => ({ ...defaultConfig }), [])

  return (
    <section className="band wrap">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16">
        <div className="h-[30rem] sm:h-[36rem] lg:h-[44rem]">
          <CupViewer
            config={config}
            exploded={exploded}
            showLabels
            toolbar="minimal"
            autoTurn={!exploded}
          />
        </div>

        <Reveal>
          <p className="eyebrow">{t('anatomy.eyebrow')}</p>
          <h2 className="mt-7 text-title font-light">{t('anatomy.heading')}</h2>
          <p className="passage mt-7 max-w-prose">{t('anatomy.body')}</p>

          <button
            type="button"
            onClick={() => setExploded((v) => !v)}
            aria-pressed={exploded}
            className={cn('btn tap mt-9', exploded && 'btn-solid')}
          >
            <span>{exploded ? t('anatomy.collapse') : t('anatomy.explode')}</span>
          </button>

          <p className="mt-4 meta text-ink-mute">
            {exploded ? t('anatomy.hint') : t('anatomy.labelHint')}
          </p>

          {/* The five parts, as on the reference sheet. */}
          <ol className="mt-10 space-y-0">
            {components.map((part, index) => (
              <li
                key={part.id}
                className="flex items-baseline justify-between gap-6 border-t border-line py-4"
              >
                <span className="flex items-baseline gap-4">
                  <span className="w-4 shrink-0 text-[0.6rem] tabular-nums text-ink-mute">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="meta-lg text-ink">
                    {pick(part.name)}
                  </span>
                </span>
                <span className="text-end text-sm text-ink-mute">{pick(part.note)}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
