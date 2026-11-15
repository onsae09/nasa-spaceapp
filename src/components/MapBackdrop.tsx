import { backdrops } from '../assets'
import { analysis } from '../content/analysis'
import { useResolved } from '../i18n'
import type { MapLook } from '../story/types'

/**
 * The window the map is shown in, in stage pixels: above the dialogue box.
 * Its centre, (960, 388), is where Sara's `patch` and `map` anchors point.
 */
const WINDOW = { left: 112, top: 96, width: 1696, height: 584 }

/** The map fills the window's height and is centred in its width. */
const HEIGHT = WINDOW.height
const WIDTH = (HEIGHT * analysis.size.width) / analysis.size.height
const BOX = { left: WINDOW.left + (WINDOW.width - WIDTH) / 2, top: WINDOW.top, width: WIDTH, height: HEIGHT }

/** The flooded field the story closes in on (region B of the map viewer), and how far to zoom. */
const PATCH = { ...analysis.regions.B, zoom: 3 }

/** How to move the map so that the patch sits in the middle of the window. */
function frame(look: MapLook) {
  if (look !== 'patch') return 'none'
  const dx = (PATCH.x - 0.5) * WIDTH * PATCH.zoom
  const dy = (PATCH.y - 0.5) * HEIGHT * PATCH.zoom
  return `translate(${-dx}px, ${-dy}px) scale(${PATCH.zoom})`
}

/**
 * The radar strip as a backdrop the story can walk through: the pass before
 * the cyclone, the pass after it, a close look at one field that went dark,
 * and the reference map laid over the whole strip.
 */
export function MapBackdrop({ look }: { look: MapLook }) {
  const { alt, stamp } = useResolved(backdrops.amphanSwath)
  const text = useResolved(analysis)
  const after = look !== 'whole'
  const marked = look === 'patch' || look === 'marked'
  return (
    <>
      <div className="backdrop-ground" />
      <div className="mapdrop">
        <div className="mapdrop-image" style={{ ...BOX, transform: frame(look) }}>
          <img className="map-layer" src={text.layers.vh.before} alt={alt} draggable={false} />
          <img className="map-layer map-layer--slow" src={text.layers.vh.after} alt="" draggable={false} style={{ opacity: after ? 1 : 0 }} />
          <img className="map-layer map-layer--slow" src={text.reference.src} alt="" draggable={false} style={{ opacity: marked ? 1 : 0 }} />
        </div>
      </div>
      {stamp && (
        <p className="stamp stamp--corner">
          <span className="stamp-lead">{stamp.place}</span> · {after ? text.after : text.before} · {stamp.source}
        </p>
      )}
    </>
  )
}
