'use client'

import * as React from 'react'
import Image from 'next/image'
import { CheckCircle2, Gift, PenLine, Send, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input, Select, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { PageHeader } from '@/components/home/section-heading'
import { Price } from '@/components/common/price'
import { useI18n } from '@/i18n/provider'
import { bulkTiers } from '@/data/content'
import { pricing } from '@/data/product'

export function GiftsContent() {
  const { t, pick, n } = useI18n()
  const [logoName, setLogoName] = React.useState<string | null>(null)
  const [wrap, setWrap] = React.useState(false)
  const [card, setCard] = React.useState(false)
  const [sent, setSent] = React.useState(false)

  return (
    <>
      <PageHeader eyebrowKey="gifts.eyebrow" headingKey="gifts.heading" bodyKey="gifts.intro" />

      <div className="container-terra pb-16">
        {/* Pricing tiers ------------------------------------------------ */}
        <section aria-labelledby="bulk-pricing">
          <h2 id="bulk-pricing" className="text-2xl">
            {t('gifts.pricingHeading')}
          </h2>
          <p className="mt-2 text-ink-soft">{t('gifts.pricingBody')}</p>

          <div className="mt-5 overflow-x-auto rounded-3xl border border-line">
            <table className="w-full min-w-[36rem] text-sm">
              <thead className="bg-surface-sunken">
                <tr>
                  {['qty', 'unit', 'save', 'lead'].map((key) => (
                    <th key={key} scope="col" className="p-4 text-start font-semibold">
                      {t(`gifts.pricingTable.${key}`)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-surface-raised">
                {bulkTiers.map((tier) => (
                  <tr key={tier.min}>
                    <th scope="row" className="p-4 text-start font-semibold tabular-nums">
                      {tier.max ? `${n(tier.min)}–${n(tier.max)}` : `${n(tier.min)}+`}
                    </th>
                    <td className="p-4">
                      <Price value={tier.unit} className="font-semibold" />
                    </td>
                    <td className="p-4">
                      <Badge variant="sage">
                        −{n(tier.savePercent)}%
                      </Badge>
                    </td>
                    <td className="p-4 text-ink-soft">{pick(tier.lead)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Logo + wrapping --------------------------------------------- */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <section className="card-terra p-6" aria-labelledby="logo">
            <h2 id="logo" className="text-xl">
              {t('gifts.logoHeading')}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">{t('gifts.logoBody')}</p>

            <div className="mt-4">
              <Label htmlFor="logo-file" className="sr-only">
                {t('gifts.logoUpload')}
              </Label>
              <label
                htmlFor="logo-file"
                className="tap flex cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line px-4 py-6 text-sm font-semibold text-ink-soft transition-colors hover:border-accent hover:bg-surface-sunken"
              >
                <Upload className="size-4" aria-hidden />
                {logoName ? t('gifts.logoChosen', { name: logoName }) : t('gifts.logoUpload')}
              </label>
              <input
                id="logo-file"
                type="file"
                accept=".svg,.pdf,.png,.jpg,.jpeg"
                className="sr-only"
                onChange={(event) => setLogoName(event.target.files?.[0]?.name ?? null)}
              />
              <p className="mt-2 text-xs text-ink-mute">{t('gifts.logoHint')}</p>
            </div>

            <Image
              src="/images/gifts/gift-corporate-logo-proof-mockup.svg"
              alt="Mock-up of a corporate logo laser-engraved on a moss-green 500 ml TERRA mug"
              width={640}
              height={420}
              className="mt-5 w-full rounded-2xl border border-line"
              loading="lazy"
            />
          </section>

          <section className="card-terra p-6" aria-labelledby="wrapping">
            <h2 id="wrapping" className="text-xl">
              {t('gifts.wrapHeading')}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">{t('gifts.wrapBody')}</p>

            <div className="mt-4 space-y-3">
              <label className="flex items-start gap-3 rounded-2xl border border-line p-3">
                <Checkbox checked={wrap} onCheckedChange={(v) => setWrap(v === true)} aria-label={t('gifts.giftWrap')} />
                <span>
                  <span className="flex items-center gap-2 font-semibold">
                    <Gift className="size-4 text-sage" aria-hidden />
                    {t('gifts.giftWrap')}
                  </span>
                  <span className="mt-1 block text-xs text-ink-mute">{t('gifts.giftWrapNote')}</span>
                </span>
              </label>

              <label className="flex items-start gap-3 rounded-2xl border border-line p-3">
                <Checkbox
                  checked={card}
                  onCheckedChange={(v) => setCard(v === true)}
                  aria-label={t('gifts.handwrittenCard')}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-semibold">
                    <PenLine className="size-4 text-sage" aria-hidden />
                    {t('gifts.handwrittenCard')}
                  </span>
                  <span className="mt-1 block text-xs text-ink-mute">{t('gifts.handwrittenCardNote')}</span>
                  {card ? (
                    <Textarea
                      className="mt-2 text-sm"
                      rows={3}
                      dir="auto"
                      maxLength={200}
                      placeholder={t('gifts.cardMessagePlaceholder')}
                      aria-label={t('gifts.cardMessage')}
                    />
                  ) : null}
                </span>
              </label>
            </div>

            <p className="mt-4 text-xs text-ink-mute">
              {t('gifts.giftWrap')}: +<Price value={pricing.giftWrap} /> ·{' '}
              {t('gifts.handwrittenCard')}: +<Price value={pricing.handwrittenCard} />
            </p>
          </section>
        </div>

        {/* Quote form -------------------------------------------------- */}
        <section className="mt-14 rounded-3xl surface-clay p-6 sm:p-8" aria-labelledby="quote">
          <h2 id="quote" className="text-2xl">
            {t('gifts.quoteHeading')}
          </h2>
          <p className="mt-2 max-w-prose text-ink-soft">{t('gifts.quoteBody')}</p>

          {sent ? (
            <p
              className="mt-6 flex items-center gap-2 rounded-2xl bg-sage/15 px-4 py-3 font-medium text-moss dark:text-sage"
              role="status"
            >
              <CheckCircle2 className="size-5" aria-hidden />
              {t('gifts.quoteSent')}
            </p>
          ) : (
            <form
              className="mt-6 grid gap-4 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault()
                setSent(true)
              }}
            >
              <div>
                <Label htmlFor="q-name">{t('common.name')}</Label>
                <Input id="q-name" required autoComplete="name" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="q-company">{t('gifts.company')}</Label>
                <Input id="q-company" required autoComplete="organization" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="q-email">{t('common.email')}</Label>
                <Input id="q-email" type="email" required className="mt-1.5" dir="ltr" />
              </div>
              <div>
                <Label htmlFor="q-phone">{t('common.phone')}</Label>
                <Input id="q-phone" type="tel" className="mt-1.5" dir="ltr" />
              </div>
              <div>
                <Label htmlFor="q-qty">{t('gifts.quantity')}</Label>
                <Select id="q-qty" className="mt-1.5" defaultValue="50">
                  {bulkTiers.map((tier) => (
                    <option key={tier.min} value={tier.min}>
                      {tier.max ? `${n(tier.min)}–${n(tier.max)}` : `${n(tier.min)}+`}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="q-date">{t('gifts.deadline')}</Label>
                <Input id="q-date" type="date" className="mt-1.5" dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="q-notes">{t('gifts.notes')}</Label>
                <Textarea id="q-notes" rows={4} className="mt-1.5" dir="auto" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg">
                  <Send className="size-4 rtl:-scale-x-100" aria-hidden />
                  {t('gifts.sendQuote')}
                </Button>
              </div>
            </form>
          )}
        </section>
      </div>
    </>
  )
}
