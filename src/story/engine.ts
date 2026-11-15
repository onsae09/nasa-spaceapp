import type {
  AnchorKey,
  Backdrop,
  ButtonSpec,
  CameraShot,
  ChapterMark,
  Cover,
  FactKey,
  Interaction,
  LessonStep,
  MapLook,
  MusicCue,
  OverlayKey,
  Pace,
  SaraPose,
  SaraSpot,
  Scene,
  Step,
} from './types'

/** Where the story is. Always rests on a blocking step, or is finished. */
export type State = {
  scene: number
  step: number
  finished: boolean
  /** The furthest position ever rested on (see `position`). Going back keeps it. */
  reached: number
}

export type Action =
  | { type: 'next' }
  | { type: 'pressButton' }
  | { type: 'waitDone' }
  | { type: 'close' }
  /** The visitor finished the interaction of a `do` step. */
  | { type: 'done' }
  | { type: 'back' }
  | { type: 'restart' }

/** Sara as the screen should draw her now. */
export type SaraView = { show: boolean; at: SaraSpot; pose: SaraPose; point: AnchorKey | null }

/** Everything the screen needs to draw the current moment. */
export type View = {
  sceneId: string | null
  backdrop: Backdrop | null
  uiVisible: boolean
  camera: CameraShot
  music: MusicCue
  fact: FactKey | null
  cover: Cover | null
  chapter: ChapterMark | null
  lesson: LessonStep
  sara: SaraView
  look: MapLook
  /** The interactive overlay the story is waiting on, if any. */
  open: OverlayKey | null
  /** What the visitor has to do on this step, if anything. */
  interaction: Interaction | null
  line: string | null
  pace: Pace
  button: ButtonSpec | null
  waitMs: number | null
  finished: boolean
  /** True on a step the visitor has already been past: no typing, no sounds, no blocking. */
  revisit: boolean
  canBack: boolean
  /** The chapter of the current scene (the last one, once finished). */
  chapterNo: number
  /** Which stop of the current chapter this is, counting from 1. */
  progress: { index: number; total: number }
}

const isBlocking = (step: Step) => 'say' in step || 'wait' in step || 'open' in step
/** A step the visitor can come back to: a line, with or without something to do. */
const isStop = (step: Step) => 'say' in step

/** One number for a place in the script, so two places can be compared. */
const position = (scene: number, step: number) => scene * 10000 + step

/** Move forward from (scene, step) to the first blocking step at or after it. */
function settle(script: Scene[], scene: number, step: number) {
  while (scene < script.length) {
    const steps = script[scene].steps
    while (step < steps.length) {
      if (isBlocking(steps[step])) return { scene, step, finished: false }
      step++
    }
    scene++
    step = 0
  }
  return { scene: script.length, step: 0, finished: true }
}

/** The last stop before (scene, step), or null if there is none. */
function settleBack(script: Scene[], scene: number, step: number) {
  for (let s = Math.min(scene, script.length - 1); s >= 0; s--) {
    const steps = script[s].steps
    for (let i = (s === scene ? step : steps.length) - 1; i >= 0; i--) {
      if (isStop(steps[i])) return { scene: s, step: i, finished: false }
    }
  }
  return null
}

export function start(script: Scene[], scene = 0): State {
  const clamped = Math.min(Math.max(scene, 0), script.length - 1)
  const at = settle(script, clamped, 0)
  return { ...at, reached: position(at.scene, at.step) }
}

function currentStep(script: Scene[], state: State): Step | null {
  if (state.finished) return null
  return script[state.scene].steps[state.step]
}

const isRevisit = (state: State) => position(state.scene, state.step) < state.reached

export function reduce(script: Scene[], state: State, action: Action): State {
  if (action.type === 'restart') return start(script)

  if (action.type === 'back') {
    const at = settleBack(script, state.scene, state.step)
    return at ? { ...at, reached: state.reached } : state
  }

  const step = currentStep(script, state)
  if (!step) return state

  const advance = (): State => {
    const at = settle(script, state.scene, state.step + 1)
    return { ...at, reached: Math.max(state.reached, position(at.scene, at.step)) }
  }

  switch (action.type) {
    case 'next':
      // A `do` step carries a line too, so it has to be tested first.
      if ('do' in step) return isRevisit(state) ? advance() : state
      return 'say' in step && !step.button ? advance() : state
    case 'pressButton':
      return 'say' in step && !('do' in step) && step.button ? advance() : state
    case 'done':
      return 'do' in step ? advance() : state
    case 'waitDone':
      return 'wait' in step ? advance() : state
    case 'close':
      return 'open' in step ? advance() : state
  }
}

function interactionOf(step: Step | null): Interaction | null {
  if (!step || !('do' in step)) return null
  if (step.do === 'choice') return { kind: 'choice', options: step.options, answer: step.answer }
  return { kind: step.do }
}

export function getView(script: Scene[], state: State): View {
  let backdrop: Backdrop | null = null
  let uiVisible = true
  let camera: CameraShot = 'far'
  let music: MusicCue = 'silence'
  let fact: FactKey | null = null
  let cover: Cover | null = null
  let chapter: ChapterMark | null = null
  let lesson: LessonStep = 'send'
  let sara: SaraView = { show: false, at: 'dock', pose: 'idle', point: null }
  let look: MapLook = 'whole'

  // Replay every instant step up to the current position.
  const lastScene = Math.min(state.scene, script.length - 1)
  for (let s = 0; s <= lastScene; s++) {
    const steps = script[s].steps
    const end = s === state.scene ? state.step : steps.length - 1
    for (let i = 0; i <= end && i < steps.length; i++) {
      const step = steps[i]
      if ('bg' in step) {
        backdrop = { kind: 'image', key: step.bg }
        cover = null
        look = 'whole'
        sara = { ...sara, point: null }
      } else if ('triptych' in step) {
        backdrop = { kind: 'triptych', keys: step.triptych }
        cover = null
        look = 'whole'
        sara = { ...sara, point: null }
      } else if ('cover' in step) cover = step.cover
      else if ('chapter' in step) chapter = step.chapter
      else if ('lesson' in step) lesson = step.lesson
      else if ('ui' in step) uiVisible = step.ui
      else if ('camera' in step) camera = step.camera
      else if ('music' in step) music = step.music
      else if ('fact' in step) fact = step.fact
      else if ('sara' in step) sara = { ...sara, ...step.sara }
      else if ('look' in step) look = step.look
    }
  }

  // Count the stops of the current chapter, and how many lie at or before here.
  const chapterNo = script[lastScene].chapter
  let index = 0
  let total = 0
  script.forEach((scene, s) => {
    if (scene.chapter !== chapterNo) return
    scene.steps.forEach((step, i) => {
      if (!isStop(step)) return
      total++
      if (position(s, i) <= position(state.scene, state.step)) index++
    })
  })

  const step = currentStep(script, state)
  const line = step && 'say' in step ? step : null
  return {
    sceneId: state.finished ? null : script[state.scene].id,
    backdrop,
    uiVisible,
    camera,
    music,
    fact,
    cover,
    chapter,
    lesson,
    sara,
    look,
    open: step && 'open' in step ? step.open : null,
    interaction: interactionOf(step),
    line: line ? line.say : null,
    pace: line && !('do' in line) ? (line.pace ?? 'normal') : 'normal',
    button: line && !('do' in line) ? (line.button ?? null) : null,
    waitMs: step && 'wait' in step ? step.wait : null,
    finished: state.finished,
    revisit: isRevisit(state),
    canBack: settleBack(script, state.scene, state.step) != null,
    chapterNo,
    progress: { index: Math.max(index, 1), total },
  }
}
