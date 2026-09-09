'use client'

import * as React from 'react'
import { CheckCircle2, Recycle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input, Select } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/home/section-heading'
import { useI18n } from '@/i18n/provider'
import { useStore } from '@/lib/store'
import { pointEvents } from '@/data/loyalty'

const CUP_TYPES = ['steel', 'plastic', 'glass', 'other'] as const
const CONDITIONS = ['good', 'dented', 'broken'] as const

export function TakebackContent() {
  const { t, n } = useI18n()
  const member = useStore((s) => s.member)
  const award = useStore((s) => s.award)
  const [email, setEmail] = React.useState('')
  const [started, setStarted] = React.useState(false)

  return (
    <>
      <PageHeader eyebrowKey="takeback.eyebrow" headingKey="takeback.heading" bodyKey="takeback.intro" />

      <div className="container-terra pb-16">
        {/* Four steps -------------------------------------------------- */}
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(['step1', 'step2', 'step3', 'step4'] as const).map((step, index) => (
            <li key={step} className="card-terra p-5">
              <span className="grid size-9 place-items-center rounded-full bg-sage/20 text-sm font-bold text-sage">
                {n(index + 1)}
              </span>
              <p className="mt-3 font-semibold leading-snug">{t(`takeback.${step}`)}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-start">
          {/* Form ------------------------------------------------------ */}
          <section className="card-terra p-6" aria-labelledby="takeback-form">
            <h2 id="takeback-form" className="text-xl">
              {t('takeback.formHeading')}
            </h2>
            <Badge variant="sage" className="mt-3">
              <Recycle className="size-3" aria-hidden />
              +{n(pointEvents.takeBackCup)} {t('loyalty.pointsUnit')}
            </Badge>

            {started ? (
              <p
                className="mt-5 flex items-center gap-2 rounded-2xl bg-sage/15 px-4 py-3 font-medium text-moss dark:text-sage"
                role="status"
              >
                <CheckCircle2 className="size-5" aria-hidden />
                {t('takeback.started', { email })}
              </p>
            ) : (
              <form
                className="mt-5 grid gap-4"
                onSubmit={(event) => {
                  event.preventDefault()
                  setStarted(true)
                  if (member) award('takeBackCup')
                }}
              >
                <div>
                  <Label htmlFor="tb-type">{t('takeback.cupType')}</Label>
                  <Select id="tb-type" className="mt-1.5">
                    {CUP_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {t(`takeback.cupTypes.${type}`)}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tb-condition">{t('takeback.condition')}</Label>
                  <Select id="tb-condition" className="mt-1.5">
                    {CONDITIONS.map((condition) => (
                      <option key={condition} value={condition}>
                        {t(`takeback.conditions.${condition}`)}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tb-email">{t('common.email')}</Label>
                  <Input
                    id="tb-email"
                    type="email"
                    required
                    dir="ltr"
                    className="mt-1.5"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t('common.emailPlaceholder')}
                  />
                </div>
                <Button type="submit" size="lg">
                  <Send className="size-4 rtl:-scale-x-100" aria-hidden />
                  {t('takeback.startCta')}
                </Button>
              </form>
            )}
          </section>

          {/* What happens to it ---------------------------------------- */}
          <section className="rounded-3xl surface-clay p-6">
            <h2 className="text-xl">{t('takeback.faqHeading')}</h2>
            <p className="mt-3 leading-relaxed text-ink-soft">{t('takeback.faqBody')}</p>
          </section>
        </div>
      </div>
    </>
  )
}
