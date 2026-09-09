'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus } from 'lucide-react'
import { useI18n } from '@/i18n/provider'
import { CupViewer } from '@/components/three/viewer'
import { Reveal } from '@/components/common/motion'
import { applyColorway, colorways, components, priceOf, product } from '@/data/product'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

/**
 * One product, four tones. The 3D viewer leads; everything else is a short
 * column beside it. A sticky bar carries the price and the button on mobile.
 */
export function ProductPage() {
  const { t, pick, n, price } = useI18n()
  const router = useRouter()

  const config = useStore((s) => s.config)
  const loadConfig = useStore((s) => s.loadConfig)
  const addToCart = useStore((s) => s.addToCart)
  const setSnapshot = useStore((s) => s.setSnapshot)
  const snapshot = useStore((s) => s.snapshot)

  const [quantity, setQuantity] = React.useState(1)
  const [added, setAdded] = React.useState(false)

  const active = colorways.find((c) => c.id === config.colorway) ?? colorways[1]
  const unit = priceOf(config)

  const add = () => {
    addToCart({ config, quantity, snapshot, name: active.name })
    setAdded(true)
    window.setTimeout(() => router.push('/cart'), 450)
  }

  const included = ['shop.included1', 'shop.included2', 'shop.included3', 'shop.included4']

  return (
    <>
      <div className="wrap grid gap-10 pt-28 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:pt-36">
        {/* Viewer */}
        <div className="h-[26rem] sm:h-[34rem] lg:sticky lg:top-28 lg:h-[42rem]">
          <CupViewer config={config} onSnapshot={setSnapshot} />
        </div>

        {/* Detail column */}
        <div className="pb-32 lg:pb-24">
          <Reveal>
            <p className="eyebrow">{t('shop.eyebrow')}</p>
            <h1 className="mt-6 text-title font-light">{pick(product.name)}</h1>
            <p className="passage mt-5 max-w-prose">{pick(product.short)}</p>

            <p className="mt-8 flex items-baseline gap-3">
              <span className="text-2xl font-light tabular-nums">{price(unit)}</span>
              <span className="text-[0.68rem] uppercase tracking-[0.2em] text-ink-mute">
                {pick(product.currency)}
              </span>
            </p>
            <p className="mt-2 text-[0.68rem] uppercase tracking-[0.18em] text-ink-mute">
              {t('shop.madeToOrder')}
            </p>
          </Reveal>

          {/* Tones */}
          <div className="mt-12">
            <p className="eyebrow">{t('colors.eyebrow')}</p>
            <ul className="mt-5 flex flex-wrap gap-4">
              {colorways.map((way) => {
                const selected = config.colorway === way.id
                return (
                  <li key={way.id}>
                    <button
                      type="button"
                      onClick={() => loadConfig(applyColorway(config, way.id))}
                      aria-pressed={selected}
                      aria-label={t('colors.choose', { name: pick(way.name) })}
                      className="tap group flex flex-col items-center gap-2.5"
                    >
                      <span
                        className={cn(
                          'block size-11 rounded-full ring-1 ring-inset ring-black/10 transition-all duration-500 ease-cinema',
                          selected
                            ? 'outline outline-1 outline-offset-[6px] outline-ink/40'
                            : 'group-hover:outline group-hover:outline-1 group-hover:outline-offset-[6px] group-hover:outline-ink/15',
                        )}
                        style={{ background: way.body }}
                      />
                      <span className="text-[0.6rem] uppercase tracking-[0.18em] text-ink-soft">
                        {pick(way.name)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <p className="mt-5 text-sm text-ink-mute" aria-live="polite">
              {pick(active.note)}
            </p>
          </div>

          {/* Quantity + add */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-line">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label={`${t('common.quantity')} −`}
                className="tap grid place-items-center px-4 text-ink-soft hover:text-ink"
              >
                <Minus className="size-3.5" aria-hidden />
              </button>
              <span className="min-w-10 text-center text-sm tabular-nums" aria-live="polite">
                {n(quantity)}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(20, q + 1))}
                aria-label={`${t('common.quantity')} +`}
                className="tap grid place-items-center px-4 text-ink-soft hover:text-ink"
              >
                <Plus className="size-3.5" aria-hidden />
              </button>
            </div>

            <button type="button" onClick={add} className="btn btn-solid tap flex-1 sm:flex-none">
              <span>{added ? t('common.added') : t('common.addToCart')}</span>
            </button>
          </div>

          <Link href="/customize" className="link-draw mt-6 inline-block text-[0.7rem] uppercase tracking-[0.2em] text-ink-soft hover:text-ink">
            {t('common.designYours')}
          </Link>

          {/* Detail lists — hairlines, no cards */}
          <div className="mt-14 space-y-10">
            <section>
              <p className="eyebrow">{t('shop.included')}</p>
              <ul className="mt-4">
                {included.map((key) => (
                  <li key={key} className="border-t border-line py-3 text-sm text-ink-soft">
                    {t(key)}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <p className="eyebrow">{t('shop.specs')}</p>
              <dl className="mt-4">
                {[
                  { label: t('common.capacity'), value: `${n(product.capacityMl)} ml` },
                  { label: t('common.height'), value: `${n(product.heightMm)} mm` },
                  { label: t('common.diameter'), value: `${n(product.diameterMm)} mm` },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between border-t border-line py-3 text-sm">
                    <dt className="text-ink-mute">{row.label}</dt>
                    <dd className="tabular-nums text-ink">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <p className="eyebrow">{t('anatomy.eyebrow')}</p>
              <ul className="mt-4">
                {components.map((part) => (
                  <li key={part.id} className="flex justify-between gap-6 border-t border-line py-3 text-sm">
                    <span className="text-ink">{pick(part.name)}</span>
                    <span className="text-end text-ink-mute">{pick(part.note)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <p className="eyebrow">{t('shop.care')}</p>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{t('shop.careBody')}</p>
              <p className="mt-4 text-[0.68rem] uppercase tracking-[0.18em] text-ink-mute">
                {t('shop.warranty')}
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Sticky add-to-cart, mobile only */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 backdrop-blur-xl lg:hidden">
        <div className="wrap flex items-center gap-4 py-3">
          <span className="text-sm tabular-nums">
            {price(unit * quantity)} <span className="text-ink-mute">{pick(product.currency)}</span>
          </span>
          <button type="button" onClick={add} className="btn btn-solid tap ms-auto flex-1">
            <span>{added ? t('common.added') : t('shop.stickyAdd')}</span>
          </button>
        </div>
      </div>
    </>
  )
}
