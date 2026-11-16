import { describe, expect, it } from 'vitest'
import { haor, nisar, passDate } from './nisar'

describe('the NISAR stop', () => {
  it('keeps every lake marker inside the picture', () => {
    const aspect = nisar.size.width / nisar.size.height
    for (const { x, y, r } of Object.values(nisar.lakes)) {
      expect(x - r).toBeGreaterThan(0)
      expect(x + r).toBeLessThan(1)
      // `r` is a fraction of the width; down the picture it covers more.
      expect(y - r * aspect).toBeGreaterThan(0)
      expect(y + r * aspect).toBeLessThan(1)
    }
  })

  // The point of the three: one each way, and one that does not change.
  it('has one lake that brightened, one that darkened and one that stayed', () => {
    const answers = Object.values(nisar.lakes).map((lake) => lake.answer)
    expect([...answers].sort()).toEqual(['brighter', 'darker', 'same'])
  })

  it('says something to each lake read right, and to each cause', () => {
    for (const key of Object.keys(nisar.lakes)) expect(nisar.task.right[key as keyof typeof nisar.task.right].en).toBeTruthy()
    for (const option of Object.values(nisar.drivers.options)) expect(option.note.ko).toMatch(/[가-힣]/)
  })
})

describe('the haor flood season', () => {
  it('has twelve passes in order, with a picture for each', () => {
    expect(haor.passes).toHaveLength(12)
    const dates = haor.passes.map((pass) => pass.date)
    expect([...dates].sort()).toEqual(dates)
    expect(haor.frame(haor.passes[0].key)).toContain('nisar-haor-20260618.webp')
  })

  // The stricter threshold counts less water and the looser one more, on every pass.
  it('brackets each count with its two neighbours', () => {
    for (const pass of haor.passes) {
      expect(pass.low).toBeLessThan(pass.km2)
      expect(pass.high).toBeGreaterThan(pass.km2)
    }
  })

  it('peaks in July and ends lower, whichever threshold is used', () => {
    expect(haor.peak.date).toBe('2026-07-24')
    for (const key of ['km2', 'low', 'high'] as const) {
      const most = haor.passes.reduce((best, pass) => (pass[key] > best[key] ? pass : best))
      expect(most.date).toBe('2026-07-24')
      expect(haor.last[key]).toBeLessThan(most[key] * 0.7)
    }
  })

  it('writes dates in both languages', () => {
    expect(passDate('2026-07-24')).toEqual({ en: '24 Jul 2026', ko: '2026년 7월 24일' })
  })
})

describe('the measured lakes', () => {
  // The closing line of the stop rests on this: lake 2 crosses the team's 3 dB flag.
  it('quotes a fall of more than 3 dB for lake 2', () => {
    const fall = /\(−(\d\.\d)\)/.exec(nisar.task.right['2'].en)
    expect(fall).not.toBeNull()
    expect(Number(fall![1])).toBeGreaterThan(3)
    expect(nisar.drivers.lesson.en).toContain(`${fall![1]} dB`)
  })
})
