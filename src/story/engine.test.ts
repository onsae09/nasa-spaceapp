import { describe, expect, it } from 'vitest'
import { getView, reduce, start, type State } from './engine'
import { buildStory } from './index'
import type { Scene } from './types'

const script: Scene[] = [
  {
    id: 'one',
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
      { id: 'a', steps: [{ bg: 'nepalFlood' }, { cover: 'clouds' }, { say: 'one' }, { cover: 'scan' }, { say: 'two' }] },
      { id: 'b', steps: [{ bg: 'space' }, { say: 'three' }] },
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


describe.each(['en', 'ko'] as const)('the whole story in %s', (lang) => {
  const story = buildStory(lang)

  it('plays both chapters, opening each interactive part once', () => {
    let state = start(story)
    const lines: string[] = []
    const scenes: string[] = []
    const overlays: string[] = []
    for (let guard = 0; guard < 300 && !state.finished; guard++) {
      const view = getView(story, state)
      if (view.sceneId && scenes.at(-1) !== view.sceneId) scenes.push(view.sceneId)
      if (view.line) lines.push(view.line)
      if (view.open) overlays.push(view.open)
      const type =
        view.open != null ? 'close' : view.waitMs != null ? 'waitDone' : view.button ? 'pressButton' : 'next'
      state = reduce(story, state, { type })
    }
    expect(state.finished).toBe(true)
    expect(scenes).toEqual([
      'character-intro',
      'trigger-line',
      'the-problem',
      'observation',
      'solutions',
      'deeper-observations',
    ])
    expect(overlays).toEqual(['map', 'cards', 'files'])
    // 13 lines in chapter 1, 18 in chapter 2 (4 of them the radar lesson).
    expect(lines).toHaveLength(31)
    expect(lines.every((line) => line.trim().length > 0)).toBe(true)
  })

  it('uses Hangul in Korean and none in English', () => {
    const lines = story.flatMap((scene) => scene.steps.flatMap((step) => ('say' in step ? [step.say] : [])))
    const hangul = lines.filter((line) => /[가-힣]/.test(line)).length
    expect(hangul).toBe(lang === 'ko' ? lines.length : 0)
  })

  it('never opens an overlay while the UI is hidden or a chapter card is up', () => {
    let state = start(story)
    for (let guard = 0; guard < 300 && !state.finished; guard++) {
      const view = getView(story, state)
      if (view.open) {
        expect(view.uiVisible).toBe(true)
        expect(view.chapter).toBeNull()
      }
      const type =
        view.open != null ? 'close' : view.waitMs != null ? 'waitDone' : view.button ? 'pressButton' : 'next'
      state = reduce(story, state, { type })
    }
  })
})
