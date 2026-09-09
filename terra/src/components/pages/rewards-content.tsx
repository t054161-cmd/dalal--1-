'use client'

import * as React from 'react'
import { Check, Gift, Sparkles, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { PageHeader } from '@/components/home/section-heading'
import { useI18n } from '@/i18n/provider'
import { useStore } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { POINTS_PER_KWD, pointEvents, rewards, tierFor, tiers } from '@/data/loyalty'
import { cn } from '@/lib/utils'

const EARN_ROWS = [
  { key: 'signup', labelKey: 'loyalty.earnSignup' },
  { key: 'firstDesignSaved', labelKey: 'loyalty.earnFirstDesignSaved' },
  { key: 'galleryVote', labelKey: 'loyalty.earnGalleryVote' },
  { key: 'takeBackCup', labelKey: 'loyalty.earnTakeBackCup' },
  { key: 'reviewWithPhoto', labelKey: 'loyalty.earnReviewWithPhoto' },
  { key: 'refillPlanStarted', labelKey: 'loyalty.earnRefillPlanStarted' },
] as const

export function RewardsContent() {
  const { t, pick, n } = useI18n()
  const hydrated = useHydrated()

  const member = useStore((s) => s.member)
  const memberEmail = useStore((s) => s.memberEmail)
  const joinedAt = useStore((s) => s.joinedAt)
  const points = useStore((s) => s.points)
  const history = useStore((s) => s.pointHistory)
  const joinClub = useStore((s) => s.joinClub)
  const redeem = useStore((s) => s.redeem)

  const tier = tierFor(hydrated ? points : 0)

  return (
    <>
      <PageHeader eyebrowKey="loyalty.eyebrow" headingKey="loyalty.heading" bodyKey="loyalty.intro" />

      <div className="container-terra pb-16">
        {/* Membership card / join -------------------------------------- */}
        <section className="rounded-3xl surface-moss p-6 sm:p-8">
          {hydrated && member ? (
            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="flex items-center gap-2 text-sm text-cream/80">
                  <Sparkles className="size-4 text-sand" aria-hidden />
                  {t('loyalty.member')} · {memberEmail}
                </p>
                <p className="mt-3 text-[clamp(2.6rem,9vw,4rem)] font-bold leading-none text-sand tabular-nums">
                  {n(points)}
                </p>
                <p className="mt-1 text-cream/80">{t('loyalty.pointsUnit')}</p>
                {joinedAt ? (
                  <p className="mt-2 text-xs text-cream/60">
                    {t('loyalty.memberSince', {
                      date: new Date(joinedAt).toLocaleDateString(),
                    })}
                  </p>
                ) : null}
              </div>

              <div className="min-w-[14rem] rounded-2xl bg-cream/10 p-4">
                <p className="text-xs uppercase tracking-wide text-cream/70">{t('loyalty.tierLabel')}</p>
                <p className="mt-1 text-2xl font-bold text-cream">{pick(tier.current.name)}</p>
                {tier.current.discountPercent > 0 ? (
                  <p className="mt-1 text-sm text-sand">
                    {t('loyalty.standingDiscount')}: {n(tier.current.discountPercent)}%
                  </p>
                ) : null}
                <Progress className="mt-3 bg-cream/20" value={tier.progress} aria-label={t('loyalty.tierLabel')} />
                <p className="mt-2 text-xs text-cream/75">
                  {tier.next
                    ? t('loyalty.nextTier', { points: n(tier.toNext), tier: pick(tier.next.name) })
                    : t('loyalty.topTier')}
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-xl">
              <h2 className="text-2xl text-cream">{t('loyalty.joinHeading')}</h2>
              <p className="mt-2 text-cream/80">{t('loyalty.joinBody')}</p>
              <form
                className="mt-5 flex flex-col gap-3 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault()
                  const email = new FormData(event.currentTarget).get('email')
                  if (typeof email === 'string' && email) joinClub(email)
                }}
              >
                <div className="flex-1">
                  <Label htmlFor="join-email" className="sr-only">
                    {t('common.email')}
                  </Label>
                  <Input
                    id="join-email"
                    name="email"
                    type="email"
                    required
                    dir="ltr"
                    placeholder={t('common.emailPlaceholder')}
                    className="border-cream/25 bg-cream/10 text-cream placeholder:text-cream/50"
                  />
                </div>
                <Button type="submit" variant="quiet" size="lg" className="shrink-0">
                  {t('loyalty.join')}
                </Button>
              </form>
            </div>
          )}
        </section>

        {/* Tiers -------------------------------------------------------- */}
        <section className="mt-14" aria-labelledby="tiers">
          <h2 id="tiers" className="text-2xl">
            {t('loyalty.tiersHeading')}
          </h2>
          <p className="mt-2 text-ink-soft">{t('loyalty.tiersBody')}</p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tiers.map((item) => {
              const current = hydrated && member && tier.current.id === item.id
              return (
                <li
                  key={item.id}
                  className={cn(
                    'card-terra p-5',
                    current && 'border-accent ring-2 ring-accent/30',
                  )}
                >
                  <span
                    className="grid size-10 place-items-center rounded-full"
                    style={{ background: `${item.hex}26`, color: item.hex }}
                  >
                    <Trophy className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-3 text-lg font-semibold">{pick(item.name)}</h3>
                  <p className="text-xs text-ink-mute">
                    {t('loyalty.thresholdLabel', { points: n(item.threshold) })}
                  </p>
                  {item.discountPercent > 0 ? (
                    <Badge variant="clay" className="mt-2">
                      {n(item.discountPercent)}% {t('common.off')}
                    </Badge>
                  ) : null}
                  <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                    {item.perks.map((perk) => (
                      <li key={perk.en} className="flex gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-sage" aria-hidden />
                        {pick(perk)}
                      </li>
                    ))}
                  </ul>
                  {current ? (
                    <p className="mt-3 text-xs font-semibold text-accent">{t('loyalty.tierLabel')}</p>
                  ) : null}
                </li>
              )
            })}
          </ul>
        </section>

        {/* Earn --------------------------------------------------------- */}
        <section className="mt-14 grid gap-6 lg:grid-cols-2" aria-labelledby="earn">
          <div className="card-terra p-6">
            <h2 id="earn" className="text-xl">
              {t('loyalty.earnHeading')}
            </h2>
            <ul className="mt-4 divide-y divide-line text-sm">
              <li className="flex items-center justify-between gap-4 py-3">
                <span>{t('loyalty.earnSpend', { points: n(POINTS_PER_KWD), currency: t('common.currency') })}</span>
                <Badge variant="sage">+{n(POINTS_PER_KWD)}</Badge>
              </li>
              {EARN_ROWS.map((row) => (
                <li key={row.key} className="flex items-center justify-between gap-4 py-3">
                  <span>{t(row.labelKey)}</span>
                  <Badge variant="sage">+{n(pointEvents[row.key])}</Badge>
                </li>
              ))}
            </ul>
          </div>

          {/* History */}
          <div className="card-terra p-6">
            <h2 className="text-xl">{t('loyalty.historyHeading')}</h2>
            {hydrated && history.length > 0 ? (
              <ul className="mt-4 divide-y divide-line text-sm">
                {history.slice(0, 10).map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between gap-4 py-3">
                    <span>
                      {entry.kind === 'order'
                        ? t('loyalty.earnedAtCheckout', { points: n(entry.points) })
                        : entry.kind === 'redeem'
                          ? t('loyalty.redeemed')
                          : t(
                              `loyalty.earn${entry.kind.charAt(0).toUpperCase()}${entry.kind.slice(1)}`,
                            )}
                      <span className="block text-xs text-ink-mute">
                        {new Date(entry.at).toLocaleDateString()}
                      </span>
                    </span>
                    <span
                      className={cn(
                        'font-semibold tabular-nums',
                        entry.points >= 0 ? 'text-sage' : 'text-accent',
                      )}
                    >
                      {entry.points >= 0 ? '+' : '−'}
                      {n(Math.abs(entry.points))}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-ink-mute">{t('loyalty.historyEmpty')}</p>
            )}
          </div>
        </section>

        {/* Redeem ------------------------------------------------------- */}
        <section className="mt-14" aria-labelledby="redeem">
          <h2 id="redeem" className="text-2xl">
            {t('loyalty.rewardsHeading')}
          </h2>
          <p className="mt-2 text-ink-soft">{t('loyalty.rewardsBody')}</p>

          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => {
              const affordable = hydrated && points >= reward.cost
              return (
                <li key={reward.id} className="card-terra flex flex-col p-5">
                  <span className="flex items-center justify-between gap-2">
                    <Badge variant={reward.kind === 'prize' ? 'clay' : 'sand'}>
                      {t(`loyalty.kinds.${reward.kind}`)}
                    </Badge>
                    <span className="text-sm font-bold text-accent tabular-nums">
                      {t('loyalty.cost', { points: n(reward.cost) })}
                    </span>
                  </span>
                  <h3 className="mt-3 font-semibold">{pick(reward.name)}</h3>
                  <p className="mt-1 flex-1 text-sm text-ink-soft">{pick(reward.blurb)}</p>
                  <Button
                    className="mt-4"
                    size="sm"
                    variant={affordable ? 'primary' : 'outline'}
                    disabled={!affordable}
                    onClick={() => redeem(reward.id)}
                  >
                    <Gift className="size-4" aria-hidden />
                    {affordable
                      ? t('loyalty.redeem')
                      : t('loyalty.notEnough', { points: n(Math.max(0, reward.cost - points)) })}
                  </Button>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </>
  )
}
