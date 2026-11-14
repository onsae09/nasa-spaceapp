import { useCallback, useEffect, useRef, useState } from 'react'

const VOLUME = 0.5
const FADE_IN_MS = 2000
const FADE_OUT_MS = 400
const STORAGE_KEY = 'music-muted'

function readMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function saveMuted(muted: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0')
  } catch {
    // Private windows may refuse storage; the choice then lasts for this visit only.
  }
}

/**
 * Looping background music.
 *
 * Browsers only allow sound after the visitor has clicked or pressed a key,
 * so the track fades in on the first interaction. The mute choice is
 * remembered between visits.
 */
export function useMusic(src: string) {
  const [muted, setMuted] = useState(readMuted)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef(0)
  const mutedRef = useRef(muted)
  mutedRef.current = muted

  const fadeTo = useCallback((target: number, ms: number, done?: () => void) => {
    const audio = audioRef.current
    if (!audio) return
    cancelAnimationFrame(fadeRef.current)
    const from = audio.volume
    const startedAt = performance.now()
    const tick = (now: number) => {
      const k = Math.min((now - startedAt) / ms, 1)
      audio.volume = from + (target - from) * k
      if (k < 1) fadeRef.current = requestAnimationFrame(tick)
      else done?.()
    }
    fadeRef.current = requestAnimationFrame(tick)
  }, [])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio || mutedRef.current || document.hidden) return
    if (!audio.paused) {
      fadeTo(VOLUME, FADE_IN_MS)
      return
    }
    audio
      .play()
      .then(() => fadeTo(VOLUME, FADE_IN_MS))
      .catch(() => {
        // Not allowed yet: the next click or key press tries again.
      })
  }, [fadeTo])

  const stop = useCallback(() => {
    fadeTo(0, FADE_OUT_MS, () => audioRef.current?.pause())
  }, [fadeTo])

  // Create the player, and start it on the first interaction.
  useEffect(() => {
    const audio = document.createElement('audio')
    audio.src = src
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    document.body.append(audio)
    audioRef.current = audio

    const onVisibility = () => (document.hidden ? stop() : play())
    window.addEventListener('pointerdown', play)
    window.addEventListener('keydown', play)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pointerdown', play)
      window.removeEventListener('keydown', play)
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(fadeRef.current)
      audio.pause()
      audio.remove()
      audioRef.current = null
    }
  }, [src, play, stop])

  const toggle = useCallback(() => {
    const next = !mutedRef.current
    mutedRef.current = next
    setMuted(next)
    saveMuted(next)
    if (next) stop()
    else play()
  }, [play, stop])

  return { muted, toggle }
}
