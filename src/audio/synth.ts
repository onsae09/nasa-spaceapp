/**
 * Sounds made in the browser instead of loaded from files: the quiet pad
 * heard in orbit and the rising rush of the dive. Both work on a live
 * AudioContext and on an OfflineAudioContext (for checking levels).
 */

/** A2, E3, A3, B3, E4: an open chord with no major or minor third, so it stays neutral. */
const PAD_NOTES = [110, 164.81, 220, 246.94, 329.63]

/**
 * Starts a slowly breathing synth pad and returns its output gain,
 * which begins at zero. Fade the gain up to hear it.
 */
export function startPad(ctx: BaseAudioContext, destination: AudioNode): GainNode {
  const output = ctx.createGain()
  output.gain.value = 0

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 1200
  filter.Q.value = 0.5
  filter.connect(output)
  output.connect(destination)

  PAD_NOTES.forEach((frequency, i) => {
    const level = 0.16 / (1 + i * 0.35)
    const voice = ctx.createGain()
    voice.gain.value = level
    voice.connect(filter)

    // Two oscillators a hair apart beat slowly against each other.
    for (const detune of [-1, 1]) {
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = frequency * (1 + detune * 0.0015)
      osc.connect(voice)
      osc.start()
    }

    // Each note swells and fades at its own pace.
    const swell = ctx.createOscillator()
    swell.frequency.value = 0.05 + i * 0.03
    const depth = ctx.createGain()
    depth.gain.value = level * 0.4
    swell.connect(depth)
    depth.connect(voice.gain)
    swell.start()
  })

  return output
}

export const WHOOSH_SECONDS = 1.8

/** A rush of filtered noise that rises for 1.8 s and then cuts off. */
export function playWhoosh(ctx: BaseAudioContext, destination: AudioNode, at = ctx.currentTime) {
  const length = Math.ceil(ctx.sampleRate * (WHOOSH_SECONDS + 0.2))
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const samples = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) samples[i] = Math.random() * 2 - 1

  const noise = ctx.createBufferSource()
  noise.buffer = buffer

  const filter = ctx.createBiquadFilter()
  filter.type = 'bandpass'
  filter.Q.value = 1.2
  filter.frequency.setValueAtTime(180, at)
  filter.frequency.exponentialRampToValueAtTime(3200, at + WHOOSH_SECONDS - 0.1)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, at)
  gain.gain.exponentialRampToValueAtTime(0.5, at + WHOOSH_SECONDS - 0.15)
  gain.gain.linearRampToValueAtTime(0, at + WHOOSH_SECONDS)

  noise.connect(filter)
  filter.connect(gain)
  gain.connect(destination)
  noise.start(at)
  noise.stop(at + WHOOSH_SECONDS + 0.1)
}

const BLIP_HZ = 660

/**
 * The short soft tick heard as each letter of dialogue is typed.
 * The pitch wanders a little so a long line does not sound like a machine.
 */
export function playBlip(ctx: BaseAudioContext, destination: AudioNode, at = ctx.currentTime) {
  const osc = ctx.createOscillator()
  osc.type = 'triangle'
  osc.frequency.value = BLIP_HZ * (0.96 + Math.random() * 0.08)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, at)
  gain.gain.linearRampToValueAtTime(0.09, at + 0.004)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.045)

  osc.connect(gain)
  gain.connect(destination)
  osc.start(at)
  osc.stop(at + 0.05)
}

/** A single soft radar ping, heard as the sweep starts. */
export function playPing(ctx: BaseAudioContext, destination: AudioNode, at = ctx.currentTime) {
  const osc = ctx.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = 1320

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, at)
  gain.gain.linearRampToValueAtTime(0.1, at + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 1.1)

  osc.connect(gain)
  gain.connect(destination)
  osc.start(at)
  osc.stop(at + 1.2)
}
