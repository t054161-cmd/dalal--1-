'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'
import { useI18n } from '@/i18n/provider'
import { Reveal } from '@/components/common/motion'
import { CupViewer } from '@/components/three/viewer'
import { useStore } from '@/lib/store'

/**
 * The designer, introduced on the home page: one prompt box. Typing here and
 * pressing return carries the sentence straight into /customize, which runs it.
 */
export function DesignerTeaser() {
  const { t } = useI18n()
  const router = useRouter()
  const config = useStore((s) => s.config)
  const [prompt, setPrompt] = React.useState('')

  const suggestions = ['designer.try1', 'designer.try2', 'designer.try3', 'designer.try4']

  const go = (text: string) => {
    const value = text.trim()
    router.push(value ? `/customize?ask=${encodeURIComponent(value)}` : '/customize')
  }

  return (
    <section className="band wrap grid items-center gap-14 lg:grid-cols-[1fr_0.85fr] lg:gap-20">
      <Reveal>
        <p className="eyebrow">{t('designer.eyebrow')}</p>
        <h2 className="mt-7 text-title font-light">{t('designer.heading')}</h2>
        <p className="passage mt-7 max-w-prose">{t('designer.body')}</p>

        <form
          className="mt-10"
          onSubmit={(event) => {
            event.preventDefault()
            go(prompt)
          }}
        >
          <label htmlFor="teaser-prompt" className="eyebrow">
            {t('designer.inputLabel')}
          </label>
          <div className="mt-4 flex items-end gap-4 border-b border-ink/25 pb-3 transition-colors focus-within:border-ink">
            <input
              id="teaser-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder={t('designer.placeholder')}
              dir="auto"
              className="tap w-full bg-transparent text-base text-ink placeholder:text-ink-mute/70 focus:outline-none"
            />
            <button
              type="submit"
              aria-label={t('designer.generate')}
              className="tap shrink-0 text-ink-soft transition-colors hover:text-ink"
            >
              <ArrowRight className="size-5 flip-rtl" aria-hidden />
            </button>
          </div>
        </form>

        <ul className="mt-6 flex flex-wrap gap-2">
          {suggestions.map((key) => (
            <li key={key}>
              <button
                type="button"
                onClick={() => go(t(key))}
                dir="auto"
                className="tap border border-line px-4 py-2 text-start text-[0.68rem] text-ink-soft transition-colors duration-500 ease-cinema hover:border-ink/40 hover:text-ink"
              >
                {t(key)}
              </button>
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="h-[24rem] sm:h-[30rem] lg:h-[34rem]">
        <CupViewer config={config} toolbar="minimal" />
      </div>
    </section>
  )
}
