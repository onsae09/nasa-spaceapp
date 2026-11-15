/** Full-screen backgrounds. Paths live in src/assets.ts. */
export type BackdropKey = 'space' | 'nepalFlood' | 'brokenCity' | 'amphanSwath' | 'radarLesson'

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

/**
 * Which picture the radar lesson is showing (background `radarLesson`).
 *   send    – the satellite sends its signal down
 *   dry     – dry ground scatters it; part comes back; bright
 *   wet     – calm water bounces it away; little comes back; dark
 *   compare – the same place before and after: darker means water may have come
 */
export type LessonStep = 'send' | 'dry' | 'wet' | 'compare'

/** How fast a line is typed. Heavy lines are slow, greetings are quick. */
export type Pace = 'slow' | 'normal' | 'quick'

/** Figures shown large beside the dialogue. Content lives in src/assets.ts. */
export type FactKey = 'nepalToll'

/**
 * A full-screen interactive part of the story. The story waits until it is closed.
 *   map   – the radar change map: zoom, drag, switch layers
 *   cards – the solution cards: turn them over
 *   files – the research files: open and read
 */
export type OverlayKey = 'map' | 'cards' | 'files'

/** The card shown at the start of a chapter. */
export type ChapterMark = { number: number; title: string }

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
 *   open  – opens an interactive overlay; waits until the visitor closes it
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
 *   chapter   – show a chapter card, or null to take it away
 *   lesson    – which picture of the radar lesson to show
 */
export type Step =
  | { say: string; button?: ButtonSpec; pace?: Pace }
  | { wait: number }
  | { open: OverlayKey }
  | { bg: BackdropKey }
  | { triptych: [PanelKey, PanelKey, PanelKey] }
  | { ui: boolean }
  | { camera: CameraShot }
  | { music: MusicCue }
  | { fact: FactKey | null }
  | { cover: Cover | null }
  | { chapter: ChapterMark | null }
  | { lesson: LessonStep }

export type Scene = {
  id: string
  steps: Step[]
}

export type Backdrop =
  | { kind: 'image'; key: BackdropKey }
  | { kind: 'triptych'; keys: [PanelKey, PanelKey, PanelKey] }
