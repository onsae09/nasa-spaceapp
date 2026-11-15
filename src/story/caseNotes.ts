import { useSyncExternalStore } from 'react'
import type { RegionKey, RegionLabel } from '../content/analysis'
import type { Channel } from '../content/histogram'
import type { EvidenceKey, GapKey, InterpretationKey, NextStepKey, SupportKey } from '../content/investigation'

/**
 * What the visitor did along the way: the regions they labelled on the map,
 * the one they took forward, the evidence they held against it and what they
 * made of it, the gaps they looked at, the cut-off they kept, and the next
 * step they chose. The desk, the map and the closing card read it back, and
 * say so plainly where a part was skipped. Kept outside the story engine
 * because none of it changes where the story goes.
 */
export type CaseNotes = {
  labels: Partial<Record<RegionKey, RegionLabel>>
  /** The region carried from the map into the evidence check. */
  region: RegionKey | null
  checkedReference: boolean
  /** What the visitor said each source shows about their region. */
  evidence: Partial<Record<EvidenceKey, SupportKey>>
  interpretation: InterpretationKey | null
  gaps: GapKey[]
  cutOff: { channel: Channel; delta: number; precision: number; recall: number } | null
  nextStep: NextStepKey | null
}

const EMPTY: CaseNotes = {
  labels: {},
  region: null,
  checkedReference: false,
  evidence: {},
  interpretation: null,
  gaps: [],
  cutOff: null,
  nextStep: null,
}

let notes = EMPTY
const listeners = new Set<() => void>()

function set(next: CaseNotes) {
  notes = next
  listeners.forEach((listener) => listener())
}

export const caseNotes = {
  get: () => notes,
  label: (region: RegionKey, label: RegionLabel) => set({ ...notes, labels: { ...notes.labels, [region]: label } }),
  /** Taking a different region forward starts its evidence check afresh. */
  investigate: (region: RegionKey | null) => {
    if (region !== notes.region) set({ ...notes, region, evidence: {}, interpretation: null })
  },
  checkReference: () => {
    if (!notes.checkedReference) set({ ...notes, checkedReference: true })
  },
  weigh: (source: EvidenceKey, support: SupportKey) => set({ ...notes, evidence: { ...notes.evidence, [source]: support } }),
  interpret: (interpretation: InterpretationKey) => set({ ...notes, interpretation }),
  seeGap: (gap: GapKey) => {
    if (!notes.gaps.includes(gap)) set({ ...notes, gaps: [...notes.gaps, gap] })
  },
  keepCutOff: (cutOff: NonNullable<CaseNotes['cutOff']>) => set({ ...notes, cutOff }),
  chooseNextStep: (nextStep: NextStepKey) => set({ ...notes, nextStep }),
  reset: () => set(EMPTY),
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useCaseNotes = () => useSyncExternalStore(subscribe, caseNotes.get)
