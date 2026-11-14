import { motion } from 'motion/react'
import { panels } from '../assets'
import { EASE } from '../motion'
import type { PanelKey } from '../story/types'

/** Splits the background into three vertical photos, each with its flag on top. */
export function Triptych({ keys }: { keys: [PanelKey, PanelKey, PanelKey] }) {
  return (
    <div className="triptych">
      {keys.map((key, i) => {
        const panel = panels[key]
        return (
          <motion.figure
            key={key}
            className="triptych-panel"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE }}
          >
            <img
              className="triptych-photo"
              src={panel.src}
              alt={panel.alt}
              style={{ objectPosition: panel.position }}
              draggable={false}
            />
            <figcaption>
              <div className="triptych-label">
                <img className="triptych-flag" src={panel.flag} alt="" draggable={false} />
                <span className="triptych-country">{panel.country}</span>
                <p className="stamp">
                  {panel.stamp.place} · {panel.stamp.date}
                </p>
              </div>
              <p className="stamp triptych-source">{panel.stamp.source}</p>
            </figcaption>
          </motion.figure>
        )
      })}
    </div>
  )
}
