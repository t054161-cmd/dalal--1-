'use client'

import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'

/**
 * The countdown to local midnight. Values come from useCupOfTheDay so the
 * timer and the design rollover are driven by the same tick.
 */
export function Countdown({
  parts,
  className,
  compact = false,
}: {
  parts: { hours: number; minutes: number; seconds: number }
  className?: string
  compact?: boolean
}) {
  const { t, n } = useI18n()
  const pad = (value: number) => n(value, { minimumIntegerDigits: 2, useGrouping: false })

  const cells = [
    { value: parts.hours, label: t('cotd.hours') },
    { value: parts.minutes, label: t('cotd.minutes') },
    { value: parts.seconds, label: t('cotd.seconds') },
  ]

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="timer"
      aria-label={t('cotd.countdownLabel')}
    >
      {cells.map((cell, index) => (
        <span key={cell.label} className="flex items-center gap-2">
          <span
            className={cn(
              'flex flex-col items-center rounded-xl bg-bark/90 px-2.5 py-1.5 text-cream tabular-nums dark:bg-surface-sunken',
              compact ? 'min-w-[2.6rem]' : 'min-w-[3.2rem]',
            )}
          >
            <span className={cn('font-bold leading-none', compact ? 'text-lg' : 'text-2xl')}>
              {pad(cell.value)}
            </span>
            <span className="mt-0.5 text-[0.6rem] uppercase tracking-wider text-cream/70">
              {cell.label}
            </span>
          </span>
          {index < cells.length - 1 ? (
            <span aria-hidden className="text-lg font-bold text-ink-mute">
              :
            </span>
          ) : null}
        </span>
      ))}
    </div>
  )
}
