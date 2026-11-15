import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { character } from '../assets'
import { deck, solutions } from '../content/solutions'
import { ui } from '../content/ui'
import { useResolved } from '../i18n'
import { EASE } from '../motion'
import { ArrowRightIcon, CloseIcon } from './icons'

/** Degrees between neighbouring cards in the fan. */
const SPREAD = 11

const pad = (n: number) => String(n + 1).padStart(2, '0')

/**
 * The astronaut holds the solution cards face down. Choosing one lifts it to
 * the middle of the screen and turns it over. Cards already read stay face
 * up in her hand.
 */
export function SolutionDeck({ onClose }: { onClose: () => void }) {
  const cards = useResolved(solutions)
  const t = useResolved(deck)
  const words = useResolved(ui)
  const [open, setOpen] = useState<number | null>(null)
  const [seen, setSeen] = useState<ReadonlySet<number>>(new Set())

  const show = useCallback((index: number | null) => {
    setOpen(index)
    if (index != null) setSeen((s) => new Set(s).add(index))
  }, [])

  const step = useCallback(
    (by: number) => show(open == null ? 0 : (open + by + solutions.length) % solutions.length),
    [open, show],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open == null) return
      if (e.key === 'Escape') show(null)
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, show, step])

  const middle = (cards.length - 1) / 2
  const card = open == null ? null : cards[open]

  return (
    <div className="deck" onClick={(e) => e.stopPropagation()}>
      <header className="deck-head">
        <h2 className="overlay-title">{t.title}</h2>
        <p className="overlay-lead">{t.lead}</p>
        <p className="stamp deck-source">{t.source}</p>
      </header>

      <div className="deck-fan">
        {cards.map((solution, i) => (
          <button
            key={solution.title}
            type="button"
            className="deck-card"
            data-seen={seen.has(i)}
            style={{ '--tilt': `${(i - middle) * SPREAD}deg` } as React.CSSProperties}
            aria-label={seen.has(i) ? `${solution.title}, ${t.readAgain}` : `${t.idea} ${pad(i)}, ${t.turnOver}`}
            onClick={() => show(i)}
          >
            <span className="deck-card-number">{pad(i)}</span>
            <span className="deck-card-name">{seen.has(i) ? solution.title : t.idea}</span>
          </button>
        ))}
      </div>

      {/* PLACEHOLDER pose: the final illustration shows her holding the cards. */}
      <img className="deck-holder" src={character.src} alt="" draggable={false} />

      <button type="button" className="story-button story-button--corner" onClick={onClose}>
        {words.continue}
      </button>

      <AnimatePresence>
        {card && open != null && (
          <motion.div
            key="scrim"
            className="deck-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={() => show(null)}
          >
            <motion.article
              key={open}
              className="deck-face"
              role="dialog"
              aria-label={card.title}
              initial={{ rotateY: 90, scale: 0.6, opacity: 0 }}
              animate={{ rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="stamp">
                <span className="stamp-lead">
                  {t.idea} {pad(open)}
                </span>{' '}
                · {card.stage} · {card.horizon}
              </p>
              <h3 className="deck-face-title">{card.title}</h3>
              <p className="deck-face-plain">{card.plain}</p>
              <p className="deck-face-note">{card.note}</p>

              <footer className="deck-face-foot">
                <p className="stamp">
                  <span className="stamp-lead">{t.uses}</span> · {card.data.join(' · ')}
                </p>
                <button type="button" className="text-button" onClick={() => step(1)}>
                  {t.next}
                  <ArrowRightIcon />
                </button>
              </footer>

              <button type="button" className="icon-button deck-face-close" aria-label={t.close} onClick={() => show(null)}>
                <CloseIcon />
              </button>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
