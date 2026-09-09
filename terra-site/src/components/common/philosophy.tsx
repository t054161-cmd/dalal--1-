'use client'

import { useI18n } from '@/i18n/provider'
import { BrushTitle } from '@/components/common/motion'
import { cn } from '@/lib/utils'

/**
 * ============================================================================
 * FROM EARTH, BACK TO EARTH
 * ============================================================================
 * The reason for the name, and the only place the site explains itself — which
 * it does in six words, written by hand, with the same thought echoed in the
 * other language underneath. No paragraph, no history, no manifesto: a brand
 * statement is typography and air, not an article.
 * ============================================================================
 */

/** The echo sits in whichever script the reader is *not* reading in. */
function useEchoFont() {
  const { locale } = useI18n()
  return locale === 'ar' ? 'font-display tracking-[0.24em] uppercase' : 'font-arabic'
}

/** The full statement: the eyebrow gloss, the written line, the echo. */
export function Philosophy({ className }: { className?: string }) {
  const { t } = useI18n()
  const echoFont = useEchoFont()

  return (
    <div className={className}>
      <p className="eyebrow">{t('brand.latin')}</p>

      <BrushTitle
        as="h2"
        className="brush mt-7 text-title-lg text-ink"
        text={t('brand.philosophy')}
        step={62}
      />

      {/* dir="auto" belongs on the run, not the block: on the block it would
          turn the whole paragraph RTL and push the echo to the far edge. */}
      <p className={cn('mt-5 text-[1.15rem] text-ink-mute', echoFont)} aria-hidden>
        <span dir="auto">{t('brand.philosophyEcho')}</span>
      </p>
    </div>
  )
}

/**
 * One line of it, for the footer and the foot of the story: the philosophy as
 * a signature rather than a headline.
 */
export function PhilosophyLine({ className }: { className?: string }) {
  const { t } = useI18n()
  const echoFont = useEchoFont()

  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-4 gap-y-1', className)}>
      <span className="brush text-[1.35rem] leading-snug text-ink">{t('brand.philosophy')}</span>
      <span dir="auto" className={cn('text-[0.95rem] text-ink-mute', echoFont)} aria-hidden>
        {t('brand.philosophyEcho')}
      </span>
    </p>
  )
}
