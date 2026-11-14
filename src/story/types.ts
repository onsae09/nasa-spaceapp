/** Full-screen backgrounds. Paths live in src/assets.ts. */
export type BackdropKey = 'space' | 'nepalFlood' | 'brokenCity'

/** Vertical panels used by the three-way split. */
export type PanelKey = 'bangladesh' | 'india' | 'us'

export type ButtonSpec = {
  label: string
  /** center: large button mid-screen. corner: bottom right. */
  at: 'center' | 'corner'
}

/**
 * One beat of the story.
 *
 * Blocking steps (the story waits on them):
 *   say   – a line of dialogue; waits for a click, or for its button if it has one
 *   wait  – pauses for the given milliseconds; clicks are ignored
 *
 * Instant steps (applied, then the story moves on):
 *   bg        – replace the background with a full-screen image
 *   triptych  – replace the background with three vertical panels
 *   ui        – show or hide the character and dialogue box
 */
export type Step =
  | { say: string; button?: ButtonSpec }
  | { wait: number }
  | { bg: BackdropKey }
  | { triptych: [PanelKey, PanelKey, PanelKey] }
  | { ui: boolean }

export type Scene = {
  id: string
  steps: Step[]
}

export type Backdrop =
  | { kind: 'image'; key: BackdropKey }
  | { kind: 'triptych'; keys: [PanelKey, PanelKey, PanelKey] }
