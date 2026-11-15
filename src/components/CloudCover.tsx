import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'motion/react'
import { ui } from '../content/ui'
import { useResolved } from '../i18n'
import { EASE } from '../motion'
import type { Cover } from '../story/types'
import { STAGE_WIDTH } from './Stage'

export const SCAN_SECONDS = 2.8

/** In drag mode the beam starts a little way in, so it can be seen and grabbed. */
const START = 0.05
/** Dragged this far, the sweep finishes itself. */
const ENOUGH = 0.92

/**
 * Cloud that rolls in over a satellite image, and the radar sweep that
 * clears it. With `drag`, the visitor pulls the beam across themselves (or
 * presses Enter on its handle to have it cross on its own); `onSwept` fires
 * once it is across. With cover `scan` it crosses by itself.
 *
 * The sweep uncovers the image that was already there; it does not show
 * radar data, and the label on screen says so. When there is a real SAR
 * frame of this area, put it under the cloud here.
 */
export function CloudCover({ cover, drag = false, onSwept }: {
  cover: Cover | null
  drag?: boolean
  onSwept?: () => void
}) {
  const label = useResolved(ui.scan)
  const root = useRef<HTMLDivElement>(null)
  const held = useRef(false)
  const swept = useRef(false)

  /** How far across the beam is, 0 to 1. The cloud is cut away behind it. */
  const progress = useMotionValue(0)
  const clipPath = useTransform(progress, (p) => `inset(0% 0% 0% ${p * 100}%)`)
  const beamX = useTransform(progress, (p) => p * STAGE_WIDTH)

  useEffect(() => {
    if (cover === 'scan') {
      const sweep = animate(progress, 1, { duration: SCAN_SECONDS, ease: 'linear' })
      return () => sweep.stop()
    }
    if (cover === 'clouds') {
      swept.current = false
      progress.set(drag ? START : 0)
    }
  }, [cover, drag, progress])

  const finish = useCallback(
    (seconds: number) => {
      if (swept.current) return
      swept.current = true
      animate(progress, 1, { duration: seconds, ease: 'linear' }).then(() => onSwept?.())
    },
    [progress, onSwept],
  )

  /** Follows the pointer, but never gives ground back to the cloud. */
  const pull = (clientX: number) => {
    const rect = root.current?.getBoundingClientRect()
    if (!rect || swept.current) return
    const p = Math.max(progress.get(), Math.min((clientX - rect.left) / rect.width, 1))
    progress.set(p)
    if (p >= ENOUGH) finish(0.25)
  }

  const scanning = cover === 'scan' || (cover === 'clouds' && drag)

  return (
    <AnimatePresence>
      {cover && (
        <motion.div
          key="cover"
          ref={root}
          className="cloud-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.4, ease: EASE }}
        >
          <motion.div className="cloud-sky" style={{ clipPath }}>
            <CloudLayer seed={11} className="cloud-layer cloud-layer--near" />
            <CloudLayer seed={47} className="cloud-layer cloud-layer--far" />
          </motion.div>

          {scanning && (
            <>
              <motion.div className="scan-beam" style={{ x: beamX }} />
              <motion.p
                className="stamp scan-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className="stamp-lead">{label.lead}</span> · {label.rest}
              </motion.p>
            </>
          )}

          {drag && cover === 'clouds' && (
            <div
              className="sweep"
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                held.current = true
                pull(e.clientX)
              }}
              onPointerMove={(e) => held.current && pull(e.clientX)}
              onPointerUp={() => (held.current = false)}
              onPointerCancel={() => (held.current = false)}
            >
              <motion.button
                type="button"
                className="sweep-handle"
                role="slider"
                aria-label={label.drag}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress.get() * 100)}
                style={{ x: beamX }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') {
                    const p = Math.min(progress.get() + 0.1, 1)
                    progress.set(p)
                    if (p >= ENOUGH) finish(0.25)
                  } else if (e.key === 'Enter' || e.key === ' ') finish(SCAN_SECONDS * (1 - progress.get()))
                  else return
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
                </svg>
              </motion.button>
              <motion.p className="sweep-prompt" style={{ x: beamX }}>
                {label.drag}
              </motion.p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const WIDTH = 540
const HEIGHT = 270
const LATTICE = 64

/** A sheet of cloud seen from above, drawn once from layered noise. */
function CloudLayer({ seed, className }: { seed: number; className: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const ctx = ref.current?.getContext('2d')
    if (!ctx) return

    let state = seed
    const random = () => ((state = (state * 1664525 + 1013904223) >>> 0) / 2 ** 32)
    const lattice = Float32Array.from({ length: LATTICE * LATTICE }, random)
    const at = (x: number, y: number) => lattice[(y & (LATTICE - 1)) * LATTICE + (x & (LATTICE - 1))]

    // Smooth noise: blend the four lattice values around a point.
    const noise = (x: number, y: number) => {
      const xi = Math.floor(x)
      const yi = Math.floor(y)
      const u = (x - xi) ** 2 * (3 - 2 * (x - xi))
      const v = (y - yi) ** 2 * (3 - 2 * (y - yi))
      const top = at(xi, yi) + (at(xi + 1, yi) - at(xi, yi)) * u
      const bottom = at(xi, yi + 1) + (at(xi + 1, yi + 1) - at(xi, yi + 1)) * u
      return top + (bottom - top) * v
    }

    // Five octaves: big billows first, then finer and fainter detail.
    const billow = (x: number, y: number) => {
      let value = 0
      let size = 1 / 90
      let weight = 0.5
      for (let octave = 0; octave < 5; octave++) {
        value += weight * noise(x * size, y * size)
        size *= 2
        weight *= 0.5
      }
      return value
    }

    const image = ctx.createImageData(WIDTH, HEIGHT)
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const density = billow(x, y)
        // Thick over most of the frame, thinning only in the sparsest patches.
        const t = Math.min(Math.max((density - 0.2) / 0.25, 0), 1)
        const alpha = t * t * (3 - 2 * t)
        const shade = 196 + 56 * billow(x + 300, y + 170)
        const i = (y * WIDTH + x) * 4
        image.data[i] = shade - 6
        image.data[i + 1] = shade
        image.data[i + 2] = shade + 4
        image.data[i + 3] = alpha * 240
      }
    }
    ctx.putImageData(image, 0, 0)
  }, [seed])

  return <canvas ref={ref} className={className} width={WIDTH} height={HEIGHT} aria-hidden="true" />
}
