'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Minus, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Price } from '@/components/common/price'
import { Mug2D } from '@/components/mug3d/mug-2d'
import { DesignSummary } from '@/components/designer/design-summary'
import { useI18n } from '@/i18n/provider'
import { useStore } from '@/lib/store'
import { pricing } from '@/data/product'
import { accessoriesTotal } from '@/data/accessories'
import type { CartLine } from '@/types/design'

/** One line in the cart: the design, its options, quantity and price. */
export function CartLineCard({ line, editable = true }: { line: CartLine; editable?: boolean }) {
  const { t, pick, n } = useI18n()
  const router = useRouter()
  const setQuantity = useStore((s) => s.setQuantity)
  const removeLine = useStore((s) => s.removeLine)
  const setLineOptions = useStore((s) => s.setLineOptions)
  const loadDesign = useStore((s) => s.loadDesign)

  const unit = line.unitPrice + accessoriesTotal(line.design.accessories)

  return (
    <article className="card-terra p-4 sm:p-5">
      <div className="flex gap-4">
        {/* The 3D snapshot the customer took, or a drawn preview. */}
        <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-surface-sunken sm:size-32">
          {line.snapshot ? (
            <Image
              src={line.snapshot}
              alt={t('common.yourDesign')}
              width={256}
              height={256}
              unoptimized
              className="size-full object-contain"
            />
          ) : (
            <Mug2D design={line.design} className="h-20 w-auto sm:h-28" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="font-semibold" dir="auto">
              {line.designName ? pick(line.designName) : t('common.yourDesign')}
            </h3>
            <Price value={unit * line.quantity} className="font-semibold" />
          </div>

          <details className="mt-2 text-sm">
            <summary className="tap cursor-pointer text-ink-mute underline-offset-4 hover:underline">
              {t('designer.step4.summaryHeading')}
            </summary>
            <DesignSummary design={line.design} className="mt-2" />
          </details>

          {editable ? (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center gap-1 rounded-full border border-line p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                  aria-label={`${t('common.quantity')} −`}
                >
                  <Minus className="size-4" aria-hidden />
                </Button>
                <span className="min-w-8 text-center text-sm font-bold tabular-nums" aria-live="polite">
                  {n(line.quantity)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                  aria-label={`${t('common.quantity')} +`}
                >
                  <Plus className="size-4" aria-hidden />
                </Button>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  loadDesign(line.design, { step: 1 })
                  router.push('/customize')
                }}
              >
                <Pencil className="size-4" aria-hidden />
                {t('cart.editDesign')}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLine(line.lineId)}
                className="text-ink-mute hover:text-accent"
              >
                <Trash2 className="size-4" aria-hidden />
                {t('common.remove')}
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Gift options, per line */}
      {editable ? (
        <div className="mt-4 grid gap-3 rounded-2xl bg-surface-sunken p-3 sm:grid-cols-2">
          <label className="flex items-start gap-3 text-sm">
            <Checkbox
              checked={line.giftWrap}
              onCheckedChange={(value) => setLineOptions(line.lineId, { giftWrap: value === true })}
              aria-label={t('gifts.giftWrap')}
            />
            <span>
              <span className="font-semibold">{t('gifts.giftWrap')}</span>
              <span className="block text-xs text-ink-mute">
                +<Price value={pricing.giftWrap} /> · {t('gifts.giftWrapNote')}
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3 text-sm">
            <Checkbox
              checked={line.handwrittenCard}
              onCheckedChange={(value) =>
                setLineOptions(line.lineId, { handwrittenCard: value === true })
              }
              aria-label={t('gifts.handwrittenCard')}
            />
            <span className="min-w-0 flex-1">
              <span className="font-semibold">{t('gifts.handwrittenCard')}</span>
              <span className="block text-xs text-ink-mute">
                +<Price value={pricing.handwrittenCard} />
              </span>
              {line.handwrittenCard ? (
                <Input
                  className="mt-2 text-sm"
                  dir="auto"
                  maxLength={200}
                  placeholder={t('gifts.cardMessagePlaceholder')}
                  value={line.cardMessage ?? ''}
                  onChange={(event) =>
                    setLineOptions(line.lineId, { cardMessage: event.target.value })
                  }
                  aria-label={t('gifts.cardMessage')}
                />
              ) : null}
            </span>
          </label>
        </div>
      ) : null}
    </article>
  )
}
