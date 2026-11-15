import { motion } from 'motion/react'
import { music } from '../assets'
import type { RegionKey } from '../content/analysis'
import { sources } from '../content/sources'
import { ui } from '../content/ui'
import { useLang, useResolved } from '../i18n'
import { EASE } from '../motion'
import { useCaseNotes } from '../story/caseNotes'

const REGIONS: RegionKey[] = ['A', 'B', 'C']

/**
 * The final briefing: the closing line, the visitor's own case read back to
 * them (and said plainly where a part was skipped), what someone like them
 * can do, and what the story is built on.
 */
export function EndCard({ onRestart }: { onRestart: () => void }) {
  const t = useResolved(ui)
  const lang = useLang()
  const notes = useCaseNotes()
  const b = t.ending.briefing

  const marked = REGIONS.flatMap((key) => {
    const label = notes.labels[key]
    return label ? [`${b.region} ${key} ${b.as[label]}`] : []
  })
  const cut = notes.cutOff
  const rows = [
    { name: b.marked, value: marked.length ? marked.join(' · ') : b.noRegion, done: marked.length > 0 },
    { name: b.checked, value: notes.checkedReference ? b.reference : b.noReference, done: notes.checkedReference },
    {
      name: b.chose,
      value: cut
        ? b.cutOff
            .replace('{delta}', `${cut.delta < 0 ? '−' : '+'}${Math.abs(cut.delta).toFixed(1)} dB`)
            .replace('{channel}', cut.channel.toUpperCase())
            .replace('{right}', (cut.precision * 10).toFixed(1))
            .replace('{caught}', (cut.recall * 10).toFixed(1))
        : b.noCutOff,
      done: cut != null,
    },
    { name: b.needed, value: b.missing, done: true },
  ]

  return (
    <motion.div
      className="end-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE }}
      onClick={(e) => e.stopPropagation()}
    >
      <p className="end-card-eyebrow">{t.ending.thanks}</p>
      <h1 className="end-card-title">{t.ending.title}</h1>

      <div className="end-card-columns">
        <section>
          <p className="end-card-note">{b.lead}</p>
          <dl className="end-card-briefing">
            {rows.map((row) => (
              <div key={row.name} data-done={row.done}>
                <dt>{row.name}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <p className="end-card-note">{t.ending.lead}</p>
          <ol className="end-card-actions">
            {t.ending.actions.map((action) => (
              <li key={action.name}>
                <span className="end-card-action">{action.name}</span>
                {action.line}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <button type="button" className="story-button title-lang end-card-restart" onClick={onRestart}>
        {t.backToStart}
      </button>
      <p className="stamp end-card-sources">
        <span className="stamp-lead">{t.ending.sources}</span>
        {sources.map((source) => (
          <span key={source.label.en}>
            {' · '}
            {source.href ? (
              <a href={source.href} target="_blank" rel="noreferrer">
                {source.label[lang]}
              </a>
            ) : (
              source.label[lang]
            )}
          </span>
        ))}
      </p>
      <p className="stamp end-card-credit">{music.credit[lang]}</p>
    </motion.div>
  )
}
