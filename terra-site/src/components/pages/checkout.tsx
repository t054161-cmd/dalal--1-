'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { useI18n } from '@/i18n/provider'
import { Tumbler2D } from '@/components/three/tumbler-2d'
import { cartTotals, useStore } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { product } from '@/data/product'

/** Payment placeholders — no processor is wired up. */
const METHODS = ['KNET', 'Apple Pay', 'Visa / Mastercard']

/**
 * One screen, three groups of fields, one button. Guest only: an account is
 * one more thing to forget.
 */
export function Checkout() {
  const { t, pick, n, price } = useI18n()
  const hydrated = useHydrated()

  const cart = useStore((s) => s.cart)
  const clearCart = useStore((s) => s.clearCart)

  const [method, setMethod] = React.useState(METHODS[0])
  const [placing, setPlacing] = React.useState(false)
  const [order, setOrder] = React.useState<{ number: string; email: string } | null>(null)

  const totals = cartTotals(cart)

  const place = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const email = String(new FormData(event.currentTarget).get('email') ?? '')
    setPlacing(true)
    // A real storefront would hand off to a payment provider here.
    window.setTimeout(() => {
      setOrder({ number: `TR-${Math.floor(100000 + Math.random() * 899999)}`, email })
      clearCart()
      setPlacing(false)
    }, 650)
  }

  if (order) {
    return (
      <div className="wrap py-40">
        <h1 className="text-title font-light">{t('checkout.successHeading')}</h1>
        <p className="passage mt-6 max-w-prose">
          {t('checkout.successBody', { email: order.email, order: order.number })}
        </p>
        <p className="mt-3 max-w-prose text-sm text-ink-mute">{t('checkout.successNote')}</p>
        <Link href="/shop" className="btn tap mt-10">
          <span>{t('checkout.keepShopping')}</span>
        </Link>
      </div>
    )
  }

  if (hydrated && cart.length === 0) {
    return (
      <div className="wrap py-40">
        <h1 className="text-title font-light">{t('checkout.heading')}</h1>
        <p className="passage mt-6">{t('cart.empty')}</p>
        <Link href="/shop" className="btn tap mt-10">
          <span>{t('common.shopTerra')}</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="wrap pb-28 pt-28 lg:pt-36">
      <h1 className="text-title font-light">{t('checkout.heading')}</h1>
      <p className="mt-4 max-w-measure text-sm text-ink-mute">{t('checkout.note')}</p>

      <form onSubmit={place} className="mt-14 grid gap-16 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
        <div className="space-y-14">
          <fieldset>
            <legend className="eyebrow">{t('checkout.contact')}</legend>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Field id="fullName" label={t('checkout.fullName')} autoComplete="name" required />
              <Field id="phone" label={t('common.phone')} type="tel" autoComplete="tel" required dir="ltr" />
              <div className="sm:col-span-2">
                <Field id="email" label={t('common.email')} type="email" autoComplete="email" required dir="ltr" />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="eyebrow">{t('checkout.delivery')}</legend>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Field id="area" label={t('checkout.area')} required />
              <Field id="block" label={t('checkout.block')} required />
              <Field id="street" label={t('checkout.street')} required />
              <Field id="building" label={t('checkout.building')} required />
              <div className="sm:col-span-2">
                <Field id="extra" label={`${t('checkout.extra')} (${t('common.optional')})`} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="eyebrow">{t('checkout.payment')}</legend>
            <p className="mt-4 max-w-prose text-[0.68rem] leading-relaxed text-ink-mute">
              {t('checkout.paymentNote')}
            </p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {METHODS.map((option) => (
                <li key={option}>
                  <label
                    className={`tap flex cursor-pointer items-center gap-3 border px-5 py-3 meta transition-colors duration-500 ${
                      method === option ? 'border-ink text-ink' : 'border-line text-ink-soft hover:border-ink/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option}
                      checked={method === option}
                      onChange={() => setMethod(option)}
                      className="sr-only"
                    />
                    {option}
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        </div>

        <aside className="lg:sticky lg:top-32">
          <p className="eyebrow">{t('checkout.summary')}</p>

          <ul className="mt-6">
            {cart.map((line) => (
              <li key={line.lineId} className="flex items-center gap-4 border-t border-line py-4">
                <span className="grid size-16 shrink-0 place-items-center bg-sunken">
                  {line.snapshot ? (
                    <Image src={line.snapshot} alt="" width={128} height={128} unoptimized className="size-full object-contain" />
                  ) : (
                    <Tumbler2D config={line.config} className="h-14 w-auto" />
                  )}
                </span>
                <span className="min-w-0 flex-1 text-sm">
                  <span className="block meta text-ink">
                    {line.name ? pick(line.name) : t('cart.yourDesign')}
                  </span>
                  <span className="mt-1 block text-ink-mute">×{n(line.quantity)}</span>
                </span>
                <span className="text-sm tabular-nums">{price(line.unitPrice * line.quantity)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
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

          <button type="submit" disabled={placing} className="btn btn-solid tap mt-8 w-full">
            <span className="flex items-center gap-2">
              {placing ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : null}
              {placing ? t('checkout.placing') : t('checkout.place')}
            </span>
          </button>
          <p className="mt-4 text-[0.64rem] leading-relaxed text-ink-mute">{t('checkout.terms')}</p>
        </aside>
      </form>
    </div>
  )
}

/** A hairline field — label above, rule below, no boxes. */
function Field({
  id,
  label,
  type = 'text',
  ...rest
}: { id: string; label: string; type?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="block meta text-ink-mute">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        className="tap mt-2 w-full border-b border-line bg-transparent pb-2 text-base text-ink transition-colors focus:border-ink focus:outline-none"
        {...rest}
      />
    </div>
  )
}
