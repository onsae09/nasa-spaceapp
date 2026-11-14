import { describe, expect, it } from 'vitest'
import { charDelay, pauseAfter } from './pacing'

describe('dialogue pacing', () => {
  it('types slow lines slower than quick ones', () => {
    expect(charDelay('slow')).toBeGreaterThan(charDelay('normal'))
    expect(charDelay('normal')).toBeGreaterThan(charDelay('quick'))
  })

  it('holds longer at the end of a sentence than at a comma', () => {
    expect(pauseAfter('.', ' ')).toBeGreaterThan(pauseAfter(',', ' '))
    expect(pauseAfter(',', ' ')).toBeGreaterThan(0)
  })

  it('does not pause inside numbers or contractions', () => {
    expect(pauseAfter(',', '4')).toBe(0)
    expect(pauseAfter('.', '5')).toBe(0)
    expect(pauseAfter("'", 'm')).toBe(0)
  })

  it('pauses on an ellipsis and never after the last character', () => {
    expect(pauseAfter('…', ' ')).toBeGreaterThan(0)
    expect(pauseAfter('.', undefined)).toBe(0)
    expect(pauseAfter('!', undefined)).toBe(0)
  })
})
