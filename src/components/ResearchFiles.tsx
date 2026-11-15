import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { games, type GameKey } from '../content/games'
import type { NextStepKey } from '../content/investigation'
import { researchFiles, shelf } from '../content/research'
import { ui } from '../content/ui'
import { useResolved, type Resolved } from '../i18n'
import { EASE } from '../motion'
import { useCaseNotes } from '../story/caseNotes'
import { FileGame } from './FileGames'
import { CloseIcon } from './icons'
import { Speech } from './Speech'
import { useSpeech } from './useSpeech'

type FileText = Resolved<(typeof researchFiles)[number]>
type ShelfText = Resolved<typeof shelf>

/** The file that bears most on each next step: the case, the radar, or the blind spots. */
const RELEVANT: Record<NextStepKey, string> = { map: '01', warn: '02', plan: '03' }

/**
 * Three research files. Opening one lays it out as a document, with a figure
 * on the left and the text on the right, while Sara says two lines about it.
 * `onSpeaking` tells the app when a file is open, so it can bring her in.
 */
export function ResearchFiles({ onClose, tick, onSpeaking }: {
  onClose: () => void
  tick: () => void
  onSpeaking: (speaking: boolean, typing: boolean) => void
}) {
  const files = useResolved(researchFiles)
  const t = useResolved(shelf)
  const words = useResolved(ui)
  const [open, setOpen] = useState<number | null>(null)
  const [line, setLine] = useState(0)
  const [seen, setSeen] = useState<ReadonlySet<number>>(new Set())
  const [game, setGame] = useState<GameKey | null>(null)
  const notes = useCaseNotes()
  const play = useResolved(games.play)
  const relevant = notes.nextStep ? RELEVANT[notes.nextStep] : null

  const file = open == null ? null : files[open]
  const text = file ? file.lines[line] : ''
  const isLast = file ? line === file.lines.length - 1 : true
  const typing = useSpeech(`file-${open}-${line}`, text, 'normal', file != null, tick)

  // Sara steps out while a game is being played: it needs the whole sheet.
  useEffect(() => {
    onSpeaking(file != null && !game, file != null && !game && !typing.done)
  }, [file, game, typing.done, onSpeaking])
  useEffect(() => () => onSpeaking(false, false), [onSpeaking])

  const show = useCallback((index: number | null) => {
    setOpen(index)
    setLine(0)
    setGame(null)
    if (index != null) setSeen((s) => new Set(s).add(index))
  }, [])

  // First press finishes the line that is still typing; the next one moves on.
  const advance = useCallback(() => {
    if (!file || game) return
    if (!typing.done) typing.finish()
    else if (!isLast) setLine((n) => n + 1)
  }, [file, game, typing.done, typing.finish, isLast])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open == null) return
      // A game has the keys while it is open, apart from Escape.
      if (game) {
        if (e.key === 'Escape') setGame(null)
        return
      }
      if (e.key === 'Escape') show(null)
      else if (['Enter', ' ', 'ArrowRight'].includes(e.key)) {
        // A focused button or link handles Enter and Space itself.
        if (e.key !== 'ArrowRight' && (e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement)) return
        advance()
      } else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, game, show, advance])

  return (
    <div
      className="files"
      onClick={(e) => {
        e.stopPropagation()
        advance()
      }}
    >
      <AnimatePresence mode="wait">
        {file == null ? (
          <motion.div
            key="shelf"
            className="files-shelf"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <header className="files-head">
              <h2 className="overlay-title">{t.title}</h2>
              <p className="overlay-lead">{t.lead}</p>
            </header>

            <ul className="files-row">
              {files.map((item, i) => (
                <motion.li
                  key={item.number}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: EASE }}
                >
                  <button
                    type="button"
                    className="file-tab"
                    data-relevant={item.number === relevant}
                    onClick={(e) => {
                      e.stopPropagation()
                      show(i)
                    }}
                  >
                    <span className="file-tab-number">
                      {t.file} {item.number}
                      {seen.has(i) && <span className="file-tab-read"> · {t.read}</span>}
                    </span>
                    {item.number === relevant && <span className="file-tab-relevant">{t.relevant}</span>}
                    <span className="file-tab-title">{item.title}</span>
                    <span className="file-tab-teaser">{item.teaser}</span>
                    <span className="file-tab-paper">{item.paper.authors}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ) : (
          <motion.div
            key={`file-${file.number}`}
            className="files-open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {game ? (
              <FileGame game={game} onClose={() => setGame(null)} />
            ) : (
              <OpenFile file={file} t={t} play={play} onPlay={() => setGame(file.game)} onClose={() => show(null)} />
            )}
            {!game && <Speech text={text} count={typing.count} done={typing.done} showHint={!isLast} />}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        className="story-button story-button--corner"
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        {words.continue}
      </button>
    </div>
  )
}

function OpenFile({ file, t, play, onPlay, onClose }: {
  file: FileText
  t: ShelfText
  play: string
  onPlay: () => void
  onClose: () => void
}) {
  return (
    <motion.article
      className="file-page"
      initial={{ y: 24, scale: 0.97 }}
      animate={{ y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="file-side">
        <FileFigure figure={file.figure} />
        <p className="file-paper">
          {t.basedOn}{' '}
          <a href={file.paper.href} target="_blank" rel="noreferrer" lang="en" onClick={(e) => e.stopPropagation()}>
            {file.paper.title}
          </a>
          . {file.paper.authors}. {file.paper.published}.
        </p>
      </div>

      <div className="file-text">
        <p className="file-number">
          {t.file} {file.number}
        </p>
        <h3 className="file-title">{file.title}</h3>
        <button
          type="button"
          className="game-button file-play"
          onClick={(e) => {
            e.stopPropagation()
            onPlay()
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
          {play}
        </button>
        {file.body.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="file-paragraph">
            {paragraph}
          </p>
        ))}
      </div>

      <button
        type="button"
        className="icon-button icon-button--on-paper file-close"
        aria-label={t.close}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        <CloseIcon />
      </button>
    </motion.article>
  )
}

function FileFigure({ figure }: { figure: FileText['figure'] }) {
  if (figure.kind === 'facts') {
    return (
      <figure className="file-figure">
        <p className="file-figure-heading">{figure.heading}</p>
        <dl className="file-facts">
          {figure.items.map((item) => (
            <div key={item.label}>
              <dt>{item.value}</dt>
              <dd>{item.label}</dd>
            </div>
          ))}
        </dl>
      </figure>
    )
  }
  return (
    <figure className="file-figure">
      <div className={figure.onLight ? 'file-image file-image--light' : 'file-image'}>
        <img src={figure.src} alt={figure.alt} draggable={false} />
      </div>
      <figcaption>{figure.caption}</figcaption>
    </figure>
  )
}
