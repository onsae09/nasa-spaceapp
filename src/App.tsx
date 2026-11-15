import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { allImageUrls, music } from './assets'
import { useSoundtrack } from './audio/useSoundtrack'
import { BackdropLayer } from './components/BackdropLayer'
import { Choice } from './components/Choice'
import { CloudCover } from './components/CloudCover'
import { EndCard } from './components/EndCard'
import { FactPanel } from './components/FactPanel'
import { MapViewer } from './components/MapViewer'
import { MusicToggle } from './components/MusicToggle'
import { ResearchFiles } from './components/ResearchFiles'
import { Sara } from './components/Sara'
import { SolutionDeck } from './components/SolutionDeck'
import { Speech } from './components/Speech'
import { Stage } from './components/Stage'
import { StoryNav } from './components/StoryNav'
import { useSpeech } from './components/useSpeech'
import { chapterLabel, ui } from './content/ui'
import { LANGS, LangProvider, initialLang, resolve, saveLang, type Lang } from './i18n'
import { EASE } from './motion'
import { buildStory } from './story'
import { caseNotes } from './story/caseNotes'
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
 * title   – waiting for the visitor to choose a language (the click also unlocks sound)
 * opening – the title is fading out
 * story   – the story is playing
 */
type Phase = 'title' | 'opening' | 'story'

export default function App() {
  const [phase, setPhase] = useState<Phase>('title')
  const [lang, setLang] = useState<Lang>(initialLang)
  const playing = phase === 'story'

  const story = useMemo(() => buildStory(lang), [lang])
  const t = useMemo(() => resolve(ui, lang), [lang])
  const { view, stepId, next, pressButton, restart, back, toChapter, done, close } = useStory(story, sceneFromUrl(), playing)
  const sound = useSoundtrack(music.src)

  // A line the visitor has already read comes back whole and silent.
  const speaking = playing && view.line != null && view.uiVisible
  const typing = useSpeech(stepId, view.line ?? '', view.pace, speaking, sound.blip, view.revisit)

  const backdrop = playing ? view.backdrop : TITLE_BACKDROP
  const camera = playing ? view.camera : 'far'
  const cover = playing ? view.cover : null
  const overlay = playing ? view.open : null
  const interaction = playing && !overlay && view.uiVisible ? view.interaction : null

  // The research files have their own lines; they say when Sara should be there.
  const [files, setFiles] = useState({ speaking: false, typing: false })
  const onFilesSpeaking = useCallback(
    (isSpeaking: boolean, isTyping: boolean) =>
      setFiles((f) => (f.speaking === isSpeaking && f.typing === isTyping ? f : { speaking: isSpeaking, typing: isTyping })),
    [],
  )
  const inFiles = overlay === 'files' && files.speaking
  const saraShown = playing && (inFiles || (!overlay && !view.finished && view.uiVisible && view.sara.show))
  const diving = playing && camera === 'dive' && view.backdrop?.kind === 'image' && view.backdrop.key === 'space'

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  /** Choosing a language starts the story. */
  const begin = useCallback(
    (chosen: Lang) => {
      setLang(chosen)
      saveLang(chosen)
      sound.unlock()
      setPhase('opening')
    },
    [sound.unlock],
  )

  useEffect(() => {
    if (phase !== 'opening') return
    const id = setTimeout(() => setPhase('story'), OPENING_MS)
    return () => clearTimeout(id)
  }, [phase])

  // First click finishes the line that is still typing; the next one moves on.
  // (The engine ignores it while the visitor still has something to do.)
  const advance = useCallback(() => {
    if (!speaking) return
    if (!typing.done) typing.finish()
    else next()
  }, [speaking, typing.done, typing.finish, next])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return
      // On the title the language buttons take the keys.
      if (phase !== 'story') return
      if (e.key.toLowerCase() === 'm') return sound.toggle()
      // An open overlay has its own keys.
      if (overlay) return
      // The radar handle uses the arrow keys itself.
      if (e.target instanceof HTMLElement && e.target.getAttribute('role') === 'slider') return
      if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault()
        return back()
      }
      if (!['Enter', ' ', 'ArrowRight'].includes(e.key)) return
      // A focused button handles Enter/Space itself.
      if (e.target instanceof HTMLButtonElement && e.key !== 'ArrowRight') return
      e.preventDefault()
      advance()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, overlay, advance, back, sound.toggle])

  // The story decides what the soundtrack does.
  useEffect(() => {
    sound.setCue(playing ? view.music : 'silence')
  }, [playing, view.music, sound.setCue])

  // Sounds belong to the first time through: not to a step come back to.
  useEffect(() => {
    if (diving && !view.revisit) sound.whoosh()
  }, [diving, view.revisit, sound.whoosh])

  const onSwept = useCallback(() => {
    sound.ping()
    done()
  }, [sound.ping, done])

  const pulse = useMemo(
    () => ({ armed: interaction?.kind === 'pulse', onFire: sound.ping, onDone: done }),
    [interaction?.kind, sound.ping, done],
  )
  const task = useMemo(() => ({ armed: interaction?.kind === 'window', onDone: done }), [interaction?.kind, done])
  const cut = useMemo(() => ({ armed: interaction?.kind === 'cutoff', onDone: done }), [interaction?.kind, done])

  /** Back to the first line, with an empty set of case notes. */
  const startOver = useCallback(() => {
    caseNotes.reset()
    restart()
  }, [restart])

  // Load every image up front so scene changes do not flash.
  useEffect(() => {
    allImageUrls.forEach((url) => {
      new Image().src = url
    })
  }, [])

  const button = speaking && typing.done ? view.button : null
  const chapter = playing ? view.chapter : null

  return (
    <LangProvider value={lang}>
      <MotionConfig reducedMotion="user">
        <Stage onClick={advance} chapter={playing ? view.chapterNo : 1}>
          <BackdropLayer backdrop={backdrop} camera={camera} lesson={view.lesson} look={view.look} pulse={pulse} task={task} cut={cut} />
          <CloudCover cover={cover} drag={interaction?.kind === 'sweep'} onSwept={onSwept} />

          {/* Chapter 2 is framed like an instrument; the CSS shows this only there. */}
          <div className="hud-frame" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>

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
                <p className="stamp">{t.title.stamp}</p>
                <h1 className="title-name">{t.title.name}</h1>
                <p className="title-line">{t.title.line}</p>
                <p className="title-prompt">{t.title.choose}</p>
                <div className="title-langs">
                  {LANGS.map(({ key, name }) => (
                    <button
                      key={key}
                      type="button"
                      className="story-button title-lang"
                      lang={key}
                      aria-pressed={key === lang}
                      // Looking at a language shows the title in it.
                      onPointerEnter={() => setLang(key)}
                      onFocus={() => setLang(key)}
                      onClick={(e) => {
                        e.stopPropagation()
                        begin(key)
                      }}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {chapter && (
              <motion.div
                key={`chapter-${chapter.number}`}
                className="title title--chapter"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <p className="stamp">{chapterLabel(chapter.number, t.chapter, lang)}</p>
                <h1 className="title-name">{chapter.title}</h1>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {playing && view.uiVisible && view.fact && <FactPanel key={view.fact} id={view.fact} />}
          </AnimatePresence>

          <AnimatePresence>
            {playing && view.uiVisible && !view.finished && !overlay && (
              <motion.div
                key="ui"
                className={view.sara.show ? 'ui' : 'ui ui--plain'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
              >
                <Speech
                  text={view.line}
                  count={typing.count}
                  done={typing.done}
                  showHint={!view.button && (!view.interaction || view.revisit)}
                />
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

          <AnimatePresence>
            {interaction?.kind === 'choice' && typing.done && (
              <Choice key={stepId} options={interaction.options} answer={interaction.answer} onDone={done} />
            )}
          </AnimatePresence>

          {/* The interactive parts. The story waits until each is closed. */}
          <AnimatePresence>
            {overlay && (
              <motion.div
                key={overlay}
                className="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                {overlay === 'map' && <MapViewer onClose={close} />}
                {overlay === 'cards' && <SolutionDeck onClose={close} />}
                {overlay === 'files' && (
                  <ResearchFiles onClose={close} tick={sound.blip} onSpeaking={onFilesSpeaking} />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {view.finished && <EndCard onRestart={startOver} />}

          <Sara
            show={saraShown}
            at={view.sara.at}
            pose={inFiles ? 'idle' : view.sara.pose}
            point={inFiles ? null : view.sara.point}
            talking={inFiles ? files.typing : speaking && !typing.done}
          />

          {playing && !overlay && !chapter && (view.uiVisible || view.finished) && (
            <StoryNav
              chapter={view.chapterNo}
              progress={view.progress}
              canBack={view.canBack}
              onBack={back}
              onChapter={toChapter}
              showProgress={!view.finished}
            />
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
    </LangProvider>
  )
}
