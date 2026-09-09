'use client'

import * as React from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/provider'
import { CupViewer } from '@/components/three/viewer'
import { Reveal } from '@/components/common/motion'
import { applyColorway, colorways } from '@/data/product'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

/**
 * The range. Four circular selectors; the cup changes as you choose, and the
 * choice follows you into the designer.
 */
export function Tones() {
  const { t, pick } = useI18n()
  const config = useStore((s) => s.config)
  const loadConfig = useStore((s) => s.loadConfig)

  const active = colorways.find((c) => c.id === config.colorway) ?? colorways[1]

  return (
    <section className="band border-y border-line bg-raised">
      <div className="wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal>
          <p className="eyebrow">{t('colors.eyebrow')}</p>
          <h2 className="mt-7 text-title font-light">{t('colors.heading')}</h2>
          <p className="passage mt-7 max-w-prose">{t('colors.body')}</p>

          <ul className="mt-11 flex flex-wrap gap-3">
            {colorways.map((way) => {
              const selected = config.colorway === way.id
              return (
                <li key={way.id}>
                  <button
                    type="button"
                    onClick={() => loadConfig(applyColorway(config, way.id))}
                    aria-pressed={selected}
                    aria-label={t('colors.choose', { name: pick(way.name) })}
                    className={cn(
                      'tap group flex flex-col items-center gap-3 px-2 pb-1 pt-2 transition-opacity duration-500',
                      selected ? 'opacity-100' : 'opacity-70 hover:opacity-100',
                    )}
                  >
                    <span
                      className={cn(
                        'block size-12 rounded-full ring-1 ring-inset ring-black/10 transition-all duration-500 ease-cinema',
                        selected
                          ? 'scale-100 ring-offset-4 ring-offset-raised outline outline-1 outline-offset-[6px] outline-ink/35'
                          : 'scale-95 group-hover:scale-100',
                      )}
                      style={{ background: way.body }}
                    />
                    <span className="meta text-ink-soft">
                      {pick(way.name)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <p className="mt-8 max-w-measure text-sm text-ink-mute" aria-live="polite">
            {pick(active.note)}
          </p>

          <Link href="/customize" className="btn tap mt-10">
            <span>{t('common.designYours')}</span>
          </Link>
        </Reveal>

        <div className="h-[26rem] sm:h-[32rem] lg:h-[38rem]">
          <CupViewer config={config} toolbar="minimal" />
        </div>
      </div>
    </section>
  )
}
