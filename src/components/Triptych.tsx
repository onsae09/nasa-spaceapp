import { motion } from 'motion/react'
import { panels } from '../assets'
import { useResolved } from '../i18n'
import { EASE } from '../motion'
import type { PanelKey } from '../story/types'

const WIPE_SECONDS = 0.9
const STAGGER_SECONDS = 0.22

/**
 * Splits the background into three vertical photos. Each one is uncovered
 * from the top, left to right, and its flag follows once it is open.
 */
export function Triptych({ keys }: { keys: [PanelKey, PanelKey, PanelKey] }) {
  const all = useResolved(panels)
  return (
    <div className="triptych">
      {keys.map((key, i) => {
        const panel = all[key]
        const delay = 0.15 + i * STAGGER_SECONDS
        return (
          <motion.figure
            key={key}
            className="triptych-panel"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: WIPE_SECONDS, delay, ease: EASE }}
          >
            <motion.img
              className="triptych-photo"
              src={panel.src}
              alt={panel.alt}
              style={{ objectPosition: panel.position }}
              draggable={false}
              initial={{ scale: 1.14 }}
              animate={{ scale: 1 }}
              transition={{ duration: 7, delay, ease: EASE }}
            />
            <motion.figcaption
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: delay + 0.5, ease: EASE }}
            >
              <div className="triptych-label">
                <img className="triptych-flag" src={panel.flag} alt="" draggable={false} />
                <span className="triptych-country">{panel.country}</span>
                <p className="stamp">
                  {panel.stamp.place} · {panel.stamp.date}
                </p>
              </div>
              <p className="stamp triptych-source">{panel.stamp.source}</p>
            </motion.figcaption>
          </motion.figure>
        )
      })}
    </div>
  )
}
