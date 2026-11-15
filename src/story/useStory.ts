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

  useEffect(() => {
    if (view.waitMs == null || !running) return
    const id = setTimeout(() => dispatch({ type: 'waitDone' }), view.waitMs)
    return () => clearTimeout(id)
  }, [state.scene, state.step, view.waitMs, running])

  return {
    view,
    /** Changes whenever the story moves to a different step. */
    stepId: `${state.scene}:${state.step}`,
    next: useCallback(() => dispatch({ type: 'next' }), []),
    pressButton: useCallback(() => dispatch({ type: 'pressButton' }), []),
    restart: useCallback(() => dispatch({ type: 'restart' }), []),
    /** Closes the interactive overlay the story is waiting on. */
    close: useCallback(() => dispatch({ type: 'close' }), []),
  }
}
