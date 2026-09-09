'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Check, Heart, ShoppingBag, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Price } from '@/components/common/price'
import { Mug2D } from '@/components/mug3d/mug-2d'
import { useI18n } from '@/i18n/provider'
import { useStore } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { priceOf } from '@/data/product'
import type { Bilingual, DesignConfig } from '@/types/design'
import { cn } from '@/lib/utils'

/**
 * One orderable design. Used on the shop grid, the gallery and the wishlist —
 * so a design looks and behaves the same everywhere.
 */
export function DesignCard({
  id,
  design,
  name,
  blurb,
  badge,
  inStock = true,
  className,
}: {
  id: string
  design: DesignConfig
  name: Bilingual
  blurb?: Bilingual
  badge?: string
  inStock?: boolean
  className?: string
}) {
  const { t, pick } = useI18n()
  const router = useRouter()
  const hydrated = useHydrated()

  const addToCart = useStore((s) => s.addToCart)
  const loadDesign = useStore((s) => s.loadDesign)
  const wishlist = useStore((s) => s.wishlist)
  const toggleWishlist = useStore((s) => s.toggleWishlist)
  const stockAlerts = useStore((s) => s.stockAlerts)
  const requestStockAlert = useStore((s) => s.requestStockAlert)

  const wished = hydrated && wishlist.some((w) => w.id === id)
  const alerted = hydrated && stockAlerts.includes(id)

  return (
    <article className={cn('card-terra flex flex-col', className)}>
      <div className="relative grid h-56 place-items-center bg-surface-sunken">
        <Mug2D design={design} className="h-48 w-auto" />
        {badge ? (
          <Badge variant="clay" className="absolute start-3 top-3">
            {badge}
          </Badge>
        ) : null}
        {!inStock ? (
          <Badge variant="sand" className="absolute end-3 top-3">
            {t('common.outOfStock')}
          </Badge>
        ) : null}
        <button
          type="button"
          onClick={() => toggleWishlist({ id, design, name })}
          aria-pressed={wished}
          aria-label={wished ? t('common.inWishlist') : t('common.addToWishlist')}
          className={cn(
            'tap absolute bottom-2 end-2 grid place-items-center rounded-full border border-line bg-surface-raised/90 text-ink-mute transition-colors hover:text-accent',
            wished && 'text-accent',
          )}
        >
          <Heart className={cn('size-5', wished && 'fill-current')} aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold" dir="auto">
          {pick(name)}
        </h3>
        {blurb ? <p className="mt-1 text-sm text-ink-mute">{pick(blurb)}</p> : null}
        <Price value={priceOf(design)} className="mt-3 font-semibold" />

        <div className="mt-4 flex flex-col gap-2 pt-1 sm:flex-row">
          {inStock ? (
            <Button
              className="flex-1 whitespace-normal px-3 text-center leading-tight"
              size="sm"
              onClick={() => {
                addToCart({ design, designName: name })
                router.push('/cart')
              }}
            >
              <ShoppingBag className="size-4" aria-hidden />
              {t('common.addToCart')}
            </Button>
          ) : (
            <Button
              className="h-auto min-h-11 flex-1 whitespace-normal px-3 py-2 text-center leading-tight"
              size="sm"
              variant="outline"
              onClick={() => requestStockAlert(id)}
              disabled={alerted}
            >
              {alerted ? <Check className="size-4" aria-hidden /> : <Bell className="size-4" aria-hidden />}
              {alerted ? t('common.notifySent') : t('common.notifyMe')}
            </Button>
          )}
          <Button
            className="h-auto min-h-11 flex-1 whitespace-normal px-3 py-2 text-center leading-tight"
            size="sm"
            variant="outline"
            onClick={() => {
              loadDesign(design)
              router.push('/customize')
            }}
          >
            <Wand2 className="size-4" aria-hidden />
            {t('common.customizeThisOne')}
          </Button>
        </div>
      </div>
    </article>
  )
}
