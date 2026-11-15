import { describe, expect, it } from 'vitest'
import { analysis, formatLonLat, lonLat } from './analysis'
import { BINS, TOTAL, cutOff, edge, histogram } from './histogram'

describe('where the map layers sit on Earth', () => {
  it('puts the middle of the strip in south-western Bangladesh', () => {
    const { lon, lat } = lonLat(0.5, 0.5)
    expect(lat).toBeCloseTo(22.21, 1)
    expect(lon).toBeCloseTo(88.78, 1)
    expect(formatLonLat({ lon: 88.9534, lat: 22.2141 })).toBe('22.214°N 88.953°E')
  })

  it('runs east to the right and south downward', () => {
    expect(lonLat(1, 0.5).lon).toBeGreaterThan(lonLat(0, 0.5).lon)
    expect(lonLat(0.5, 1).lat).toBeLessThan(lonLat(0.5, 0).lat)
  })

  it('keeps the regions the reference map can check inside its coverage, and C outside it', () => {
    const west = Math.min(...analysis.reference.coverage.map(([x]) => x))
    expect(analysis.regions.A.x).toBeGreaterThan(west)
    expect(analysis.regions.B.x).toBeGreaterThan(west)
    expect(analysis.regions.C.x).toBeLessThan(west)
  })
})

describe('the cut-off chart', () => {
  it('has a count for every bin', () => {
    for (const counts of Object.values(histogram)) {
      expect(counts.flooded).toHaveLength(BINS)
      expect(counts.other).toHaveLength(BINS)
    }
    expect(edge('vv', 0)).toBe(histogram.vv.min)
    expect(edge('vv', BINS)).toBeCloseTo(histogram.vv.max, 8)
  })

  // Rows of the team's threshold table (data/amphan/tables/README.md).
  it('agrees with the threshold table to within 1%', () => {
    const near = (channel: 'vv' | 'vh', delta: number) => {
      let best = 0
      for (let i = 0; i <= BINS; i++) if (Math.abs(edge(channel, i) - delta) < Math.abs(edge(channel, best) - delta)) best = i
      return cutOff(channel, best)
    }
    // VV, flag if change ≤ −5.996 dB: precision 0.434, recall 0.413.
    expect(near('vv', -5.99626663).precision).toBeCloseTo(0.434, 1)
    expect(near('vv', -5.99626663).recall).toBeCloseTo(0.413, 1)
    // VH, flag if change ≤ 2.002 dB: 10,416 hits, 462,508 false alarms.
    const vh = near('vh', 2.00218872)
    expect(Math.abs(vh.hits - 10416) / 10416).toBeLessThan(0.01)
    expect(Math.abs(vh.falseAlarms - 462508) / 462508).toBeLessThan(0.02)
  })

  it('trades hits for false alarms: no cut-off gets both right', () => {
    for (const channel of ['vh', 'vv'] as const) {
      let last = cutOff(channel, 1)
      for (let i = 2; i < BINS; i++) {
        const now = cutOff(channel, i)
        expect(now.recall).toBeGreaterThanOrEqual(last.recall)
        expect(now.hits + now.falseAlarms).toBeLessThanOrEqual(TOTAL.flooded + TOTAL.other)
        last = now
      }
      const both = Array.from({ length: BINS - 1 }, (_, i) => cutOff(channel, i + 1)).filter(
        (c) => c.precision > 0.8 && c.recall > 0.8,
      )
      expect(both).toEqual([])
    }
  })
})
