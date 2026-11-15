import { createContext, useContext, useMemo } from 'react'

export type Lang = 'en' | 'ko'

export const LANGS: { key: Lang; name: string }[] = [
  { key: 'en', name: 'English' },
  { key: 'ko', name: '한국어' },
]

/** A piece of text in every language. Write these wherever the app shows words. */
export type L = { en: string; ko: string }

/** The same shape with every `L` replaced by the string for one language. */
export type Resolved<T> = T extends L
  ? string
  : T extends readonly unknown[]
    ? { [K in keyof T]: Resolved<T[K]> }
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T

const isL = (value: unknown): value is L =>
  typeof value === 'object' &&
  value !== null &&
  Object.keys(value).length === 2 &&
  typeof (value as L).en === 'string' &&
  typeof (value as L).ko === 'string'

/** Walks any content object and picks one language everywhere. */
export function resolve<T>(value: T, lang: Lang): Resolved<T> {
  if (isL(value)) return value[lang] as Resolved<T>
  if (Array.isArray(value)) return value.map((item) => resolve(item, lang)) as Resolved<T>
  if (typeof value === 'object' && value !== null) {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v, lang)])) as Resolved<T>
  }
  return value as Resolved<T>
}

const LangContext = createContext<Lang>('en')
export const LangProvider = LangContext.Provider
export const useLang = () => useContext(LangContext)

/** Content written with `L` leaves, in the current language. */
export function useResolved<T>(source: T): Resolved<T> {
  const lang = useLang()
  return useMemo(() => resolve(source, lang), [source, lang])
}

const STORAGE_KEY = 'lang'
const isLang = (value: unknown): value is Lang => value === 'en' || value === 'ko'

/** `?lang=ko` in the URL, then the visitor's last choice, then English. */
export function initialLang(): Lang {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (isLang(fromUrl)) return fromUrl
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (isLang(saved)) return saved
  } catch {
    // No storage: fall through to the default.
  }
  return 'en'
}

export function saveLang(lang: Lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // The choice then lasts for this visit only.
  }
  document.documentElement.lang = lang
}
