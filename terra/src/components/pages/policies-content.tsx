'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/home/section-heading'
import { useI18n } from '@/i18n/provider'
import { regions } from '@/data/content'

export function PoliciesContent() {
  const { t, pick } = useI18n()

  return (
    <>
      <PageHeader eyebrowKey="policies.eyebrow" headingKey="policies.heading" />

      <div className="container-terra grid gap-10 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
        <div className="max-w-prose space-y-10">
          <section aria-labelledby="shipping">
            <h2 id="shipping" className="text-2xl">
              {t('policies.shippingHeading')}
            </h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{t('policies.shippingBody')}</p>

            <div className="mt-5 overflow-x-auto rounded-3xl border border-line">
              <table className="w-full min-w-[28rem] text-sm">
                <thead className="bg-surface-sunken">
                  <tr>
                    {['region', 'time', 'cost'].map((key) => (
                      <th key={key} scope="col" className="p-4 text-start font-semibold">
                        {t(`policies.regionTable.${key}`)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface-raised">
                  {regions.map((region) => (
                    <tr key={region.id}>
                      <th scope="row" className="p-4 text-start font-semibold">
                        {pick(region.name)}
                      </th>
                      <td className="p-4 text-ink-soft">{pick(region.days)}</td>
                      <td className="p-4 text-ink-soft">{pick(region.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {(
            [
              { id: 'returns', heading: 'policies.returnsHeading', body: 'policies.returnsBody' },
              { id: 'warranty', heading: 'policies.warrantyHeading', body: 'policies.warrantyBody' },
              { id: 'refunds', heading: 'policies.refundHeading', body: 'policies.refundBody' },
            ] as const
          ).map((section) => (
            <section key={section.id} aria-labelledby={section.id}>
              <h2 id={section.id} className="text-2xl">
                {t(section.heading)}
              </h2>
              <p className="mt-3 leading-relaxed text-ink-soft">{t(section.body)}</p>
            </section>
          ))}
        </div>

        <aside className="card-terra p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">{t('policies.contactCta')}</h2>
          <div className="mt-4 flex flex-col gap-2">
            <Button asChild>
              <Link href="/contact">{t('faq.contactCta')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/track">{t('nav.track')}</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/faq">{t('nav.faq')}</Link>
            </Button>
          </div>
        </aside>
      </div>
    </>
  )
}
