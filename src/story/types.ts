/** Full-screen backgrounds. Paths live in src/assets.ts. */
export type BackdropKey =
  | 'space'
  | 'nepalFlood'
  | 'brokenCity'
  | 'amphanSwath'
  | 'radarLesson'
  /** The team's histogram of flooded and other pixels, with a cut-off to drag (components/CutOffExplorer.tsx). */
  | 'evidence'
  /** The investigation desk: the two passes as thumbnails, and the case notes (components/CaseDesk.tsx). */
  | 'desk'
  /** The warning-time calculation, drawn in code (components/WarningWindow.tsx). */
  | 'warningWindow'

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
 *   send    – the satellite over dry ground, nothing fired yet
 *   dry     – dry ground scatters the signal; part comes back; bright
 *   flood   – the same field under water, nothing fired yet
 *   wet     – calm water bounces it away; little comes back; dark
 *   compare – the same place before and after: darker means water may have come
 */
export type LessonStep = 'send' | 'dry' | 'flood' | 'wet' | 'compare'

/** How fast a line is typed. Heavy lines are slow, greetings are quick. */
export type Pace = 'slow' | 'normal' | 'quick'

/** Figures shown large beside the dialogue. Content lives in src/assets.ts. */
export type FactKey = 'nepalToll' | 'oneInTen' | 'texas'

/**
 * A full-screen interactive part of the story. The story waits until it is closed.
 *   map   – the radar map: compare the two passes and label three regions
 *   clues – the same map: hold other evidence against one region
 *   gaps  – the same map: what a radar map of this place can miss
 *   steps – choose a next step for the briefing
 *   cards – the solution cards: turn them over
 *   files – the research files: open, read and play
 */
export type OverlayKey = 'map' | 'clues' | 'gaps' | 'steps' | 'cards' | 'files'

/** Where Sara floats. dock: beside the dialogue box. */
export type SaraSpot = 'dock'

/** What Sara's body is doing. */
export type SaraPose = 'idle' | 'wave' | 'think' | 'alarm' | 'present'

/** A place on the stage Sara can point at. Coordinates live in ./anchors.ts. */
export type AnchorKey = 'valley' | 'satellite' | 'ground' | 'tile' | 'tiles' | 'stamp' | 'patch' | 'map'

/**
 * A direction for Sara. Only the fields given change; the rest carry over
 * from the last cue. `point` is dropped whenever the background changes.
 */
export type SaraCue = { show?: boolean; at?: SaraSpot; pose?: SaraPose; point?: AnchorKey | null }

/**
 * What the radar map backdrop shows.
 *   whole  – the whole strip on the pass before the cyclone
 *   after  – the whole strip on the pass after it
 *   patch  – close on one field that went dark, with the reference map over it
 *   marked – the whole strip after the cyclone, with the reference map over it
 */
export type MapLook = 'whole' | 'after' | 'patch' | 'marked'

/**
 * Something the visitor does themselves.
 *   sweep  – drag the radar beam across the cloud
 *   pulse  – fire the radar and watch the echo
 *   window – find the village enough warning time
 *   cutoff – drag one cut-off across the histogram and keep it
 *   choice – pick an answer
 */
export type Interaction =
  | { kind: 'sweep' }
  | { kind: 'pulse' }
  | { kind: 'window' }
  | { kind: 'cutoff' }
  | { kind: 'choice'; options: string[]; answer: number }

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
 *   do    – the visitor acts (see Interaction); its line stays up meanwhile.
 *           Once done it no longer blocks, so coming back to it is a plain line.
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
 *   sara      – show, hide, pose or point the character
 *   look      – what the radar map backdrop shows; reset by a new background
 */
export type Step =
  | { say: string; button?: ButtonSpec; pace?: Pace }
  | { wait: number }
  | { open: OverlayKey }
  | { do: 'sweep' | 'pulse' | 'window' | 'cutoff'; say: string }
  | { do: 'choice'; say: string; options: string[]; answer: number }
  | { bg: BackdropKey }
  | { triptych: [PanelKey, PanelKey, PanelKey] }
  | { ui: boolean }
  | { camera: CameraShot }
  | { music: MusicCue }
  | { fact: FactKey | null }
  | { cover: Cover | null }
  | { chapter: ChapterMark | null }
  | { lesson: LessonStep }
  | { sara: SaraCue }
  | { look: MapLook }

export type Scene = {
  id: string
  /** Which chapter the scene belongs to, for the progress display and the look. */
  chapter: number
  steps: Step[]
}

export type Backdrop =
  | { kind: 'image'; key: BackdropKey }
  | { kind: 'triptych'; keys: [PanelKey, PanelKey, PanelKey] }
