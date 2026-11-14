import { describe, expect, it } from 'vitest'
import { getView, reduce, start, type State } from './engine'
import { chapter1 } from './chapter1'
import type { Scene } from './types'

const script: Scene[] = [
  {
    id: 'one',
    steps: [
      { bg: 'space' },
      { say: 'first' },
      { say: 'second', button: { label: 'Go', at: 'center' } },
    ],
  },
  {
    id: 'two',
    steps: [
      { ui: false },
      { bg: 'nepalFlood' },
      { wait: 3000 },
      { ui: true },
      { say: 'third' },
      { triptych: ['bangladesh', 'india', 'us'] },
      { say: 'fourth' },
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
