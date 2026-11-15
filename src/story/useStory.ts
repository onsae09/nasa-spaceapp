import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { getView, reduce, start, type Action, type State } from './engine'
import type { Scene } from './types'

/**
 * Connects the story engine to React and runs the timer for `wait` steps.
 * While `running` is false the story holds still (used behind the title screen).
 */
export function useStory(script: Scene[], startScene = 0, running = true) {
  const [state, dispatch] = useReducer(
    (s: State, a: Action) => reduce(script, s, a),
    undefined,
    () => start(script, startScene),
  )
  const view = useMemo(() => getView(script, state), [script, state])

  // A pause the visitor has already sat through is not repeated.
  const waitMs = view.waitMs == null ? null : view.revisit ? 0 : view.waitMs
  useEffect(() => {
    if (waitMs == null || !running) return
    const id = setTimeout(() => dispatch({ type: 'waitDone' }), waitMs)
    return () => clearTimeout(id)
  }, [state.scene, state.step, waitMs, running])

  return {
    view,
    /** Changes whenever the story moves to a different step. */
    stepId: `${state.scene}:${state.step}`,
    next: useCallback(() => dispatch({ type: 'next' }), []),
    pressButton: useCallback(() => dispatch({ type: 'pressButton' }), []),
    restart: useCallback(() => dispatch({ type: 'restart' }), []),
    /** Returns to the previous line. */
    back: useCallback(() => dispatch({ type: 'back' }), []),
    /** Goes to the start of a chapter. */
    toChapter: useCallback(
      (chapter: number) => {
        const scene = script.findIndex((s) => s.chapter === chapter)
        if (scene >= 0) dispatch({ type: 'jump', scene })
      },
      [script],
    ),
    /** The visitor finished what the current step asked them to do. */
    done: useCallback(() => dispatch({ type: 'done' }), []),
    /** Closes the interactive overlay the story is waiting on. */
    close: useCallback(() => dispatch({ type: 'close' }), []),
  }
}
