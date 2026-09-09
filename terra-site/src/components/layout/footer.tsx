'use client'

import * as React from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/provider'
import { PhilosophyLine } from '@/components/common/philosophy'

export function Footer() {
  const { t } = useI18n()
  const [subscribed, setSubscribed] = React.useState(false)

  return (
    <footer className="mt-24 border-t border-line">
      <div className="wrap grid gap-14 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:gap-10">
        <div>
          <p className="wordmark text-[0.9rem]">TERRA</p>
          {/* The philosophy signs the site off — it is the footer's only line. */}
          <PhilosophyLine className="mt-6" />

          <form
            className="mt-9 max-w-sm"
            onSubmit={(event) => {
              event.preventDefault()
              setSubscribed(true)
            }}
          >
            <label htmlFor="footer-email" className="eyebrow">
              {t('footer.newsletter')}
            </label>
            <p className="mt-2 text-sm text-ink-mute">{t('footer.newsletterBody')}</p>
            {subscribed ? (
              <p className="mt-4 text-sm text-ink" role="status">
                {t('footer.subscribed')}
              </p>
            ) : (
              <div className="mt-4 flex items-end gap-3 border-b border-line pb-2">
                <input
                  id="footer-email"
                  type="email"
                  required
                  placeholder={t('common.emailPlaceholder')}
                  className="tap w-full bg-transparent text-sm text-ink placeholder:text-ink-mute/70 focus:outline-none"
                />
                <button type="submit" className="shrink-0 py-2 meta text-ink-soft hover:text-ink">
                  {t('footer.subscribe')}
                </button>
              </div>
            )}
          </form>
        </div>

        <nav aria-label={t('footer.shop')}>
          <p className="eyebrow">{t('footer.shop')}</p>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { href: '/shop', key: 'nav.shop' },
              { href: '/customize', key: 'nav.customize' },
              { href: '/cart', key: 'nav.cart' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-draw text-ink-soft hover:text-ink">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t('footer.about')}>
          <p className="eyebrow">{t('footer.about')}</p>
          <ul className="mt-5 space-y-3 text-sm">
            <li>
              <Link href="/story" className="link-draw text-ink-soft hover:text-ink">
                {t('nav.story')}
              </Link>
            </li>
            <li>
              <a href="mailto:hello@terra.example" className="link-draw text-ink-soft hover:text-ink">
                {t('footer.contact')}
              </a>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer noopener"
                className="link-draw text-ink-soft hover:text-ink"
                aria-label={`${t('footer.social', { network: 'Instagram' })} — ${t('a11y.external')}`}
              >
                Instagram
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="wrap flex flex-col gap-2 border-t border-line py-6 meta text-ink-mute sm:flex-row sm:items-center sm:justify-between">
        <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
        <p>Shuwaikh · Kuwait</p>
      </div>
    </footer>
  )
}
