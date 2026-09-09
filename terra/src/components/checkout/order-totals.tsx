'use client'

import Link from 'next/link'
import { Sparkles, Truck, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Price } from '@/components/common/price'
import { useI18n } from '@/i18n/provider'
import { cartTotals, useStore } from '@/lib/store'
import { pricing } from '@/data/product'
import { tierFor } from '@/data/loyalty'

/** The money. Shared by the cart and the checkout screens. */
export function OrderTotals({ showDeliveryProgress = true }: { showDeliveryProgress?: boolean }) {
  const { t, pick, n } = useI18n()
  const cart = useStore((s) => s.cart)
  const points = useStore((s) => s.points)
  const member = useStore((s) => s.member)
  const appliedRewardId = useStore((s) => s.appliedRewardId)
  const clearReward = useStore((s) => s.clearReward)

  const totals = cartTotals({ cart, points, member, appliedRewardId })
  const tier = tierFor(points)

  return (
    <div className="space-y-3 text-sm">
      <Row label={t('common.subtotal')} value={totals.subtotal} />
      {totals.addons > 0 ? <Row label={t('accessories.totalLine')} value={totals.addons} muted /> : null}
      {totals.giftWrap > 0 ? <Row label={t('cart.giftWrapLine')} value={totals.giftWrap} muted /> : null}
      {totals.cards > 0 ? <Row label={t('cart.cardLine')} value={totals.cards} muted /> : null}

      {totals.clubPercent > 0 ? (
        <div className="flex items-center justify-between gap-3 text-sage">
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5" aria-hidden />
            {t('loyalty.appliedDiscount', { percent: n(totals.clubPercent) })}
          </span>
          <span>
            −<Price value={totals.clubDiscount} />
          </span>
        </div>
      ) : null}

      {totals.reward && totals.rewardDiscount > 0 ? (
        <div className="flex items-center justify-between gap-3 text-sage">
          <span className="flex items-center gap-1.5">
            {t('loyalty.rewardApplied', { name: pick(totals.reward.name) })}
            <button
              type="button"
              onClick={clearReward}
              className="tap rounded-full p-1 text-ink-mute hover:text-accent"
              aria-label={t('loyalty.clearReward')}
            >
              <X className="size-3.5" aria-hidden />
            </button>
          </span>
          <span>
            −<Price value={totals.rewardDiscount} />
          </span>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-ink-mute">
          <Truck className="size-3.5" aria-hidden />
          {t('common.shipping')}
        </span>
        {totals.delivery === 0 ? (
          <span className="font-semibold text-sage">{t('common.free')}</span>
        ) : (
          <Price value={totals.delivery} />
        )}
      </div>

      <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3 text-lg font-bold">
        <span>{t('common.total')}</span>
        <Price value={totals.total} />
      </div>

      {/* Free-delivery nudge */}
      {showDeliveryProgress && cart.length > 0 && !totals.freeDelivery ? (
        <div className="rounded-2xl bg-surface-sunken p-3">
          <p className="text-xs font-medium text-ink-soft">
            {t('cart.freeDeliveryProgress', { amount: n(totals.amountToFreeDelivery) })}
          </p>
          <Progress
            className="mt-2"
            value={Math.min(100, (totals.subtotal / pricing.freeDeliveryThreshold) * 100)}
            aria-label={t('common.shipping')}
          />
        </div>
      ) : null}
      {showDeliveryProgress && totals.freeDelivery && cart.length > 0 ? (
        <p className="text-xs font-medium text-sage">{t('cart.freeDeliveryReached')}</p>
      ) : null}

      {/* Points */}
      {cart.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="sage">
            <Sparkles className="size-3" aria-hidden />
            {t('loyalty.earnedAtCheckout', { points: n(totals.pointsEarned) })}
          </Badge>
          {member ? (
            <span className="text-xs text-ink-mute">
              {t('loyalty.tierLabel')}: {pick(tier.current.name)}
            </span>
          ) : (
            <Button asChild variant="link" size="sm">
              <Link href="/rewards">{t('loyalty.notMemberNote')}</Link>
            </Button>
          )}
        </div>
      ) : null}
    </div>
  )
}

function Row({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={muted ? 'text-ink-mute' : ''}>{label}</span>
      <Price value={value} />
    </div>
  )
}
