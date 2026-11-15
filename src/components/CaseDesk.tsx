import { useState } from 'react'
import { analysis } from '../content/analysis'
import { desk, nextSteps } from '../content/investigation'
import { useResolved } from '../i18n'
import { useCaseNotes } from '../story/caseNotes'

type Pass = 'before' | 'after'

/**
 * The investigation desk: the two radar passes as equal thumbnails with
 * their dates, and a strip of case notes that starts empty and fills in as
 * the visitor works. A thumbnail can be enlarged for a closer look; nothing
 * here has to be done before moving on.
 */
export function CaseDesk() {
  const t = useResolved(desk)
  const text = useResolved(analysis)
  const [large, setLarge] = useState<Pass | null>(null)

  return (
    <div className="desk">
      <header className="desk-head">
        <h2 className="overlay-title">{t.lead}</h2>
        <p className="overlay-lead">{t.support}</p>
      </header>

      <div className="desk-views" data-large={large ?? undefined}>
        {(['before', 'after'] as const).map((pass) => (
          <button
            key={pass}
            type="button"
            className="desk-view"
            data-large={large === pass}
            aria-label={`${text[pass]} · ${large === pass ? t.shrink : t.enlarge}`}
            aria-pressed={large === pass}
            onClick={(e) => {
              e.stopPropagation()
              setLarge(large === pass ? null : pass)
            }}
          >
            <img src={text.layers.vh[pass]} alt="" draggable={false} />
            <span className="stamp desk-date">
              <span className="stamp-lead">{text[pass]}</span> · {text.source}
            </span>
          </button>
        ))}
      </div>

      <CaseStrip />
    </div>
  )
}

/** The three case notes: what changed, what is uncertain, and the next step. */
export function CaseStrip() {
  const t = useResolved(desk)
  const task = useResolved(analysis.task)
  const steps = useResolved(nextSteps)
  const notes = useCaseNotes()

  const changed = (['A', 'B', 'C'] as const).filter((key) => notes.labels[key] === 'changed')
  const unclear = (['A', 'B', 'C'] as const).filter((key) => notes.labels[key] === 'unclear')
  const rows = [
    { name: t.notes.change, value: changed.length ? `${task.region} ${changed.join(', ')}` : null },
    { name: t.notes.uncertainty, value: unclear.length ? `${task.region} ${unclear.join(', ')}` : null },
    { name: t.notes.next, value: notes.nextStep ? steps.options[notes.nextStep].name : null },
  ]

  return (
    <dl className="desk-notes" aria-label={t.notes.title}>
      {rows.map((row) => (
        <div key={row.name} data-filled={row.value != null}>
          <dt>{row.name}</dt>
          <dd>{row.value ?? t.notes.empty}</dd>
        </div>
      ))}
    </dl>
  )
}
