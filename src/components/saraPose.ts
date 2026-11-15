import type { SaraPose, SaraSpot } from '../story/types'

/** Sara is drawn in a 260×450 box. These are places inside it. */
export const SARA_SIZE = { width: 260, height: 450 }
export const SHOULDER = { left: { x: 60, y: 206 }, right: { x: 200, y: 206 } }

/** Where the box's top-left corner sits on the stage, and how large it is drawn. */
export const SPOTS: Record<SaraSpot, { x: number; y: number; scale: number }> = {
  dock: { x: 120, y: 566, scale: 1.02 },
}

export type Face = 'smile' | 'flat' | 'open'

/**
 * A pose. Arms hang straight down at 0°; a positive angle swings the hand
 * toward the left of the screen, a negative one toward the right.
 */
export type Pose = { armLeft: number; armRight: number; lean: number; head: number; face: Face; wave?: boolean }

export const POSES: Record<SaraPose, Pose> = {
  idle: { armLeft: 12, armRight: -12, lean: 0, head: 0, face: 'smile' },
  wave: { armLeft: 150, armRight: -12, lean: -2, head: -4, face: 'smile', wave: true },
  think: { armLeft: 12, armRight: -158, lean: 2, head: 8, face: 'flat' },
  alarm: { armLeft: 128, armRight: -128, lean: 0, head: 0, face: 'open' },
  present: { armLeft: 12, armRight: -72, lean: 2, head: 3, face: 'smile' },
}

/**
 * The angle that points an arm hanging from `shoulder` at `target`, in the
 * same convention as Pose: 0° is straight down, negative is toward the right.
 */
export function armAngle(shoulder: { x: number; y: number }, target: { x: number; y: number }): number {
  const degrees = (Math.atan2(-(target.x - shoulder.x), target.y - shoulder.y) * 180) / Math.PI
  // `|| 0` turns a rounded -0 into a plain 0.
  return Math.round(degrees) || 0
}

/**
 * The pose with one arm turned to point at a place on the stage: the arm on
 * the side the target is on.
 */
export function pointAt(pose: Pose, spot: SaraSpot, target: { x: number; y: number } | null): Pose {
  if (!target) return pose
  const { x, y, scale } = SPOTS[spot]
  const onStage = (p: { x: number; y: number }) => ({ x: x + p.x * scale, y: y + p.y * scale })
  const centre = x + (SARA_SIZE.width / 2) * scale
  return target.x >= centre
    ? { ...pose, armRight: armAngle(onStage(SHOULDER.right), target) }
    : { ...pose, armLeft: armAngle(onStage(SHOULDER.left), target), wave: false }
}
