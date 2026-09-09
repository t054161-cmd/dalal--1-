'use client'

import * as React from 'react'
import { dictionaries, LOCALES, localeMeta, type Dictionary, type Locale } from './translations'

const STORAGE_KEY = 'terra.locale'

type Ctx = {
  locale: Locale
  dir: 'ltr' | 'rtl'
  isRTL: boolean
  setLocale: (l: Locale) => void
  /** Dot-path lookup with {placeholder} interpolation. */
  t: (key: string, vars?: Record<string, string | number>) => string
  /** Locale-aware number (Arabic-Indic digits in AR). */
  n: (value: number, opts?: Intl.NumberFormatOptions) => string
  /** Price in KWD, 3 decimals as is conventional in Kuwait. */
  price: (value: number) => string
  /** Pick the right half of a bilingual data field. */
  pick: <T>(field: Record<Locale, T>) => T
  dict: Dictionary
}

const LocaleContext = React.createContext<Ctx | null>(null)

function lookup(dict: unknown, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, dict)
  return typeof value === 'string' ? value : undefined
}

function interpolate(template: string, vars?: Record<string, string | number>) {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  )
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // SSR always renders English so the server and the first client render agree.
  // The inline script in <head> has already set <html lang/dir> from storage,
  // so the layout direction is correct before paint; this effect then syncs
  // the strings.
  const [locale, setLocaleState] = React.useState<Locale>('en')

  React.useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      /* storage blocked — fall back to the document */
    }
    const fromDoc = document.documentElement.lang
    const next = isLocale(stored) ? stored : isLocale(fromDoc) ? fromDoc : 'en'
    if (next !== 'en') setLocaleState(next)
  }, [])

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  // Keep the document in sync: language, direction, and the font stack.
  React.useEffect(() => {
    const el = document.documentElement
    el.lang = locale
    el.dir = localeMeta[locale].dir
  }, [locale])

  const value = React.useMemo<Ctx>(() => {
    const dict = dictionaries[locale]
    const numberLocale = locale === 'ar' ? 'ar-KW' : 'en-US'
    return {
      locale,
      dir: localeMeta[locale].dir,
      isRTL: locale === 'ar',
      setLocale,
      dict,
      t: (key, vars) => {
        const found = lookup(dict, key) ?? lookup(dictionaries.en, key)
        if (found === undefined) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`[i18n] missing key: ${key}`)
          }
          return key
        }
        return interpolate(found, vars)
      },
      n: (v, opts) => new Intl.NumberFormat(numberLocale, opts).format(v),
      price: (v) =>
        new Intl.NumberFormat(numberLocale, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        }).format(v),
      pick: (field) => field[locale],
    }
  }, [locale, setLocale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useI18n() {
  const ctx = React.useContext(LocaleContext)
  if (!ctx) throw new Error('useI18n must be used inside <LocaleProvider>')
  return ctx
}

/** Convenience: just the translate function. */
export function useT() {
  return useI18n().t
}
