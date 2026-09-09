'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Moon, Sun } from 'lucide-react'
import { useI18n } from '@/i18n/provider'
import { cartCount, useStore } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import { useTheme } from './providers'

const LINKS = [
  { href: '/', key: 'nav.home' },
  { href: '/shop', key: 'nav.shop' },
  { href: '/customize', key: 'nav.customize' },
  { href: '/story', key: 'nav.story' },
]

/**
 * Five destinations, nothing more. Transparent over the hero, then it settles
 * onto a hairline as soon as the page moves.
 */
export function Nav() {
  const { t, locale, setLocale } = useI18n()
  const { theme, toggle } = useTheme()
  const pathname = usePathname()
  const hydrated = useHydrated()
  const cart = useStore((s) => s.cart)
  const count = hydrated ? cartCount(cart) : 0

  const [settled, setSettled] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  // The hero owns the top of the home page; elsewhere the bar is settled from
  // the first frame so the links are always legible.
  const overHero = pathname === '/'

  React.useEffect(() => {
    if (!overHero) {
      setSettled(true)
      return
    }
    const onScroll = () => setSettled(window.scrollY > window.innerHeight * 0.7)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [overHero])

  React.useEffect(() => setOpen(false), [pathname])

  // Lock the page while the mobile sheet is open.
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <a href="#main" className="skip">
        {t('common.skipToContent')}
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-cinema',
          settled
            ? 'border-b border-line/70 bg-surface/85 text-ink backdrop-blur-xl'
            : 'border-b border-transparent text-[rgb(246,243,236)]',
        )}
      >
        {/* Over the hero the bar is transparent, so a soft scrim keeps the
            links legible against whatever the canopy is doing. */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-28 transition-opacity duration-700',
            settled ? 'opacity-0' : 'opacity-100',
          )}
          style={{ background: 'linear-gradient(to bottom, rgb(35 44 36 / 0.42), transparent)' }}
        />
        <div className="wrap relative flex h-[4.5rem] items-center gap-6">
          <Link href="/" className="wordmark shrink-0 text-[0.95rem] leading-none">
            TERRA
          </Link>

          <nav aria-label={t('nav.menu')} className="mx-auto hidden md:block">
            <ul className="flex items-center gap-9">
              {LINKS.map((link) => {
                const active = pathname === link.href
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      data-active={active}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'link-draw text-[0.7rem] uppercase tracking-[0.22em] transition-colors',
                        settled ? 'text-ink-soft hover:text-ink' : 'text-current/85 hover:text-current',
                      )}
                    >
                      {t(link.key)}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="ms-auto flex items-center gap-1 md:ms-0">
            <button
              type="button"
              onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}
              aria-label={locale === 'ar' ? t('nav.toEnglish') : t('nav.toArabic')}
              className={cn(
                'tap px-2 text-[0.7rem] uppercase tracking-[0.18em] transition-colors',
                settled ? 'text-ink-soft hover:text-ink' : 'text-current/85 hover:text-current',
              )}
            >
              {locale === 'ar' ? 'EN' : 'ع'}
            </button>

            <button
              type="button"
              onClick={toggle}
              aria-label={theme === 'dark' ? t('nav.toLight') : t('nav.toDark')}
              className={cn(
                'tap grid place-items-center px-2 transition-colors',
                settled ? 'text-ink-soft hover:text-ink' : 'text-current/85 hover:text-current',
              )}
            >
              {theme === 'dark' ? <Sun className="size-4" aria-hidden /> : <Moon className="size-4" aria-hidden />}
            </button>

            <Link
              href="/cart"
              aria-label={t('nav.cartCount', { count })}
              className={cn(
                'tap flex items-center gap-1.5 px-2 text-[0.7rem] uppercase tracking-[0.22em] transition-colors',
                settled ? 'text-ink-soft hover:text-ink' : 'text-current/85 hover:text-current',
              )}
            >
              <span>{t('nav.cart')}</span>
              <span className="tabular-nums">({count})</span>
            </Link>

            {/* Mobile menu trigger — two hairlines, not a hamburger cliché. */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t('nav.closeMenu') : t('nav.openMenu')}
              className="tap relative grid place-items-center px-2 md:hidden"
            >
              <span
                aria-hidden
                className={cn(
                  'block h-px w-6 bg-current transition-transform duration-500 ease-cinema',
                  open ? 'translate-y-[3px] rotate-45' : '-translate-y-[3px]',
                )}
              />
              <span
                aria-hidden
                className={cn(
                  'absolute block h-px w-6 bg-current transition-transform duration-500 ease-cinema',
                  open ? 'translate-y-[3px] -rotate-45' : 'translate-y-[3px]',
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet: full screen, quiet, one column of large type. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 bg-surface/98 backdrop-blur-xl md:hidden"
      >
        <nav aria-label={t('nav.menu')} className="wrap flex h-full flex-col justify-center">
          <ul className="space-y-6">
            {LINKS.map((link, i) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block font-display text-[2rem] font-light tracking-[0.06em] text-ink"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  {t(link.key)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/cart" className="block font-display text-[2rem] font-light tracking-[0.06em] text-ink">
                {t('nav.cart')} ({count})
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
}
