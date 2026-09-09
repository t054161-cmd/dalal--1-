'use client'

import { AlertTriangle, Check, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useI18n } from '@/i18n/provider'
import {
  fonts,
  getBodyColor,
  getFont,
  MAX_TEXT_LENGTH,
  placements,
  textColors,
  textSizes,
} from '@/data/product'
import { checkContrast, suggestTextColor } from '@/lib/contrast'
import { useStore } from '@/lib/store'
import type { Placement, TextSize } from '@/types/design'
import { cn } from '@/lib/utils'

export function StepText() {
  const { t, pick, n, locale } = useI18n()
  const design = useStore((s) => s.design)
  const setDesign = useStore((s) => s.setDesign)

  const body = getBodyColor(design.bodyColorId)
  const contrast = checkContrast(body.hex, textColors.find((c) => c.id === design.textColorId)!.hex)
  const suggestion = suggestTextColor(body.hex)
  const hasText = design.text.trim().length > 0

  const arabicFonts = fonts.filter((f) => f.script === 'arabic')
  const latinFonts = fonts.filter((f) => f.script === 'latin')

  const previewText = (fontId: string) => {
    if (hasText) return design.text
    return pick(getFont(fontId).sample)
  }

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl">{t('designer.step3.heading')}</h2>
      <p className="mt-2 text-ink-soft">{t('designer.step3.body')}</p>

      {/* Text input ------------------------------------------------------ */}
      <div className="mt-6">
        <Label htmlFor="engraving">{t('designer.step3.inputLabel')}</Label>
        <Input
          id="engraving"
          className="mt-2 text-lg"
          value={design.text}
          maxLength={MAX_TEXT_LENGTH}
          placeholder={t('designer.step3.inputPlaceholder')}
          onChange={(event) => setDesign({ text: event.target.value.slice(0, MAX_TEXT_LENGTH) })}
          // Both scripts are welcome; the mug knows which way to read.
          dir="auto"
          aria-describedby="engraving-counter"
        />
        <p
          id="engraving-counter"
          className={cn(
            'mt-2 text-xs',
            design.text.length >= MAX_TEXT_LENGTH ? 'text-accent' : 'text-ink-mute',
          )}
          aria-live="polite"
        >
          {design.text.length >= MAX_TEXT_LENGTH
            ? t('designer.step3.counterFull')
            : t('designer.step3.counter', { count: n(design.text.length), max: n(MAX_TEXT_LENGTH) })}
        </p>
        {!hasText ? (
          <p className="mt-1 text-xs text-ink-mute">{t('designer.step3.emptyHint')}</p>
        ) : null}
      </div>

      {/* Fonts ----------------------------------------------------------- */}
      <section className="mt-8">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          <Type className="size-4 text-sage" aria-hidden />
          {t('designer.step3.fontHeading')}
        </h3>
        <p className="mt-1 text-xs text-ink-mute">{t('designer.step3.fontPreviewNote')}</p>

        {[
          { label: t('designer.step3.arabicFonts'), list: arabicFonts, dir: 'rtl' as const },
          { label: t('designer.step3.latinFonts'), list: latinFonts, dir: 'ltr' as const },
        ].map((group) => (
          <div key={group.label} className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">
              {group.label}
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {group.list.map((font) => {
                const selected = design.fontId === font.id
                return (
                  <li key={font.id}>
                    <button
                      type="button"
                      onClick={() => setDesign({ fontId: font.id })}
                      aria-pressed={selected}
                      className={cn(
                        'tap flex w-full flex-col items-start gap-1 rounded-2xl border px-3 py-2.5 text-start transition-colors',
                        selected
                          ? 'border-accent bg-accent-soft/50'
                          : 'border-line hover:bg-surface-sunken',
                      )}
                    >
                      <span
                        className="line-clamp-1 w-full text-xl leading-tight"
                        // The preview uses the customer's own text, in the
                        // same webfont the engraving will use.
                        style={{ fontFamily: `var(${font.cssVar})`, fontWeight: font.weight }}
                        dir={group.dir}
                      >
                        {previewText(font.id)}
                      </span>
                      <span className="text-[0.7rem] font-medium text-ink-mute">
                        {pick(font.name)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </section>

      {/* Text size ------------------------------------------------------- */}
      <section className="mt-8">
        <h3 className="text-sm font-semibold">{t('designer.step3.sizeHeading')}</h3>
        <div className="mt-2 flex gap-2">
          {textSizes.map((size) => (
            <button
              key={size.id}
              type="button"
              onClick={() => setDesign({ textSize: size.id as TextSize })}
              aria-pressed={design.textSize === size.id}
              className={cn(
                'tap flex-1 rounded-xl border px-3 text-sm font-semibold transition-colors',
                design.textSize === size.id
                  ? 'border-accent bg-accent-soft/50 text-accent'
                  : 'border-line text-ink-soft hover:bg-surface-sunken',
              )}
            >
              {t(size.labelKey)}
            </button>
          ))}
        </div>
      </section>

      {/* Text colour ----------------------------------------------------- */}
      <section className="mt-8">
        <h3 className="text-sm font-semibold">{t('designer.step3.colorHeading')}</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {textColors.map((color) => {
            const selected = design.textColorId === color.id
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => setDesign({ textColorId: color.id })}
                aria-pressed={selected}
                aria-label={pick(color.name)}
                title={pick(color.name)}
                className={cn(
                  'tap grid place-items-center rounded-full border-2 transition-transform',
                  selected ? 'border-accent scale-105' : 'border-transparent hover:scale-105',
                )}
              >
                <span
                  className="grid size-10 place-items-center rounded-full border border-black/10"
                  style={{ background: color.hex }}
                >
                  {selected ? (
                    <Check className="size-4" style={{ color: color.dark ? '#F6F1E7' : '#3E3229' }} aria-hidden />
                  ) : null}
                </span>
              </button>
            )
          })}
        </div>

        {/* Contrast guard */}
        {hasText ? (
          <div
            className={cn(
              'mt-3 flex flex-wrap items-center gap-3 rounded-2xl border p-3 text-sm',
              contrast.ok
                ? 'border-sage/40 bg-sage/10 text-moss dark:text-sage'
                : 'border-accent/50 bg-accent-soft/60 text-bark dark:text-ink',
            )}
            role="status"
            aria-live="polite"
          >
            {contrast.ok ? (
              <>
                <Check className="size-4 shrink-0" aria-hidden />
                <span>
                  {t('designer.step3.contrastOk')} ({n(contrast.ratio)}:1)
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="size-4 shrink-0" aria-hidden />
                <span className="flex-1">
                  {t('designer.step3.contrastWarning')}{' '}
                  {t('designer.step3.contrastSuggestion', { color: pick(suggestion.name) })}
                </span>
                <Button size="sm" onClick={() => setDesign({ textColorId: suggestion.id })}>
                  {t('designer.step3.contrastFix')}
                </Button>
              </>
            )}
          </div>
        ) : null}
      </section>

      {/* Placement ------------------------------------------------------- */}
      <section className="mt-8">
        <h3 className="text-sm font-semibold">{t('designer.step3.placementHeading')}</h3>
        <ul className="mt-2 grid gap-2 sm:grid-cols-3">
          {placements.map((placement) => {
            const selected = design.placement === placement.id
            return (
              <li key={placement.id}>
                <button
                  type="button"
                  onClick={() => setDesign({ placement: placement.id as Placement })}
                  aria-pressed={selected}
                  className={cn(
                    'tap w-full rounded-2xl border p-3 text-start transition-colors',
                    selected ? 'border-accent bg-accent-soft/50' : 'border-line hover:bg-surface-sunken',
                  )}
                >
                  <span className="block text-sm font-semibold">{t(placement.labelKey)}</span>
                  <span className="mt-0.5 block text-xs text-ink-mute">{t(placement.hintKey)}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <p className="sr-only" aria-live="polite">
        {locale === 'ar' ? 'تم تحديث المعاينة' : 'Preview updated'}
      </p>
    </div>
  )
}
