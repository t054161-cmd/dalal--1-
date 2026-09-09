import * as React from 'react'
import { cn } from '@/lib/utils'

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'tap w-full rounded-xl border border-line bg-surface-raised px-4 py-3 text-base text-ink placeholder:text-ink-mute/70 transition-colors focus:border-accent disabled:opacity-60',
        className,
      )}
      {...props}
    />
  ),
)
Input.displayName = 'Input'

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'w-full rounded-xl border border-line bg-surface-raised px-4 py-3 text-base text-ink placeholder:text-ink-mute/70 transition-colors focus:border-accent',
      className,
    )}
    {...props}
  />
))
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'tap w-full appearance-none rounded-xl border border-line bg-surface-raised px-4 py-3 text-base text-ink transition-colors focus:border-accent',
      className,
    )}
    {...props}
  />
))
Select.displayName = 'Select'
