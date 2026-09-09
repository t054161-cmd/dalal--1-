'use client'

import * as React from 'react'
import { Check, Palette } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useI18n } from '@/i18n/provider'
import { bodyColors, lidColors, palettes, pricing } from '@/data/product'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

/** A large, labelled colour swatch. 44px+ everywhere. */
function Swatch({
  hex,
  label,
  group,
  selected,
  onSelect,
  note,
}: {
  hex: string
  label: string
  group: string
  selected: boolean
  onSelect: () => void
  note?: string
}) {
  const { t } = useI18n()
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${t('a11y.swatchLabel', { name: label, group })}${selected ? ` — ${t('a11y.selected')}` : ''}`}
      className={cn(
        'tap group flex flex-col items-center gap-2 rounded-2xl border-2 p-2 transition-all duration-200 ease-organic',
        selected ? 'border-accent bg-accent-soft/50 shadow-soft' : 'border-transparent hover:bg-surface-sunken',
      )}
    >
      <span
        className="relative grid size-14 place-items-center rounded-2xl border border-black/10 shadow-inset"
        style={{ background: hex }}
      >
        {selected ? (
          <Check
            className="size-6 drop-shadow"
            style={{ color: hex === '#F0E9DA' || hex === '#D9C7A7' || hex === '#B9BDBC' ? '#3E3229' : '#F6F1E7' }}
            aria-hidden
          />
        ) : null}
      </span>
      <span className="text-center text-xs font-semibold leading-tight text-ink-soft">{label}</span>
      {note ? <span className="text-[0.65rem] text-ink-mute">{note}</span> : null}
    </button>
  )
}

export function StepColor() {
  const { t, pick, price } = useI18n()
  const design = useStore((s) => s.design)
  const setDesign = useStore((s) => s.setDesign)
  const [appliedPalette, setAppliedPalette] = React.useState<string | null>(null)

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl">{t('designer.step2.heading')}</h2>
      <p className="mt-2 text-ink-soft">{t('designer.step2.body')}</p>

      {/* Curated palettes ------------------------------------------------ */}
      <section className="mt-6 rounded-2xl border border-line bg-surface-raised p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Palette className="size-4 text-sage" aria-hidden />
          {t('designer.step2.palettesHeading')}
        </h3>
        <p className="mt-1 text-xs text-ink-mute">{t('designer.step2.palettesBody')}</p>
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {palettes.map((palette) => {
            const body = bodyColors.find((c) => c.id === palette.bodyColorId)!
            const lid = lidColors.find((c) => c.id === palette.lidColorId)!
            const active = design.bodyColorId === palette.bodyColorId && design.lidColorId === palette.lidColorId
            return (
              <li key={palette.id}>
                <button
                  type="button"
                  onClick={() => {
                    setDesign({
                      bodyColorId: palette.bodyColorId,
                      lidColorId: palette.lidColorId,
                      textColorId: palette.textColorId,
                    })
                    setAppliedPalette(palette.id)
                  }}
                  aria-pressed={active}
                  className={cn(
                    'tap flex w-full items-center gap-3 rounded-xl border p-2 text-start transition-colors',
                    active ? 'border-accent bg-accent-soft/50' : 'border-line hover:bg-surface-sunken',
                  )}
                >
                  <span className="flex shrink-0">
                    <span className="size-8 rounded-full border border-black/10" style={{ background: body.hex }} />
                    <span
                      className="-ms-3 size-8 rounded-full border border-black/10"
                      style={{ background: lid.hex }}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{pick(palette.name)}</span>
                    {appliedPalette === palette.id ? (
                      <span className="text-[0.65rem] text-sage">{t('designer.step2.applied')}</span>
                    ) : null}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      {/* Body ------------------------------------------------------------ */}
      <section className="mt-7">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-mute">
          {t('designer.step2.bodyHeading')}
        </h3>
        <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-6">
          {bodyColors.map((color) => (
            <Swatch
              key={color.id}
              hex={color.hex}
              label={pick(color.name)}
              group={t('common.bodyColor')}
              selected={design.bodyColorId === color.id}
              onSelect={() => setDesign({ bodyColorId: color.id })}
            />
          ))}
        </div>
      </section>

      {/* Lid ------------------------------------------------------------- */}
      <section className="mt-7">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-mute">
          {t('designer.step2.lidHeading')}
        </h3>
        <div className="mt-3 grid grid-cols-3 gap-1.5 sm:grid-cols-6">
          {lidColors.map((lid) => (
            <Swatch
              key={lid.id}
              hex={lid.hex}
              label={pick(lid.name)}
              group={t('common.lidColor')}
              selected={design.lidColorId === lid.id}
              onSelect={() => setDesign({ lidColorId: lid.id })}
              note={lid.material === 'bamboo' ? `+${price(pricing.bambooLid)}` : undefined}
            />
          ))}
        </div>
        <Badge variant="sage" className="mt-3">
          {t('designer.step4.bambooLid')} · +{price(pricing.bambooLid)} {t('common.currency')}
        </Badge>
      </section>
    </div>
  )
}
