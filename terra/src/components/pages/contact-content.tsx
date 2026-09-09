'use client'

import * as React from 'react'
import { CheckCircle2, Clock, Mail, MapPin, MessageCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input, Select, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/home/section-heading'
import { useI18n } from '@/i18n/provider'

const SUBJECTS = ['order', 'product', 'bulk', 'takeback', 'other'] as const

export function ContactContent() {
  const { t } = useI18n()
  const [sent, setSent] = React.useState(false)

  return (
    <>
      <PageHeader eyebrowKey="contact.eyebrow" headingKey="contact.heading" bodyKey="contact.intro" />

      <div className="container-terra grid gap-8 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
        {/* Form ------------------------------------------------------- */}
        <section className="card-terra p-6" aria-labelledby="contact-form">
          <h2 id="contact-form" className="text-xl">
            {t('contact.formHeading')}
          </h2>

          {sent ? (
            <p
              className="mt-5 flex items-center gap-2 rounded-2xl bg-sage/15 px-4 py-3 font-medium text-moss dark:text-sage"
              role="status"
            >
              <CheckCircle2 className="size-5" aria-hidden />
              {t('contact.sent')}
            </p>
          ) : (
            <form
              className="mt-5 grid gap-4 sm:grid-cols-2"
              onSubmit={(event) => {
                event.preventDefault()
                setSent(true)
              }}
            >
              <div>
                <Label htmlFor="c-name">{t('common.name')}</Label>
                <Input id="c-name" required autoComplete="name" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="c-email">{t('common.email')}</Label>
                <Input id="c-email" type="email" required className="mt-1.5" dir="ltr" />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="c-subject">{t('contact.subject')}</Label>
                <Select id="c-subject" className="mt-1.5">
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {t(`contact.subjectOptions.${subject}`)}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="c-message">{t('common.message')}</Label>
                <Textarea id="c-message" rows={6} required className="mt-1.5" dir="auto" />
              </div>
              <div className="sm:col-span-2">
                <Button type="submit" size="lg">
                  <Send className="size-4 rtl:-scale-x-100" aria-hidden />
                  {t('contact.send')}
                </Button>
              </div>
            </form>
          )}
        </section>

        {/* Direct channels -------------------------------------------- */}
        <aside className="space-y-4">
          <a
            href="https://wa.me/96500000000?text=TERRA"
            target="_blank"
            rel="noreferrer noopener"
            className="card-terra flex items-start gap-3 p-5 transition-colors hover:bg-surface-sunken"
          >
            <MessageCircle className="size-5 shrink-0 text-sage" aria-hidden />
            <span>
              <span className="block font-semibold">{t('contact.whatsapp')}</span>
              <span className="mt-1 block text-sm text-ink-mute">{t('contact.whatsappNote')}</span>
            </span>
          </a>

          <a href="mailto:hello@terra.example" className="card-terra flex items-start gap-3 p-5 transition-colors hover:bg-surface-sunken">
            <Mail className="size-5 shrink-0 text-sage" aria-hidden />
            <span>
              <span className="block font-semibold">{t('contact.emailUs')}</span>
              <span className="mt-1 block text-sm text-ink-mute" dir="ltr">
                hello@terra.example
              </span>
            </span>
          </a>

          <div className="card-terra p-5">
            <p className="flex items-start gap-3">
              <MapPin className="size-5 shrink-0 text-sage" aria-hidden />
              <span>
                <span className="block font-semibold">{t('contact.visit')}</span>
                <span className="mt-1 block text-sm text-ink-mute">{t('contact.address')}</span>
              </span>
            </p>
            <p className="mt-4 flex items-start gap-3">
              <Clock className="size-5 shrink-0 text-sage" aria-hidden />
              <span className="text-sm text-ink-mute">{t('contact.hours')}</span>
            </p>
          </div>
        </aside>
      </div>
    </>
  )
}
