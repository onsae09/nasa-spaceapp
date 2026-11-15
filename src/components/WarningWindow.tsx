import { useEffect, useRef, useState } from 'react'
import { ui } from '../content/ui'
import { useResolved } from '../i18n'

/**
 * The warning-time sum from the team's solutions paper (section 4), for a
 * flood that starts 35 km upstream:
 *
 *   arrival = distance / speed
 *   window  = arrival − time to detect − time to alert
 *
 * With people in the loop, detecting takes 10 minutes and alerting 5; with
 * sensor, model and cell broadcast wired together the two take 5. A village
 * needs 15 minutes to get out. The speeds are the paper's illustrative
 * ones, not measurements, and the screen says so.
 */
const DISTANCE_KM = 35
const SPEEDS = [5, 10, 15, 20]
const NEEDED = 15
const DELAY = { manual: { detect: 10, alert: 5 }, automatic: { detect: 0, alert: 5 } }

/** The drawing is 1696×584; the bar starts here and a minute is this wide. */
const LEFT = 120
const PER_MINUTE = 8
const BAR = { y: 132, height: 72 }

const arrival = (speed: number) => (DISTANCE_KM * 1000) / speed / 60
const one = (minutes: number) => minutes.toFixed(1)

export type WindowTask = {
  /** The story is waiting for the visitor to find the village its 15 minutes. */
  armed: boolean
  onDone: () => void
}

/**
 * The visitor sees the worst case first (the fastest flood, people in the
 * loop, just short of 15 minutes) and finds what buys the time back.
 */
export function WarningWindow({ task }: { task?: WindowTask }) {
  const t = useResolved(ui.window)
  const [speed, setSpeed] = useState(20)
  const [automatic, setAutomatic] = useState(false)

  const delay = automatic ? DELAY.automatic : DELAY.manual
  const lost = delay.detect + delay.alert
  const arrives = arrival(speed)
  const left = arrives - lost
  const enough = left >= NEEDED

  // Automating the warning is the answer: it is enough at every speed shown.
  const armed = task?.armed ?? false
  const onDone = useRef(task?.onDone)
  onDone.current = task?.onDone
  useEffect(() => {
    if (!armed || !automatic) return
    const id = setTimeout(() => onDone.current?.(), 1800)
    return () => clearTimeout(id)
  }, [armed, automatic])

  const x = (minutes: number) => LEFT + minutes * PER_MINUTE

  return (
    <div className="window">
      <svg className="window-art" viewBox="0 0 1696 584" role="img" aria-label={t.alt}>
        <text className="lesson-label lesson-label--lead" x={LEFT} y={BAR.y - 72}>
          {t.axis}
        </text>

        {/* Minutes lost before anyone is told. */}
        <rect className="window-lost" x={x(0)} y={BAR.y} width={lost * PER_MINUTE} height={BAR.height} rx="8" />
        <text className="lesson-label window-small" x={x(0)} y={BAR.y - 20}>
          {automatic ? t.automaticDelay : t.manualDelay}
        </text>

        {/* What is left to get out in. */}
        <rect
          className={enough ? 'window-left window-left--enough' : 'window-left'}
          x={x(lost)}
          y={BAR.y}
          width={Math.max(left, 0) * PER_MINUTE}
          height={BAR.height}
          rx="8"
        />

        {/* The flood arrives. */}
        <path className="lesson-line" d={`M${x(arrives)} ${BAR.y - 40}V${BAR.y + BAR.height + 40}`} />
        <text className="lesson-label window-small" x={x(arrives) + 20} y={BAR.y + BAR.height / 2 + 8}>
          {t.arrives} · {one(arrives)} {t.min}
        </text>

        {/* The 15 minutes a village needs, measured back from the arrival. */}
        <path
          className="window-needed"
          d={`M${x(arrives - NEEDED)} ${BAR.y + BAR.height + 28}v-12M${x(arrives - NEEDED)} ${BAR.y + BAR.height + 22}H${x(arrives)}`}
        />
        <text className="lesson-label lesson-label--centre window-small" x={x(arrives - NEEDED / 2)} y={BAR.y + BAR.height + 64}>
          {t.needed}
        </text>

        <text className="window-figure" x={LEFT} y={BAR.y + 300}>
          {one(left)} {t.min}
        </text>
        <text className="lesson-label lesson-label--strong" x={LEFT + 480} y={BAR.y + 260}>
          {t.left}
        </text>
        <text className={enough ? 'lesson-label window-verdict window-verdict--enough' : 'lesson-label window-verdict'} x={LEFT + 480} y={BAR.y + 304}>
          {enough ? t.enough : t.short}
        </text>
      </svg>

      <div className="window-controls" onClick={(e) => e.stopPropagation()}>
        <p className="map-group">{t.speed}</p>
        <div className="map-switch" role="group" aria-label={t.speed}>
          {SPEEDS.map((value) => (
            <button
              key={value}
              type="button"
              className="map-switch-option window-speed"
              aria-pressed={value === speed}
              onClick={() => setSpeed(value)}
            >
              {value} m/s
            </button>
          ))}
        </div>
        <p className="stamp window-note">{t.illustrative}</p>

        <button
          type="button"
          className="window-automate"
          aria-pressed={automatic}
          onClick={() => setAutomatic((on) => !on)}
        >
          <span className="window-automate-box" aria-hidden="true" />
          {t.automate}
        </button>
        <p className="stamp window-note">{t.source}</p>
      </div>
    </div>
  )
}
