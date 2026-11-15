import { motion } from 'motion/react'
import { facts } from '../assets'
import { useResolved } from '../i18n'
import { EASE } from '../motion'
import type { FactKey } from '../story/types'

/** Figures shown large and still, with their source underneath. */
export function FactPanel({ id }: { id: FactKey }) {
  const { rows, source } = useResolved(facts[id])
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
      <p className="stamp fact-source">{source}</p>
    </motion.div>
  )
}
