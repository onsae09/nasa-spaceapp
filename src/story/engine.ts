import type { Backdrop, ButtonSpec, CameraShot, Cover, FactKey, MusicCue, Pace, Scene, Step } from './types'

/** Where the story is. Always rests on a blocking step, or is finished. */
export type State = {
  scene: number
  step: number
  finished: boolean
}

export type Action =
  | { type: 'next' }
  | { type: 'pressButton' }
  | { type: 'waitDone' }
  | { type: 'restart' }

/** Everything the screen needs to draw the current moment. */
export type View = {
  sceneId: string | null
  backdrop: Backdrop | null
  uiVisible: boolean
  camera: CameraShot
  music: MusicCue
  fact: FactKey | null
  cover: Cover | null
  line: string | null
  pace: Pace
  button: ButtonSpec | null
  waitMs: number | null
  finished: boolean
}

const isBlocking = (step: Step) => 'say' in step || 'wait' in step

/** Move forward from (scene, step) to the first blocking step at or after it. */
function settle(script: Scene[], scene: number, step: number): State {
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

export function start(script: Scene[], scene = 0): State {
  const clamped = Math.min(Math.max(scene, 0), script.length - 1)
  return settle(script, clamped, 0)
}

function currentStep(script: Scene[], state: State): Step | null {
  if (state.finished) return null
  return script[state.scene].steps[state.step]
}

export function reduce(script: Scene[], state: State, action: Action): State {
  if (action.type === 'restart') return start(script)

  const step = currentStep(script, state)
  if (!step) return state

  const advance = () => settle(script, state.scene, state.step + 1)

  switch (action.type) {
    case 'next':
      return 'say' in step && !step.button ? advance() : state
    case 'pressButton':
      return 'say' in step && step.button ? advance() : state
    case 'waitDone':
      return 'wait' in step ? advance() : state
  }
}

export function getView(script: Scene[], state: State): View {
  let backdrop: Backdrop | null = null
  let uiVisible = true
  let camera: CameraShot = 'far'
  let music: MusicCue = 'silence'
  let fact: FactKey | null = null
  let cover: Cover | null = null

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
      } else if ('triptych' in step) {
        backdrop = { kind: 'triptych', keys: step.triptych }
        cover = null
      } else if ('cover' in step) cover = step.cover
      else if ('ui' in step) uiVisible = step.ui
      else if ('camera' in step) camera = step.camera
      else if ('music' in step) music = step.music
      else if ('fact' in step) fact = step.fact
    }
  }

  const step = currentStep(script, state)
  return {
    sceneId: state.finished ? null : script[state.scene].id,
    backdrop,
    uiVisible,
    camera,
    music,
    fact,
    cover,
    line: step && 'say' in step ? step.say : null,
    pace: step && 'say' in step ? (step.pace ?? 'normal') : 'normal',
    button: step && 'say' in step ? (step.button ?? null) : null,
    waitMs: step && 'wait' in step ? step.wait : null,
    finished: state.finished,
  }
}
