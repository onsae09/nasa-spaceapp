import { useLayoutEffect, useState, type ReactNode } from 'react'

export const STAGE_WIDTH = 1920
export const STAGE_HEIGHT = 1080

const fitScale = () => Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT)

/**
 * A fixed 1920×1080 canvas (the Canva page size) scaled to fit the window.
 * Everything inside is positioned in Canva pixels.
 */
export function Stage({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  const [scale, setScale] = useState(fitScale)

  useLayoutEffect(() => {
    const update = () => setScale(fitScale())
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="viewport">
      <div
        className="stage"
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  )
}
