'use client'

import * as React from 'react'
import Link from 'next/link'
import { Instagram, Mail, MapPin, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/i18n/provider'
import { LeafMark } from '@/components/common/dividers'

const SHOP_LINKS = [
  { href: '/customize', key: 'nav.customize' },
  { href: '/shop', key: 'nav.shop' },
  { href: '/cup-of-the-day', key: 'nav.cupOfTheDay' },
  { href: '/gifts', key: 'nav.gifts' },
  { href: '/subscribe', key: 'nav.subscribe' },
]

const HELP_LINKS = [
  { href: '/faq', key: 'nav.faq' },
  { href: '/policies', key: 'nav.policies' },
  { href: '/track', key: 'nav.track' },
  { href: '/contact', key: 'nav.contact' },
  { href: '/rewards', key: 'nav.rewards' },
]

const COMPANY_LINKS = [
  { href: '/about', key: 'nav.about' },
  { href: '/impact', key: 'nav.impact' },
  { href: '/takeback', key: 'nav.takeBack' },
  { href: '/gallery', key: 'nav.gallery' },
]

export function Footer() {
  const { t } = useI18n()
  const [subscribed, setSubscribed] = React.useState(false)

  return (
    <footer className="surface-moss mt-16">
      <div className="container-terra grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        {/* Brand + newsletter */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-sand/25">
              <LeafMark className="size-5 text-sand" />
            </span>
            <span className="text-lg font-bold tracking-[0.14em]">TERRA</span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/80">{t('footer.blurb')}</p>

          <div className="mt-6 max-w-sm">
            <h3 className="text-sm font-semibold">{t('footer.newsletterHeading')}</h3>
            <p className="mt-1 text-xs text-cream/70">{t('footer.newsletterBody')}</p>
            {subscribed ? (
              <p className="mt-3 rounded-xl bg-sand/20 px-3 py-2 text-sm" role="status">
                {t('footer.subscribed')}
              </p>
            ) : (
              <form
                className="mt-3 flex gap-2"
                onSubmit={(event) => {
                  event.preventDefault()
                  setSubscribed(true)
                }}
              >
                <Label htmlFor="footer-email" className="sr-only">
                  {t('common.email')}
                </Label>
                <Input
                  id="footer-email"
                  type="email"
                  required
                  placeholder={t('common.emailPlaceholder')}
                  className="border-cream/25 bg-cream/10 text-cream placeholder:text-cream/50"
                />
                <Button type="submit" variant="quiet" size="md" className="shrink-0">
                  <Send className="size-4 rtl:-scale-x-100" aria-hidden />
                  <span className="sr-only sm:not-sr-only">{t('footer.subscribe')}</span>
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Link columns */}
        {[
          { heading: 'footer.shopHeading', links: SHOP_LINKS },
          { heading: 'footer.helpHeading', links: HELP_LINKS },
          { heading: 'footer.companyHeading', links: COMPANY_LINKS },
        ].map((column) => (
          <nav key={column.heading} aria-label={t(column.heading)}>
            <h3 className="text-sm font-semibold">{t(column.heading)}</h3>
            <ul className="mt-3 space-y-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded text-sm text-cream/75 transition-colors hover:text-cream"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-cream/15">
        <div className="container-terra flex flex-col gap-3 py-5 text-xs text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5" aria-hidden />
              {t('contact.address')}
            </span>
            <a
              href="mailto:hello@terra.example"
              className="flex items-center gap-1.5 rounded hover:text-cream"
            >
              <Mail className="size-3.5" aria-hidden />
              hello@terra.example
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded hover:text-cream"
              aria-label={`${t('footer.social', { network: 'Instagram' })} — ${t('a11y.externalLink')}`}
            >
              <Instagram className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
