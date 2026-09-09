'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base: 44px min tap target, organic radius, gentle easing.
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-200 ease-organic disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-accent text-accent-ink shadow-soft hover:brightness-[1.07] hover:shadow-lift',
        secondary:
          'bg-sage text-[rgb(252,249,243)] shadow-soft hover:brightness-110',
        outline:
          'border border-line bg-surface-raised text-ink hover:bg-surface-sunken',
        ghost: 'text-ink hover:bg-surface-sunken',
        link: 'text-accent underline underline-offset-4 hover:brightness-110 rounded-md',
        quiet: 'bg-sand/60 text-bark hover:bg-sand dark:bg-surface-sunken dark:text-ink',
      },
      size: {
        sm: 'h-10 px-4 text-[0.8rem]',
        md: 'h-12 px-6',
        lg: 'h-14 px-8 text-base',
        icon: 'h-11 w-11 rounded-full',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
