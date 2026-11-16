import { useEffect, useRef, useState } from 'react'
import { nisar, type DriverKey, type LakeChange, type LakeKey } from '../content/nisar'
import { ui } from '../content/ui'
import { useResolved } from '../i18n'

/** Where the picture sits on the stage, in stage pixels. */
const FRAME = { left: 112, top: 168, width: 1000 }
const HEIGHT = (FRAME.width * nisar.size.height) / nisar.size.width
/** How close the divider may come to either edge of the picture. */
const EDGE = 40

const LAKES: LakeKey[] = ['1', '2', '3']
const CHANGES: LakeChange[] = ['brighter', 'darker', 'same']
const DRIVERS: DriverKey[] = ['wind', 'ice', 'level']

/**
 * The NISAR stop: two passes of the L-band radar over the lakes around
 * Siling Co, either side of a divider. The visitor reads what three lakes
 * did between the passes, then says what might have caused it. No cause is
 * marked right; each answer says what would test it. Beside the picture is
 * what the newer radar adds, and what the team's pipeline ran on its archive.
 */
export function NisarCase({ onClose }: { onClose: () => void }) {
  const t = useResolved(nisar)
  const words = useResolved(ui)
  const frame = useRef<HTMLDivElement>(null)
  const sliding = useRef(false)
  const [split, setSplit] = useState(FRAME.width / 2)
  const [lake, setLake] = useState<LakeKey>('1')
  const [read, setRead] = useState<Partial<Record<LakeKey, LakeChange>>>({})
  const [driver, setDriver] = useState<DriverKey | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const clamp = (x: number) => Math.min(Math.max(x, EDGE), FRAME.width - EDGE)
  /** A pointer position as stage pixels from the picture's left edge. */
  const toFrame = (clientX: number) => {
    const rect = frame.current!.getBoundingClientRect()
    return ((clientX - rect.left) / rect.width) * FRAME.width
  }

  /** Picking a lake puts the divider through the middle of it. */
  const pick = (key: LakeKey) => {
    setLake(key)
    setSplit(clamp(nisar.lakes[key].x * FRAME.width))
  }

  const answer = read[lake]
  const correct = (key: LakeKey) => read[key] === nisar.lakes[key].answer
  const allRead = LAKES.every(correct)

  return (
    <div className="nisar" onClick={(e) => e.stopPropagation()}>
      <header className="nisar-head">
        <h2 className="overlay-title">{t.title}</h2>
        <p className="overlay-lead">{t.lead}</p>
      </header>

      <div ref={frame} className="nisar-frame" style={{ ...FRAME, height: HEIGHT }}>
        <img className="nisar-layer" src={t.before} alt={t.alt} draggable={false} />
        {/* The later pass shows to the right of the divider. */}
        <img className="nisar-layer" src={t.after} alt="" draggable={false} style={{ clipPath: `inset(0 0 0 ${split}px)` }} />

        {LAKES.map((key) => {
          const { x, y, r } = nisar.lakes[key]
          return (
            <button
              key={key}
              type="button"
              className="map-region"
              data-selected={key === lake}
              data-found={correct(key)}
              aria-pressed={key === lake}
              aria-label={`${t.task.lake} ${key}`}
              style={{ left: `${x * 100}%`, top: `${y * 100}%`, width: r * 2 * FRAME.width, height: r * 2 * FRAME.width }}
              onClick={() => pick(key)}
            >
              <span className="map-region-tag">{key}</span>
            </button>
          )
        })}

        {/* The dates stay in the corners: beside the divider they would be cut off at the edges. */}
        <p className="stamp nisar-date nisar-date--before">{t.beforeDate}</p>
        <p className="stamp nisar-date nisar-date--after">{t.afterDate}</p>

        <div className="nisar-divider" style={{ left: split }}>
          <button
            type="button"
            className="map-divider-grip"
            role="slider"
            aria-label={t.divider}
            aria-valuemin={EDGE}
            aria-valuemax={FRAME.width - EDGE}
            aria-valuenow={Math.round(split)}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              sliding.current = true
            }}
            onPointerMove={(e) => {
              if (sliding.current) setSplit(clamp(toFrame(e.clientX)))
            }}
            onPointerUp={() => (sliding.current = false)}
            onPointerCancel={() => (sliding.current = false)}
            onKeyDown={(e) => {
              const by = e.key === 'ArrowLeft' ? -40 : e.key === 'ArrowRight' ? 40 : 0
              if (!by) return
              e.preventDefault()
              setSplit((s) => clamp(s + by))
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </button>
        </div>
        <p className="stamp nisar-stamp">
          <span className="stamp-lead">{t.place}</span> · {t.scale}
          <br />
          {t.source}
        </p>
      </div>

      <div className="nisar-panel">
        <section className="nisar-block">
          <div className="nisar-tabs" role="group" aria-label={t.task.lake}>
            {LAKES.map((key) => (
              <button
                key={key}
                type="button"
                className="nisar-tab"
                aria-pressed={key === lake}
                data-found={correct(key)}
                onClick={() => pick(key)}
              >
                {t.task.lake} {key}
              </button>
            ))}
          </div>
          <p className="nisar-ask">{t.task.ask.replace('{lake}', lake)}</p>
          <div className="nisar-options">
            {CHANGES.map((key) => (
              <button
                key={key}
                type="button"
                className="nisar-option"
                aria-pressed={answer === key}
                onClick={() => setRead((old) => ({ ...old, [lake]: key }))}
              >
                {t.task.changes[key]}
              </button>
            ))}
          </div>
          <p className="nisar-note" aria-live="polite">
            {answer ? (correct(lake) ? t.task.right[lake] : t.task.wrong) : t.colour}
          </p>
        </section>

        <section className="nisar-block">
          <p className="nisar-ask">{t.drivers.ask}</p>
          <div className="nisar-options nisar-options--stack">
            {DRIVERS.map((key) => (
              <button
                key={key}
                type="button"
                className="nisar-option"
                aria-pressed={driver === key}
                disabled={!allRead}
                onClick={() => setDriver(key)}
              >
                {t.drivers.options[key].name}
              </button>
            ))}
          </div>
          <p className="nisar-note" aria-live="polite">
            {!allRead ? t.drivers.locked : driver ? t.drivers.options[driver].note : t.drivers.open}
          </p>
          {driver && <p className="nisar-lesson">{t.drivers.lesson}</p>}
        </section>
      </div>

      <aside className="nisar-facts">
        <section>
          <h3 className="nisar-facts-title">{t.facts.title}</h3>
          {t.facts.adds.map((line) => (
            <p key={line} className="nisar-fact">
              {line}
            </p>
          ))}
        </section>
        <section>
          <h3 className="nisar-facts-title">{t.facts.team}</h3>
          <dl className="nisar-counts">
            {t.facts.counts.map((count) => (
              <div key={count.label}>
                <dt>{count.value}</dt>
                <dd>{count.label}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <h3 className="nisar-facts-title">{t.facts.ruleTitle}</h3>
          <p className="nisar-fact">{t.facts.rule}</p>
          <p className="nisar-fact">
            {t.facts.status}{' '}
            <a href={t.facts.href} target="_blank" rel="noreferrer">
              {t.facts.link}
            </a>
          </p>
        </section>
      </aside>

      <button type="button" className="story-button story-button--corner" onClick={onClose}>
        {words.continue}
      </button>
    </div>
  )
}
