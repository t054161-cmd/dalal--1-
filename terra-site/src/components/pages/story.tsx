'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useI18n } from '@/i18n/provider'
import { Parallax, Reveal } from '@/components/common/motion'
import { Packaging } from '@/components/sections/story-blocks'

/**
 * OUR STORY — the name, the reason, the promise. Long-form, set as an
 * editorial spread: one narrow column of type with air around it.
 */
export function Story() {
  const { t } = useI18n()

  return (
    <article className="pb-24 pt-28 lg:pt-36">
      <header className="wrap">
        <Reveal>
          <p className="eyebrow">{t('story.eyebrow')}</p>
          <h1 className="mt-7 max-w-3xl text-title-lg font-light">{t('story.heading')}</h1>
        </Reveal>
      </header>

      {/* The name, given room. */}
      <section className="wrap mt-16 border-y border-line py-16 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <p
              className="font-display text-[clamp(4rem,13vw,9rem)] font-extralight leading-[0.85] tracking-[0.02em] text-ink"
              lang="la"
            >
              terra
            </p>
            <p className="mt-6 text-[0.66rem] uppercase tracking-[0.28em] text-ink-mute">
              earth · land · soil
            </p>
          </Reveal>
          <Reveal delay={140}>
            <p className="passage max-w-prose text-[clamp(1.25rem,2.4vw,1.7rem)] leading-[1.55]">
              {t('story.intro')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why we started. */}
      <section className="wrap mt-20 lg:mt-28">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="max-w-prose space-y-6">
            <p className="passage">{t('story.p1')}</p>
            <p className="passage">{t('story.p2')}</p>
          </Reveal>
          <Reveal delay={120}>
            <Parallax amount={30}>
              <Image
                src="/images/story/story-studio-bench-shuwaikh.svg"
                alt="The TERRA studio bench in Shuwaikh: bodies waiting for their lids, beside a stack of unbleached cartons"
                width={1400}
                height={900}
                className="w-full"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </Parallax>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-14 lg:grid-cols-2 lg:gap-20">
          <Reveal className="max-w-prose space-y-6">
            <p className="passage">{t('story.p3')}</p>
            <p className="passage">{t('story.p4')}</p>
            <p className="text-[0.7rem] uppercase tracking-[0.24em] text-ink-mute">
              {t('story.signature')}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Image
              src="/images/story/story-four-tones-lined-up.svg"
              alt="The four TERRA tones in a row: Linen, Sage, Sandi and Forest"
              width={1400}
              height={700}
              className="w-full"
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </Reveal>
        </div>
      </section>

      {/* Packaging — the same story, in the same words as the home page. */}
      <Packaging />

      {/* The promise. */}
      <section className="wrap border-t border-line pt-16">
        <Reveal>
          <p className="eyebrow">{t('story.promiseHeading')}</p>
        </Reveal>
        <ul className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-3">
          {[
            { title: 'story.promise1', body: 'story.promise1Body' },
            { title: 'story.promise2', body: 'story.promise2Body' },
            { title: 'story.promise3', body: 'story.promise3Body' },
          ].map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 110}>
              <h2 className="text-[0.78rem] uppercase tracking-[0.2em] text-ink">{t(item.title)}</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">{t(item.body)}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-16 flex flex-wrap gap-3">
          <Link href="/shop" className="btn btn-solid tap">
            <span>{t('common.shopTerra')}</span>
          </Link>
          <Link href="/customize" className="btn tap">
            <span>{t('common.designYours')}</span>
          </Link>
        </Reveal>
      </section>
    </article>
  )
}
