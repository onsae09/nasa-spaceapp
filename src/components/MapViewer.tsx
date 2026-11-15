import { useCallback, useEffect, useRef, useState } from 'react'
import { analysis, type LayerKey } from '../content/analysis'
import { ui } from '../content/ui'
import { useResolved } from '../i18n'
import { STAGE_WIDTH } from './Stage'
import { CloseIcon, FitIcon, MinusIcon, PlusIcon } from './icons'

/** Size of the map at rest, in stage pixels, and where its centre sits. */
const BASE_WIDTH = 1700
const BASE_HEIGHT = (BASE_WIDTH * analysis.size.height) / analysis.size.width
const CENTRE = { x: STAGE_WIDTH / 2, y: 510 }

const MAX_ZOOM = 6
const STEP = 1.5
const LAYERS: LayerKey[] = ['vh', 'vv']

type View = { x: number; y: number; zoom: number }
const HOME: View = { x: 0, y: 0, zoom: 1 }

/** Keeps the zoom in range and at least half of the map on screen. */
function settle(view: View): View {
  const zoom = Math.min(Math.max(view.zoom, 1), MAX_ZOOM)
  const reachX = (BASE_WIDTH * zoom) / 2
  const reachY = (BASE_HEIGHT * zoom) / 2
  return {
    zoom,
    x: Math.min(Math.max(view.x, -reachX), reachX),
    y: Math.min(Math.max(view.y, -reachY), reachY),
  }
}

/**
 * The radar change map, full screen, free to explore: scroll or use the
 * buttons to zoom, drag to move, and switch between the two radar channels
 * in place. The story has already walked through what it shows.
 */
export function MapViewer({ onClose }: { onClose: () => void }) {
  const text = useResolved(analysis)
  const words = useResolved(ui)
  const root = useRef<HTMLDivElement>(null)
  const [layer, setLayer] = useState<LayerKey>('vh')
  const [view, setView] = useState<View>(HOME)
  const [explored, setExplored] = useState(false)
  const drag = useRef<{ x: number; y: number } | null>(null)

  /** A point on screen, in stage pixels measured from the map's resting centre. */
  const toStage = useCallback((clientX: number, clientY: number) => {
    const rect = root.current!.getBoundingClientRect()
    const scale = rect.width / STAGE_WIDTH
    return {
      x: (clientX - rect.left) / scale - CENTRE.x,
      y: (clientY - rect.top) / scale - CENTRE.y,
      scale,
    }
  }, [])

  /** Zooms so that the point under (px, py) stays where it is. */
  const zoomAt = useCallback((factor: number, px = 0, py = 0) => {
    setExplored(true)
    setView((v) => {
      const zoom = Math.min(Math.max(v.zoom * factor, 1), MAX_ZOOM)
      const k = zoom / v.zoom
      return settle({ zoom, x: px - (px - v.x) * k, y: py - (py - v.y) * k })
    })
  }, [])

  // The wheel listener has to be non-passive to stop the page from scrolling.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const p = toStage(e.clientX, e.clientY)
      zoomAt(Math.exp(-e.deltaY * 0.0015), p.x, p.y)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [toStage, zoomAt])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else {
        const pan = (dx: number, dy: number) => setView((v) => settle({ ...v, x: v.x + dx, y: v.y + dy }))
        if (e.key === '+' || e.key === '=') zoomAt(STEP)
        else if (e.key === '-') zoomAt(1 / STEP)
        else if (e.key === '0') setView(HOME)
        else if (e.key === 'ArrowLeft') pan(80, 0)
        else if (e.key === 'ArrowRight') pan(-80, 0)
        else if (e.key === 'ArrowUp') pan(0, 80)
        else if (e.key === 'ArrowDown') pan(0, -80)
        else return
      }
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, zoomAt])

  const active = text.layers[layer]

  return (
    <div
      ref={root}
      className="map"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="map-surface"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          drag.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerMove={(e) => {
          if (!drag.current) return
          const { scale } = toStage(e.clientX, e.clientY)
          const dx = (e.clientX - drag.current.x) / scale
          const dy = (e.clientY - drag.current.y) / scale
          drag.current = { x: e.clientX, y: e.clientY }
          setExplored(true)
          setView((v) => settle({ ...v, x: v.x + dx, y: v.y + dy }))
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onDoubleClick={(e) => {
          const p = toStage(e.clientX, e.clientY)
          zoomAt(STEP, p.x, p.y)
        }}
      >
        <div
          className="map-image"
          style={{
            left: CENTRE.x - BASE_WIDTH / 2,
            top: CENTRE.y - BASE_HEIGHT / 2,
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
          }}
        >
          {LAYERS.map((key) => (
            <img
              key={key}
              className="map-layer"
              src={text.layers[key].src}
              alt={key === layer ? text.alt : ''}
              style={{ opacity: key === layer ? 1 : 0 }}
              draggable={false}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        className="icon-button map-close"
        aria-label={text.labels.close}
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
      >
        <CloseIcon />
      </button>

          <header className="map-head">
            <h2 className="overlay-title">{text.title}</h2>
            <p className="stamp">
              <span className="stamp-lead">{text.place}</span> · {text.dates} · {text.source}
            </p>
            <p className="stamp">{text.summary}</p>
          </header>

          <section className="map-panel">
            <p className="map-group">{text.channels}</p>
            <div className="map-switch" role="group" aria-label={text.channels}>
              {LAYERS.map((key) => (
                <button
                  key={key}
                  type="button"
                  className="map-switch-option"
                  aria-pressed={key === layer}
                  onClick={() => setLayer(key)}
                >
                  {text.layers[key].label}
                </button>
              ))}
            </div>
            <p className="map-explain">{active.explain}</p>

            <ul className="map-legend">
              {text.legend.map((item) => (
                <li key={item.text}>
                  <span
                    className={item.swatch ? 'map-swatch' : 'map-swatch map-swatch--speckle'}
                    style={item.swatch ? { background: item.swatch } : undefined}
                  />
                  {item.text}
                </li>
              ))}
            </ul>
          </section>

          <section className="map-result">
            <p className="map-finding">{text.question}</p>
            <dl className="map-scores">
              {LAYERS.map((key) => (
                <div key={key} className="map-score" data-active={key === layer}>
                  <dt>{text.layers[key].label}</dt>
                  {/* The bar runs from 50 in 100 (a coin toss) to 100 in 100. */}
                  <dd className="map-score-bar">
                    <span style={{ width: `${(text.layers[key].wins - 50) * 2}%` }} />
                  </dd>
                  <dd className="map-score-value">{text.layers[key].score}</dd>
                </div>
              ))}
            </dl>
            <p className="stamp map-note map-method">{text.notes[0]}</p>
          </section>

          {/* The small print sits in the empty band under the strip. */}
          <section className="map-notes">
            {text.notes.slice(1).map((note) => (
              <p key={note} className="stamp map-note">
                {note}
              </p>
            ))}
          </section>

          <div className="map-zoom">
            {!explored && <p className="stamp map-hint">{text.labels.hint}</p>}
            <button type="button" className="icon-button" aria-label={text.labels.zoomOut} onClick={() => zoomAt(1 / STEP)}>
              <MinusIcon />
            </button>
            <button type="button" className="icon-button" aria-label={text.labels.zoomIn} onClick={() => zoomAt(STEP)}>
              <PlusIcon />
            </button>
            <button type="button" className="icon-button" aria-label={text.labels.fit} onClick={() => setView(HOME)}>
              <FitIcon />
            </button>
          </div>
      <button type="button" className="story-button map-continue" onClick={onClose}>
        {words.continue}
      </button>
    </div>
  )
}
