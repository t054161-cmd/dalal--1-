'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus } from 'lucide-react'
import { useI18n } from '@/i18n/provider'
import { CupViewer } from '@/components/three/viewer'
import { Reveal } from '@/components/common/motion'
import { Disclosure } from '@/components/common/disclosure'
import { BotanicalBackdrop } from './botanical-backdrop'
import { applyColorway, colorways, priceOf, product } from '@/data/product'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

/**
 * One product, nine tones.
 *
 * The cup is photographed against a botanical set (see BotanicalBackdrop) and
 * everything else is one short column: name, a line, the price, the four
 * tones, a quantity and a button. Specifications, care and materials are
 * folded behind three closed hairlines, because a lifestyle object should not
 * open with a datasheet.
 *
 * A sticky bar carries the price and the button on mobile.
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
        {/* Viewer, standing in the botanical set. The set is blurred and the
            cup is not — the canvas paints above it and stays the one sharp
            object on the page. */}
        <div className="relative h-[26rem] sm:h-[34rem] lg:sticky lg:top-28 lg:h-[42rem]">
          <BotanicalBackdrop />
          <div className="relative h-full">
            {/* Turn, reset, and that is all — zoom stays on scroll and pinch.
                The snapshot and zoom buttons belong in the designer, where a
                customer is making something, not here where they are looking
                at it. */}
            <CupViewer config={config} glow={false} toolbar="minimal" onSnapshot={setSnapshot} />
          </div>
        </div>

        {/* Detail column */}
        <div className="pb-32 lg:pb-24">
          <Reveal>
            <p className="eyebrow">{t('shop.eyebrow')}</p>
            <h1 className="mt-6 text-title font-light">{pick(product.name)}</h1>
            <p className="passage mt-5 max-w-prose">{pick(product.short)}</p>

            <p className="mt-8 flex items-baseline gap-3">
              <span className="text-2xl font-light tabular-nums">{price(unit)}</span>
              <span className="meta text-ink-mute">
                {pick(product.currency)}
              </span>
            </p>
            <p className="meta mt-2 text-ink-mute">{t('shop.madeToOrder')}</p>
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
                      <span className="meta text-ink-soft">
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

          <Link
            href="/customize"
            className="link-draw meta mt-7 inline-block text-ink-soft hover:text-ink"
          >
            {t('common.designYours')}
          </Link>

          {/* Details · Care · Materials — closed until asked for. */}
          <Disclosure
            className="mt-14"
            items={[
              {
                id: 'details',
                label: t('shop.details'),
                children: (
                  <>
                    <ul>
                      {included.map((key) => (
                        <li key={key} className="flex items-baseline gap-3">
                          <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-ink-mute" />
                          {t(key)}
                        </li>
                      ))}
                    </ul>
                    <dl className="mt-6 max-w-xs">
                      {[
                        { label: t('common.capacity'), value: `${n(product.capacityMl)} ml` },
                        { label: t('common.height'), value: `${n(product.heightMm)} mm` },
                        { label: t('common.diameter'), value: `${n(product.diameterMm)} mm` },
                      ].map((row) => (
                        <div key={row.label} className="flex justify-between gap-6 py-1">
                          <dt className="text-ink-mute">{row.label}</dt>
                          <dd className="tabular-nums">{row.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                ),
              },
              {
                id: 'care',
                label: t('shop.care'),
                children: (
                  <>
                    <p>{t('shop.careBody')}</p>
                    <p className="meta mt-4 text-ink-mute">{t('shop.warranty')}</p>
                  </>
                ),
              },
              {
                id: 'materials',
                label: t('shop.materials'),
                children: <p>{t('shop.materialsBody')}</p>,
              },
            ]}
          />
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
