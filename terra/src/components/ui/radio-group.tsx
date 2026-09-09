'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { cn } from '@/lib/utils'

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root ref={ref} className={cn('grid gap-3', className)} {...props} />
))
RadioGroup.displayName = 'RadioGroup'

/** A large, card-shaped radio — comfortable on a 375px screen. */
export const RadioCard = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    ref={ref}
    className={cn(
      'tap group relative flex w-full items-start gap-4 rounded-2xl border border-line bg-surface-raised p-4 text-start transition-all duration-200 ease-organic hover:border-accent/60 data-[state=checked]:border-accent data-[state=checked]:bg-accent-soft/60 data-[state=checked]:shadow-soft',
      className,
    )}
    {...props}
  >
    <span
      aria-hidden
      className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 border-stone transition-colors group-data-[state=checked]:border-accent"
    >
      <span className="size-2.5 scale-0 rounded-full bg-accent transition-transform group-data-[state=checked]:scale-100" />
    </span>
    <span className="min-w-0 flex-1">{children}</span>
  </RadioGroupPrimitive.Item>
))
RadioCard.displayName = 'RadioCard'
