'use client'

import * as React from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/home/section-heading'
import { DesignCard } from '@/components/shop/design-card'
import { useI18n } from '@/i18n/provider'
import { colorFamilies, colorFamilyLabels, occasionOptions, shopDesigns, type Occasion } from '@/data/shop'
import { defaultDesign, sizes } from '@/data/product'
import type { DesignConfig, SizeId } from '@/types/design'
import { cn } from '@/lib/utils'

const toDesign = (d: (typeof shopDesigns)[number]): DesignConfig => ({
  ...defaultDesign,
  sizeId: d.sizeId,
  bodyColorId: d.bodyColorId,
  lidColorId: d.lidColorId,
  text: d.text,
  fontId: d.fontId,
  textColorId: d.textColorId,
  textSize: d.textSize,
  placement: d.placement,
  handle: d.handle,
  accessories: [],
  presetId: d.id,
})

export function ShopContent() {
  const { t, pick, n } = useI18n()
  const [occasion, setOccasion] = React.useState<Occasion | 'all'>('all')
  const [family, setFamily] = React.useState<string | 'all'>('all')
  const [size, setSize] = React.useState<SizeId | 'all'>('all')

  const filtered = shopDesigns.filter(
    (design) =>
      (occasion === 'all' || design.occasions.includes(occasion)) &&
      (family === 'all' || design.colorFamily === family) &&
      (size === 'all' || design.sizeId === size),
  )

  const clear = () => {
    setOccasion('all')
    setFamily('all')
    setSize('all')
  }
  const dirty = occasion !== 'all' || family !== 'all' || size !== 'all'

  const Chip = ({
    active,
    onClick,
    children,
  }: {
    active: boolean
    onClick: () => void
    children: React.ReactNode
  }) => (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'tap rounded-full border px-4 text-sm font-semibold transition-colors',
        active ? 'border-accent bg-accent text-accent-ink' : 'border-line text-ink-soft hover:bg-surface-sunken',
      )}
    >
      {children}
    </button>
  )

  return (
    <>
      <PageHeader eyebrowKey="shop.eyebrow" headingKey="shop.heading" bodyKey="shop.body" />

      <div className="container-terra">
        {/* Filters ------------------------------------------------------- */}
        <section
          className="rounded-3xl border border-line bg-surface-raised p-4 sm:p-5"
          aria-label={t('shop.filters')}
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <SlidersHorizontal className="size-4 text-sage" aria-hidden />
              {t('shop.filters')}
            </h2>
            {dirty ? (
              <Button variant="ghost" size="sm" onClick={clear}>
                <X className="size-4" aria-hidden />
                {t('shop.clearFilters')}
              </Button>
            ) : null}
          </div>

          <div className="mt-4 space-y-4">
            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
                {t('shop.filterOccasion')}
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                <Chip active={occasion === 'all'} onClick={() => setOccasion('all')}>
                  {t('shop.occasions.all')}
                </Chip>
                {occasionOptions.map((option) => (
                  <Chip key={option} active={occasion === option} onClick={() => setOccasion(option)}>
                    {t(`shop.occasions.${option}`)}
                  </Chip>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
                {t('shop.filterColor')}
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                <Chip active={family === 'all'} onClick={() => setFamily('all')}>
                  {t('shop.occasions.all')}
                </Chip>
                {colorFamilies.map((option) => (
                  <Chip key={option} active={family === option} onClick={() => setFamily(option)}>
                    {pick(colorFamilyLabels[option])}
                  </Chip>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
                {t('shop.filterSize')}
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                <Chip active={size === 'all'} onClick={() => setSize('all')}>
                  {t('shop.occasions.all')}
                </Chip>
                {sizes.map((option) => (
                  <Chip key={option.id} active={size === option.id} onClick={() => setSize(option.id)}>
                    {pick(option.name)}
                  </Chip>
                ))}
              </div>
            </fieldset>
          </div>
        </section>

        {/* Grid ---------------------------------------------------------- */}
        <p className="mt-6 text-sm font-semibold text-ink-mute" aria-live="polite">
          {t('shop.resultCount', { count: n(filtered.length) })}
        </p>

        {filtered.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-dashed border-line p-10 text-center">
            <p className="text-lg font-semibold">{t('shop.noResults')}</p>
            <Button className="mt-4" onClick={clear}>
              {t('shop.noResultsCta')}
            </Button>
          </div>
        ) : (
          <ul className="mb-16 mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((design) => (
              <li key={design.id}>
                <DesignCard
                  id={design.id}
                  design={toDesign(design)}
                  name={design.name}
                  blurb={design.blurb}
                  badge={design.bestseller ? t('common.new') : undefined}
                  inStock={design.inStock}
                  className="h-full"
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
