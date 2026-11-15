import { describe, expect, it } from 'vitest'
import { analysis } from './analysis'
import { FLOODED, PASS, bestPass, floodExtent, games, spotGrid } from './games'
import { clues, gaps } from './investigation'

describe('the games in the research files', () => {
  it('hides exactly three changed squares, and a river that is dark on both passes', () => {
    const cells = spotGrid.flat()
    expect(cells.filter((cell) => cell.flooded)).toHaveLength(FLOODED.length)
    for (const cell of cells) {
      if (cell.river) expect(cell.before).toBeLessThan(0.2)
      if (cell.river || cell.flooded) expect(cell.after).toBeLessThan(0.2)
      else expect(cell.after).toBeGreaterThan(0.5)
      // A changed square was bright before, or it would not be a change.
      if (cell.flooded) expect(cell.before).toBeGreaterThan(0.5)
      expect(cell.river && cell.flooded).toBe(false)
    }
  })

  it('gives every sprint mission a right answer among its options', () => {
    for (const mission of games.sprint.missions) expect(mission.options[mission.answer]).toBeDefined()
    expect(games.sprint.missions.length).toBeGreaterThanOrEqual(3)
  })

  it('lets a six-day satellite catch the peak only on the right day', () => {
    expect(floodExtent(4.5)).toBe(1)
    expect(floodExtent(2)).toBe(0)
    expect(bestPass(4.5)).toBe(1)
    // Passing on days 0, 6 and 12 arrives after the peak has started to drain.
    expect(bestPass(0)).toBeLessThan(0.9)
    // Passing on days 3 and 9 sees dry ground both times: the flood came and went in between.
    expect(bestPass(3)).toBe(0)
    expect(PASS.revisit).toBe(6)
  })
})

describe('the evidence and the gaps', () => {
  it('has the reference map silent exactly where it has no coverage', () => {
    const west = Math.min(...analysis.reference.coverage.map(([x]) => x))
    for (const key of ['A', 'B', 'C'] as const) {
      const covered = analysis.regions[key].x > west
      expect(clues.sources.reference.truth[key] === 'silent').toBe(!covered)
    }
  })

  it('never claims ground evidence the team does not have', () => {
    expect(Object.values(clues.sources.ground.truth)).toEqual(['silent', 'silent', 'silent'])
  })

  it('places every marker on the map layers', () => {
    for (const item of Object.values(gaps.items)) {
      if (!item.at) continue
      expect(item.at.x).toBeGreaterThan(0)
      expect(item.at.x).toBeLessThan(1)
      expect(item.at.y).toBeGreaterThan(0)
      expect(item.at.y).toBeLessThan(1)
    }
  })
})
