'use client'

import { useI18n } from '@/i18n/provider'
import {
  getBodyColor,
  getFont,
  getLidColor,
  getSize,
  getTextColor,
  placements,
  pricing,
  textSizes,
} from '@/data/product'
import { accessories, accessoriesTotal, getAccessory } from '@/data/accessories'
import { Price } from '@/components/common/price'
import type { DesignConfig } from '@/types/design'
import { cn } from '@/lib/utils'

/** A plain list of every choice, in the customer's language. */
export function DesignSummary({ design, className }: { design: DesignConfig; className?: string }) {
  const { t, pick } = useI18n()
  const hasText = design.text.trim().length > 0

  const rows: { label: string; value: string; swatch?: string }[] = [
    { label: t('common.size'), value: pick(getSize(design.sizeId).name) },
    {
      label: t('common.bodyColor'),
      value: pick(getBodyColor(design.bodyColorId).name),
      swatch: getBodyColor(design.bodyColorId).hex,
    },
    {
      label: t('common.lidColor'),
      value: pick(getLidColor(design.lidColorId).name),
      swatch: getLidColor(design.lidColorId).hex,
    },
    { label: t('common.text'), value: hasText ? design.text : t('common.noText') },
  ]

  if (hasText) {
    rows.push(
      { label: t('common.font'), value: pick(getFont(design.fontId).name) },
      {
        label: t('common.textColor'),
        value: pick(getTextColor(design.textColorId).name),
        swatch: getTextColor(design.textColorId).hex,
      },
      {
        label: t('designer.step3.sizeHeading'),
        value: t(textSizes.find((s) => s.id === design.textSize)!.labelKey),
      },
      {
        label: t('common.placement'),
        value: t(placements.find((p) => p.id === design.placement)!.labelKey),
      },
    )
  }

  rows.push({
    label: t('common.handle'),
    value: design.handle && design.sizeId !== '350' ? t('common.withHandle') : t('common.noHandle'),
  })

  rows.push({
    label: t('accessories.stepName'),
    value: design.accessories.length
      ? design.accessories.map((id) => pick(getAccessory(id)!.name)).join(' · ')
      : t('accessories.none'),
  })

  return (
    <dl className={cn('divide-y divide-line text-sm', className)}>
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-4 py-2.5">
          <dt className="text-ink-mute">{row.label}</dt>
          <dd className="flex items-center gap-2 text-end font-semibold" dir="auto">
            {row.swatch ? (
              <span
                className="size-4 shrink-0 rounded-full border border-black/10"
                style={{ background: row.swatch }}
                aria-hidden
              />
            ) : null}
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

/** Itemised price for one mug: base, engraving, bamboo lid, add-ons. */
export function PriceBreakdown({ design, className }: { design: DesignConfig; className?: string }) {
  const { t, pick, n } = useI18n()
  const size = getSize(design.sizeId)
  const hasText = design.text.trim().length > 0
  const bamboo = getLidColor(design.lidColorId).material === 'bamboo'

  const lines: { label: string; value: number }[] = [
    { label: t('designer.step4.basePrice', { size: n(size.volumeMl) }), value: pricing.base[design.sizeId] },
  ]
  if (hasText) lines.push({ label: t('designer.step4.engraving'), value: pricing.engraving })
  if (bamboo) lines.push({ label: t('designer.step4.bambooLid'), value: pricing.bambooLid })
  for (const id of design.accessories) {
    const accessory = accessories.find((a) => a.id === id)
    if (accessory) lines.push({ label: pick(accessory.name), value: accessory.price })
  }

  const gross = lines.reduce((sum, line) => sum + line.value, 0)
  const discount = design.discountPercent
    ? (pricing.base[design.sizeId] +
        (hasText ? pricing.engraving : 0) +
        (bamboo ? pricing.bambooLid : 0)) *
      (design.discountPercent / 100)
    : 0
  const total = Math.round((gross - discount) * 1000) / 1000

  return (
    <div className={cn('text-sm', className)}>
      <ul className="divide-y divide-line">
        {lines.map((line) => (
          <li key={line.label} className="flex items-center justify-between gap-4 py-2.5">
            <span className="text-ink-mute">{line.label}</span>
            <Price value={line.value} />
          </li>
        ))}
        {discount > 0 ? (
          <li className="flex items-center justify-between gap-4 py-2.5 text-sage">
            <span>{t('cart.todayDiscount', { percent: n(design.discountPercent ?? 0) })}</span>
            <span>−<Price value={discount} /></span>
          </li>
        ) : null}
      </ul>
      <div className="mt-2 flex items-center justify-between gap-4 border-t border-line pt-3 text-base font-bold">
        <span>{t('common.total')}</span>
        <Price value={total} />
      </div>
      {design.accessories.length ? (
        <p className="mt-2 text-xs text-ink-mute">
          {t('accessories.totalLine')}: <Price value={accessoriesTotal(design.accessories)} />
        </p>
      ) : null}
    </div>
  )
}
