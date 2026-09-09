'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, RotateCcw, Wand2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RadioCard, RadioGroup } from '@/components/ui/radio-group'
import { Progress } from '@/components/ui/progress'
import { Mug2D } from '@/components/mug3d/mug-2d'
import { Price } from '@/components/common/price'
import { useI18n } from '@/i18n/provider'
import { presets, type Preset } from '@/data/presets'
import { priceOf } from '@/data/product'
import { useStore } from '@/lib/store'
import { designFromPreset } from '@/components/cotd/cup-of-the-day'

/**
 * "Which TERRA is yours?" — three questions, then a recommended preset the
 * visitor can order as-is or open in the designer.
 *
 * The recommendation is a simple scored match over the preset library, so it
 * always returns something real from the catalogue.
 */

type Answers = { use?: 'car' | 'desk' | 'outdoors'; drink?: 'hot' | 'cold' | 'both'; style?: 'earthy' | 'minimal' | 'bold' }

const QUESTIONS = [
  {
    id: 'use' as const,
    labelKey: 'home.quiz.q1',
    options: [
      { value: 'car', key: 'home.quiz.q1a' },
      { value: 'desk', key: 'home.quiz.q1b' },
      { value: 'outdoors', key: 'home.quiz.q1c' },
    ],
  },
  {
    id: 'drink' as const,
    labelKey: 'home.quiz.q2',
    options: [
      { value: 'hot', key: 'home.quiz.q2a' },
      { value: 'cold', key: 'home.quiz.q2b' },
      { value: 'both', key: 'home.quiz.q2c' },
    ],
  },
  {
    id: 'style' as const,
    labelKey: 'home.quiz.q3',
    options: [
      { value: 'earthy', key: 'home.quiz.q3a' },
      { value: 'minimal', key: 'home.quiz.q3b' },
      { value: 'bold', key: 'home.quiz.q3c' },
    ],
  },
]

const WARM = ['clay', 'rust', 'saffron', 'sand']
const QUIET = ['cream', 'stone', 'steel', 'sand']
const BOLD = ['indigo', 'rust', 'moss', 'bark', 'ash']

function recommend(answers: Answers): Preset {
  const wantedSize = answers.use === 'car' ? '350' : answers.use === 'outdoors' ? '700' : '500'

  const scored = presets.map((preset) => {
    let score = 0
    if (preset.sizeId === wantedSize) score += 3
    if (answers.style === 'earthy' && WARM.includes(preset.bodyColorId)) score += 2
    if (answers.style === 'minimal' && QUIET.includes(preset.bodyColorId)) score += 2
    if (answers.style === 'bold' && BOLD.includes(preset.bodyColorId)) score += 2
    if (answers.drink === 'cold' && preset.sizeId === '700') score += 1
    if (answers.drink === 'hot' && preset.handle) score += 1
    if (answers.use === 'desk' && preset.handle) score += 1
    if (answers.use === 'car' && !preset.handle) score += 1
    return { preset, score }
  })

  return scored.sort((a, b) => b.score - a.score)[0].preset
}

export function Quiz() {
  const { t, pick } = useI18n()
  const router = useRouter()
  const [step, setStep] = React.useState(0)
  const [answers, setAnswers] = React.useState<Answers>({})
  const [started, setStarted] = React.useState(false)

  const addToCart = useStore((s) => s.addToCart)
  const loadDesign = useStore((s) => s.loadDesign)

  const done = step >= QUESTIONS.length
  const result = done ? recommend(answers) : null

  const reset = () => {
    setAnswers({})
    setStep(0)
    setStarted(false)
  }

  return (
    <section className="section container-terra">
      <div className="rounded-3xl border border-line bg-surface-raised p-6 sm:p-10">
        <p className="eyebrow">
          <Wand2 className="size-3.5" aria-hidden />
          {t('home.quiz.eyebrow')}
        </p>
        <h2 className="mt-3 text-display-sm">{t('home.quiz.heading')}</h2>
        <p className="mt-3 max-w-prose text-ink-soft">{t('home.quiz.body')}</p>

        {!started ? (
          <Button className="mt-6" size="lg" onClick={() => setStarted(true)}>
            {t('home.quiz.start')}
          </Button>
        ) : done && result ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-[minmax(0,14rem)_1fr] sm:items-center">
            <div className="grid place-items-center rounded-2xl bg-surface-sunken p-4">
              <Mug2D design={designFromPreset(result, false)} className="h-56 w-auto" />
            </div>
            <div>
              <h3 className="text-2xl">{t('home.quiz.resultHeading', { name: pick(result.name) })}</h3>
              <p className="mt-2 text-ink-soft">{t('home.quiz.resultBody')}</p>
              <p className="mt-1 text-sm text-ink-mute">{pick(result.story)}</p>
              <Price value={priceOf(designFromPreset(result, false))} className="mt-4 block text-lg font-semibold" />
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    addToCart({ design: designFromPreset(result, false), designName: result.name })
                    router.push('/cart')
                  }}
                >
                  {t('common.addToCart')}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    loadDesign(designFromPreset(result, false))
                    router.push('/customize')
                  }}
                >
                  {t('common.customizeThisOne')}
                  <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
                </Button>
                <Button variant="ghost" onClick={reset}>
                  <RotateCcw className="size-4" aria-hidden />
                  {t('home.quiz.restart')}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 max-w-xl">
            <p className="text-sm font-semibold text-ink-mute">
              {t('home.quiz.question', { current: step + 1, total: QUESTIONS.length })}
            </p>
            <Progress
              className="mt-2"
              value={((step + 1) / QUESTIONS.length) * 100}
              aria-label={t('home.quiz.heading')}
            />
            <fieldset className="mt-5">
              <legend className="text-xl font-semibold">{t(QUESTIONS[step].labelKey)}</legend>
              <RadioGroup
                className="mt-4"
                value={(answers[QUESTIONS[step].id] as string) ?? ''}
                onValueChange={(value) => {
                  setAnswers((prev) => ({ ...prev, [QUESTIONS[step].id]: value }))
                  window.setTimeout(() => setStep((s) => s + 1), 180)
                }}
              >
                {QUESTIONS[step].options.map((option) => (
                  <RadioCard key={option.value} value={option.value} id={`quiz-${option.value}`}>
                    <span className="text-base font-medium">{t(option.key)}</span>
                  </RadioCard>
                ))}
              </RadioGroup>
            </fieldset>
            {step > 0 ? (
              <Button variant="ghost" className="mt-4" onClick={() => setStep((s) => s - 1)}>
                {t('common.back')}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
