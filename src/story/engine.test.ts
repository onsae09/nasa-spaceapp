import { describe, expect, it } from 'vitest'
import { getView, reduce, start, type Action, type State } from './engine'
import { buildStory } from './index'
import type { Scene } from './types'

const script: Scene[] = [
  {
    id: 'one',
    chapter: 1,
    steps: [
      { bg: 'space' },
      { music: 'ambience' },
      { say: 'first' },
      { camera: 'earth' },
      { say: 'second', button: { label: 'Go', at: 'center' } },
    ],
  },
  {
    id: 'two',
    chapter: 1,
    steps: [
      { ui: false },
      { music: 'silence' },
      { camera: 'dive' },
      { bg: 'nepalFlood' },
      { wait: 3000 },
      { ui: true },
      { music: 'theme' },
      { fact: 'nepalToll' },
      { say: 'third' },
      { fact: null },
      { cover: 'clouds' },
      { triptych: ['bangladesh', 'india', 'us'] },
      { say: 'fourth', pace: 'slow' },
    ],
  },
]

const run = (state: State, ...types: Array<'next' | 'pressButton' | 'waitDone' | 'restart'>) =>
  types.reduce((s, type) => reduce(script, s, { type }), state)

describe('story engine', () => {
  it('starts on the first line with instant steps already applied', () => {
    const view = getView(script, start(script))
    expect(view.line).toBe('first')
    expect(view.backdrop).toEqual({ kind: 'image', key: 'space' })
    expect(view.uiVisible).toBe(true)
    expect(view.sceneId).toBe('one')
  })

  it('advances a plain line on next', () => {
    expect(getView(script, run(start(script), 'next')).line).toBe('second')
  })

  it('holds a line with a button until the button is pressed', () => {
    const onButtonLine = run(start(script), 'next')
    expect(getView(script, onButtonLine).button).toEqual({ label: 'Go', at: 'center' })
    expect(run(onButtonLine, 'next')).toEqual(onButtonLine)
    expect(getView(script, run(onButtonLine, 'pressButton')).sceneId).toBe('two')
  })

  it('ignores pressButton on a line without a button', () => {
    const s = start(script)
    expect(run(s, 'pressButton')).toEqual(s)
  })

  it('hides the UI and ignores clicks during a wait', () => {
    const waiting = run(start(script), 'next', 'pressButton')
    const view = getView(script, waiting)
    expect(view.waitMs).toBe(3000)
    expect(view.uiVisible).toBe(false)
    expect(view.line).toBeNull()
    expect(view.backdrop).toEqual({ kind: 'image', key: 'nepalFlood' })
    expect(run(waiting, 'next')).toEqual(waiting)
  })

  it('brings the UI back when the wait ends', () => {
    const view = getView(script, run(start(script), 'next', 'pressButton', 'waitDone'))
    expect(view.uiVisible).toBe(true)
    expect(view.line).toBe('third')
  })

  it('swaps the backdrop for the triptych', () => {
    const view = getView(script, run(start(script), 'next', 'pressButton', 'waitDone', 'next'))
    expect(view.line).toBe('fourth')
    expect(view.backdrop).toEqual({ kind: 'triptych', keys: ['bangladesh', 'india', 'us'] })
  })

  it('tracks the camera, the music cue and the fact panel', () => {
    const first = getView(script, start(script))
    expect([first.camera, first.music, first.fact]).toEqual(['far', 'ambience', null])

    const second = getView(script, run(start(script), 'next'))
    expect(second.camera).toBe('earth')

    const waiting = getView(script, run(start(script), 'next', 'pressButton'))
    expect([waiting.camera, waiting.music]).toEqual(['dive', 'silence'])

    const third = getView(script, run(start(script), 'next', 'pressButton', 'waitDone'))
    expect([third.music, third.fact]).toEqual(['theme', 'nepalToll'])

    const fourth = getView(script, run(start(script), 'next', 'pressButton', 'waitDone', 'next'))
    expect(fourth.fact).toBeNull()
  })

  it('reports the pace of the current line', () => {
    expect(getView(script, start(script)).pace).toBe('normal')
    const fourth = getView(script, run(start(script), 'next', 'pressButton', 'waitDone', 'next'))
    expect(fourth.pace).toBe('slow')
  })

  it('clears the cloud cover when the background changes', () => {
    const covered: Scene[] = [
      { id: 'a', chapter: 1, steps: [{ bg: 'nepalFlood' }, { cover: 'clouds' }, { say: 'one' }, { cover: 'scan' }, { say: 'two' }] },
      { id: 'b', chapter: 1, steps: [{ bg: 'space' }, { say: 'three' }] },
    ]
    const at = (n: number) => {
      let s = start(covered)
      for (let i = 0; i < n; i++) s = reduce(covered, s, { type: 'next' })
      return getView(covered, s).cover
    }
    expect([at(0), at(1), at(2)]).toEqual(['clouds', 'scan', null])
  })

  it('waits on an overlay until it is closed, and shows chapter cards', () => {
    const interactive: Scene[] = [
      {
        id: 'a',
        chapter: 1,
        steps: [
          { chapter: { number: 2, title: 'Observation' } },
          { wait: 100 },
          { chapter: null },
          { say: 'look' },
          { open: 'map' },
          { say: 'after' },
        ],
      },
    ]
    let s = start(interactive)
    expect(getView(interactive, s).chapter).toEqual({ number: 2, title: 'Observation' })
    s = reduce(interactive, s, { type: 'waitDone' })
    expect(getView(interactive, s).chapter).toBeNull()
    s = reduce(interactive, s, { type: 'next' })
    expect(getView(interactive, s).open).toBe('map')
    expect(getView(interactive, s).line).toBeNull()
    // Clicks and timers do not get past an open overlay.
    expect(reduce(interactive, s, { type: 'next' })).toEqual(s)
    expect(reduce(interactive, s, { type: 'waitDone' })).toEqual(s)
    s = reduce(interactive, s, { type: 'close' })
    expect(getView(interactive, s).open).toBeNull()
    expect(getView(interactive, s).line).toBe('after')
  })

  it('finishes after the last line and keeps the last backdrop', () => {
    const done = run(start(script), 'next', 'pressButton', 'waitDone', 'next', 'next')
    const view = getView(script, done)
    expect(view.finished).toBe(true)
    expect(view.line).toBeNull()
    expect(view.backdrop?.kind).toBe('triptych')
    expect(run(done, 'next')).toEqual(done)
  })

  it('restarts from the beginning', () => {
    const done = run(start(script), 'next', 'pressButton', 'waitDone', 'next', 'next')
    expect(run(done, 'restart')).toEqual(start(script))
  })

  it('can start from a later scene', () => {
    const view = getView(script, start(script, 1))
    expect(view.sceneId).toBe('two')
    expect(view.waitMs).toBe(3000)
  })
})


describe('going back, and things the visitor does', () => {
  const acts: Scene[] = [
    {
      id: 'a',
      chapter: 1,
      steps: [
        { bg: 'nepalFlood' },
        { say: 'one' },
        { cover: 'clouds' },
        { sara: { show: true, pose: 'wave', point: 'valley' } },
        { do: 'sweep', say: 'sweep it' },
        { cover: null },
        { sara: { pose: 'idle' } },
        { say: 'two' },
      ],
    },
    {
      id: 'b',
      chapter: 2,
      steps: [
        { ui: false },
        { chapter: { number: 2, title: 'Two' } },
        { wait: 500 },
        { chapter: null },
        { ui: true },
        { bg: 'amphanSwath' },
        { look: 'patch' },
        { do: 'choice', say: 'pick', options: ['x', 'y'], answer: 1 },
        { open: 'map' },
        { say: 'three' },
      ],
    },
  ]
  const play = (state: State, ...types: Action['type'][]) =>
    types.reduce((s, type) => reduce(acts, s, { type } as Action), state)
  const line = (state: State) => getView(acts, state).line

  it('does nothing at the first line', () => {
    const s = start(acts)
    expect(getView(acts, s).canBack).toBe(false)
    expect(play(s, 'back')).toEqual(s)
  })

  it('holds a step with something to do until it is done', () => {
    const waiting = play(start(acts), 'next')
    const view = getView(acts, waiting)
    expect(view.line).toBe('sweep it')
    expect(view.interaction).toEqual({ kind: 'sweep' })
    expect(view.cover).toBe('clouds')
    expect(play(waiting, 'next')).toEqual(waiting)
    expect(play(waiting, 'pressButton')).toEqual(waiting)
    expect(line(play(waiting, 'done'))).toBe('two')
  })

  it('shows the same moment after stepping on and back', () => {
    const before = play(start(acts), 'next')
    const after = play(before, 'done', 'back')
    expect(getView(acts, after)).toEqual({ ...getView(acts, before), revisit: true })
  })

  it('lets a finished interaction be passed like a plain line', () => {
    const again = play(start(acts), 'next', 'done', 'back')
    expect(getView(acts, again).revisit).toBe(true)
    expect(line(play(again, 'next'))).toBe('two')
    // The furthest point is new again, so it is not a revisit.
    expect(getView(acts, play(again, 'next')).revisit).toBe(false)
  })

  it('never rests on a pause, a chapter card or an overlay when going back', () => {
    let s = play(start(acts), 'next', 'done', 'next', 'waitDone', 'done', 'close')
    expect(line(s)).toBe('three')
    const seen: (string | null)[] = []
    while (getView(acts, s).canBack) {
      s = play(s, 'back')
      const view = getView(acts, s)
      expect(view.waitMs).toBeNull()
      expect(view.open).toBeNull()
      expect(view.chapter).toBeNull()
      seen.push(view.line)
    }
    expect(seen).toEqual(['pick', 'two', 'sweep it', 'one'])
  })

  it('skips a pause already sat through, and goes back from the end', () => {
    const end = play(start(acts), 'next', 'done', 'next', 'waitDone', 'done', 'close', 'next')
    expect(end.finished).toBe(true)
    expect(line(play(end, 'back'))).toBe('three')
    // Back to the first chapter and forward again: the card's pause is a revisit.
    const pause = play(end, 'back', 'back', 'back', 'next')
    expect(getView(acts, pause).waitMs).toBe(500)
    expect(getView(acts, pause).revisit).toBe(true)
  })

  it('carries Sara from cue to cue and drops what she points at with the background', () => {
    const sweeping = getView(acts, play(start(acts), 'next'))
    expect(sweeping.sara).toEqual({ show: true, at: 'dock', pose: 'wave', point: 'valley' })
    const two = getView(acts, play(start(acts), 'next', 'done'))
    expect(two.sara).toEqual({ show: true, at: 'dock', pose: 'idle', point: 'valley' })
    const pick = getView(acts, play(start(acts), 'next', 'done', 'next', 'waitDone'))
    expect(pick.sara.point).toBeNull()
    expect(pick.look).toBe('patch')
    expect(pick.interaction).toEqual({ kind: 'choice', options: ['x', 'y'], answer: 1 })
  })

  it('jumps to the start of a scene, and remembers how far the visitor got', () => {
    const far = play(start(acts), 'next', 'done', 'next', 'waitDone')
    expect(line(far)).toBe('pick')
    const home = reduce(acts, far, { type: 'jump', scene: 0 })
    expect(line(home)).toBe('one')
    expect(getView(acts, home).revisit).toBe(true)
    // Jumping ahead of anything seen is a first visit: the chapter card's pause runs.
    const ahead = reduce(acts, start(acts), { type: 'jump', scene: 1 })
    expect(getView(acts, ahead).waitMs).toBe(500)
    expect(getView(acts, ahead).revisit).toBe(false)
  })

  it('counts the stops of the current chapter', () => {
    expect(getView(acts, start(acts)).progress).toEqual({ index: 1, total: 3 })
    const pick = getView(acts, play(start(acts), 'next', 'done', 'next', 'waitDone'))
    expect([pick.chapterNo, pick.progress]).toEqual([2, { index: 1, total: 2 }])
  })
})

/** Plays the story the way a visitor would, calling `see` at every stop. */
function playThrough(story: Scene[], see: (view: ReturnType<typeof getView>) => void) {
  let state = start(story)
  for (let guard = 0; guard < 300 && !state.finished; guard++) {
    const view = getView(story, state)
    see(view)
    const type: Action['type'] =
      view.open != null
        ? 'close'
        : view.waitMs != null
          ? 'waitDone'
          : view.interaction
            ? 'done'
            : view.button
              ? 'pressButton'
              : 'next'
    state = reduce(story, state, { type } as Action)
  }
  return state
}

/** A judge has five to ten minutes: the story has to stay this short. */
const BUDGET = { chapter1: 9, chapter2: 16, chapter3: 12, words: 12, hangul: 40 }

describe.each(['en', 'ko'] as const)('the whole story in %s', (lang) => {
  const story = buildStory(lang)

  it('plays all three chapters within the length budget', () => {
    const lines: Record<number, string[]> = { 1: [], 2: [], 3: [] }
    const scenes: string[] = []
    const overlays: string[] = []
    const end = playThrough(story, (view) => {
      if (view.sceneId && scenes.at(-1) !== view.sceneId) scenes.push(view.sceneId)
      if (view.line) lines[view.chapterNo].push(view.line)
      if (view.open) overlays.push(view.open)
    })
    expect(end.finished).toBe(true)
    expect(scenes).toEqual(['missed', 'reminder', 'echo', 'hunt', 'gaps', 'window', 'briefing'])
    expect(overlays).toEqual(['map', 'cards', 'files'])
    expect(lines[1].length).toBeLessThanOrEqual(BUDGET.chapter1)
    expect(lines[2].length).toBeLessThanOrEqual(BUDGET.chapter2)
    expect(lines[3].length).toBeLessThanOrEqual(BUDGET.chapter3)
    for (const line of [...lines[1], ...lines[2], ...lines[3]]) {
      expect(line.trim().length).toBeGreaterThan(0)
      if (lang === 'en') expect(line.split(/\s+/).length, line).toBeLessThanOrEqual(BUDGET.words)
      else expect(line.length, line).toBeLessThanOrEqual(BUDGET.hangul)
    }
  })

  it('speaks to the visitor, not about the team', () => {
    if (lang !== 'en') return
    const lines = story.flatMap((scene) => scene.steps.flatMap((step) => ('say' in step ? [step.say] : [])))
    expect(lines.filter((line) => /\b(we|our)\b/i.test(line))).toEqual([])
  })

  it('uses Hangul in Korean and none in English', () => {
    const lines = story.flatMap((scene) => scene.steps.flatMap((step) => ('say' in step ? [step.say] : [])))
    const hangul = lines.filter((line) => /[가-힣]/.test(line)).length
    expect(hangul).toBe(lang === 'ko' ? lines.length : 0)

    // Buttons and answers are words too, except answers that are plain numbers.
    const labels = story.flatMap((scene) =>
      scene.steps.flatMap((step) =>
        'do' in step && step.do === 'choice'
          ? step.options
          : 'say' in step && !('do' in step) && step.button
            ? [step.button.label]
            : [],
      ),
    )
    const words = labels.filter((label) => !/^\d+$/.test(label))
    expect(words.length).toBeGreaterThan(0)
    expect(words.filter((label) => /[가-힣]/.test(label)).length).toBe(lang === 'ko' ? words.length : 0)
  })

  it('sets each interaction where it can be done, and never opens an overlay blind', () => {
    playThrough(story, (view) => {
      if (view.open) {
        expect(view.uiVisible).toBe(true)
        expect(view.chapter).toBeNull()
      }
      if (view.line) expect(view.camera === 'dive' && view.backdrop?.kind === 'image' && view.backdrop.key === 'space').toBe(false)
      if (view.interaction) expect(view.uiVisible).toBe(true)
      if (view.interaction?.kind === 'sweep') expect(view.cover).toBe('clouds')
      if (view.interaction?.kind === 'pulse') expect(view.backdrop).toEqual({ kind: 'image', key: 'radarLesson' })
      if (view.interaction?.kind === 'window') expect(view.backdrop).toEqual({ kind: 'image', key: 'warningWindow' })
      if (view.interaction?.kind === 'choice') {
        expect(view.interaction.options[view.interaction.answer]).toBeDefined()
      }
    })
  })
})
