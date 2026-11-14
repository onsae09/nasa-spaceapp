import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { getView, reduce, start, type Action, type State } from './engine'
import type { Scene } from './types'

/** Connects the story engine to React and runs the timer for `wait` steps. */
export function useStory(script: Scene[], startScene = 0) {
  const [state, dispatch] = useReducer(
    (s: State, a: Action) => reduce(script, s, a),
    undefined,
    () => start(script, startScene),
  )
  const view = useMemo(() => getView(script, state), [script, state])

  useEffect(() => {
    if (view.waitMs == null) return
    const id = setTimeout(() => dispatch({ type: 'waitDone' }), view.waitMs)
    return () => clearTimeout(id)
  }, [state.scene, state.step, view.waitMs])

  return {
    view,
    /** Changes whenever the story moves to a different step. */
    stepId: `${state.scene}:${state.step}`,
    next: useCallback(() => dispatch({ type: 'next' }), []),
    pressButton: useCallback(() => dispatch({ type: 'pressButton' }), []),
    restart: useCallback(() => dispatch({ type: 'restart' }), []),
  }
}
