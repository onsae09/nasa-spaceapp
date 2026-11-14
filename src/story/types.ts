/** Full-screen backgrounds. Paths live in src/assets.ts. */
export type BackdropKey = 'space' | 'nepalFlood' | 'brokenCity'

/** Vertical panels used by the three-way split. */
export type PanelKey = 'bangladesh' | 'india' | 'us'

/**
 * Where the camera is while the background is `space`.
 *   far   – Earth small and distant on the right
 *   earth – up close: Earth fills the right of the frame
 *   dive  – falls toward Nepal until the screen whites out
 */
export type CameraShot = 'far' | 'earth' | 'dive'

/**
 * What the soundtrack is doing.
 *   ambience – quiet synth pad for the scenes in orbit
 *   silence  – nothing
 *   theme    – the piano piece
 */
export type MusicCue = 'ambience' | 'silence' | 'theme'

/**
 * What lies over a satellite image.
 *   clouds – cloud rolls in and hides the ground
 *   scan   – a radar sweep crosses the frame and the cloud clears behind it
 */
export type Cover = 'clouds' | 'scan'

/** How fast a line is typed. Heavy lines are slow, greetings are quick. */
export type Pace = 'slow' | 'normal' | 'quick'

/** Figures shown large beside the dialogue. Content lives in src/assets.ts. */
export type FactKey = 'nepalToll'

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
 *   camera    – move the camera within the space background
 *   music     – change what the soundtrack is doing
 *   fact      – show figures beside the dialogue, or null to clear them
 *   cover     – put cloud over the image, or sweep it away with radar;
 *               cleared automatically when the background changes
 */
export type Step =
  | { say: string; button?: ButtonSpec; pace?: Pace }
  | { wait: number }
  | { bg: BackdropKey }
  | { triptych: [PanelKey, PanelKey, PanelKey] }
  | { ui: boolean }
  | { camera: CameraShot }
  | { music: MusicCue }
  | { fact: FactKey | null }
  | { cover: Cover | null }

export type Scene = {
  id: string
  steps: Step[]
}

export type Backdrop =
  | { kind: 'image'; key: BackdropKey }
  | { kind: 'triptych'; keys: [PanelKey, PanelKey, PanelKey] }
