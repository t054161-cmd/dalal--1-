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

/**
 * The echo sits in whichever script the reader is *not* reading in, which
 * means its face and its size both have to flip. Ruq'ah needs noticeably more
 * size than a tracked line of Latin caps to be read at all, so the two are
 * never set at the same nominal size.
 */
function useEcho(scale: 'block' | 'line') {
  const { locale } = useI18n()
  if (locale === 'ar') {
    // The echo is English: tracked Audrey caps.
    return scale === 'block'
      ? 'font-display uppercase tracking-[0.24em] text-[0.95rem]'
      : 'font-display uppercase tracking-[0.2em] text-[0.8rem]'
  }
  // The echo is the Arabic phrase, and it is a key phrase — so, Ruq'ah.
  return scale === 'block' ? 'font-arabic text-[1.6rem] leading-snug' : 'font-arabic text-[1.2rem] leading-snug'
}

/** The full statement: the eyebrow gloss, the written line, the echo. */
export function Philosophy({ className }: { className?: string }) {
  const { t } = useI18n()
  const echo = useEcho('block')

  return (
    <div className={className}>
      <p className="eyebrow">{t('brand.latin')}</p>

      <BrushTitle
        as="h2"
        className="brush mt-7 text-title-lg text-ink"
        text={t('brand.philosophy')}
        step={210}
      />

      {/* dir="auto" belongs on the run, not the block: on the block it would
          turn the whole paragraph RTL and push the echo to the far edge. */}
      <p className={cn('mt-4 text-ink-mute', echo)} aria-hidden>
        <span dir="auto">{t('brand.philosophyEcho')}</span>
      </p>

      {/* And what it means, in one sentence. This is the only explanation the
          brand gives anywhere; the story page says the same thing at slightly
          greater length and nothing else repeats it. */}
      <p className="passage mt-6 max-w-prose">{t('brand.plain')}</p>
    </div>
  )
}

/**
 * One line of it, for the footer and the foot of the story: the philosophy as
 * a signature rather than a headline.
 */
export function PhilosophyLine({ className }: { className?: string }) {
  const { t } = useI18n()
  const echo = useEcho('line')

  return (
    <p className={cn('flex flex-wrap items-baseline gap-x-4 gap-y-1', className)}>
      <span className="brush text-[1.35rem] leading-snug text-ink">{t('brand.philosophy')}</span>
      <span dir="auto" className={cn('text-ink-mute', echo)} aria-hidden>
        {t('brand.philosophyEcho')}
      </span>
    </p>
  )
}
