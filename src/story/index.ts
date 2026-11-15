import { resolve, type L, type Lang } from '../i18n'
import { chapter1 } from './chapter1'
import { chapter2 } from './chapter2'
import type { Scene } from './types'

const script = [...chapter1, ...chapter2]

const built: Partial<Record<Lang, Scene[]>> = {}

/** The whole story in one language. `?scene=N` in the URL counts scenes from here. */
export function buildStory(lang: Lang): Scene[] {
  return (built[lang] ??= resolve(script, lang))
}

/** What the closing card announces. Update when the next chapter is built. */
export const nextChapter: { number: number; title: L } = {
  number: 3,
  title: { en: 'Final words', ko: '마지막 이야기' },
}
