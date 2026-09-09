'use client'

import * as React from 'react'
import Link from 'next/link'
import { CheckCircle2, CreditCard, Loader2, Lock, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input, Select } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CartLineCard } from '@/components/checkout/cart-line-card'
import { OrderTotals } from '@/components/checkout/order-totals'
import { useI18n } from '@/i18n/provider'
import { cartTotals, useStore } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { regions } from '@/data/content'

/** Payment placeholders. No processor is wired up — this is a reference build. */
const PAYMENT_METHODS = [
  { id: 'knet', label: 'KNET', hint: '•••• 4127' },
  { id: 'applepay', label: 'Apple Pay', hint: '' },
  { id: 'mada', label: 'mada', hint: '' },
  { id: 'card', label: 'Visa / Mastercard', hint: '' },
  { id: 'tabby', label: 'Tabby', hint: 'bnpl' },
  { id: 'tamara', label: 'Tamara', hint: 'bnpl' },
]

export function CheckoutContent() {
  const { t, pick, n, price } = useI18n()
  const hydrated = useHydrated()

  const cart = useStore((s) => s.cart)
  const points = useStore((s) => s.points)
  const member = useStore((s) => s.member)
  const appliedRewardId = useStore((s) => s.appliedRewardId)
  const clearCart = useStore((s) => s.clearCart)
  const creditOrder = useStore((s) => s.creditOrder)

  const [region, setRegion] = React.useState('kw')
  const [method, setMethod] = React.useState('knet')
  const [placing, setPlacing] = React.useState(false)
  const [order, setOrder] = React.useState<{ number: string; email: string; earned: number } | null>(null)

  const totals = cartTotals({ cart, points, member, appliedRewardId })
  const activeRegion = regions.find((r) => r.id === region) ?? regions[0]

  const placeOrder = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') ?? '')
    setPlacing(true)
    // A real storefront would post to a payment provider here.
    window.setTimeout(() => {
      const earned = creditOrder(totals.total)
      setOrder({
        number: `TR-${Math.floor(100000 + Math.random() * 899999)}`,
        email,
        earned,
      })
      clearCart()
      setPlacing(false)
    }, 700)
  }

  if (order) {
    return (
      <div className="container-terra py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-sage/40 bg-sage/10 p-8 text-center">
          <CheckCircle2 className="mx-auto size-12 text-sage" aria-hidden />
          <h1 className="mt-4 text-display-sm">{t('checkout.successHeading')}</h1>
          <p className="mt-3 text-ink-soft">
            {t('checkout.successBody', { email: order.email, order: order.number })}
          </p>
          {order.earned > 0 && member ? (
            <Badge variant="sage" className="mt-4">
              <Sparkles className="size-3" aria-hidden />
              {t('loyalty.earnedAtCheckout', { points: n(order.earned) })}
            </Badge>
          ) : null}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <Link href={`/track?order=${order.number}`}>{t('checkout.trackCta')}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/shop">{t('cart.continueShopping')}</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (hydrated && cart.length === 0) {
    return (
      <div className="container-terra py-16 text-center">
        <h1 className="text-display-sm">{t('checkout.heading')}</h1>
        <p className="mt-3 text-ink-mute">{t('cart.empty')}</p>
        <Button asChild className="mt-6">
          <Link href="/customize">{t('cart.emptyCta')}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container-terra py-10">
      <h1 className="text-display-sm">{t('checkout.heading')}</h1>
      <p className="mt-2 flex items-center gap-2 text-sm text-ink-mute">
        <Lock className="size-3.5" aria-hidden />
        {t('checkout.guestNote')}
      </p>

      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
        <div className="space-y-6">
          {/* Contact ---------------------------------------------------- */}
          <fieldset className="card-terra p-5">
            <legend className="px-1 text-lg font-semibold">{t('checkout.contactHeading')}</legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="fullName">{t('checkout.fullName')}</Label>
                <Input id="fullName" name="fullName" required autoComplete="name" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="phone">{t('common.phone')}</Label>
                <Input id="phone" name="phone" type="tel" required autoComplete="tel" className="mt-1.5" dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">{t('common.email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={t('common.emailPlaceholder')}
                  className="mt-1.5"
                  dir="ltr"
                />
              </div>
            </div>
          </fieldset>

          {/* Delivery --------------------------------------------------- */}
          <fieldset className="card-terra p-5">
            <legend className="px-1 text-lg font-semibold">{t('checkout.deliveryHeading')}</legend>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="region">{t('checkout.region')}</Label>
                <Select
                  id="region"
                  name="region"
                  className="mt-1.5"
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {pick(r.name)}
                    </option>
                  ))}
                </Select>
                <p className="mt-1.5 text-xs text-sage" aria-live="polite">
                  {t('checkout.regionEstimate', { days: pick(activeRegion.days) })}
                </p>
              </div>
              <div>
                <Label htmlFor="area">{t('checkout.area')}</Label>
                <Input id="area" name="area" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="block">{t('checkout.block')}</Label>
                <Input id="block" name="block" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="street">{t('checkout.street')}</Label>
                <Input id="street" name="street" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="building">{t('checkout.building')}</Label>
                <Input id="building" name="building" required className="mt-1.5" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="extra">
                  {t('checkout.extra')} <span className="font-normal text-ink-mute">({t('common.optional')})</span>
                </Label>
                <Input id="extra" name="extra" className="mt-1.5" />
              </div>
            </div>
          </fieldset>

          {/* Payment ---------------------------------------------------- */}
          <fieldset className="card-terra p-5">
            <legend className="px-1 text-lg font-semibold">{t('checkout.paymentHeading')}</legend>
            <p className="mt-2 text-xs text-ink-mute">{t('checkout.paymentNote')}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {PAYMENT_METHODS.map((option) => (
                <label
                  key={option.id}
                  className={`tap flex cursor-pointer items-center gap-3 rounded-2xl border p-3 text-sm transition-colors ${
                    method === option.id ? 'border-accent bg-accent-soft/50' : 'border-line hover:bg-surface-sunken'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.id}
                    checked={method === option.id}
                    onChange={() => setMethod(option.id)}
                    className="size-4 accent-clay"
                  />
                  <span className="flex-1 font-semibold">{option.label}</span>
                  {option.hint === 'bnpl' ? (
                    <Badge variant="sage">{t('checkout.bnpl')}</Badge>
                  ) : option.hint ? (
                    <span className="text-xs text-ink-mute">{option.hint}</span>
                  ) : null}
                </label>
              ))}
            </div>
            {method === 'tabby' || method === 'tamara' ? (
              <p className="mt-3 text-xs text-ink-mute">
                {t('checkout.bnplNote')} · 4 × {price(totals.total / 4)} {t('common.currency')}
              </p>
            ) : null}
            {method === 'card' ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="sm:col-span-3">
                  <Label htmlFor="card-number">{t('checkout.payWith')}</Label>
                  <div className="relative mt-1.5">
                    <Input id="card-number" inputMode="numeric" placeholder="4242 4242 4242 4242" dir="ltr" />
                    <CreditCard
                      className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-ink-mute"
                      aria-hidden
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </fieldset>

          {/* Order review ---------------------------------------------- */}
          <section aria-label={t('checkout.summaryHeading')} className="space-y-4">
            {cart.map((line) => (
              <CartLineCard key={line.lineId} line={line} editable={false} />
            ))}
          </section>
        </div>

        {/* Summary --------------------------------------------------- */}
        <aside className="card-terra p-5 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">{t('checkout.summaryHeading')}</h2>
          <div className="mt-4">
            <OrderTotals showDeliveryProgress={false} />
          </div>
          <Button type="submit" size="lg" className="mt-5 w-full" disabled={placing}>
            {placing ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            {placing ? t('checkout.placing') : t('checkout.placeOrder')}
          </Button>
          <p className="mt-3 text-xs text-ink-mute">{t('checkout.termsNote')}</p>
        </aside>
      </form>
    </div>
  )
}
