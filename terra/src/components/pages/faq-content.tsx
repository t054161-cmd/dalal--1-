'use client'

import * as React from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/home/section-heading'
import { FaqAccordion } from '@/components/common/faq-accordion'
import { useI18n } from '@/i18n/provider'
import { faqs, type FaqCategory } from '@/data/content'

const CATEGORIES: FaqCategory[] = ['product', 'customization', 'orders', 'care']

export function FaqContent() {
  const { t } = useI18n()
  return (
    <>
      <PageHeader eyebrowKey="faq.eyebrow" headingKey="faq.heading" bodyKey="faq.intro" />

      <div className="container-terra pb-16">
        <Tabs defaultValue="product">
          <TabsList className="flex-wrap">
            {CATEGORIES.map((category) => (
              <TabsTrigger key={category} value={category}>
                {t(`faq.categories.${category}`)}
              </TabsTrigger>
            ))}
          </TabsList>

          {CATEGORIES.map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <FaqAccordion items={faqs.filter((item) => item.category === category)} />
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-12 rounded-3xl surface-clay p-6 sm:p-8">
          <h2 className="text-xl">{t('faq.stillHave')}</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/contact">
                <MessageCircle className="size-4" aria-hidden />
                {t('faq.contactCta')}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/policies">{t('nav.policies')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
