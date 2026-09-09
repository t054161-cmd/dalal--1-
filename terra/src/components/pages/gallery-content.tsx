'use client'

import * as React from 'react'
import Link from 'next/link'
import { Heart, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mug2D } from '@/components/mug3d/mug-2d'
import { PageHeader } from '@/components/home/section-heading'
import { useI18n } from '@/i18n/provider'
import { galleryEntries } from '@/data/content'
import { defaultDesign } from '@/data/product'
import { useStore } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { cn } from '@/lib/utils'
import type { DesignConfig } from '@/types/design'

export function GalleryContent() {
  const { t, pick, n } = useI18n()
  const hydrated = useHydrated()
  const [sort, setSort] = React.useState<'votes' | 'new'>('votes')

  const votes = useStore((s) => s.votes)
  const toggleVote = useStore((s) => s.toggleVote)
  const loadDesign = useStore((s) => s.loadDesign)

  const entries = [...galleryEntries].sort((a, b) =>
    sort === 'votes' ? b.votes - a.votes : b.submittedAt.localeCompare(a.submittedAt),
  )

  return (
    <>
      <PageHeader eyebrowKey="gallery.eyebrow" headingKey="gallery.heading" bodyKey="gallery.intro" />

      <div className="container-terra pb-16">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-ink-mute">{t('gallery.sortHeading')}</span>
          {(
            [
              { id: 'votes', label: t('gallery.sortVotes') },
              { id: 'new', label: t('gallery.sortNew') },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSort(option.id)}
              aria-pressed={sort === option.id}
              className={cn(
                'tap rounded-full border px-4 text-sm font-semibold transition-colors',
                sort === option.id
                  ? 'border-accent bg-accent text-accent-ink'
                  : 'border-line text-ink-soft hover:bg-surface-sunken',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map((entry) => {
            const design: DesignConfig = { ...defaultDesign, ...entry.design, accessories: [] }
            const voted = hydrated && votes.includes(entry.id)
            return (
              <li key={entry.id} className="card-terra flex flex-col">
                <div className="relative grid h-56 place-items-center bg-surface-sunken">
                  <Mug2D design={design} className="h-48 w-auto" />
                  {entry.designOfMonth ? (
                    <Badge variant="clay" className="absolute start-3 top-3">
                      <Trophy className="size-3" aria-hidden />
                      {t('home.gallery.designOfMonth')}
                    </Badge>
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-sm font-semibold">{t('gallery.by', { name: pick(entry.author) })}</p>
                  <p className="mt-1 flex-1 text-sm text-ink-soft" dir="auto">
                    {pick(entry.caption)}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant={voted ? 'primary' : 'outline'}
                      className="flex-1"
                      onClick={() => toggleVote(entry.id)}
                      aria-pressed={voted}
                    >
                      <Heart className={cn('size-4', voted && 'fill-current')} aria-hidden />
                      {voted
                        ? t('home.gallery.voted')
                        : t('home.gallery.votes', { count: n(entry.votes) })}
                    </Button>
                    <Button asChild size="sm" variant="ghost" className="flex-1">
                      <Link href="/customize" onClick={() => loadDesign(design)}>
                        {t('common.customizeThisOne')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        <section className="mt-12 rounded-3xl surface-clay p-6 sm:p-8">
          <h2 className="text-xl">{t('gallery.submitHeading')}</h2>
          <p className="mt-2 max-w-prose text-ink-soft">{t('gallery.submitBody')}</p>
          <Button asChild className="mt-5">
            <Link href="/customize">{t('gallery.submitCta')}</Link>
          </Button>
        </section>
      </div>
    </>
  )
}
