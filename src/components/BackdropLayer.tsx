import { AnimatePresence, motion } from 'motion/react'
import { backdrops } from '../assets'
import { EASE } from '../motion'
import type { Backdrop, BackdropKey, CameraShot } from '../story/types'
import { SpaceScene } from './SpaceScene'
import { Triptych } from './Triptych'

const keyOf = (b: Backdrop) => (b.kind === 'image' ? b.key : `triptych:${b.keys.join(',')}`)

/** The background. A new one fades in on top of the old one. */
export function BackdropLayer({ backdrop, camera }: { backdrop: Backdrop | null; camera: CameraShot }) {
  return (
    <AnimatePresence>
      {backdrop && (
        <motion.div
          key={keyOf(backdrop)}
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
          ) : (
            <PhotoBackdrop id={backdrop.key} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function PhotoBackdrop({ id }: { id: BackdropKey }) {
  const { src, alt, stamp, position, drift } = backdrops[id]
  return (
    <>
      <motion.img
        className="backdrop-image"
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
