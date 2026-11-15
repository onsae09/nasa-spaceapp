import { backdrops } from '../assets'
import { analysis } from '../content/analysis'
import { useResolved } from '../i18n'
import type { MapLook } from '../story/types'

/**
 * The window the map is shown in, in stage pixels: above the dialogue box.
 * Its centre, (960, 388), is where Sara's `patch` and `map` anchors point.
 */
const WINDOW = { left: 112, top: 96, width: 1696, height: 584 }

/** The flooded patch the story closes in on: a point in the 1570×639 image, and how far to zoom. */
const PATCH = { x: 549, y: 364, zoom: 3 }

/** How to move the image so that the patch sits in the middle of the window. */
function frame(look: MapLook) {
  if (look === 'whole') return 'none'
  const { width, height } = analysis.size
  const scale = Math.min(WINDOW.width / width, WINDOW.height / height)
  const dx = (PATCH.x - width / 2) * scale * PATCH.zoom
  const dy = (PATCH.y - height / 2) * scale * PATCH.zoom
  return `translate(${-dx}px, ${-dy}px) scale(${PATCH.zoom})`
}

/** The radar change map as a backdrop the story can zoom into. */
export function MapBackdrop({ look }: { look: MapLook }) {
  const { src, alt, stamp } = useResolved(backdrops.amphanSwath)
  return (
    <>
      <div className="backdrop-ground" />
      <div className="mapdrop">
        <img className="mapdrop-image" src={src} alt={alt} draggable={false} style={{ ...WINDOW, transform: frame(look) }} />
      </div>
      {stamp && (
        <p className="stamp stamp--corner">
          <span className="stamp-lead">{stamp.place}</span> · {stamp.date} · {stamp.source}
        </p>
      )}
    </>
  )
}
