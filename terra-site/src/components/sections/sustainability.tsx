'use client'

import * as React from 'react'
import { useI18n } from '@/i18n/provider'
import { Reveal } from '@/components/common/motion'
import { useInView, useReducedMotion } from '@/lib/hooks'
import { cn } from '@/lib/utils'

/** Mid-range life-cycle figures, rounded down. Stated in the copy. */
const CO2_PER_CUP_G = 2
const WATER_PER_CUP_L = 0.24

const STAGES = [
  { id: 'material', titleKey: 'sustain.material', bodyKey: 'sustain.materialBody' },
  { id: 'craft', titleKey: 'sustain.craft', bodyKey: 'sustain.craftBody' },
  { id: 'reuse', titleKey: 'sustain.reuse', bodyKey: 'sustain.reuseBody' },
  { id: 'impact', titleKey: 'sustain.impact', bodyKey: 'sustain.impactBody' },
]

/** A number that counts up once, when it is first seen. */
function Counted({ value }: { value: number }) {
  const { n } = useI18n()
  const [ref, inView] = useInView<HTMLSpanElement>(0.4)
  const reduced = useReducedMotion()
  const [shown, setShown] = React.useState(0)
  const from = React.useRef(0)

  React.useEffect(() => {
    if (!inView) return
    if (reduced) {
      setShown(value)
      return
    }
    const start = performance.now()
    const origin = from.current
    let frame = 0
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1100)
      const eased = 1 - Math.pow(1 - p, 4)
      setShown(Math.round(origin + (value - origin) * eased))
      if (p < 1) frame = requestAnimationFrame(tick)
      else from.current = value
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduced, value])

  return (
    <span ref={ref} className="tabular-nums">
      {n(shown)}
    </span>
  )
}

/**
 * MATERIAL → CRAFT → REUSE → IMPACT, then the reader's own number.
 * No generic environmental language, and every figure says where it came from.
 */
export function Sustainability() {
  const { t, n } = useI18n()

  const [perDay, setPerDay] = React.useState(2)
  const [daysWeek, setDaysWeek] = React.useState(6)
  const [years, setYears] = React.useState(5)

  const cups = Math.round(perDay * daysWeek * 52 * years)
  const kg = Math.round(((cups * CO2_PER_CUP_G) / 1000) * 10) / 10
  const litres = Math.round(cups * WATER_PER_CUP_L)

  return (
    <section className="band wrap">
      <Reveal>
        <p className="eyebrow">{t('sustain.eyebrow')}</p>
        <h2 className="mt-7 max-w-prose text-title font-light">{t('sustain.heading')}</h2>
      </Reveal>

      {/* The four stages, as a single continuous line. */}
      <ol className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((stage, i) => (
          <Reveal as="li" key={stage.id} delay={i * 110}>
            <span className="flex items-center gap-4">
              <span className="text-[0.6rem] tabular-nums text-ink-mute">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span aria-hidden className="h-px flex-1 bg-line" />
            </span>
            <h3 className="mt-5 meta-lg text-ink">
              {t(stage.titleKey)}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-ink-soft">{t(stage.bodyKey)}</p>
          </Reveal>
        ))}
      </ol>

      {/* The personal counter. */}
      <Reveal className="mt-20 border-t border-line pt-14">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <h3 className="text-title-sm font-light">{t('sustain.counterHeading')}</h3>
            <p className="mt-4 text-sm text-ink-soft">{t('sustain.counterBody')}</p>

            <div className="mt-10 space-y-9">
              <Stepper
                label={t('sustain.perDay')}
                value={perDay}
                min={1}
                max={6}
                onChange={setPerDay}
              />
              <Stepper
                label={t('sustain.daysWeek')}
                value={daysWeek}
                min={1}
                max={7}
                onChange={setDaysWeek}
              />
              <div>
                <p className="eyebrow">{t('sustain.years')}</p>
                <div className="mt-4 flex gap-2">
                  {[1, 3, 5, 10].map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setYears(option)}
                      aria-pressed={years === option}
                      className={cn(
                        'tap flex-1 border px-3 meta transition-colors duration-500 ease-cinema',
                        years === option
                          ? 'border-ink bg-ink text-surface'
                          : 'border-line text-ink-soft hover:border-ink/40',
                      )}
                    >
                      {t('sustain.yearsUnit', { count: n(option) })}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center" aria-live="polite">
            <p className="font-display text-[clamp(3.4rem,11vw,7rem)] font-extralight leading-none tracking-tight text-ink">
              <Counted value={cups} />
            </p>
            <p className="mt-5 max-w-measure meta-lg text-ink-soft">
              {t('sustain.resultUnit')}
            </p>
            {/* The same figure as one sentence, for screen readers. */}
            <p className="sr-only">{t('sustain.result', { cups: n(cups) })}</p>
            <p className="passage mt-6 max-w-measure">
              {t('sustain.resultNote', { kg: n(kg), litres: n(litres) })}
            </p>
            <p className="mt-8 max-w-prose text-[0.68rem] leading-relaxed text-ink-mute">
              {t('sustain.method')}
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function Stepper({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (v: number) => void
}) {
  const { n } = useI18n()
  return (
    <div>
      <p className="eyebrow">{label}</p>
      <div className="mt-4 flex gap-2">
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={value === option}
            aria-label={`${label}: ${option}`}
            className={cn(
              'tap grid flex-1 place-items-center border text-sm tabular-nums transition-colors duration-500 ease-cinema',
              value === option
                ? 'border-ink bg-ink text-surface'
                : 'border-line text-ink-soft hover:border-ink/40',
            )}
          >
            {n(option)}
          </button>
        ))}
      </div>
    </div>
  )
}
