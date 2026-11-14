import { useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { allImageUrls, character, music } from './assets'
import { useMusic } from './audio/useMusic'
import { BackdropLayer } from './components/BackdropLayer'
import { DialogueBox } from './components/DialogueBox'
import { MusicToggle } from './components/MusicToggle'
import { Stage } from './components/Stage'
import { useTypewriter } from './components/useTypewriter'
import { chapter1 } from './story/chapter1'
import { EASE } from './motion'
import { useStory } from './story/useStory'

/** `?scene=2` starts at the second scene. Handy when checking one page. */
function sceneFromUrl() {
  const n = Number(new URLSearchParams(window.location.search).get('scene'))
  return Number.isInteger(n) && n >= 1 ? n - 1 : 0
}

export default function App() {
  const { view, stepId, next, pressButton, restart } = useStory(chapter1, sceneFromUrl())
  const typing = useTypewriter(stepId, view.line ?? '')
  const speaking = view.line != null && view.uiVisible
  const { muted, toggle: toggleMusic } = useMusic(music.src)

  // First click finishes the line that is still typing; the next one moves on.
  const advance = useCallback(() => {
    if (!speaking) return
    if (!typing.done) typing.finish()
    else next()
  }, [speaking, typing.done, typing.finish, next])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.key.toLowerCase() === 'm') return toggleMusic()
      if (!['Enter', ' ', 'ArrowRight'].includes(e.key)) return
      // A focused button handles Enter/Space itself.
      if (e.target instanceof HTMLButtonElement && e.key !== 'ArrowRight') return
      e.preventDefault()
      advance()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance, toggleMusic])

  // Load every image up front so scene changes do not flash.
  useEffect(() => {
    allImageUrls.forEach((url) => {
      new Image().src = url
    })
  }, [])

  const button = speaking && typing.done ? view.button : null

  return (
    <Stage onClick={advance}>
      <BackdropLayer backdrop={view.backdrop} />

      <AnimatePresence>
        {view.uiVisible && !view.finished && (
          <motion.div
            key="ui"
            className="ui"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {view.line != null && (
              <DialogueBox text={view.line} count={typing.count} done={typing.done} showHint={!view.button} />
            )}
            <img className="character" src={character.src} alt={character.alt} draggable={false} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {button && (
          <motion.button
            key={stepId}
            type="button"
            className={`story-button story-button--${button.at}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => {
              e.stopPropagation()
              pressButton()
            }}
          >
            {button.label}
          </motion.button>
        )}
      </AnimatePresence>

      {view.finished && (
        <motion.div className="end-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: EASE }}>
          <p className="end-card-eyebrow">Chapter 2</p>
          <h1 className="end-card-title">Observation</h1>
          <p className="end-card-note">Coming soon</p>
          <button
            type="button"
            className="story-button"
            onClick={(e) => {
              e.stopPropagation()
              restart()
            }}
          >
            Back to start
          </button>
          <p className="stamp end-card-credit">{music.credit}</p>
        </motion.div>
      )}

      {/* Hidden with the rest of the UI while a photo is shown on its own. */}
      <AnimatePresence>
        {(view.uiVisible || view.finished) && (
          <motion.div
            key="music"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <MusicToggle muted={muted} onToggle={toggleMusic} />
          </motion.div>
        )}
      </AnimatePresence>
    </Stage>
  )
}
