import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { EASE } from '../motion'

/** How long the answer stays marked before the story moves on. */
const SETTLE_MS = 1100

/**
 * A question the visitor answers before being told. Whatever they pick, the
 * right answer is marked, then the story moves on.
 */
export function Choice({ options, answer, onDone }: { options: string[]; answer: number; onDone: () => void }) {
  const [picked, setPicked] = useState<number | null>(null)

  useEffect(() => {
    if (picked == null) return
    const id = setTimeout(onDone, SETTLE_MS)
    return () => clearTimeout(id)
  }, [picked, onDone])

  return (
    <motion.div
      className="choice"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      onClick={(e) => e.stopPropagation()}
    >
      {options.map((option, i) => (
        <button
          key={option}
          type="button"
          className="choice-option"
          data-state={picked == null ? undefined : i === answer ? 'right' : i === picked ? 'wrong' : 'other'}
          disabled={picked != null}
          onClick={() => setPicked(i)}
        >
          {option}
        </button>
      ))}
    </motion.div>
  )
}
