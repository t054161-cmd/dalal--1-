'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useI18n } from '@/i18n/provider'
import type { FaqItem } from '@/data/content'

export function FaqAccordion({ items, defaultOpen }: { items: FaqItem[]; defaultOpen?: string }) {
  const { pick } = useI18n()
  return (
    <Accordion type="single" collapsible defaultValue={defaultOpen} className="w-full">
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{pick(item.question)}</AccordionTrigger>
          <AccordionContent>{pick(item.answer)}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
