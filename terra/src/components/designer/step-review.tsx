'use client'

import * as React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Bookmark, Camera, Check, Link2, RotateCcw, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/i18n/provider'
import { useStore } from '@/lib/store'
import { useCopy } from '@/lib/hooks'
import { shareUrl } from '@/lib/share'
import { pointsForSpend } from '@/data/loyalty'
import { priceOf } from '@/data/product'
import { accessoriesTotal } from '@/data/accessories'
import { AccessoriesPicker } from './accessories-picker'
import { DesignSummary, PriceBreakdown } from './design-summary'

export function StepReview() {
  const { t, n } = useI18n()
  const router = useRouter()
  const design = useStore((s) => s.design)
  const snapshot = useStore((s) => s.snapshot)
  const addToCart = useStore((s) => s.addToCart)
  const saveCurrentDesign = useStore((s) => s.saveCurrentDesign)
  const resetDesign = useStore((s) => s.resetDesign)

  const [attach, setAttach] = React.useState(true)
  const [saved, setSaved] = React.useState(false)
  const [copied, copy] = useCopy()

  const link = shareUrl(design)
  const total = priceOf(design) + accessoriesTotal(design.accessories)

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl">{t('designer.step4.heading')}</h2>
      <p className="mt-2 text-ink-soft">{t('designer.step4.body')}</p>

      {/* Snapshot -------------------------------------------------------- */}
      <section className="mt-6 rounded-2xl border border-line bg-surface-raised p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Camera className="size-4 text-sage" aria-hidden />
          {t('designer.step4.snapshotHeading')}
        </h3>
        <p className="mt-1 text-xs text-ink-mute">{t('designer.step4.snapshotBody')}</p>

        {snapshot ? (
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <Image
              src={snapshot}
              alt={t('designer.step4.snapshotHeading')}
              width={180}
              height={180}
              unoptimized
              className="size-32 rounded-xl border border-line bg-surface-sunken object-contain"
            />
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                className="size-5 accent-clay"
                checked={attach}
                onChange={(event) => setAttach(event.target.checked)}
              />
              {attach ? t('designer.step4.snapshotAttached') : t('designer.step4.attachSnapshot')}
            </label>
          </div>
        ) : (
          <p className="mt-3 text-sm text-ink-mute">{t('viewer.snapshotHint')}</p>
        )}
      </section>

      {/* Choices + price -------------------------------------------------- */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line bg-surface-raised p-4">
          <h3 className="text-sm font-semibold">{t('designer.step4.summaryHeading')}</h3>
          <DesignSummary design={design} className="mt-2" />
        </section>
        <section className="rounded-2xl border border-line bg-surface-raised p-4">
          <h3 className="text-sm font-semibold">{t('designer.step4.priceHeading')}</h3>
          <PriceBreakdown design={design} className="mt-2" />
          <Badge variant="sage" className="mt-3">
            {t('loyalty.earnedAtCheckout', { points: n(pointsForSpend(total)) })}
          </Badge>
        </section>
      </div>

      {/* Add-ons --------------------------------------------------------- */}
      <div className="mt-8">
        <AccessoriesPicker />
      </div>

      {/* Actions --------------------------------------------------------- */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          size="lg"
          onClick={() => {
            addToCart({ design, snapshot: attach ? snapshot : undefined })
            router.push('/cart')
          }}
        >
          <ShoppingBag className="size-4" aria-hidden />
          {t('common.addToCart')}
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            saveCurrentDesign()
            setSaved(true)
          }}
        >
          {saved ? <Check className="size-4" aria-hidden /> : <Bookmark className="size-4" aria-hidden />}
          {saved ? t('common.saved') : t('common.saveDesign')}
        </Button>
        <Button size="lg" variant="ghost" onClick={resetDesign}>
          <RotateCcw className="size-4" aria-hidden />
          {t('designer.step4.startOver')}
        </Button>
      </div>

      {/* Share ----------------------------------------------------------- */}
      <section className="mt-8 rounded-2xl border border-line bg-surface-sunken p-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Link2 className="size-4 text-sage" aria-hidden />
          {t('designer.step4.shareHeading')}
        </h3>
        <p className="mt-1 text-xs text-ink-mute">{t('designer.step4.shareBody')}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <Input readOnly value={link} className="font-mono text-xs" onFocus={(e) => e.currentTarget.select()} />
          <Button className="shrink-0" onClick={() => void copy(link)}>
            {copied ? t('common.linkCopied') : t('common.shareDesign')}
          </Button>
        </div>
      </section>
    </div>
  )
}
