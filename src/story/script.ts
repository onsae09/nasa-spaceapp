import type { L } from '../i18n'
import type { BackdropKey, CameraShot, Cover, FactKey, LessonStep, MusicCue, OverlayKey, Pace, PanelKey } from './types'

/**
 * How the chapters are written: the same steps the engine plays (see
 * ./types.ts), with every piece of text given in each language.
 * `buildStory` in ./index.ts turns these into one language's story.
 */
export type ScriptStep =
  | { say: L; button?: { label: L; at: 'center' | 'corner' }; pace?: Pace }
  | { wait: number }
  | { open: OverlayKey }
  | { bg: BackdropKey }
  | { triptych: [PanelKey, PanelKey, PanelKey] }
  | { ui: boolean }
  | { camera: CameraShot }
  | { music: MusicCue }
  | { fact: FactKey | null }
  | { cover: Cover | null }
  | { lesson: LessonStep }
  | { chapter: { number: number; title: L } | null }

export type ScriptScene = {
  id: string
  steps: ScriptStep[]
}
