'use client'

import { useT } from '@/i18n/provider'
import { cn } from '@/lib/utils'

/**
 * Shown while the 3D bundle downloads. Deliberately cheap: two shapes and a
 * shimmer, no dependencies, so it paints instantly.
 */
export function ViewerSkeleton({ className }: { className?: string }) {
  const t = useT()
  return (
    <div
      className={cn(
        'grid h-full w-full place-items-center rounded-3xl bg-surface-sunken',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 p-6">
        <div className="animate-soft-pulse">
          <div className="mx-auto h-4 w-20 rounded-full bg-stone/40" />
          <div className="mx-auto mt-1.5 h-32 w-24 rounded-b-[1.6rem] rounded-t-lg bg-stone/30 sm:h-40 sm:w-28" />
        </div>
        <p className="text-xs font-medium text-ink-mute">{t('viewer.loading')}</p>
      </div>
    </div>
  )
}
