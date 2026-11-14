import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { allImageUrls, character, music } from './assets'
import { useSoundtrack } from './audio/useSoundtrack'
import { BackdropLayer } from './components/BackdropLayer'
import { CloudCover } from './components/CloudCover'
import { DialogueBox } from './components/DialogueBox'
import { FactPanel } from './components/FactPanel'
import { MusicToggle } from './components/MusicToggle'
import { Stage } from './components/Stage'
import { useTypewriter } from './components/useTypewriter'
import { EASE } from './motion'
import { chapter1 } from './story/chapter1'
import type { Backdrop } from './story/types'
import { useStory } from './story/useStory'

/** `?scene=2` starts at the second scene. Handy when checking one page. */
function sceneFromUrl() {
  const n = Number(new URLSearchParams(window.location.search).get('scene'))
  return Number.isInteger(n) && n >= 1 ? n - 1 : 0
}

const TITLE_BACKDROP: Backdrop = { kind: 'image', key: 'space' }
const OPENING_MS = 900

/**
 * title   – waiting for the first click or key press (also what unlocks sound)
 * opening – the title is fading out
 * story   – the story is playing
 */
type Phase = 'title' | 'opening' | 'story'

export default function App() {
  const [phase, setPhase] = useState<Phase>('title')
  const playing = phase === 'story'

  const { view, stepId, next, pressButton, restart } = useStory(chapter1, sceneFromUrl(), playing)
  const sound = useSoundtrack(music.src)
  const typing = useTypewriter(playing ? stepId : 'idle', playing ? (view.line ?? '') : '', view.pace)

  const speaking = playing && view.line != null && view.uiVisible
  const backdrop = playing ? view.backdrop : TITLE_BACKDROP
  const camera = playing ? view.camera : 'far'
  const cover = playing ? view.cover : null
  const diving = playing && camera === 'dive' && view.backdrop?.kind === 'image' && view.backdrop.key === 'space'

  const begin = useCallback(() => {
    sound.unlock()
    setPhase('opening')
  }, [sound.unlock])

  useEffect(() => {
    if (phase !== 'opening') return
    const id = setTimeout(() => setPhase('story'), OPENING_MS)
    return () => clearTimeout(id)
  }, [phase])

  // First click finishes the line that is still typing; the next one moves on.
  const advance = useCallback(() => {
    if (!speaking) return
    if (!typing.done) typing.finish()
    else next()
  }, [speaking, typing.done, typing.finish, next])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      if (phase === 'title') {
        if (!['Shift', 'Tab', 'Escape'].includes(e.key)) begin()
        return
      }
      if (e.key.toLowerCase() === 'm') return sound.toggle()
      if (!['Enter', ' ', 'ArrowRight'].includes(e.key)) return
      // A focused button handles Enter/Space itself.
      if (e.target instanceof HTMLButtonElement && e.key !== 'ArrowRight') return
      e.preventDefault()
      advance()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, begin, advance, sound.toggle])

  // The story decides what the soundtrack does.
  useEffect(() => {
    sound.setCue(playing ? view.music : 'silence')
  }, [playing, view.music, sound.setCue])

  useEffect(() => {
    if (diving) sound.whoosh()
  }, [diving, sound.whoosh])

  useEffect(() => {
    if (cover === 'scan') sound.ping()
  }, [cover, sound.ping])

  // A soft tick as the dialogue types: every second letter, never for spaces
  // or punctuation, and not when a click reveals the rest of the line at once.
  const typedRef = useRef(0)
  useEffect(() => {
    const previous = typedRef.current
    typedRef.current = typing.count
    if (!speaking || typing.count !== previous + 1 || typing.count % 2 !== 0) return
    if (/[\p{L}\p{N}]/u.test(view.line?.[typing.count - 1] ?? '')) sound.blip()
  }, [typing.count, speaking, view.line, sound.blip])

  // Load every image up front so scene changes do not flash.
  useEffect(() => {
    allImageUrls.forEach((url) => {
      new Image().src = url
    })
  }, [])

  const button = speaking && typing.done ? view.button : null

  return (
    <MotionConfig reducedMotion="user">
      <Stage onClick={phase === 'title' ? begin : advance}>
        <BackdropLayer backdrop={backdrop} camera={camera} />
        <CloudCover cover={cover} />

        {/* The white-out at the end of the dive; clears once the photo is in. */}
        <motion.div
          className="haze"
          initial={false}
          animate={{ opacity: diving ? 1 : 0 }}
          transition={diving ? { duration: 1.2, delay: 0.6, ease: 'easeIn' } : { duration: 1.4, ease: EASE }}
        />

        <AnimatePresence>
          {phase === 'title' && (
            <motion.div
              key="title"
              className="title"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <p className="stamp">NASA Space Apps Challenge 2026</p>
              <h1 className="title-name">Dancing with the SARs</h1>
              <p className="title-line">A flood, seen from orbit</p>
              <p className="title-prompt">Click or press any key to begin</p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {playing && view.uiVisible && view.fact && <FactPanel key={view.fact} id={view.fact} />}
        </AnimatePresence>

        <AnimatePresence>
          {playing && view.uiVisible && !view.finished && (
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
              <motion.div
                className="character"
                initial={{ opacity: 0, x: -48 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                <img className="character-art" src={character.src} alt={character.alt} draggable={false} />
              </motion.div>
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
          <motion.div
            className="end-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
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
          {playing && (view.uiVisible || view.finished) && (
            <motion.div
              key="music"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <MusicToggle muted={sound.muted} onToggle={sound.toggle} />
            </motion.div>
          )}
        </AnimatePresence>
      </Stage>
    </MotionConfig>
  )
}
