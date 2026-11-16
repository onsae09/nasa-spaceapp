import { useEffect, useState } from 'react'
import { haor, passDate } from '../content/nisar'
import { ui } from '../content/ui'
import { useLang, useResolved } from '../i18n'

/** The chart, in its own units. */
const CHART = { width: 900, height: 270, left: 8, right: 8, top: 26, bottom: 54 }
const DAY = 86_400_000
const PLAY_MS = 900

const days = haor.passes.map((pass) => Date.parse(pass.date) / DAY)
const span = days[days.length - 1] - days[0]
/** The tallest thing drawn: the widest count at the looser threshold. */
const top = Math.max(...haor.passes.map((pass) => pass.high))

/**
 * Twelve NISAR passes over the haor basin, one after another. The visitor
 * moves through them, picks the pass with the most water, and only then
 * sees the measured area of every pass, with their own pick marked.
 */
export function HaorPulse({ onClose }: { onClose: () => void }) {
  const t = useResolved(haor)
  const words = useResolved(ui)
  const lang = useLang()
  const [index, setIndex] = useState(0)
  const [flag, setFlag] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [picked, setPicked] = useState<number | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  // Playing runs through the season once and stops on the last pass.
  useEffect(() => {
    if (!playing) return
    if (index >= haor.passes.length - 1) return setPlaying(false)
    const id = setTimeout(() => setIndex((i) => i + 1), PLAY_MS)
    return () => clearTimeout(id)
  }, [playing, index])

  const play = () => {
    if (playing) return setPlaying(false)
    if (index >= haor.passes.length - 1) setIndex(0)
    setPlaying(true)
  }

  const pass = haor.passes[index]
  const date = (i: number) => passDate(haor.passes[i].date)[lang]
  const revealed = picked != null
  const right = revealed && haor.passes[picked].date === haor.peak.date

  const plot = { width: CHART.width - CHART.left - CHART.right, height: CHART.height - CHART.top - CHART.bottom }
  const xOf = (i: number) => CHART.left + 24 + ((days[i] - days[0]) / span) * (plot.width - 48)
  const yOf = (km2: number) => CHART.top + plot.height * (1 - km2 / top)
  /** Where a label under bar `i` goes so that the first and last are not cut off. */
  const edge = (i: number) =>
    i === 0
      ? ({ x: CHART.left, anchor: 'start' } as const)
      : i === haor.passes.length - 1
        ? ({ x: CHART.width - CHART.right, anchor: 'end' } as const)
        : ({ x: xOf(i), anchor: 'middle' } as const)

  return (
    <div className="nisar pulse" onClick={(e) => e.stopPropagation()}>
      <header className="nisar-head">
        <h2 className="overlay-title">{t.title}</h2>
        <p className="overlay-lead">{t.lead}</p>
      </header>

      <div className="nisar-frame pulse-frame">
        {/* Every pass stays loaded, so moving between them does not flash. */}
        {haor.passes.map((p, i) => (
          <img
            key={p.key}
            className="nisar-layer"
            src={haor.frame(p.key)}
            alt={i === index ? t.alt : ''}
            draggable={false}
            style={{ opacity: i === index ? 1 : 0 }}
          />
        ))}
        {flag && <img className="nisar-layer" src={haor.water(pass.key)} alt="" draggable={false} />}
        <p className="stamp nisar-date nisar-date--before">{date(index)}</p>
        <p className="stamp nisar-stamp">
          <span className="stamp-lead">{t.place}</span>
          <br />
          {t.scale}
          <br />
          {t.source}
        </p>
      </div>

      <div className="pulse-panel">
        <div className="pulse-controls">
          <button type="button" className="nisar-option pulse-play" onClick={play}>
            {playing ? t.labels.pause : t.labels.play}
          </button>
          <input
            className="pulse-slider"
            type="range"
            min={0}
            max={haor.passes.length - 1}
            step={1}
            value={index}
            aria-label={t.labels.slider}
            aria-valuetext={date(index)}
            onChange={(e) => {
              setPlaying(false)
              setIndex(Number(e.target.value))
            }}
          />
          <p className="stamp pulse-count">
            {t.labels.pass} {index + 1} / {haor.passes.length}
          </p>
        </div>

        <label className="pulse-flag">
          <input type="checkbox" checked={flag} onChange={(e) => setFlag(e.target.checked)} />
          {t.labels.flag}
        </label>

        {!revealed ? (
          <>
            <p className="nisar-note">{t.how}</p>
            <button type="button" className="story-button pulse-pick" onClick={() => setPicked(index)}>
              {t.labels.pick}: {date(index)}
            </button>
          </>
        ) : (
          <>
            <p className="nisar-ask" aria-live="polite">
              {right
                ? t.result.right
                : t.result.wrong
                    .replace('{date}', date(picked))
                    .replace('{km2}', haor.passes[picked].km2.toLocaleString('en-US'))}
            </p>

            <figure className="pulse-chart">
              <figcaption className="stamp">{t.labels.chart}</figcaption>
              <svg viewBox={`0 0 ${CHART.width} ${CHART.height}`} role="img" aria-label={t.labels.chart}>
                <line className="pulse-axis" x1={CHART.left} x2={CHART.width - CHART.right} y1={yOf(0)} y2={yOf(0)} />
                {haor.passes.map((p, i) => (
                  <g
                    key={p.key}
                    className="pulse-bar"
                    data-current={i === index}
                    data-peak={p.date === haor.peak.date}
                    onClick={() => {
                      setPlaying(false)
                      setIndex(i)
                    }}
                  >
                    <rect x={xOf(i) - 22} y={CHART.top} width={44} height={plot.height} fill="transparent" />
                    <rect className="pulse-bar-fill" x={xOf(i) - 16} y={yOf(p.km2)} width={32} height={yOf(0) - yOf(p.km2)} rx={4} />
                    {/* The same count with the threshold 2 dB either way. */}
                    <line className="pulse-range" x1={xOf(i)} x2={xOf(i)} y1={yOf(p.high)} y2={yOf(p.low)} />
                    {(i === index || p.date === haor.peak.date || i === haor.passes.length - 1) && (
                      <text className="pulse-value" x={xOf(i)} y={yOf(p.high) - 8} textAnchor="middle">
                        {p.km2.toLocaleString('en-US')}
                      </text>
                    )}
                    {i === picked && (
                      <text className="pulse-yours" x={edge(i).x} y={CHART.height - 6} textAnchor={edge(i).anchor}>
                        {t.labels.yours}
                      </text>
                    )}
                  </g>
                ))}
                <text className="pulse-tick" x={CHART.left} y={CHART.height - 30} textAnchor="start">
                  {date(0)}
                </text>
                <text className="pulse-tick" x={CHART.width - CHART.right} y={CHART.height - 30} textAnchor="end">
                  {date(haor.passes.length - 1)}
                </text>
                {/* The one pass of the season the archive does not have. */}
                <text className="pulse-tick" x={(xOf(3) + xOf(4)) / 2} y={CHART.height - 30} textAnchor="middle">
                  {t.labels.gap}
                </text>
              </svg>
            </figure>

            <ul className="pulse-findings">
              {t.findings.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <button type="button" className="story-button story-button--corner" onClick={onClose}>
        {words.continue}
      </button>
    </div>
  )
}
