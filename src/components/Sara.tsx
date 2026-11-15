import { AnimatePresence, motion } from 'motion/react'
import { character } from '../assets'
import { useResolved } from '../i18n'
import { EASE } from '../motion'
import { anchors } from '../story/anchors'
import type { AnchorKey, SaraPose, SaraSpot } from '../story/types'
import { POSES, SARA_SIZE, SHOULDER, SPOTS, pointAt } from './saraPose'

const MOUTHS = {
  smile: 'M114 122 Q130 136 146 122',
  flat: 'M118 127 H142',
  open: 'M130 118 a9 11 0 1 0 0.01 0z',
}

/**
 * Sara, drawn in code so she can move: her arms turn at the shoulder to
 * strike a pose or to point at a place on the stage, her head tilts, and her
 * mouth moves while a line is being typed. A ring marks what she points at.
 *
 * Mounted once by the app, so she stays put while panels open and close.
 */
export function Sara({ show, at, pose, point, talking }: {
  show: boolean
  at: SaraSpot
  pose: SaraPose
  point: AnchorKey | null
  talking: boolean
}) {
  const alt = useResolved(character.alt)
  const spot = SPOTS[at]
  const target = point ? anchors[point] : null
  const p = pointAt(POSES[pose], at, target)
  const turn = (shoulder: { x: number; y: number }, angle: number) => ({
    transform: `translate(${shoulder.x}px, ${shoulder.y}px) rotate(${angle}deg)`,
  })

  return (
    <>
      <AnimatePresence>
        {show && target && target.r > 0 && (
          <motion.div
            key={point}
            className={target.box ? 'sara-target sara-target--box' : 'sara-target'}
            style={{
              left: target.x,
              top: target.y,
              width: target.box?.width ?? target.r * 2,
              height: target.box?.height ?? target.r * 2,
            }}
            initial={{ opacity: 0, scale: 1.25 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {show && (
          <motion.div
            key="sara"
            className="sara"
            style={{ ...SARA_SIZE, transformOrigin: '0 0' }}
            initial={{ opacity: 0, x: spot.x - 72, y: spot.y - 40, scale: spot.scale }}
            animate={{ opacity: 1, x: spot.x, y: spot.y, scale: spot.scale }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <svg
              className={talking ? 'sara-art sara-art--talking' : 'sara-art'}
              viewBox={`0 0 ${SARA_SIZE.width} ${SARA_SIZE.height}`}
              role="img"
              aria-label={alt}
            >
              <g className="sara-part" style={{ transform: `rotate(${p.lean}deg)`, transformOrigin: '130px 330px' }}>
                {/* Life-support pack, then legs and boots, behind the suit. */}
                <rect className="sara-pack" x="58" y="168" width="144" height="150" rx="30" />
                <rect className="sara-suit" x="78" y="312" width="46" height="108" rx="21" />
                <rect className="sara-suit" x="136" y="312" width="46" height="108" rx="21" />
                <rect className="sara-trim" x="70" y="398" width="60" height="34" rx="15" />
                <rect className="sara-trim" x="130" y="398" width="60" height="34" rx="15" />

                <g className="sara-part" style={turn(SHOULDER.left, p.armLeft)}>
                  <g className={p.wave ? 'sara-wave' : undefined}>
                    <Arm />
                  </g>
                </g>
                <g className="sara-part" style={turn(SHOULDER.right, p.armRight)}>
                  <Arm />
                </g>

                <rect className="sara-suit" x="66" y="180" width="128" height="160" rx="36" />
                <rect className="sara-trim" x="98" y="246" width="64" height="42" rx="8" />
                <rect className="sara-stripe" x="108" y="258" width="44" height="8" rx="4" />
                <circle className="sara-light" cx="116" cy="277" r="4" />

                <g className="sara-part" style={{ transform: `rotate(${p.head}deg)`, transformOrigin: '130px 190px' }}>
                  <rect className="sara-trim" x="24" y="84" width="20" height="44" rx="9" />
                  <rect className="sara-trim" x="216" y="84" width="20" height="44" rx="9" />
                  <circle className="sara-suit" cx="130" cy="104" r="94" />
                  <ellipse className="sara-visor" cx="130" cy="108" rx="70" ry="62" />
                  <path className="sara-shine" d="M92 76q18-22 44-18" />
                  <g className={p.face === 'open' ? 'sara-eyes sara-eyes--wide' : 'sara-eyes'}>
                    <circle cx="108" cy="100" r="7" />
                    <circle cx="152" cy="100" r="7" />
                  </g>
                  <path className={p.face === 'open' ? 'sara-mouth sara-mouth--open' : 'sara-mouth'} d={MOUTHS[p.face]} />
                </g>
              </g>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** An arm hanging straight down from the shoulder at (0, 0), with its glove. */
function Arm() {
  return (
    <>
      <rect className="sara-suit" x="-23" y="-16" width="46" height="128" rx="23" />
      <circle className="sara-glove" cx="0" cy="104" r="25" />
    </>
  )
}
