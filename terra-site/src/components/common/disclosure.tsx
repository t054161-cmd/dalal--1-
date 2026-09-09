'use client'

import * as React from 'react'
import * as Accordion from '@radix-ui/react-accordion'

/**
 * ============================================================================
 * DISCLOSURE
 * ============================================================================
 * Everything the customer might want to know, and nothing they have to read.
 *
 * TERRA is a lifestyle object, not a piece of equipment: the page should answer
 * *what is it, what does it look like, can I make it mine, how do I buy it* and
 * then stop. So specifications, care and materials live behind three closed
 * hairlines rather than in three open lists — the information is a click away
 * for the one person in twenty who wants it, and invisible to the rest.
 *
 * All rows start closed, and only one opens at a time.
 * ============================================================================
 */

export type DisclosureItem = {
  id: string
  label: string
  children: React.ReactNode
}

export function Disclosure({ items, className }: { items: DisclosureItem[]; className?: string }) {
  return (
    <Accordion.Root type="single" collapsible className={className}>
      {items.map((item) => (
        <Accordion.Item key={item.id} value={item.id} className="border-t border-line last:border-b">
          <Accordion.Header>
            <Accordion.Trigger className="tap group flex w-full items-center justify-between gap-6 py-5 text-start">
              <span className="meta text-ink">{item.label}</span>
              {/* A plus that loses its upright to become a minus. */}
              <span aria-hidden className="relative size-3 shrink-0 text-ink-mute transition-colors duration-500 group-hover:text-ink">
                <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
                <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current transition-all duration-500 ease-cinema group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0" />
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="disclosure-panel overflow-hidden">
            <div className="pb-7 pe-6 text-sm leading-relaxed text-ink-soft">{item.children}</div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  )
}
