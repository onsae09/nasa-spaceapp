import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { backdrops, earth } from '../assets'
import { EASE } from '../motion'
import type { CameraShot } from '../story/types'

/**
 * Nepal's position inside the Earth image, in stage pixels from the image's
 * top-left corner. The dive zooms around this point.
 */
const NEPAL = { x: 1187, y: 779 }

/** Where the Earth image sits for each camera shot (offsets from its resting place). */
const POSES: Record<CameraShot, { x: number; y: number; scale: number }> = {
  // A 387px disc centred at (1560, 480), clear of the title on the left.
  far: { x: -143, y: 96, scale: 0.22 },
  earth: { x: 0, y: 0, scale: 1 },
  // Brings Nepal to the centre of the frame while zooming in.
  dive: { x: -783, y: 205, scale: 4.5 },
}

const MOVES = {
  far: { duration: 0 },
  earth: { duration: 3.2, ease: EASE },
  // Slow start, then accelerating, like falling.
  dive: { duration: 1.8, ease: [0.6, 0, 0.9, 0.4] },
} as const

/** Open space with softly twinkling stars and the Earth, moved by the camera shot. */
export function SpaceScene({ camera }: { camera: CameraShot }) {
  return (
    <div className="space">
      <img className="backdrop-image" src={backdrops.space.src} alt="" draggable={false} />
      <Starfield />
      <motion.img
        className="earth"
        src={earth.src}
        alt="The Earth seen from orbit, with Asia and the Indian Ocean facing us."
        draggable={false}
        style={{ transformOrigin: `${NEPAL.x}px ${NEPAL.y}px` }}
        initial={false}
        animate={POSES[camera]}
        transition={MOVES[camera]}
      />
    </div>
  )
}

const STAR_COUNT = 110
const FRAME_MS = 50

/** A layer of stars that slowly brighten and dim. Drawn once if motion is reduced. */
function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Fixed seed so the stars are in the same place on every visit.
    let seed = 7
    const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32)
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: random() * canvas.width,
      y: random() * canvas.height,
      radius: 0.8 + random() * 1.6,
      phase: random() * Math.PI * 2,
      speed: 0.4 + random() * 1.1,
    }))

    const draw = (seconds: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#eef0f5'
      for (const star of stars) {
        // Between 45% and 100%: a shimmer, never a blink.
        ctx.globalAlpha = 0.725 + 0.275 * Math.sin(star.phase + seconds * star.speed)
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    draw(0)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let last = 0
    const loop = (now: number) => {
      if (now - last >= FRAME_MS) {
        last = now
        draw(now / 1000)
      }
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frame)
  }, [])

  return <canvas ref={ref} className="starfield" width={1920} height={1080} aria-hidden="true" />
}
