import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { researchFiles, shelf } from '../content/research'
import { ui } from '../content/ui'
import { useResolved, type Resolved } from '../i18n'
import { EASE } from '../motion'
import { CloseIcon } from './icons'
import { Speech } from './Speech'
import { useSpeech } from './useSpeech'

type FileText = Resolved<(typeof researchFiles)[number]>
type ShelfText = Resolved<typeof shelf>

/**
 * Three research files. Opening one lays it out as a document, with a figure
 * on the left and the text on the right, while the astronaut talks it through.
 */
export function ResearchFiles({ onClose, tick }: { onClose: () => void; tick: () => void }) {
  const files = useResolved(researchFiles)
  const t = useResolved(shelf)
  const words = useResolved(ui)
  const [open, setOpen] = useState<number | null>(null)
  const [line, setLine] = useState(0)
  const [seen, setSeen] = useState<ReadonlySet<number>>(new Set())

  const file = open == null ? null : files[open]
  const text = file ? file.lines[line] : ''
  const isLast = file ? line === file.lines.length - 1 : true
  const typing = useSpeech(`file-${open}-${line}`, text, 'normal', file != null, tick)

  const show = useCallback((index: number | null) => {
    setOpen(index)
    setLine(0)
    if (index != null) setSeen((s) => new Set(s).add(index))
  }, [])

  // First press finishes the line that is still typing; the next one moves on.
  const advance = useCallback(() => {
    if (!file) return
    if (!typing.done) typing.finish()
    else if (!isLast) setLine((n) => n + 1)
  }, [file, typing.done, typing.finish, isLast])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open == null) return
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
  }, [open, show, advance])

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
                    onClick={(e) => {
                      e.stopPropagation()
                      show(i)
                    }}
                  >
                    <span className="file-tab-number">
                      {t.file} {item.number}
                      {seen.has(i) && <span className="file-tab-read"> · {t.read}</span>}
                    </span>
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
            <OpenFile file={file} t={t} onClose={() => show(null)} />
            <Speech text={text} count={typing.count} done={typing.done} showHint={!isLast} />
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

function OpenFile({ file, t, onClose }: { file: FileText; t: ShelfText; onClose: () => void }) {
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
