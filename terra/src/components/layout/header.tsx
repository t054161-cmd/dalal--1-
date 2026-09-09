'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Languages, Menu, Moon, ShoppingBag, Sparkles, Sun, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useI18n } from '@/i18n/provider'
import { cartCount, useStore } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { tierFor } from '@/data/loyalty'
import { cn } from '@/lib/utils'
import { useTheme } from './providers'
import { LeafMark } from '@/components/common/dividers'

const NAV = [
  { href: '/customize', key: 'nav.customize' },
  { href: '/cup-of-the-day', key: 'nav.cupOfTheDay' },
  { href: '/shop', key: 'nav.shop' },
  { href: '/impact', key: 'nav.impact' },
  { href: '/gifts', key: 'nav.gifts' },
  { href: '/rewards', key: 'nav.rewards' },
  { href: '/about', key: 'nav.about' },
]

export function Header() {
  const { t, locale, setLocale, pick } = useI18n()
  const { theme, toggle } = useTheme()
  const pathname = usePathname()
  const hydrated = useHydrated()
  const [open, setOpen] = React.useState(false)

  const cart = useStore((s) => s.cart)
  const wishlist = useStore((s) => s.wishlist)
  const points = useStore((s) => s.points)
  const member = useStore((s) => s.member)
  const count = hydrated ? cartCount(cart) : 0
  const tier = tierFor(points)

  // Close the mobile sheet whenever the route changes.
  React.useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <a href="#main" className="skip-link">
        {t('common.skipToContent')}
      </a>

      {/* Announcement bar */}
      <div className="surface-moss text-center text-xs">
        <p className="container-terra py-2 leading-relaxed">{t('header.announce')}</p>
      </div>

      <header className="sticky top-0 z-40 border-b border-line/70 bg-surface/85 backdrop-blur-md">
        <div className="container-terra flex h-16 items-center gap-3">
          {/* Brand */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 rounded-lg text-lg font-semibold tracking-tight"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-accent text-accent-ink">
              <LeafMark className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-bold tracking-[0.14em]">TERRA</span>
              <span className="mt-0.5 hidden text-[0.6rem] font-medium tracking-wide text-ink-mute sm:block">
                {t('common.tagline')}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label={t('nav.menu')} className="mx-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => {
                const active = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-surface-sunken',
                        active ? 'bg-surface-sunken text-accent' : 'text-ink-soft',
                      )}
                      aria-current={active ? 'page' : undefined}
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="ms-auto flex items-center gap-1 lg:ms-0">
            {/* Language */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
              aria-label={locale === 'ar' ? t('header.switchToEnglish') : t('header.switchToArabic')}
              title={t('header.switchLanguage')}
              className="tap gap-1.5 px-2 text-xs font-semibold"
            >
              <Languages className="size-4" aria-hidden />
              <span aria-hidden>{locale === 'ar' ? 'EN' : 'ع'}</span>
            </Button>

            {/* Theme */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              aria-label={theme === 'dark' ? t('header.toLight') : t('header.toDark')}
            >
              {theme === 'dark' ? (
                <Sun className="size-4" aria-hidden />
              ) : (
                <Moon className="size-4" aria-hidden />
              )}
            </Button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="tap relative hidden items-center justify-center rounded-full px-2 text-ink-soft transition-colors hover:bg-surface-sunken sm:flex"
              aria-label={t('nav.wishlist')}
            >
              <Heart className="size-4" aria-hidden />
              {hydrated && wishlist.length > 0 ? (
                <span className="absolute -end-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-sage text-[0.6rem] font-bold text-white">
                  {wishlist.length}
                </span>
              ) : null}
            </Link>

            {/* Points chip */}
            {hydrated && member ? (
              <Link
                href="/rewards"
                className="hidden items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft transition-colors hover:bg-surface-sunken md:flex"
                aria-label={t('loyalty.yourPoints')}
              >
                <Sparkles className="size-3.5" style={{ color: tier.current.hex }} aria-hidden />
                {points} · {pick(tier.current.name)}
              </Link>
            ) : null}

            {/* Cart */}
            <Link
              href="/cart"
              className="tap relative flex items-center justify-center rounded-full px-2 text-ink transition-colors hover:bg-surface-sunken"
              aria-label={t('header.cartCount', { count })}
            >
              <ShoppingBag className="size-5" aria-hidden />
              {count > 0 ? (
                <span className="absolute -end-1 -top-1 grid min-w-5 place-items-center rounded-full bg-accent px-1 text-[0.65rem] font-bold text-accent-ink">
                  {count}
                </span>
              ) : null}
            </Link>

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </Button>
          </div>
        </div>

        {/* Mobile nav sheet */}
        <div
          id="mobile-nav"
          hidden={!open}
          className="border-t border-line bg-surface-raised lg:hidden"
        >
          <nav aria-label={t('nav.menu')} className="container-terra py-3">
            <ul className="grid gap-1">
              {[...NAV, { href: '/gallery', key: 'nav.gallery' }, { href: '/faq', key: 'nav.faq' }, { href: '/contact', key: 'nav.contact' }, { href: '/track', key: 'nav.track' }].map(
                (item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="tap flex items-center rounded-xl px-3 text-base font-medium text-ink-soft hover:bg-surface-sunken"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  )
}
