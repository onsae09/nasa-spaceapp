import { useEffect, useRef, useState } from 'react'
import { BINS, TOTAL, cutOff, edge, histogram, type Channel } from '../content/histogram'
import { ui } from '../content/ui'
import { useLang, useResolved } from '../i18n'
import { caseNotes } from '../story/caseNotes'

/** The drawing is 1696×584. The chart's bars stand on BASE and a bin is BIN wide. */
const LEFT = 40
const BIN = 10
const TOP = 96
const BASE = 420
/** The tallest bar: a bin holding this share of its own group. */
const SHARE_MAX = 0.037
const TICKS = [-10, -5, 0, 5]
const CHANNELS: Channel[] = ['vh', 'vv']
/** Where the line starts: a little left of the middle, among the overlap. */
const START = 44

export type CutOffTask = {
  /** The story is waiting for the visitor to try a cut-off and keep one. */
  armed: boolean
  onDone: () => void
}

const signed = (db: number) => `${db < 0 ? '−' : '+'}${Math.abs(db).toFixed(1)} dB`

/**
 * The team's histogram of how the echo changed, for the pixels the reference
 * map marks newly flooded and for all the others, with one cut-off line the
 * visitor drags. Everything left of the line is flagged as flooded; the two
 * figures beside it say how many of those flags the reference map agrees
 * with, and how much of the flooding the line catches. No position gets both
 * right, because the two groups overlap.
 */
export function CutOffExplorer({ task }: { task?: CutOffTask }) {
  const t = useResolved(ui.cut)
  const lang = useLang()
  const art = useRef<SVGSVGElement>(null)
  const [channel, setChannel] = useState<Channel>('vh')
  const [index, setIndex] = useState(START)
  const [moved, setMoved] = useState(false)
  const held = useRef(false)

  const counts = histogram[channel]
  const result = cutOff(channel, index)
  const x = (i: number) => LEFT + i * BIN
  const dbToX = (db: number) => LEFT + ((db - counts.min) / (counts.max - counts.min)) * BINS * BIN
  const height = (count: number, total: number) => (count / total / SHARE_MAX) * (BASE - TOP)
  const number = (n: number) => n.toLocaleString(lang === 'ko' ? 'ko-KR' : 'en-GB')

  const armed = task?.armed ?? false
  const onDone = useRef(task?.onDone)
  onDone.current = task?.onDone

  // Stepping back to this page while the pointer is down lets go of the line.
  useEffect(() => {
    held.current = false
  }, [armed])

  const move = (to: number) => {
    setIndex(Math.min(Math.max(Math.round(to), 1), BINS - 1))
    setMoved(true)
  }
  const follow = (clientX: number) => {
    const rect = art.current?.getBoundingClientRect()
    if (!rect) return
    move(((clientX - rect.left) / rect.width) * 1696 / BIN - LEFT / BIN)
  }

  return (
    <div className="cut">
      <svg
        ref={art}
        className="cut-art"
        viewBox="0 0 1696 584"
        role="img"
        aria-label={t.alt}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          held.current = true
          follow(e.clientX)
        }}
        onPointerMove={(e) => held.current && follow(e.clientX)}
        onPointerUp={() => (held.current = false)}
        onPointerCancel={() => (held.current = false)}
      >
        <text className="lesson-label lesson-label--lead" x={LEFT} y="28">
          {t.axis}
        </text>
        <g className="cut-key">
          <rect className="cut-bar cut-bar--flooded" x={LEFT} y="46" width="20" height="20" rx="4" />
          <text className="lesson-label cut-small" x={LEFT + 32} y="64">
            {t.flooded} · {number(TOTAL.flooded)} {t.pixels}
          </text>
          <rect className="cut-bar cut-bar--other" x={LEFT + 560} y="46" width="20" height="20" rx="4" />
          <text className="lesson-label cut-small" x={LEFT + 592} y="64">
            {t.other} · {number(TOTAL.other)} {t.pixels}
          </text>
        </g>

        {/* Everything left of the line is flagged. */}
        <rect className="cut-flagged" x={LEFT} y={TOP} width={x(index) - LEFT} height={BASE - TOP} />

        {counts.other.map((count, i) => (
          <rect
            key={`o${i}`}
            className="cut-bar cut-bar--other"
            x={x(i) + 1}
            y={BASE - height(count, TOTAL.other)}
            width={BIN - 2}
            height={height(count, TOTAL.other)}
          />
        ))}
        {counts.flooded.map((count, i) => (
          <rect
            key={`f${i}`}
            className="cut-bar cut-bar--flooded"
            x={x(i) + 1}
            y={BASE - height(count, TOTAL.flooded)}
            width={BIN - 2}
            height={height(count, TOTAL.flooded)}
          />
        ))}

        <path className="lesson-line lesson-line--soft" d={`M${LEFT} ${BASE}H${x(BINS)}`} />
        {TICKS.map((db) => (
          <g key={db}>
            <path className="lesson-line lesson-line--soft" d={`M${dbToX(db)} ${BASE}v10`} />
            <text className="lesson-label lesson-label--centre lesson-label--lead" x={dbToX(db)} y={BASE + 40}>
              {db > 0 ? `+${db}` : db === 0 ? '0' : `−${-db}`} dB
            </text>
          </g>
        ))}
        <text className="lesson-label cut-small" x={LEFT} y={BASE + 76}>
          ← {t.fell}
        </text>
        <text className="lesson-label cut-small cut-end" x={x(BINS)} y={BASE + 76}>
          {t.rose} →
        </text>

        {/* The cut-off itself. */}
        <g className="cut-line" transform={`translate(${x(index)} 0)`}>
          <path d={`M0 ${TOP - 12}V${BASE + 12}`} />
          <circle cx="0" cy={TOP - 12} r="14" />
          <text className="lesson-label cut-small" x="24" y={TOP - 4}>
            {signed(result.delta)}
          </text>
        </g>
        <text className="lesson-label cut-small cut-flagged-label" x={LEFT + 12} y={TOP + 62}>
          {t.flagged}
        </text>
      </svg>

      <div className="cut-controls" onClick={(e) => e.stopPropagation()}>
        <div className="map-switch" role="group" aria-label={t.channel}>
          {CHANNELS.map((key) => (
            <button
              key={key}
              type="button"
              className="map-switch-option"
              aria-pressed={key === channel}
              onClick={() => setChannel(key)}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>

        <p className="cut-readout">
          <span className="cut-figure">{(result.precision * 10).toFixed(1)}</span>
          <span>{t.right}</span>
        </p>
        <p className="cut-readout">
          <span className="cut-figure">{(result.recall * 10).toFixed(1)}</span>
          <span>{t.caught}</span>
        </p>

        <input
          className="cut-range"
          type="range"
          role="slider"
          min={1}
          max={BINS - 1}
          value={index}
          aria-label={t.drag}
          aria-valuetext={signed(edge(channel, index))}
          onChange={(e) => move(Number(e.target.value))}
        />

        {armed && (
          <button
            type="button"
            className="story-button cut-keep"
            disabled={!moved}
            onClick={() => {
              caseNotes.keepCutOff({ channel, delta: result.delta, precision: result.precision, recall: result.recall })
              onDone.current?.()
            }}
          >
            {moved ? t.keep : t.drag}
          </button>
        )}
        <p className="stamp window-note">{t.source}</p>
      </div>
    </div>
  )
}
