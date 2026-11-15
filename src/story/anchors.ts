import type { AnchorKey } from './types'

/**
 * Places Sara can point at, in stage pixels. `r` is the radius of the ring
 * drawn there; 0 draws no ring (her arm alone does the pointing). With `box`
 * the mark is a rounded frame of that width and height instead, for things
 * that are square and have labels a ring would cut through.
 *
 * The lesson anchors are RadarLesson's own coordinates plus the drawing's
 * offset on the stage (112, 64). The map anchors are the centre of the map
 * backdrop (see MapBackdrop).
 */
export const anchors: Record<AnchorKey, { x: number; y: number; r: number; box?: { width: number; height: number } }> = {
  valley: { x: 1120, y: 400, r: 170 },
  satellite: { x: 362, y: 174, r: 160 },
  ground: { x: 972, y: 514, r: 96 },
  tile: { x: 1582, y: 294, r: 140, box: { width: 212, height: 212 } },
  tiles: { x: 1582, y: 294, r: 250, box: { width: 452, height: 212 } },
  stamp: { x: 1500, y: 58, r: 0 },
  patch: { x: 960, y: 388, r: 180 },
  map: { x: 960, y: 388, r: 0 },
}
