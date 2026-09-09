import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
  {
    variants: {
      variant: {
        clay: 'bg-accent text-accent-ink',
        sage: 'bg-sage/18 text-sage dark:bg-sage/25',
        sand: 'bg-sand/70 text-bark dark:bg-surface-sunken dark:text-ink',
        outline: 'border border-line text-ink-soft',
      },
    },
    defaultVariants: { variant: 'sand' },
  },
)

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
