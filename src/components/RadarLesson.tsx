import { motion } from 'motion/react'
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

/**
 * How radar sees water, in four pictures: the signal goes down; dry ground
 * sends part of it back (bright); calm water bounces it away (dark); so a
 * place that turns darker between two passes may have flooded.
 */
export function RadarLesson({ step }: { step: LessonStep }) {
  const t = useResolved(ui.lesson)
  const wet = step === 'wet' || step === 'compare'
  const draw = { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 } }

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

        {/* The signal on its way down. */}
        <motion.path
          className="lesson-line"
          d={`M${SAT.x + 22} ${SAT.y + 52} L${HIT.x - 14} ${HIT.y - 16}`}
          markerEnd="url(#lesson-arrow)"
          {...draw}
          transition={{ duration: 0.9, ease: EASE }}
        />
        <text className="lesson-label" x={SAT.x + 330} y={SAT.y + 150}>
          {t.sent}
        </text>

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
        {step !== 'send' && (
          <text className="lesson-label lesson-label--centre" x={HIT.x} y={HIT.y + 96}>
            {wet ? t.wet : t.dry}
          </text>
        )}

        {/* Dry ground scatters the signal every way; part of it goes back up. */}
        {step === 'dry' && (
          <motion.g key="scatter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2, ease: EASE }}>
            {[-64, -24, 20, 58].map((angle) => {
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
              d={`M${HIT.x - 84} ${HIT.y - 26} L${SAT.x - 52} ${SAT.y + 78}`}
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
        {wet && (
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
        {step !== 'send' && (
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
    </div>
  )
}
