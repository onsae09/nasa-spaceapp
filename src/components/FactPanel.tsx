import { motion } from 'motion/react'
import { facts } from '../assets'
import { useResolved } from '../i18n'
import { EASE } from '../motion'
import type { FactKey } from '../story/types'

/** Figures shown large and still, with their source underneath. */
export function FactPanel({ id }: { id: FactKey }) {
  const { rows, source, dots } = useResolved(facts[id])
  return (
    <motion.div
      className="fact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
    >
      {rows.map((row, i) => (
        <motion.p
          key={row.label}
          className="fact-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.35, ease: EASE }}
        >
          <span className="fact-figure">{row.figure}</span>
          <span className="fact-label">{row.label}</span>
        </motion.p>
      ))}
      {dots && (
        <p className="fact-dots" aria-hidden="true">
          {Array.from({ length: dots.total }, (_, i) => (
            <span key={i} className={i < dots.lit ? 'fact-dot fact-dot--lit' : 'fact-dot'} />
          ))}
        </p>
      )}
      <p className="stamp fact-source">{source}</p>
    </motion.div>
  )
}
