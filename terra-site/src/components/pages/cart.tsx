'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Minus, Plus, X } from 'lucide-react'
import { useI18n } from '@/i18n/provider'
import { Tumbler2D } from '@/components/three/tumbler-2d'
import { cartCount, cartTotals, useStore } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { freeShippingOver, product } from '@/data/product'

export function Cart() {
  const { t, pick, n, price } = useI18n()
  const router = useRouter()
  const hydrated = useHydrated()

  const cart = useStore((s) => s.cart)
  const setQuantity = useStore((s) => s.setQuantity)
  const removeLine = useStore((s) => s.removeLine)
  const loadConfig = useStore((s) => s.loadConfig)

  const totals = cartTotals(cart)

  if (!hydrated) return <div className="wrap py-40" />

  if (cart.length === 0) {
    return (
      <div className="wrap py-40">
        <h1 className="text-title font-light">{t('cart.heading')}</h1>
        <p className="passage mt-6 max-w-measure">{t('cart.empty')}</p>
        <p className="mt-2 max-w-measure text-sm text-ink-mute">{t('cart.emptyBody')}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/customize" className="btn btn-solid tap">
            <span>{t('common.designYours')}</span>
          </Link>
          <Link href="/shop" className="btn tap">
            <span>{t('common.shopTerra')}</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="wrap pb-28 pt-28 lg:pt-36">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="text-title font-light">{t('cart.heading')}</h1>
        <p className="meta text-ink-mute">
          {t('cart.itemCount', { count: n(cartCount(cart)) })}
        </p>
      </div>

      <div className="mt-14 grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
        <ul>
          {cart.map((line) => (
            <li key={line.lineId} className="flex gap-6 border-t border-line py-8">
              <div className="grid w-24 shrink-0 place-items-center bg-sunken py-3 sm:w-32">
                {line.snapshot ? (
                  <Image
                    src={line.snapshot}
                    alt={t('cart.yourDesign')}
                    width={256}
                    height={256}
                    unoptimized
                    className="size-full object-contain"
                  />
                ) : (
                  <Tumbler2D config={line.config} className="h-28 w-auto sm:h-36" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="meta-lg text-ink">
                    {line.name ? pick(line.name) : t('cart.yourDesign')}
                  </h2>
                  <p className="text-sm tabular-nums">
                    {price(line.unitPrice * line.quantity)}{' '}
                    <span className="text-ink-mute">{pick(product.currency)}</span>
                  </p>
                </div>

                {line.config.mark.trim() ? (
                  <p className="mt-2 text-sm text-ink-mute" dir="auto">
                    “{line.config.mark}”
                  </p>
                ) : null}

                <div className="mt-5 flex flex-wrap items-center gap-5">
                  <div className="flex items-center border border-line">
                    <button
                      type="button"
                      onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                      aria-label={`${t('common.quantity')} −`}
                      className="tap grid place-items-center px-3 text-ink-soft hover:text-ink"
                    >
                      <Minus className="size-3" aria-hidden />
                    </button>
                    <span className="min-w-8 text-center text-sm tabular-nums">{n(line.quantity)}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                      aria-label={`${t('common.quantity')} +`}
                      className="tap grid place-items-center px-3 text-ink-soft hover:text-ink"
                    >
                      <Plus className="size-3" aria-hidden />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      loadConfig(line.config)
                      router.push('/customize')
                    }}
                    className="link-draw meta text-ink-soft hover:text-ink"
                  >
                    {t('cart.edit')}
                  </button>

                  <button
                    type="button"
                    onClick={() => removeLine(line.lineId)}
                    aria-label={t('common.remove')}
                    className="tap grid place-items-center text-ink-mute hover:text-ink"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="lg:sticky lg:top-32">
          <p className="eyebrow">{t('checkout.summary')}</p>
          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-mute">{t('common.subtotal')}</dt>
              <dd className="tabular-nums">{price(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-mute">{t('common.shipping')}</dt>
              <dd className="tabular-nums">
                {totals.shipping === 0 ? t('common.free') : price(totals.shipping)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-line pt-4 text-base">
              <dt>{t('common.total')}</dt>
              <dd className="tabular-nums">
                {price(totals.total)} <span className="text-ink-mute">{pick(product.currency)}</span>
              </dd>
            </div>
          </dl>

          <p className="mt-4 meta text-ink-mute">
            {totals.freeShipping
              ? t('cart.freeShipReached')
              : t('cart.freeShip', { amount: n(freeShippingOver), currency: pick(product.currency) })}
          </p>

          <Link href="/checkout" className="btn btn-solid tap mt-8 w-full">
            <span>{t('common.checkout')}</span>
          </Link>
          <Link href="/shop" className="btn btn-quiet tap mt-3 w-full">
            <span>{t('cart.keepLooking')}</span>
          </Link>
        </aside>
      </div>
    </div>
  )
}
