'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingBag, Trash2, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Mug2D } from '@/components/mug3d/mug-2d'
import { Price } from '@/components/common/price'
import { PageHeader } from '@/components/home/section-heading'
import { useI18n } from '@/i18n/provider'
import { useStore } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { priceOf } from '@/data/product'

export function WishlistContent() {
  const { t, pick } = useI18n()
  const router = useRouter()
  const hydrated = useHydrated()
  const wishlist = useStore((s) => s.wishlist)
  const toggleWishlist = useStore((s) => s.toggleWishlist)
  const addToCart = useStore((s) => s.addToCart)
  const loadDesign = useStore((s) => s.loadDesign)

  return (
    <>
      <PageHeader headingKey="wishlist.heading" />

      <div className="container-terra pb-16">
        {!hydrated ? (
          <div className="h-40 animate-soft-pulse rounded-3xl bg-surface-sunken" />
        ) : wishlist.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line p-10 text-center">
            <Heart className="mx-auto size-10 text-stone" aria-hidden />
            <p className="mt-4 text-lg font-semibold">{t('wishlist.empty')}</p>
            <p className="mt-1 text-ink-mute">{t('wishlist.emptyBody')}</p>
            <Button asChild className="mt-6">
              <Link href="/shop">{t('wishlist.emptyCta')}</Link>
            </Button>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => (
              <li key={item.id} className="card-terra flex flex-col">
                <div className="grid h-52 place-items-center bg-surface-sunken">
                  <Mug2D design={item.design} className="h-44 w-auto" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-semibold" dir="auto">
                    {item.name ? pick(item.name) : t('common.yourDesign')}
                  </h2>
                  <Price value={priceOf(item.design)} className="mt-2 font-semibold" />
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        addToCart({ design: item.design, designName: item.name })
                        router.push('/cart')
                      }}
                    >
                      <ShoppingBag className="size-4" aria-hidden />
                      {t('wishlist.moveToCart')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        loadDesign(item.design)
                        router.push('/customize')
                      }}
                    >
                      <Wand2 className="size-4" aria-hidden />
                      {t('common.customizeThisOne')}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleWishlist(item)}
                      aria-label={t('common.remove')}
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
