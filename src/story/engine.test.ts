import { describe, expect, it } from 'vitest'
import { getView, reduce, start, type State } from './engine'
import { chapter1 } from './chapter1'
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
    expect([first.camera, first.music, first.fact]).toEqual(['stars', 'ambience', null])

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

describe('chapter 1 script', () => {
  it('plays through all 13 lines in three scenes and then finishes', () => {
    let state = start(chapter1)
    const lines: string[] = []
    const scenes = new Set<string>()
    for (let guard = 0; guard < 100 && !state.finished; guard++) {
      const view = getView(chapter1, state)
      if (view.sceneId) scenes.add(view.sceneId)
      if (view.line) lines.push(view.line)
      const type = view.waitMs != null ? 'waitDone' : view.button ? 'pressButton' : 'next'
      state = reduce(chapter1, state, { type })
    }
    expect(state.finished).toBe(true)
    expect(lines).toHaveLength(13)
    expect([...scenes]).toEqual(['character-intro', 'trigger-line', 'the-problem'])
  })
})
