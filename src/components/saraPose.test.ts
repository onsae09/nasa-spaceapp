import { describe, expect, it } from 'vitest'
import { POSES, SPOTS, armAngle, pointAt } from './saraPose'

describe('where Sara points', () => {
  const shoulder = { x: 100, y: 100 }

  it('hangs the arm straight down at 0°', () => {
    expect(armAngle(shoulder, { x: 100, y: 300 })).toBe(0)
  })

  it('turns negative toward the right of the screen and positive toward the left', () => {
    expect(armAngle(shoulder, { x: 300, y: 100 })).toBe(-90)
    expect(armAngle(shoulder, { x: -100, y: 100 })).toBe(90)
    expect(armAngle(shoulder, { x: 300, y: -100 })).toBe(-135)
  })

  it('uses the arm on the side the target is on, and leaves the other alone', () => {
    const right = pointAt(POSES.idle, 'dock', { x: 1500, y: 300 })
    expect(right.armLeft).toBe(POSES.idle.armLeft)
    expect(right.armRight).toBeLessThan(-90)

    const left = pointAt(POSES.wave, 'dock', { x: SPOTS.dock.x - 200, y: 300 })
    expect(left.armRight).toBe(POSES.wave.armRight)
    expect(left.armLeft).toBeGreaterThan(90)
    expect(left.wave).toBe(false)
  })

  it('keeps the pose when there is nothing to point at', () => {
    expect(pointAt(POSES.think, 'dock', null)).toEqual(POSES.think)
  })
})
