import { AnimatePresence, motion } from 'motion/react'
import { backdrops } from '../assets'
import { EASE } from '../motion'
import type { Backdrop } from '../story/types'
import { Triptych } from './Triptych'

const keyOf = (b: Backdrop) => (b.kind === 'image' ? b.key : `triptych:${b.keys.join(',')}`)

/** The background. A new one fades in on top of the old one. */
export function BackdropLayer({ backdrop }: { backdrop: Backdrop | null }) {
  return (
    <AnimatePresence>
      {backdrop && (
        <motion.div
          key={keyOf(backdrop)}
          className="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          // Stay fully visible underneath until the new backdrop has faded in.
          exit={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {backdrop.kind === 'image' ? <ImageBackdrop id={backdrop.key} /> : <Triptych keys={backdrop.keys} />}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ImageBackdrop({ id }: { id: keyof typeof backdrops }) {
  const { src, alt, stamp, position } = backdrops[id]
  return (
    <>
      <img className="backdrop-image" src={src} alt={alt} style={{ objectPosition: position }} draggable={false} />
      {stamp && (
        <p className="stamp stamp--corner">
          <span className="stamp-lead">{stamp.place}</span> · {stamp.date} · {stamp.source}
        </p>
      )}
    </>
  )
}
