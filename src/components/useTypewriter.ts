import { useCallback, useEffect, useState } from 'react'
import { charDelay, pauseAfter } from '../story/pacing'
import type { Pace } from '../story/types'

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Reveals `text` one character at a time, at the line's pace, holding a
 * moment at commas and sentence ends.
 *
 * `id` identifies the line, so the count resets the moment the line changes
 * (even when two consecutive lines have the same text).
 */
export function useTypewriter(id: string, text: string, pace: Pace = 'normal') {
  const [progress, setProgress] = useState({ id, count: 0 })
  const count = progress.id === id ? progress.count : 0

  useEffect(() => {
    if (prefersReducedMotion()) {
      setProgress({ id, count: text.length })
      return
    }
    setProgress({ id, count: 0 })

    // A Hangul block carries about as much as two or three Latin letters, so
    // Korean is typed more slowly to be read at the same pace.
    const delay = charDelay(pace) * (/[가-힣]/.test(text) ? 1.7 : 1)
    let typed = 0
    let timer = 0
    const type = () => {
      typed++
      // If a click already revealed the whole line, never step back.
      setProgress((p) => (p.id === id && p.count >= typed ? p : { id, count: typed }))
      if (typed < text.length) {
        timer = window.setTimeout(type, delay + pauseAfter(text[typed - 1], text[typed]))
      }
    }
    if (text.length > 0) timer = window.setTimeout(type, delay)
    return () => clearTimeout(timer)
  }, [id, text, pace])

  const finish = useCallback(() => setProgress({ id, count: text.length }), [id, text])

  return { count, done: count >= text.length, finish }
}
