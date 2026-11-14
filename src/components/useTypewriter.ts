import { useCallback, useEffect, useState } from 'react'

const CHARS_PER_SECOND = 45

const prefersReducedMotion = () =>
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Reveals `text` one character at a time.
 * `id` identifies the line, so the count resets the moment the line changes
 * (even when two consecutive lines have the same text).
 */
export function useTypewriter(id: string, text: string) {
  const [progress, setProgress] = useState({ id, count: 0 })
  const count = progress.id === id ? progress.count : 0

  useEffect(() => {
    if (prefersReducedMotion()) {
      setProgress({ id, count: text.length })
      return
    }
    setProgress({ id, count: 0 })
    const timer = setInterval(() => {
      setProgress((p) => (p.id === id && p.count < text.length ? { id, count: p.count + 1 } : p))
    }, 1000 / CHARS_PER_SECOND)
    return () => clearInterval(timer)
  }, [id, text])

  const finish = useCallback(() => setProgress({ id, count: text.length }), [id, text])

  return { count, done: count >= text.length, finish }
}
