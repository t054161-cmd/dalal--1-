'use client'

import { Ruler } from 'lucide-react'
import { RadioCard, RadioGroup } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Price } from '@/components/common/price'
import { ScaleReference } from './scale-reference'
import { useI18n } from '@/i18n/provider'
import { pricing, sizes } from '@/data/product'
import { useStore } from '@/lib/store'
import type { SizeId } from '@/types/design'

export function StepSize() {
  const { t, pick, n } = useI18n()
  const design = useStore((s) => s.design)
  const setDesign = useStore((s) => s.setDesign)

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl">{t('designer.step1.heading')}</h2>
      <p className="mt-2 text-ink-soft">{t('designer.step1.body')}</p>

      <RadioGroup
        className="mt-6"
        value={design.sizeId}
        onValueChange={(value) =>
          setDesign({
            sizeId: value as SizeId,
            // The 350 has no handle option, so drop it when switching down.
            handle: value === '350' ? false : design.handle,
          })
        }
        aria-label={t('common.size')}
      >
        {sizes.map((size) => (
          <RadioCard key={size.id} value={size.id} id={`size-${size.id}`}>
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-lg font-semibold">{pick(size.name)}</span>
              <Price value={pricing.base[size.id]} className="text-sm text-ink-mute" />
              {size.handleAvailable ? (
                <Badge variant="sage">{t('designer.step1.handleNote')}</Badge>
              ) : (
                <Badge variant="sand">{t('designer.step1.noHandleNote')}</Badge>
              )}
            </span>
            <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
              {pick(size.hint)}
            </span>
            <span className="mt-1 block text-xs text-ink-mute">
              {t('designer.step1.holds', { volume: n(size.volumeMl) })} ·{' '}
              {n(size.heightMm)}×{n(size.diameterMm)} mm
            </span>
          </RadioCard>
        ))}
      </RadioGroup>

      {/* Handle toggle for the sizes that allow it */}
      {design.sizeId !== '350' ? (
        <label className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface-raised p-4">
          <span>
            <span className="font-semibold">{t('common.handle')}</span>
            <span className="mt-0.5 block text-sm text-ink-mute">
              {design.handle ? t('common.withHandle') : t('common.noHandle')}
            </span>
          </span>
          <input
            type="checkbox"
            className="size-6 accent-clay"
            checked={design.handle}
            onChange={(event) => setDesign({ handle: event.target.checked })}
          />
        </label>
      ) : null}

      <figure className="mt-6 rounded-2xl border border-line bg-surface-raised p-4">
        <ScaleReference sizeId={design.sizeId} />
        <figcaption className="mt-2 flex items-center gap-2 text-xs text-ink-mute">
          <Ruler className="size-3.5" aria-hidden />
          {t('designer.step1.scaleNote')}
        </figcaption>
      </figure>
    </div>
  )
}
