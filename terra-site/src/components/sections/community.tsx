'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/provider'
import { Reveal } from '@/components/common/motion'
import { Tumbler2D } from '@/components/three/tumbler-2d'
import { community, reviews } from '@/data/content'
import { useStore } from '@/lib/store'

/**
 * THE TERRA COMMUNITY — designs people made, and four short reviews set as
 * pull quotes rather than blocks of text.
 */
export function Community() {
  const { t, pick, n } = useI18n()
  const router = useRouter()
  const loadConfig = useStore((s) => s.loadConfig)

  return (
    <section className="band border-t border-line bg-raised">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">{t('community.eyebrow')}</p>
          <div className="mt-7 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
            <h2 className="text-title font-light">{t('community.heading')}</h2>
            <p className="passage max-w-measure md:pb-2">{t('community.body')}</p>
          </div>
        </Reveal>

        {/* Designs — a horizontal reel on small screens, a row on large. */}
        <ul className="mt-14 flex snap-x gap-6 overflow-x-auto pb-4 no-scrollbar lg:grid lg:grid-cols-6 lg:overflow-visible">
          {community.map((entry, index) => (
            <Reveal
              as="li"
              key={entry.id}
              delay={(index % 3) * 90}
              className="w-[13rem] shrink-0 snap-start lg:w-auto"
            >
              <button
                type="button"
                onClick={() => {
                  loadConfig(entry.config)
                  router.push('/customize')
                }}
                className="group block w-full text-start"
              >
                <span className="block bg-sunken px-4 py-6 transition-colors duration-700 group-hover:bg-sunken/60">
                  <Tumbler2D config={entry.config} className="mx-auto h-48 w-auto" />
                </span>
                <span className="mt-4 block border-t border-line pt-3">
                  <span className="block meta text-ink">
                    {t('community.by', { name: pick(entry.author) })}
                  </span>
                  <span className="mt-1 block text-sm leading-snug text-ink-mute" dir="auto">
                    {pick(entry.caption)}
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-10">
          <Link href="/customize" className="btn tap">
            <span>{t('community.cta')}</span>
          </Link>
        </Reveal>

        {/* Reviews */}
        <div className="mt-24 border-t border-line pt-14">
          <Reveal>
            <p className="eyebrow">{t('community.reviewsHeading')}</p>
          </Reveal>
          <ul className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {reviews.map((review, index) => (
              <Reveal as="li" key={review.id} delay={(index % 2) * 110}>
                <blockquote>
                  <p className="passage" dir="auto">
                    “{pick(review.quote)}”
                  </p>
                  <footer className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 meta text-ink-mute">
                    <cite className="not-italic text-ink">{pick(review.author)}</cite>
                    <span>{pick(review.tone)}</span>
                    <span>{t('community.monthsIn', { count: n(review.months) })}</span>
                    <span>{t('community.verified')}</span>
                  </footer>
                </blockquote>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
