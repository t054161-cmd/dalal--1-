'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight, Droplets, Leaf, Recycle, Wind } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Select } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/home/section-heading'
import { Reveal } from '@/components/common/reveal'
import { SoilLayers } from '@/components/common/dividers'
import { useI18n } from '@/i18n/provider'
import { impactNumbers, lifecycleStages, materialsBreakdown } from '@/data/content'
import { sizes } from '@/data/product'
import type { SizeId } from '@/types/design'

/** Mid-range life-cycle figures, rounded down. Documented in the copy. */
const CO2_PER_CUP_G = 2
const WATER_PER_CUP_L = 0.24

export function ImpactContent() {
  const { t, pick, n } = useI18n()
  const [sizeId, setSizeId] = React.useState<SizeId>('500')
  const [perDay, setPerDay] = React.useState(2)
  const [daysPerWeek, setDaysPerWeek] = React.useState(7)

  const cupsPerYear = Math.round(perDay * daysPerWeek * 52)
  const co2 = Math.round(((cupsPerYear * CO2_PER_CUP_G) / 1000) * 10) / 10
  const water = Math.round(cupsPerYear * WATER_PER_CUP_L)

  return (
    <>
      <PageHeader eyebrowKey="impact.eyebrow" headingKey="impact.heading" bodyKey="impact.intro" />

      <div className="container-terra pb-16">
        {/* Materials ---------------------------------------------------- */}
        <section className="mt-6" aria-labelledby="materials">
          <h2 id="materials" className="text-2xl">
            {t('impact.materialsHeading')}
          </h2>
          <p className="mt-2 text-ink-soft">{t('impact.materialsBody')}</p>

          <div className="mt-5 overflow-x-auto rounded-3xl border border-line">
            <table className="w-full min-w-[34rem] text-sm">
              <thead className="bg-surface-sunken text-start">
                <tr>
                  <th scope="col" className="p-4 text-start font-semibold">
                    {t('impact.materialsTable.material')}
                  </th>
                  <th scope="col" className="p-4 text-start font-semibold">
                    {t('impact.materialsTable.share')}
                  </th>
                  <th scope="col" className="p-4 text-start font-semibold">
                    {t('impact.materialsTable.note')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface-raised">
                {materialsBreakdown.map((row) => (
                  <tr key={row.material.en}>
                    <th scope="row" className="p-4 text-start font-semibold">
                      <span className="flex items-center gap-2">
                        {pick(row.material)}
                        {row.recycled ? (
                          <Recycle className="size-4 text-sage" aria-hidden />
                        ) : null}
                      </span>
                    </th>
                    <td className="p-4">
                      <span className="flex items-center gap-2">
                        <span className="tabular-nums font-semibold">{n(row.share)}%</span>
                        <span className="h-2 w-24 overflow-hidden rounded-full bg-sand">
                          <span
                            className="block h-full rounded-full bg-sage"
                            style={{ width: `${row.share}%` }}
                          />
                        </span>
                      </span>
                    </td>
                    <td className="p-4 text-ink-soft">{pick(row.note)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Lifecycle ---------------------------------------------------- */}
        <section className="mt-14" aria-labelledby="lifecycle">
          <h2 id="lifecycle" className="text-2xl">
            {t('impact.lifecycleHeading')}
          </h2>
          <p className="mt-2 text-ink-soft">{t('impact.lifecycleBody')}</p>

          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {lifecycleStages.map((stage, index) => (
              <Reveal as="li" key={stage.title.en} delay={index * 80} className="card-terra p-5">
                <span className="flex items-center gap-2">
                  <span className="grid size-8 place-items-center rounded-full bg-sage/20 text-sm font-bold text-sage">
                    {n(index + 1)}
                  </span>
                  {index === lifecycleStages.length - 1 ? (
                    <Recycle className="size-4 text-sage" aria-hidden />
                  ) : null}
                </span>
                <h3 className="mt-3 text-base font-semibold">{pick(stage.title)}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{pick(stage.body)}</p>
              </Reveal>
            ))}
          </ol>
          <SoilLayers className="mt-8 h-24 w-full max-w-lg opacity-80" />
        </section>

        {/* Numbers ------------------------------------------------------ */}
        <section className="mt-14" aria-labelledby="numbers">
          <h2 id="numbers" className="text-2xl">
            {t('impact.numbersHeading')}
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {impactNumbers.map((item, index) => (
              <Reveal as="li" key={item.label.en} delay={index * 60} className="rounded-3xl surface-clay p-5">
                <p className="text-3xl font-bold text-clay tabular-nums">{item.value}</p>
                <p className="mt-1 font-semibold leading-snug">{pick(item.label)}</p>
                <p className="mt-2 text-sm text-ink-mute">{pick(item.note)}</p>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* Calculator --------------------------------------------------- */}
        <section className="mt-14 rounded-3xl border border-line bg-surface-raised p-6 sm:p-8" aria-labelledby="calc">
          <h2 id="calc" className="text-2xl">
            {t('impact.calcHeading')}
          </h2>
          <p className="mt-2 text-ink-soft">{t('impact.calcBody')}</p>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="space-y-5">
              <div>
                <Label htmlFor="calc-size">{t('impact.calcSize')}</Label>
                <Select
                  id="calc-size"
                  className="mt-1.5"
                  value={sizeId}
                  onChange={(event) => setSizeId(event.target.value as SizeId)}
                >
                  {sizes.map((size) => (
                    <option key={size.id} value={size.id}>
                      {pick(size.name)}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="calc-per-day">
                  {t('impact.calcPerDay')}: <strong>{n(perDay)}</strong>
                </Label>
                <Slider
                  id="calc-per-day"
                  className="mt-1"
                  min={1}
                  max={6}
                  step={1}
                  value={[perDay]}
                  onValueChange={([value]) => setPerDay(value)}
                  aria-valuetext={String(perDay)}
                />
              </div>

              <div>
                <Label htmlFor="calc-days">
                  {t('impact.calcDays')}: <strong>{n(daysPerWeek)}</strong>
                </Label>
                <Slider
                  id="calc-days"
                  className="mt-1"
                  min={1}
                  max={7}
                  step={1}
                  value={[daysPerWeek]}
                  onValueChange={([value]) => setDaysPerWeek(value)}
                  aria-valuetext={String(daysPerWeek)}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-sage/10 p-5" aria-live="polite">
              <p className="text-lg font-semibold leading-snug">
                {t('impact.calcResult', {
                  size: n(sizes.find((s) => s.id === sizeId)!.volumeMl),
                  cups: n(cupsPerYear),
                })}
              </p>
              <p className="mt-3 text-sm text-ink-soft">
                {t('impact.calcResultCo2', { kg: n(co2), litres: n(water) })}
              </p>
              <ul className="mt-4 flex flex-wrap gap-2">
                <li>
                  <Badge variant="sage">
                    <Leaf className="size-3" aria-hidden />
                    {n(cupsPerYear)} {t('home.impact.unit')}
                  </Badge>
                </li>
                <li>
                  <Badge variant="sage">
                    <Wind className="size-3" aria-hidden />
                    {n(co2)} kg CO₂e
                  </Badge>
                </li>
                <li>
                  <Badge variant="sage">
                    <Droplets className="size-3" aria-hidden />
                    {n(water)} L
                  </Badge>
                </li>
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-ink-mute">{t('impact.calcNote')}</p>
            </div>
          </div>
        </section>

        {/* Take-back ---------------------------------------------------- */}
        <section className="mt-14 rounded-3xl surface-moss p-6 sm:p-8">
          <h2 className="text-2xl text-cream">{t('impact.takeBackHeading')}</h2>
          <p className="mt-3 max-w-prose text-cream/85">{t('impact.takeBackBody')}</p>
          <Button asChild variant="quiet" size="lg" className="mt-6">
            <Link href="/takeback">
              {t('impact.takeBackCta')}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          </Button>
        </section>
      </div>
    </>
  )
}
