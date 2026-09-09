'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/provider'
import { Magnetic, SplitTitle } from '@/components/common/motion'
import { LeafCanopy } from './leaf-canopy'

/**
 * The opening frame. It starts almost empty; TERRA is written out letter by
 * letter, the line arrives, then one invitation. Nothing else.
 */
export function Hero() {
  const { t } = useI18n()

  return (
    <section className="relative flex h-[100svh] min-h-[34rem] flex-col items-center justify-center overflow-hidden">
      <LeafCanopy />

      <div className="wrap relative z-10 flex flex-col items-center text-center">
        {/* Written, not typeset: the brush lays each letter down in turn and
            the strokes overlap, so the word arrives as one gesture. */}
        {/* No text-shadow here: the brush mask is sized to the glyph box, so a
            glow would be sliced into a rectangle at its edges. The canopy's
            vignette and scrim carry the contrast instead. */}
        <h1 className="brush text-title-xl text-[rgb(246,243,236)]">
          <SplitTitle text={t('common.brand')} delay={420} step={150} />
        </h1>

        <p
          className="passage mt-8 max-w-measure animate-fade-up text-[rgb(246,243,236)]/90"
          style={{ animationDelay: '1750ms' }}
        >
          {t('hero.tagline')}
        </p>

        <div className="mt-12 animate-fade-up" style={{ animationDelay: '2250ms' }}>
          <Magnetic>
            <Link
              href="/shop"
              className="btn tap border-[rgb(246,243,236)]/45 text-[rgb(246,243,236)] hover:border-[rgb(246,243,236)]"
            >
              <span>{t('hero.cta')}</span>
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* Scroll cue: a hairline that breathes. */}
      <div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-fade-in text-center"
        style={{ animationDelay: '3000ms' }}
      >
        <span className="block meta text-[rgb(246,243,236)]/70">
          {t('common.scroll')}
        </span>
        <span
          aria-hidden
          className="mx-auto mt-3 block h-10 w-px animate-pulse-soft bg-[rgb(246,243,236)]/50"
        />
      </div>
    </section>
  )
}
