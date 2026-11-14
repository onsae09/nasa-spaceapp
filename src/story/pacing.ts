import type { Pace } from './types'

/** Characters per second for each pace. */
const SPEED: Record<Pace, number> = { slow: 28, normal: 45, quick: 60 }

export const charDelay = (pace: Pace) => 1000 / SPEED[pace]

/**
 * Extra milliseconds to hold after a character, so a line breathes where a
 * speaker would. `next` is the character that follows, if any.
 *
 * Punctuation inside a number or a word ("1,455", "I'm") is not a pause:
 * a mark only counts when a space follows it.
 */
export function pauseAfter(char: string, next: string | undefined): number {
  if (next === undefined) return 0
  if (char === '…') return 520
  if (char === '—') return 220
  if (next !== ' ') return 0
  if ('.!?'.includes(char)) return 380
  if (',;:'.includes(char)) return 170
  return 0
}
