import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ui } from '../content/ui'
import { useResolved } from '../i18n'
import { EASE } from '../motion'
import type { Cover } from '../story/types'

export const SCAN_SECONDS = 2.8

/**
 * Cloud that rolls in over a satellite image, and the radar sweep that
 * clears it. The sweep uncovers the image that was already there; it does
 * not show radar data. When chapter 2 has a real SAR frame of this area,
 * put it under the cloud here so the sweep reveals the radar view itself.
 */
export function CloudCover({ cover }: { cover: Cover | null }) {
  const scanning = cover === 'scan'
  const label = useResolved(ui.scan)
  return (
    <AnimatePresence>
      {cover && (
        <motion.div
          key="cover"
          className="cloud-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.4, ease: EASE }}
        >
          {/* The cloud is cut away from the left as the sweep crosses. */}
          <motion.div
            className="cloud-sky"
            initial={false}
            animate={{ clipPath: scanning ? 'inset(0% 0% 0% 100%)' : 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: scanning ? SCAN_SECONDS : 0, ease: 'linear' }}
          >
            <CloudLayer seed={11} className="cloud-layer cloud-layer--near" />
            <CloudLayer seed={47} className="cloud-layer cloud-layer--far" />
          </motion.div>

          {scanning && (
            <>
              <motion.div
                className="scan-beam"
                initial={{ x: 0 }}
                animate={{ x: 1920 }}
                transition={{ duration: SCAN_SECONDS, ease: 'linear' }}
              />
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
