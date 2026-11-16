import { describe, expect, it } from 'vitest'
import { nisar } from './nisar'

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
