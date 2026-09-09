'use client'

import { Brush, CupSoda, Link2, Package, Plus, Check } from 'lucide-react'
import { useI18n } from '@/i18n/provider'
import { accessories } from '@/data/accessories'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const ICONS = { 'cup-soda': CupSoda, link: Link2, brush: Brush, package: Package } as const

/**
 * Cup holder, carry chain, brush and spare lid. The first two appear on the
 * 3D model the moment they are added.
 */
export function AccessoriesPicker() {
  const { t, pick, price } = useI18n()
  const design = useStore((s) => s.design)
  const toggleAccessory = useStore((s) => s.toggleAccessory)

  return (
    <section>
      <h3 className="text-lg font-semibold">{t('accessories.heading')}</h3>
      <p className="mt-1 max-w-prose text-sm text-ink-soft">{t('accessories.body')}</p>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {accessories.map((accessory) => {
          const Icon = ICONS[accessory.icon]
          const added = design.accessories.includes(accessory.id)
          return (
            <li key={accessory.id}>
              <button
                type="button"
                onClick={() => toggleAccessory(accessory.id)}
                aria-pressed={added}
                className={cn(
                  'tap flex h-full w-full items-start gap-3 rounded-2xl border p-4 text-start transition-colors',
                  added ? 'border-accent bg-accent-soft/50' : 'border-line hover:bg-surface-sunken',
                )}
              >
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-xl"
                  style={{ background: `${accessory.hex}33`, color: accessory.hex }}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-2">
                    <span className="font-semibold">{pick(accessory.name)}</span>
                    <span className="text-sm text-ink-mute">
                      {t('accessories.priceEach', {
                        price: price(accessory.price),
                        currency: t('common.currency'),
                      })}
                    </span>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                    {pick(accessory.blurb)}
                  </span>
                </span>
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full border',
                    added ? 'border-accent bg-accent text-accent-ink' : 'border-line text-ink-mute',
                  )}
                  aria-hidden
                >
                  {added ? <Check className="size-4" /> : <Plus className="size-4" />}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
