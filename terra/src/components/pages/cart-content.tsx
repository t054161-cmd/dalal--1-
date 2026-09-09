'use client'

import Link from 'next/link'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CartLineCard } from '@/components/checkout/cart-line-card'
import { OrderTotals } from '@/components/checkout/order-totals'
import { useI18n } from '@/i18n/provider'
import { cartCount, useStore } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'

export function CartContent() {
  const { t, n } = useI18n()
  const cart = useStore((s) => s.cart)
  const hydrated = useHydrated()

  if (!hydrated) {
    return (
      <div className="container-terra py-16">
        <div className="h-40 animate-soft-pulse rounded-3xl bg-surface-sunken" />
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="container-terra py-16">
        <h1 className="text-display-sm">{t('cart.heading')}</h1>
        <div className="mt-8 rounded-3xl border border-dashed border-line p-10 text-center">
          <ShoppingBag className="mx-auto size-10 text-stone" aria-hidden />
          <p className="mt-4 text-lg font-semibold">{t('cart.empty')}</p>
          <p className="mt-1 text-ink-mute">{t('cart.emptyBody')}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/customize">{t('cart.emptyCta')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/shop">{t('nav.shop')}</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-terra py-10">
      <h1 className="text-display-sm">{t('cart.heading')}</h1>
      <p className="mt-2 text-ink-mute">{t('cart.itemCount', { count: n(cartCount(cart)) })}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
        <ul className="space-y-4">
          {cart.map((line) => (
            <li key={line.lineId}>
              <CartLineCard line={line} />
            </li>
          ))}
        </ul>

        <aside className="card-terra p-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">{t('checkout.summaryHeading')}</h2>
          <div className="mt-4">
            <OrderTotals />
          </div>
          <Button asChild size="lg" className="mt-5 w-full">
            <Link href="/checkout">
              {t('cart.checkout')}
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link href="/shop">{t('cart.continueShopping')}</Link>
          </Button>
        </aside>
      </div>
    </div>
  )
}
