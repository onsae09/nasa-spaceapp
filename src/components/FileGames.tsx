import { useEffect, useState } from 'react'
import { FLOODED, PASS, bestPass, floodExtent, games, spotGrid, type GameKey } from '../content/games'
import { useResolved } from '../i18n'
import { CloseIcon } from './icons'

/** A game laid over the open research file, on the same sheet of paper. */
export function FileGame({ game, onClose }: { game: GameKey; onClose: () => void }) {
  const t = useResolved(games)
  return (
    <article className="file-page game" onClick={(e) => e.stopPropagation()}>
      {game === 'spot' ? <SpotGame /> : game === 'sprint' ? <SprintGame onClose={onClose} /> : <PassGame />}
      <p className="game-note">{t.illustration}</p>
      <button type="button" className="icon-button icon-button--on-paper file-close" aria-label={t.back} onClick={onClose}>
        <CloseIcon />
      </button>
    </article>
  )
}

const grey = (level: number) => `hsl(220 8% ${Math.round(8 + level * 82)}%)`

/** Two grids of one place; the visitor finds the squares that went dark. */
function SpotGame() {
  const t = useResolved(games.spot)
  const again = useResolved(games.again)
  const [found, setFound] = useState<ReadonlySet<string>>(new Set())
  const [message, setMessage] = useState<string | null>(null)
  const done = found.size === FLOODED.length

  const press = (row: number, column: number) => {
    const cell = spotGrid[row][column]
    if (cell.flooded) {
      setFound((old) => new Set(old).add(`${row},${column}`))
      setMessage(t.hit)
    } else setMessage(cell.river ? t.river : t.same)
  }

  return (
    <div className="game-body">
      <h3 className="file-title">{t.title}</h3>
      <p className="file-paragraph">{t.lead}</p>
      <div className="spot">
        <figure className="spot-side">
          <figcaption>{t.before}</figcaption>
          <div className="spot-grid" aria-hidden="true">
            {spotGrid.flatMap((cells, row) =>
              cells.map((cell, column) => (
                <span key={`${row},${column}`} className="spot-cell" style={{ background: grey(cell.before) }} />
              )),
            )}
          </div>
        </figure>
        <figure className="spot-side">
          <figcaption>{t.after}</figcaption>
          <div className="spot-grid">
            {spotGrid.flatMap((cells, row) =>
              cells.map((cell, column) => (
                <button
                  key={`${row},${column}`}
                  type="button"
                  className="spot-cell"
                  data-found={found.has(`${row},${column}`)}
                  aria-label={t.cell.replace('{row}', String(row + 1)).replace('{column}', String(column + 1))}
                  style={{ background: grey(cell.after) }}
                  onClick={() => press(row, column)}
                />
              )),
            )}
          </div>
        </figure>
      </div>
      <p className="game-status" aria-live="polite">
        <strong>{t.found.replace('{count}', String(found.size))}</strong> {done ? t.done : message}
      </p>
      {done && (
        <button
          type="button"
          className="game-button"
          onClick={() => {
            setFound(new Set())
            setMessage(null)
          }}
        >
          {again}
        </button>
      )}
    </div>
  )
}

const SPRINT_SECONDS = 90

/** A timed run of observation problems; a wrong answer sends the visitor back to choose again. */
function SprintGame({ onClose }: { onClose: () => void }) {
  const t = useResolved(games.sprint)
  const shared = useResolved(games)
  const [phase, setPhase] = useState<'intro' | 'run' | 'end'>('intro')
  const [left, setLeft] = useState(SPRINT_SECONDS)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [verdict, setVerdict] = useState<'right' | 'wrong' | null>(null)

  useEffect(() => {
    if (phase !== 'run') return
    const id = setInterval(() => setLeft((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [phase])
  useEffect(() => {
    if (phase === 'run' && left <= 0) setPhase('end')
  }, [phase, left])

  const start = () => {
    setLeft(SPRINT_SECONDS)
    setIndex(0)
    setScore(0)
    setVerdict(null)
    setPhase('run')
  }

  if (phase === 'intro') {
    return (
      <div className="game-body game-body--centre">
        <h3 className="file-title">{t.title}</h3>
        <p className="file-paragraph game-wide">{t.intro}</p>
        <button type="button" className="game-button" onClick={start}>
          {t.start}
        </button>
      </div>
    )
  }

  if (phase === 'end') {
    return (
      <div className="game-body game-body--centre">
        <p className="file-number">{t.complete}</p>
        <h3 className="file-title">{t.solved.replace('{score}', String(score))}</h3>
        <p className="file-paragraph game-wide">{t.closing}</p>
        <div className="game-row">
          <button type="button" className="game-button" onClick={start}>
            {shared.again}
          </button>
          <button type="button" className="game-button game-button--quiet" onClick={onClose}>
            {shared.back}
          </button>
        </div>
      </div>
    )
  }

  const mission = t.missions[index]
  const last = index === t.missions.length - 1
  return (
    <div className="game-body">
      <p className="game-meter">
        <span>
          {t.time} <strong>{left}</strong>
        </span>
        <span>
          {t.score} <strong>{score}</strong>
        </span>
      </p>
      <p className="file-number">
        {t.mission} {index + 1}
      </p>
      <h3 className="game-ask">{mission.ask}</h3>
      <div className="game-row">
        {mission.options.map((option, i) => (
          <button
            key={option}
            type="button"
            className="game-button game-button--quiet"
            disabled={verdict === 'right'}
            onClick={() => {
              if (i === mission.answer) {
                setScore((n) => n + 1)
                setVerdict('right')
              } else setVerdict('wrong')
            }}
          >
            {option}
          </button>
        ))}
      </div>
      <p className="game-status" aria-live="polite">
        {verdict === 'right' ? mission.right : verdict === 'wrong' ? mission.wrong : ''}
      </p>
      {verdict === 'right' && (
        <button
          type="button"
          className="game-button"
          onClick={() => {
            setVerdict(null)
            if (last) setPhase('end')
            else setIndex((n) => n + 1)
          }}
        >
          {last ? t.finish : t.next}
        </button>
      )}
    </div>
  )
}

/** The chart is 760×260; a day is DAY wide and the curve stands on BASE. */
const DAY = 60
const BASE = 210
const TOP = 30
const LEFT = 20

/** A flood rises and drains; the visitor chooses when a six-day satellite first passes. */
function PassGame() {
  const t = useResolved(games.pass)
  const [first, setFirst] = useState(0)
  const caught = bestPass(first)
  const x = (day: number) => LEFT + day * DAY
  const y = (extent: number) => BASE - extent * (BASE - TOP)
  const curve = Array.from({ length: PASS.days * 4 + 1 }, (_, i) => `${x(i / 4)},${y(floodExtent(i / 4))}`).join(' ')
  const passes: number[] = []
  for (let day = first; day <= PASS.days; day += PASS.revisit) passes.push(day)

  return (
    <div className="game-body">
      <h3 className="file-title">{t.title}</h3>
      <p className="file-paragraph">{t.lead}</p>
      <svg className="pass-art" viewBox="0 0 760 260" role="img" aria-label={t.extent}>
        <polygon className="pass-flood" points={`${x(0)},${BASE} ${curve} ${x(PASS.days)},${BASE}`} />
        <path className="pass-axis" d={`M${x(0)} ${BASE}H${x(PASS.days)}`} />
        {Array.from({ length: PASS.days / 2 + 1 }, (_, i) => i * 2).map((day) => (
          <text key={day} className="pass-label" x={x(day)} y={BASE + 28}>
            {t.day} {day}
          </text>
        ))}
        {passes.map((day) => (
          <g key={day}>
            <path className="pass-line" d={`M${x(day)} ${TOP - 12}V${BASE}`} />
            <circle className="pass-dot" cx={x(day)} cy={y(floodExtent(day))} r="8" />
            <text className="pass-label pass-label--strong" x={x(day)} y={TOP - 18}>
              {t.pass}
            </text>
          </g>
        ))}
      </svg>
      <label className="pass-control">
        {t.slider}
        <input
          type="range"
          role="slider"
          min={0}
          max={PASS.revisit - 0.25}
          step={0.25}
          value={first}
          aria-valuetext={`${t.day} ${first}`}
          onChange={(e) => setFirst(Number(e.target.value))}
        />
      </label>
      <p className="game-status" aria-live="polite">
        <strong>{Math.round(caught * 100)}%</strong> {t.caught}. {caught >= 0.9 ? t.good : t.poor}
      </p>
    </div>
  )
}
