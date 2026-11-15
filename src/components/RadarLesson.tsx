import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ui } from '../content/ui'
import { useResolved } from '../i18n'
import { EASE } from '../motion'
import type { LessonStep } from '../story/types'

/** Where things sit in the 1696×600 drawing. */
const SAT = { x: 250, y: 110 }
const HIT = { x: 860, y: 450 }
const GROUND = { from: 520, to: 1200 }
const TILE = 180

/** The colour the flood map uses for water, so the lesson and the map agree. */
const WATER = '#3fe0f0'

const rough = () => {
  const points: string[] = []
  for (let x = GROUND.from, i = 0; x <= GROUND.to; x += 34, i++) points.push(`${x},${HIT.y + (i % 2 ? -9 : 9)}`)
  return points.join(' ')
}

type Point = { x: number; y: number }

/** The paths a pulse travels: down, back up as an echo, or away off the water. */
const DOWN = { from: { x: SAT.x + 22, y: SAT.y + 52 }, to: { x: HIT.x - 14, y: HIT.y - 16 } }
const ECHO = { from: { x: HIT.x - 84, y: HIT.y - 26 }, to: { x: SAT.x - 52, y: SAT.y + 78 } }
const AWAY = { from: { x: HIT.x + 16, y: HIT.y - 16 }, to: { x: HIT.x + 520, y: HIT.y - 290 } }
const SCATTER = [-64, -24, 20, 58]

/** Seconds: the pulse reaches the ground, and the whole shot is over. */
const LANDS = 1.4
const SHOT_MS = { dry: 3500, wet: 3400 }

export type Pulse = {
  /** The story is waiting for the visitor to fire. */
  armed: boolean
  onFire: () => void
  /** Called when the echo is home, or has failed to come. */
  onDone: () => void
}

/**
 * How radar sees water. The visitor fires the pulse: wavefronts travel down;
 * dry ground scatters them and part comes back (bright); calm water bounces
 * them away and nothing returns (dark). So a place that turns darker between
 * two passes may have flooded. Between shots it shows the still picture for
 * the current step.
 */
export function RadarLesson({ step, pulse }: { step: LessonStep; pulse?: Pulse }) {
  const t = useResolved(ui.lesson)
  const wet = step === 'flood' || step === 'wet' || step === 'compare'
  /** The still picture of the result: after a shot, not before one. */
  const shown = step === 'dry' || step === 'wet' || step === 'compare'
  const draw = { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 } }

  // Each press of Fire is one shot; the count restarts the animation.
  const [shot, setShot] = useState(0)
  const [flying, setFlying] = useState(false)
  const onDone = useRef(pulse?.onDone)
  onDone.current = pulse?.onDone
  useEffect(() => {
    if (!flying) return
    const id = setTimeout(() => {
      setFlying(false)
      onDone.current?.()
    }, wet ? SHOT_MS.wet : SHOT_MS.dry)
    return () => clearTimeout(id)
  }, [flying, shot, wet])

  // If the visitor steps back mid-flight, the shot is abandoned.
  const armed = pulse?.armed ?? false
  useEffect(() => {
    if (!armed) setFlying(false)
  }, [armed])

  return (
    <div className="lesson">
      <svg className="lesson-art" viewBox="0 0 1696 600" role="img" aria-label={t.alt}>
        <defs>
          <marker id="lesson-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0 0 10 5 0 10z" fill="context-stroke" />
          </marker>
        </defs>

        {/* The satellite: a body, two solar panels and a dish pointing down. */}
        <g className="lesson-line" transform={`translate(${SAT.x} ${SAT.y})`}>
          <rect x="-34" y="-24" width="68" height="48" rx="8" />
          <rect x="-128" y="-16" width="78" height="32" rx="4" />
          <rect x="50" y="-16" width="78" height="32" rx="4" />
          <path d="M-50 0h16M34 0h16" />
          <path d="M-18 24 0 44 18 24" />
        </g>

        <text className="lesson-label lesson-label--centre lesson-label--lead" x={SAT.x} y={SAT.y - 52}>
          {t.yours}
        </text>

        {/* The signal on its way down, once it has been fired. */}
        {shown && !flying && (
          <g key={`signal-${step}`}>
            <motion.path
              className="lesson-line"
              d={`M${DOWN.from.x} ${DOWN.from.y} L${DOWN.to.x} ${DOWN.to.y}`}
              markerEnd="url(#lesson-arrow)"
              {...draw}
              transition={{ duration: 0.9, ease: EASE }}
            />
            <text className="lesson-label" x={SAT.x + 330} y={SAT.y + 150}>
              {t.sent}
            </text>
          </g>
        )}

        {/* A shot in flight. */}
        {flying && (
          <g key={`shot-${shot}`}>
            <Trail from={DOWN.from} to={DOWN.to} delay={0} seconds={1.25} />
            <Wavefronts from={DOWN.from} to={DOWN.to} delay={0} seconds={1.25} />
            {wet ? (
              <>
                <Trail from={AWAY.from} to={AWAY.to} delay={LANDS} seconds={1.4} />
                <Wavefronts from={AWAY.from} to={AWAY.to} delay={LANDS} seconds={1.4} />
              </>
            ) : (
              <>
                {SCATTER.map((angle) => {
                  const a = ((angle - 90) * Math.PI) / 180
                  const from = { x: HIT.x + 30 * Math.cos(a), y: HIT.y - 14 + 30 * Math.sin(a) }
                  const to = { x: HIT.x + 150 * Math.cos(a), y: HIT.y - 14 + 150 * Math.sin(a) }
                  return <Wavefronts key={angle} from={from} to={to} delay={LANDS} seconds={0.8} count={2} soft />
                })}
                <Trail from={ECHO.from} to={ECHO.to} delay={LANDS + 0.2} seconds={1.4} soft />
                <Wavefronts from={ECHO.from} to={ECHO.to} delay={LANDS + 0.2} seconds={1.4} soft />
              </>
            )}
          </g>
        )}

        {/* The surface it lands on. */}
        {wet ? (
          <motion.g key="water" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: EASE }}>
            <path d={`M${GROUND.from} ${HIT.y}H${GROUND.to}`} stroke={WATER} className="lesson-surface" />
            <path d={`M${GROUND.from + 60} ${HIT.y + 22}H${GROUND.to - 60}`} stroke={WATER} className="lesson-surface lesson-surface--faint" />
            <path d={`M${GROUND.from + 140} ${HIT.y + 44}H${GROUND.to - 140}`} stroke={WATER} className="lesson-surface lesson-surface--faint" />
          </motion.g>
        ) : (
          <polyline key="ground" points={rough()} className="lesson-surface lesson-surface--ground" />
        )}
        {/* Named at the end of the surface, clear of the choices shown below it. */}
        <text className="lesson-label" x={GROUND.to + 28} y={HIT.y + 10}>
          {wet ? t.wet : t.dry}
        </text>

        {/* Dry ground scatters the signal every way; part of it goes back up. */}
        {step === 'dry' && !flying && (
          <motion.g key="scatter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2, ease: EASE }}>
            {SCATTER.map((angle) => {
              const a = ((angle - 90) * Math.PI) / 180
              return (
                <path
                  key={angle}
                  className="lesson-line lesson-line--soft"
                  d={`M${HIT.x + 30 * Math.cos(a)} ${HIT.y - 14 + 30 * Math.sin(a)} L${HIT.x + 120 * Math.cos(a)} ${HIT.y - 14 + 120 * Math.sin(a)}`}
                  markerEnd="url(#lesson-arrow)"
                />
              )
            })}
            {/* The echo runs beside the signal, dashed, so the two read apart. */}
            <motion.path
              className="lesson-line lesson-echo"
              d={`M${ECHO.from.x} ${ECHO.from.y} L${ECHO.to.x} ${ECHO.to.y}`}
              markerEnd="url(#lesson-arrow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
            />
            <text className="lesson-label" x={SAT.x + 70} y={SAT.y + 240}>
              {t.echo}
            </text>
          </motion.g>
        )}

        {/* Calm water is a mirror: the signal leaves at the same angle it arrived. */}
        {wet && shown && !flying && (
          <motion.g key="mirror" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2, ease: EASE }}>
            <motion.path
              className="lesson-line"
              d={`M${HIT.x + 16} ${HIT.y - 16} L${HIT.x + 330} ${HIT.y - 186}`}
              markerEnd="url(#lesson-arrow)"
              {...draw}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            />
            <text className="lesson-label" x={HIT.x + 230} y={HIT.y - 50}>
              {t.away}
            </text>
          </motion.g>
        )}

        {/* What ends up in the radar image. */}
        {shown && !flying && (
          <motion.g key={step === 'compare' ? 'pair' : 'tile'} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5, ease: EASE }}>
            <text className="lesson-label lesson-label--centre lesson-label--lead" x="1470" y="96">
              {t.records}
            </text>
            {step === 'compare' ? (
              <>
                <rect x={1470 - TILE - 30} y="140" width={TILE} height={TILE} rx="12" className="lesson-tile lesson-tile--bright" />
                <rect x={1470 + 30} y="140" width={TILE} height={TILE} rx="12" className="lesson-tile lesson-tile--dark" />
                <path className="lesson-line" d="M1454 230h32" markerEnd="url(#lesson-arrow)" />
                <text className="lesson-label lesson-label--centre" x={1470 - TILE / 2 - 30} y="368">
                  {t.before}
                </text>
                <text className="lesson-label lesson-label--centre" x={1470 + TILE / 2 + 30} y="368">
                  {t.after}
                </text>
                <text className="lesson-label lesson-label--centre lesson-label--strong" x="1470" y="430">
                  {t.darker}
                </text>
              </>
            ) : (
              <>
                <rect
                  x={1470 - TILE / 2}
                  y="140"
                  width={TILE}
                  height={TILE}
                  rx="12"
                  className={wet ? 'lesson-tile lesson-tile--dark' : 'lesson-tile lesson-tile--bright'}
                />
                <text className="lesson-label lesson-label--centre lesson-label--strong" x="1470" y="368">
                  {wet ? t.dark : t.bright}
                </text>
              </>
            )}
          </motion.g>
        )}
      </svg>

      <AnimatePresence>
        {pulse?.armed && !flying && (
          <motion.button
            key="fire"
            type="button"
            className="lesson-fire"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => {
              e.stopPropagation()
              setShot((n) => n + 1)
              setFlying(true)
              pulse.onFire()
            }}
          >
            {t.fire}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Curved wavefronts travelling from one point to another, one behind the next. */
function Wavefronts({ from, to, delay, seconds, count = 4, soft = false }: {
  from: Point
  to: Point
  delay: number
  seconds: number
  count?: number
  soft?: boolean
}) {
  const angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <motion.g
          key={i}
          initial={{ x: from.x, y: from.y, opacity: 0 }}
          animate={{ x: to.x, y: to.y, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: seconds,
            delay: delay + i * 0.11,
            ease: 'linear',
            opacity: { duration: seconds, delay: delay + i * 0.11, times: [0, 0.12, 0.8, 1] },
          }}
        >
          <path
            className={soft ? 'lesson-wave lesson-wave--soft' : 'lesson-wave'}
            transform={`rotate(${angle})`}
            d="M-12 -46Q20 0-12 46"
          />
        </motion.g>
      ))}
    </>
  )
}

/** The line a pulse leaves behind it as it travels, so its path can be followed. */
function Trail({ from, to, delay, seconds, soft = false }: {
  from: Point
  to: Point
  delay: number
  seconds: number
  soft?: boolean
}) {
  return (
    <motion.path
      className={soft ? 'lesson-trail lesson-trail--soft' : 'lesson-trail'}
      d={`M${from.x} ${from.y} L${to.x} ${to.y}`}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: [0, 0.5, 0.5, 0.2] }}
      transition={{ duration: seconds, delay, ease: 'linear' }}
    />
  )
}
