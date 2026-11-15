import { useEffect, useRef } from 'react'
import type { Pace } from '../story/types'
import { useTypewriter } from './useTypewriter'

/**
 * Types out a line and ticks as it goes: every second letter, never for
 * spaces or punctuation, and not when a click reveals the rest at once.
 * While `active` is false nothing is typed and nothing sounds. With `instant`
 * (a line the visitor has already read) it appears whole and silent.
 */
export function useSpeech(id: string, text: string, pace: Pace, active: boolean, tick: () => void, instant = false) {
  const typing = useTypewriter(active ? id : 'idle', active ? text : '', pace, instant)

  const typed = useRef(0)
  useEffect(() => {
    const previous = typed.current
    typed.current = typing.count
    if (!active || typing.count !== previous + 1 || typing.count % 2 !== 0) return
    if (/[\p{L}\p{N}]/u.test(text[typing.count - 1] ?? '')) tick()
  }, [typing.count, active, text, tick])

  return typing
}
