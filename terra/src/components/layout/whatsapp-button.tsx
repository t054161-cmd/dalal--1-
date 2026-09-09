'use client'

import { MessageCircle } from 'lucide-react'
import { useI18n } from '@/i18n/provider'

/** Sticky "order by chat" button. Bottom-end so it flips sides in RTL. */
export function WhatsAppButton() {
  const { t } = useI18n()
  return (
    <a
      href="https://wa.me/96500000000?text=TERRA"
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`${t('whatsapp.aria')} — ${t('a11y.externalLink')}`}
      className="tap fixed bottom-4 end-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-[#0B3D26] shadow-lift transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
    >
      <MessageCircle className="size-5" aria-hidden />
      <span className="hidden sm:inline">{t('whatsapp.label')}</span>
    </a>
  )
}
