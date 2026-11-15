import { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { backdrops, type PhotoKey } from '../assets'
import { useResolved } from '../i18n'
import { EASE } from '../motion'
import type { Backdrop, CameraShot, LessonStep } from '../story/types'
import { RadarLesson } from './RadarLesson'
import { SpaceScene } from './SpaceScene'
import { Triptych } from './Triptych'

const keyOf = (b: Backdrop) => (b.kind === 'image' ? b.key : `triptych:${b.keys.join(',')}`)

/** The background. A new one fades in on top of the old one. */
export function BackdropLayer({ backdrop, camera, lesson }: {
  backdrop: Backdrop | null
  camera: CameraShot
  lesson: LessonStep
}) {
  // Count every change, so that returning to a backdrop mounts a fresh layer
  // on top. Reusing the key would revive the old layer where it was, under
  // whatever replaced it, if it had not finished leaving yet.
  const id = backdrop ? keyOf(backdrop) : null
  const turn = useRef({ id, count: 0 })
  if (turn.current.id !== id) turn.current = { id, count: turn.current.count + 1 }

  return (
    <AnimatePresence>
      {backdrop && (
        <motion.div
          key={`${turn.current.count}:${id}`}
          className="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // Stay visible underneath until the new backdrop has finished arriving
          // (the three-way split takes a moment to uncover itself). The value
          // has to change a hair, or the exit ends at once and the old backdrop
          // is removed before the new one has covered it.
          exit={{ opacity: [1, 0.999], transition: { duration: 1.8 } }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {backdrop.kind === 'triptych' ? (
            <Triptych keys={backdrop.keys} />
          ) : backdrop.key === 'space' ? (
            <SpaceScene camera={camera} />
          ) : backdrop.key === 'radarLesson' ? (
            <RadarLesson step={lesson} />
          ) : (
            <PhotoBackdrop id={backdrop.key} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PhotoBackdrop({ id }: { id: PhotoKey }) {
  const { src, alt, stamp, position, drift, fit } = useResolved(backdrops[id])
  return (
    <>
      {/* A contained image leaves gaps, so it needs its own ground to cover the last backdrop. */}
      {fit === 'contain' && <div className="backdrop-ground" />}
      <motion.img
        className={fit === 'contain' ? 'backdrop-image backdrop-image--contain' : 'backdrop-image'}
        src={src}
        alt={alt}
        style={{ objectPosition: position }}
        draggable={false}
        initial={drift ? { scale: drift.from } : false}
        animate={drift ? { scale: drift.to } : undefined}
        transition={drift ? { duration: drift.seconds, ease: drift.pace === 'settle' ? EASE : 'linear' } : undefined}
      />
      {stamp && (
        <p className="stamp stamp--corner">
          <span className="stamp-lead">{stamp.place}</span> · {stamp.date} · {stamp.source}
        </p>
      )}
    </>
  )
}
