import { useCallback, useEffect, useRef, useState } from 'react'
import {
  analysis,
  formatLonLat,
  lonLat,
  type LayerKey,
  type RegionKey,
  type RegionLabel,
  type ViewKey,
} from '../content/analysis'
import { ui } from '../content/ui'
import { useResolved } from '../i18n'
import { caseNotes, useCaseNotes } from '../story/caseNotes'
import { STAGE_WIDTH, holdStill } from './Stage'
import { CloseIcon, FitIcon, MinusIcon, PlusIcon } from './icons'

/** Size of the map at rest, in stage pixels, and where its centre sits. */
const BASE_WIDTH = 1500
const BASE_HEIGHT = (BASE_WIDTH * analysis.size.height) / analysis.size.width
const CENTRE = { x: STAGE_WIDTH / 2, y: 500 }

const MAX_ZOOM = 6
const STEP = 1.5
/** How close the map comes when a region is picked. */
const REGION_ZOOM = 3
const LAYERS: LayerKey[] = ['vh', 'vv']
const VIEWS: ViewKey[] = ['compare', 'change']
const REGIONS: RegionKey[] = ['A', 'B', 'C']
const LABELS: RegionLabel[] = ['changed', 'present', 'unclear']
/** How far the divider can travel across the stage. */
const SPLIT = { min: 160, max: STAGE_WIDTH - 160 }
/** Lengths the scale bar may show, in km; the longest that fits is used. */
const SCALE_STEPS = [20, 10, 5, 2, 1]
const SCALE_MAX_PX = 260

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
 * The team's radar layers, full screen. The two passes sit either side of a
 * divider the visitor drags; three marked places wait to be judged as a new
 * change, something already there, or unclear; the published reference map
 * can be laid on top, and it visibly stops part-way along the strip. What the
 * visitor decides is kept in the case notes for the closing card.
 */
export function MapViewer({ onClose }: { onClose: () => void }) {
  const text = useResolved(analysis)
  const words = useResolved(ui)
  const notes = useCaseNotes()
  const root = useRef<HTMLDivElement>(null)
  const [layer, setLayer] = useState<LayerKey>('vh')
  const [mode, setMode] = useState<ViewKey>('compare')
  const [reference, setReference] = useState(false)
  const [view, setView] = useState<View>(HOME)
  const [split, setSplit] = useState(CENTRE.x)
  const [explored, setExplored] = useState(false)
  const [region, setRegion] = useState<RegionKey | null>(null)
  const [cursor, setCursor] = useState<{ u: number; v: number } | null>(null)
  const drag = useRef<{ x: number; y: number } | null>(null)
  const sliding = useRef(false)

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

  /** Brings a region to the middle of the screen, with the divider through it. */
  const inspect = useCallback((key: RegionKey) => {
    const { x, y } = analysis.regions[key]
    setRegion(key)
    setExplored(true)
    setSplit(CENTRE.x)
    setView(settle({ zoom: REGION_ZOOM, x: -(x - 0.5) * BASE_WIDTH * REGION_ZOOM, y: -(y - 0.5) * BASE_HEIGHT * REGION_ZOOM }))
  }, [])

  /** The whole strip again, with no region picked. */
  const home = useCallback(() => {
    setView(HOME)
    setSplit(CENTRE.x)
    setRegion(null)
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
      // The divider has the arrow keys while it is focused.
      if (e.target instanceof HTMLElement && e.target.getAttribute('role') === 'slider') return
      const pan = (dx: number, dy: number) => setView((v) => settle({ ...v, x: v.x + dx, y: v.y + dy }))
      if (e.key === 'Escape') onClose()
      else if (e.key === '+' || e.key === '=') zoomAt(STEP)
      else if (e.key === '-') zoomAt(1 / STEP)
      else if (e.key === '0') home()
      else if (e.key === 'ArrowLeft') pan(80, 0)
      else if (e.key === 'ArrowRight') pan(-80, 0)
      else if (e.key === 'ArrowUp') pan(0, 80)
      else if (e.key === 'ArrowDown') pan(0, -80)
      else return
      e.preventDefault()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, zoomAt, home])

  const showReference = (on: boolean) => {
    setReference(on)
    if (on) caseNotes.checkReference()
  }

  const active = text.layers[layer]
  const comparing = mode === 'compare'
  /** The divider's place inside the unscaled map image, in pixels from its left edge. */
  const splitInImage = (split - CENTRE.x - view.x) / view.zoom + BASE_WIDTH / 2

  const kmPerPx = analysis.kmWide / (BASE_WIDTH * view.zoom)
  const scaleKm = SCALE_STEPS.find((km) => km / kmPerPx <= SCALE_MAX_PX) ?? 1

  const chosen = region ? notes.labels[region] : undefined
  const found = (key: RegionKey) => notes.labels[key] === analysis.regions[key].answer
  const slots: { label: RegionLabel; key: RegionKey }[] = [
    { label: 'changed', key: 'B' },
    { label: 'present', key: 'A' },
    { label: 'unclear', key: 'C' },
  ]
  const where = (key: RegionKey) => formatLonLat(lonLat(analysis.regions[key].x, analysis.regions[key].y))

  return (
    <div ref={root} className="map" onClick={(e) => e.stopPropagation()} onScroll={holdStill}>
      <div
        className="map-surface"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId)
          drag.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerMove={(e) => {
          const p = toStage(e.clientX, e.clientY)
          const u = (p.x - view.x) / (BASE_WIDTH * view.zoom) + 0.5
          const v = (p.y - view.y) / (BASE_HEIGHT * view.zoom) + 0.5
          setCursor(u >= 0 && u <= 1 && v >= 0 && v <= 1 ? { u, v } : null)
          if (!drag.current) return
          const dx = (e.clientX - drag.current.x) / p.scale
          const dy = (e.clientY - drag.current.y) / p.scale
          drag.current = { x: e.clientX, y: e.clientY }
          setExplored(true)
          setView((old) => settle({ ...old, x: old.x + dx, y: old.y + dy }))
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onPointerLeave={() => setCursor(null)}
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
            <div key={key} className="map-stack" style={{ opacity: key === layer ? 1 : 0 }}>
              <img
                className="map-layer"
                src={text.layers[key].before}
                alt={key === layer && comparing ? text.alt.compare : ''}
                style={{ opacity: comparing ? 1 : 0 }}
                draggable={false}
              />
              {/* The later pass shows to the right of the divider. */}
              <img
                className="map-layer"
                src={text.layers[key].after}
                alt=""
                style={{ opacity: comparing ? 1 : 0, clipPath: `inset(0 0 0 ${splitInImage}px)` }}
                draggable={false}
              />
              <img
                className="map-layer"
                src={text.layers[key].change}
                alt={key === layer && !comparing ? text.alt.change : ''}
                style={{ opacity: comparing ? 0 : 1 }}
                draggable={false}
              />
            </div>
          ))}

          <img
            className="map-layer"
            src={text.reference.src}
            alt=""
            style={{ opacity: reference ? 1 : 0 }}
            draggable={false}
          />
          {reference && (
            <>
              <svg className="map-coverage" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden="true">
                <polygon points={analysis.reference.coverage.map((p) => p.join(',')).join(' ')} />
              </svg>
              <p
                className="stamp map-coverage-label"
                style={{
                  left: `${analysis.reference.coverage[3][0] * 100}%`,
                  top: `${analysis.reference.coverage[3][1] * 100}%`,
                  transform: `scale(${1 / view.zoom})`,
                }}
              >
                {text.reference.edge}
              </p>
            </>
          )}

          {REGIONS.map((key) => {
            const { x, y, r } = analysis.regions[key]
            return (
              <button
                key={key}
                type="button"
                className="map-region"
                data-selected={key === region}
                data-found={found(key)}
                aria-label={`${text.task.region} ${key}`}
                aria-pressed={key === region}
                style={{ left: `${x * 100}%`, top: `${y * 100}%`, width: r * 2 * BASE_WIDTH, height: r * 2 * BASE_WIDTH }}
                onPointerDown={(e) => e.stopPropagation()}
                onDoubleClick={(e) => e.stopPropagation()}
                onClick={() => inspect(key)}
              >
                <span className="map-region-tag" style={{ transform: `scale(${1 / view.zoom})` }}>
                  {key}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {comparing && (
        <div className="map-divider" style={{ left: split }}>
          <p className="stamp map-divider-date map-divider-date--before">{text.beforeShort}</p>
          <p className="stamp map-divider-date map-divider-date--after">{text.afterShort}</p>
          <button
            type="button"
            className="map-divider-grip"
            role="slider"
            aria-label={text.labels.divider}
            aria-valuemin={SPLIT.min}
            aria-valuemax={SPLIT.max}
            aria-valuenow={Math.round(split)}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              sliding.current = true
            }}
            onPointerMove={(e) => {
              if (!sliding.current) return
              const p = toStage(e.clientX, e.clientY)
              setExplored(true)
              setSplit(Math.min(Math.max(p.x + CENTRE.x, SPLIT.min), SPLIT.max))
            }}
            onPointerUp={() => (sliding.current = false)}
            onPointerCancel={() => (sliding.current = false)}
            onKeyDown={(e) => {
              const by = e.key === 'ArrowLeft' ? -40 : e.key === 'ArrowRight' ? 40 : 0
              if (!by) return
              e.preventDefault()
              setSplit((s) => Math.min(Math.max(s + by, SPLIT.min), SPLIT.max))
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      )}

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
        {/* Where the pointer is on Earth, once it is over the map. */}
        <p className="stamp">{cursor ? formatLonLat(lonLat(cursor.u, cursor.v)) : text.summary}</p>
      </header>

      {/* The case notes: what to find, and what has been found. */}
      <section className="map-case">
        <p className="map-finding">{text.task.lead}</p>
        <p className="stamp map-note">{text.task.how}</p>
        <ul className="map-slots">
          {slots.map(({ label, key }) => (
            <li key={label} className="map-slot" data-filled={found(key)}>
              <span className="map-slot-name">{text.task.labels[label]}</span>
              <span className="map-slot-value">{found(key) ? `${key} · ${where(key)}` : text.task.empty}</span>
            </li>
          ))}
        </ul>

        {found('A') && found('B') && <p className="map-explain map-done">{text.task.done}</p>}
      </section>

      <section className="map-panel">
        <div className="map-controls">
          <div>
            <p className="map-group">{text.viewGroup}</p>
            <div className="map-switch" role="group" aria-label={text.viewGroup}>
              {VIEWS.map((key) => (
                <button
                  key={key}
                  type="button"
                  className="map-switch-option map-switch-option--wide"
                  aria-pressed={key === mode}
                  onClick={() => setMode(key)}
                >
                  {text.views[key]}
                </button>
              ))}
            </div>
          </div>
          <div>
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
          </div>
        </div>
        <p className="stamp map-note map-method">{active.explain}</p>

        <button type="button" className="map-check" aria-pressed={reference} onClick={() => showReference(!reference)}>
          <span className="map-check-box" aria-hidden="true" />
          {text.reference.toggle}
        </button>

        <ul className="map-legend">
          {[...text.legend[mode], ...(reference ? [text.legend.reference] : [])].map((item) => (
            <li key={item.text}>
              <span className="map-swatch" style={{ background: item.swatch }} />
              {item.text}
            </li>
          ))}
        </ul>
      </section>

      {/* The verdict on the picked region; until one is picked, how well the radar did overall. */}
      <section className="map-notes">
        {region ? (
          <div className="map-verdict">
            <p className="map-group">
              {text.task.region} {region} · {where(region)}
            </p>
            <div className="map-switch" role="group" aria-label={`${text.task.region} ${region}`}>
              {LABELS.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="map-switch-option map-switch-option--wide"
                  aria-pressed={chosen === label}
                  onClick={() => caseNotes.label(region, label)}
                >
                  {text.task.labels[label]}
                </button>
              ))}
            </div>
            {chosen && <p className="map-explain">{text.task.feedback[region][chosen]}</p>}
          </div>
        ) : (
          <>
        <p className="stamp map-note">{text.question}</p>
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
        {text.notes.map((note) => (
          <p key={note} className="stamp map-note">
            {note}
          </p>
        ))}
          </>
        )}
      </section>

      <div className="map-scale" aria-hidden="true">
        <span className="map-scale-bar" style={{ width: scaleKm / kmPerPx }} />
        <span className="stamp">{scaleKm} km</span>
      </div>

      <div className="map-zoom">
        {!explored && <p className="stamp map-hint">{text.labels.hint}</p>}
        <button type="button" className="icon-button" aria-label={text.labels.zoomOut} onClick={() => zoomAt(1 / STEP)}>
          <MinusIcon />
        </button>
        <button type="button" className="icon-button" aria-label={text.labels.zoomIn} onClick={() => zoomAt(STEP)}>
          <PlusIcon />
        </button>
        <button type="button" className="icon-button" aria-label={text.labels.fit} onClick={home}>
          <FitIcon />
        </button>
      </div>

      <button type="button" className="story-button map-continue" onClick={onClose}>
        {words.continue}
      </button>
    </div>
  )
}
