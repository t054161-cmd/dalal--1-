'use client'

import * as React from 'react'
import { LOCALES, dictionaries, localeMeta, type Dictionary, type Locale } from './translations'

const KEY = 'terra.locale'

type Ctx = {
  locale: Locale
  dir: 'ltr' | 'rtl'
  isRTL: boolean
  setLocale: (l: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
  /** Locale-aware number — Arabic-Indic digits in Arabic. */
  n: (value: number, opts?: Intl.NumberFormatOptions) => string
  /** Price in KWD, three decimals as is conventional in Kuwait. */
  price: (value: number) => string
  /** Pick the right half of a bilingual data field. */
  pick: <T>(field: Record<Locale, T>) => T
  dict: Dictionary
}

const LocaleContext = React.createContext<Ctx | null>(null)

function lookup(dict: unknown, key: string) {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, dict)
  return typeof value === 'string' ? value : undefined
}

const interpolate = (template: string, vars?: Record<string, string | number>) =>
  vars ? template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : template

export const isLocale = (v: unknown): v is Locale =>
  typeof v === 'string' && (LOCALES as readonly string[]).includes(v)

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // The server always renders English so the first client render agrees with
  // it. The inline script in <head> has already set <html lang/dir> from
  // storage, so direction is correct before paint; this only syncs the words.
  const [locale, setLocaleState] = React.useState<Locale>('en')

  React.useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(KEY)
    } catch {
      /* storage blocked */
    }
    const next = isLocale(stored) ? stored : isLocale(document.documentElement.lang) ? (document.documentElement.lang as Locale) : 'en'
    if (next !== 'en') setLocaleState(next)
  }, [])

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  React.useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = localeMeta[locale].dir
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
          if (process.env.NODE_ENV !== 'production') console.warn(`[i18n] missing: ${key}`)
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

export const useT = () => useI18n().t
