'use client'

import { useI18n } from '@/i18n/provider'
import { cn } from '@/lib/utils'

/** KWD with three decimals, Arabic-Indic digits in Arabic. */
export function Price({
  value,
  className,
  strike,
}: {
  value: number
  className?: string
  strike?: number
}) {
  const { price, t } = useI18n()
  return (
    <span className={cn('inline-flex items-baseline gap-1.5 tabular-nums', className)}>
      {strike !== undefined && strike > value ? (
        <s className="text-ink-mute/80 decoration-clay/60">{price(strike)}</s>
      ) : null}
      <span>{price(value)}</span>
      <span className="text-[0.75em] font-medium text-ink-mute">{t('common.currency')}</span>
    </span>
  )
}
