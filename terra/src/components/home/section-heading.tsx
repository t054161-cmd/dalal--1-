'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useT } from '@/i18n/provider'
import { cn } from '@/lib/utils'

/**
 * Eyebrow + heading + optional body and CTA. A client component so that
 * server-rendered pages can still pull their copy from the i18n dictionary.
 */
export function SectionHeading({
  eyebrowKey,
  headingKey,
  bodyKey,
  ctaKey,
  ctaHref,
  className,
  size = 'md',
}: {
  eyebrowKey?: string
  headingKey: string
  bodyKey?: string
  ctaKey?: string
  ctaHref?: string
  className?: string
  size?: 'md' | 'lg'
}) {
  const t = useT()
  return (
    <div className={cn(className)}>
      {eyebrowKey ? <p className="eyebrow">{t(eyebrowKey)}</p> : null}
      <h2 className={cn('mt-3', size === 'lg' ? 'text-display' : 'text-display-sm')}>
        {t(headingKey)}
      </h2>
      {bodyKey ? <p className="mt-3 max-w-prose text-ink-soft">{t(bodyKey)}</p> : null}
      {ctaKey && ctaHref ? (
        <Button asChild variant="outline" className="mt-5">
          <Link href={ctaHref}>
            {t(ctaKey)}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </Link>
        </Button>
      ) : null}
    </div>
  )
}

/** Page-level hero heading used by the secondary pages. */
export function PageHeader({
  eyebrowKey,
  headingKey,
  bodyKey,
  className,
}: {
  eyebrowKey?: string
  headingKey: string
  bodyKey?: string
  className?: string
}) {
  const t = useT()
  return (
    <header className={cn('container-terra pb-6 pt-10 sm:pt-14', className)}>
      {eyebrowKey ? <p className="eyebrow">{t(eyebrowKey)}</p> : null}
      <h1 className="mt-3 text-display text-balance">{t(headingKey)}</h1>
      {bodyKey ? (
        <p className="mt-4 max-w-prose text-lg leading-relaxed text-ink-soft">{t(bodyKey)}</p>
      ) : null}
    </header>
  )
}
