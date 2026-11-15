import { useSyncExternalStore } from 'react'
import type { RegionKey, RegionLabel } from '../content/analysis'
import type { Channel } from '../content/histogram'

/**
 * What the visitor did along the way: the regions they labelled on the map,
 * whether they looked at the reference map, and the cut-off they kept. The
 * closing card reads it back to them, and says so plainly where a part was
 * skipped. Kept outside the story engine because none of it changes where
 * the story goes.
 */
export type CaseNotes = {
  labels: Partial<Record<RegionKey, RegionLabel>>
  checkedReference: boolean
  cutOff: { channel: Channel; delta: number; precision: number; recall: number } | null
}

const EMPTY: CaseNotes = { labels: {}, checkedReference: false, cutOff: null }

let notes = EMPTY
const listeners = new Set<() => void>()

function set(next: CaseNotes) {
  notes = next
  listeners.forEach((listener) => listener())
}

export const caseNotes = {
  get: () => notes,
  label: (region: RegionKey, label: RegionLabel) => set({ ...notes, labels: { ...notes.labels, [region]: label } }),
  checkReference: () => {
    if (!notes.checkedReference) set({ ...notes, checkedReference: true })
  },
  keepCutOff: (cutOff: NonNullable<CaseNotes['cutOff']>) => set({ ...notes, cutOff }),
  reset: () => set(EMPTY),
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useCaseNotes = () => useSyncExternalStore(subscribe, caseNotes.get)
