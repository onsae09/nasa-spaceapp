import { useCallback, useEffect, useRef, useState } from 'react'
import type { MusicCue } from '../story/types'
import { playBlip, playPing, playWhoosh, startPad } from './synth'

const THEME_VOLUME = 0.5
/** Measured: at 0.3 the pad sits near -22 dB RMS, a little under the piano. */
const PAD_LEVEL = 0.3
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
 * The soundtrack: a synth pad for the scenes in orbit, a piano piece for the
 * flood, and a rush of noise for the dive between them. The story says which
 * one it wants with a cue; this hook does the fades.
 *
 * Browsers only allow sound after a click or key press, so nothing plays
 * until `unlock` has been called from one. The mute choice is remembered.
 */
export function useSoundtrack(themeSrc: string) {
  const [muted, setMuted] = useState(readMuted)
  const mutedRef = useRef(muted)
  const cueRef = useRef<MusicCue>('silence')
  const ctxRef = useRef<AudioContext | null>(null)
  const padRef = useRef<GainNode | null>(null)
  const themeRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef(0)

  const fadeTheme = useCallback((target: number, ms: number, done?: () => void) => {
    const theme = themeRef.current
    if (!theme) return
    cancelAnimationFrame(fadeRef.current)
    const from = theme.volume
    const startedAt = performance.now()
    const tick = (now: number) => {
      // A frame's timestamp can be slightly earlier than startedAt; a negative
      // volume would throw and stop the fade.
      const k = Math.min(Math.max((now - startedAt) / ms, 0), 1)
      theme.volume = from + (target - from) * k
      if (k < 1) fadeRef.current = requestAnimationFrame(tick)
      else done?.()
    }
    fadeRef.current = requestAnimationFrame(tick)
  }, [])

  const fadePad = useCallback((target: number, seconds: number) => {
    const ctx = ctxRef.current
    const pad = padRef.current
    if (!ctx || !pad) return
    pad.gain.cancelScheduledValues(ctx.currentTime)
    pad.gain.setValueAtTime(pad.gain.value, ctx.currentTime)
    pad.gain.linearRampToValueAtTime(target, ctx.currentTime + seconds)
  }, [])

  /** Makes what is playing match the current cue, mute state and tab visibility. */
  const apply = useCallback(() => {
    const theme = themeRef.current
    if (!ctxRef.current || !theme) return
    const cue = mutedRef.current || document.hidden ? 'silence' : cueRef.current

    if (cue === 'theme') {
      fadePad(0, 2)
      theme
        .play()
        .then(() => fadeTheme(THEME_VOLUME, 2500))
        .catch(() => {})
      return
    }

    fadePad(cue === 'ambience' ? PAD_LEVEL : 0, cue === 'ambience' ? 3 : 0.6)
    // Only the story rewinds the piece; muting or leaving the tab pauses it in place.
    const rewind = cueRef.current !== 'theme'
    fadeTheme(0, cue === 'ambience' ? 1200 : 600, () => {
      theme.pause()
      if (rewind) theme.currentTime = 0
    })
  }, [fadePad, fadeTheme])

  useEffect(() => {
    const theme = document.createElement('audio')
    theme.src = themeSrc
    theme.loop = true
    theme.preload = 'auto'
    theme.volume = 0
    document.body.append(theme)
    themeRef.current = theme

    document.addEventListener('visibilitychange', apply)
    return () => {
      document.removeEventListener('visibilitychange', apply)
      cancelAnimationFrame(fadeRef.current)
      theme.pause()
      theme.remove()
      themeRef.current = null
      void ctxRef.current?.close()
      ctxRef.current = null
      padRef.current = null
    }
  }, [themeSrc, apply])

  /** Call from a click or key press to allow sound. */
  const unlock = useCallback(() => {
    if (!ctxRef.current) {
      const ctx = new AudioContext()
      ctxRef.current = ctx
      padRef.current = startPad(ctx, ctx.destination)
    }
    void ctxRef.current.resume()
    apply()
  }, [apply])

  const setCue = useCallback(
    (cue: MusicCue) => {
      if (cueRef.current === cue) return
      cueRef.current = cue
      apply()
    },
    [apply],
  )

  const whoosh = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx || mutedRef.current || document.hidden) return
    playWhoosh(ctx, ctx.destination)
  }, [])

  /** One tick of the dialogue typing sound. */
  const blip = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx || mutedRef.current || document.hidden) return
    playBlip(ctx, ctx.destination)
  }, [])

  /** The radar ping at the start of the sweep. */
  const ping = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx || mutedRef.current || document.hidden) return
    playPing(ctx, ctx.destination)
  }, [])

  const toggle = useCallback(() => {
    const next = !mutedRef.current
    mutedRef.current = next
    setMuted(next)
    saveMuted(next)
    apply()
  }, [apply])

  return { muted, toggle, unlock, setCue, whoosh, blip, ping }
}
