/**
 * How much the radar echo changed between 16 and 22 May 2020, pixel by pixel,
 * split by what the reference map says about each pixel. Generated from the
 * analysis team's histogram (data/amphan/tables/backscatter_change_histogram_counts.csv):
 * 100 equal bins per channel, in dB.
 *
 * The histogram leaves out the far tails. `below` is the number of pixels
 * under the first bin, worked out from the team's threshold table
 * (data/amphan/tables/README.md says how), so that counts at a cut-off agree
 * with that table to within about 1%.
 */
export type Channel = 'vh' | 'vv'

type Counts = {
  /** The dB value at the left edge of the first bin and the right edge of the last. */
  min: number
  max: number
  /** Pixels per bin that the reference map marks newly flooded, and all the others. */
  flooded: number[]
  other: number[]
  /** Pixels below `min`: [flooded, other]. */
  below: [number, number]
}

export const BINS = 100

/** Every pixel both passes and the reference map cover (data/amphan/maps_summary.json). */
export const TOTAL = { flooded: 10973, other: 684504 }

export const histogram: Record<Channel, Counts> = {
  vh: {
    min: -11.61214005,
    max: 9.43103696,
    flooded: [
      82, 94, 93, 109, 132, 123, 107, 124, 147, 165, 145, 155, 161, 176, 176, 166, 199, 194, 212, 186,
      217, 203, 199, 183, 225, 214, 181, 197, 180, 180, 203, 188, 167, 189, 176, 176, 137, 195, 176, 171,
      167, 167, 138, 164, 140, 135, 160, 153, 113, 111, 115, 128, 106, 101, 112, 112, 98, 82, 76, 88,
      82, 61, 50, 70, 61, 57, 44, 55, 32, 39, 47, 27, 22, 25, 23, 21, 16, 18, 13, 11,
      14, 4, 7, 5, 8, 8, 5, 5, 8, 3, 3, 1, 2, 0, 1, 2, 5, 1, 2, 0,
    ],
    other: [
      54, 45, 73, 62, 61, 78, 74, 101, 111, 123, 154, 139, 165, 195, 264, 245, 271, 295, 311, 345,
      415, 482, 571, 678, 764, 824, 999, 1070, 1235, 1448, 1751, 1998, 2272, 2636, 3032, 3369, 3836, 4473, 5123, 5778,
      6581, 7526, 8363, 9130, 10453, 11457, 12585, 13680, 14509, 15824, 16987, 18076, 18992, 20007, 20563, 21115, 21993, 22325, 22325, 22448,
      22326, 22032, 21530, 20932, 20276, 19252, 18425, 17243, 16338, 15263, 14209, 12758, 11969, 10728, 9758, 8801, 7728, 6989, 6232, 5518,
      4832, 4305, 3606, 3169, 2757, 2382, 1956, 1784, 1515, 1260, 1113, 904, 852, 662, 600, 497, 448, 332, 299, 229,
    ],
    below: [941, 459],
  },
  vv: {
    min: -11.86084348,
    max: 8.7977954,
    flooded: [
      90, 83, 93, 96, 101, 98, 108, 111, 97, 132, 117, 129, 149, 156, 113, 151, 145, 132, 147, 108,
      144, 172, 147, 139, 129, 126, 146, 152, 146, 153, 181, 159, 163, 159, 156, 165, 164, 171, 149, 163,
      147, 156, 173, 158, 165, 169, 151, 172, 156, 144, 140, 146, 160, 121, 120, 154, 157, 137, 110, 131,
      120, 96, 102, 88, 87, 89, 83, 68, 65, 56, 58, 65, 38, 52, 36, 39, 38, 38, 44, 29,
      27, 24, 29, 30, 19, 29, 12, 10, 18, 12, 17, 6, 6, 4, 7, 4, 3, 8, 1, 4,
    ],
    other: [
      44, 57, 45, 50, 58, 58, 57, 68, 74, 81, 92, 94, 101, 114, 117, 126, 161, 166, 186, 227,
      218, 295, 306, 330, 380, 476, 573, 647, 746, 818, 992, 1197, 1387, 1597, 1854, 2152, 2568, 3002, 3548, 4082,
      4629, 5331, 6266, 7082, 8003, 9041, 10160, 11221, 12784, 13890, 14857, 16042, 17585, 19108, 20159, 20843, 21579, 22861, 23174, 23446,
      24039, 23922, 23702, 23448, 23019, 22499, 21187, 20642, 19451, 17847, 16935, 15531, 14263, 12890, 11769, 10389, 9416, 8280, 7126, 6162,
      5407, 4565, 3877, 3239, 2684, 2386, 1985, 1605, 1351, 1141, 991, 797, 659, 503, 481, 370, 309, 271, 197, 187,
    ],
    below: [967, 429],
  },
}

/** The dB value at a bin edge, 0 (the left end) to BINS (the right end). */
export function edge(channel: Channel, index: number): number {
  const { min, max } = histogram[channel]
  return min + ((max - min) * index) / BINS
}

export type CutOff = {
  /** Pixels whose echo fell by at least this much are flagged: change ≤ delta (dB). */
  delta: number
  /** Flagged pixels the reference map marks flooded, and flagged pixels it does not. */
  hits: number
  falseAlarms: number
  /** Of the flagged pixels, the share the reference map marks flooded. */
  precision: number
  /** Of the pixels the reference map marks flooded, the share flagged. */
  recall: number
}

/** What a cut-off at a bin edge flags, measured against the reference map. */
export function cutOff(channel: Channel, index: number): CutOff {
  const { flooded, other, below } = histogram[channel]
  let hits = below[0]
  let falseAlarms = below[1]
  for (let i = 0; i < index; i++) {
    hits += flooded[i]
    falseAlarms += other[i]
  }
  return {
    delta: edge(channel, index),
    hits,
    falseAlarms,
    precision: hits / (hits + falseAlarms),
    recall: hits / TOTAL.flooded,
  }
}
