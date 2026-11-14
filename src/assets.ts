import type { BackdropKey, PanelKey } from './story/types'

/**
 * Every image the story uses. To swap one, drop the new file into
 * public/assets/ and change its path here.
 *
 * PLACEHOLDER marks art that is waiting for the final illustration.
 * Photos are real and openly licensed. Each carries a stamp (where, when,
 * who) that is shown on screen; keep it in sync when replacing a photo.
 */

const url = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`

/** Where and when an image was captured, and by whom (with its licence). */
export type Stamp = {
  place: string
  date: string
  source: string
}

type BackdropAsset = {
  src: string
  alt: string
  /** CSS object-position: which part stays visible when the image is cropped to 16:9. */
  position?: string
  stamp?: Stamp
}

type PanelAsset = {
  src: string
  alt: string
  position?: string
  flag: string
  country: string
  stamp: Stamp
}

export const character = {
  // PLACEHOLDER – replace with the Canva astronaut (transparent PNG, about 520×900).
  src: url('character/astronaut.svg'),
  alt: 'An astronaut',
}

export const music = {
  src: url('music/evening-fall-piano.mp3'),
  /** Shown on screen. CC BY requires the credit; see README for the full line. */
  credit: 'Music: "Evening Fall (Piano)" by Kevin MacLeod (incompetech.com), CC BY 4.0',
}

export const backdrops: Record<BackdropKey, BackdropAsset> = {
  space: {
    // PLACEHOLDER – replace with the Canva space background (1920×1080).
    src: url('bg/space.svg'),
    alt: '',
  },
  nepalFlood: {
    src: url('photos/nepal-flood.jpg'),
    alt: 'Satellite image of the Nepal–China border after the flash flood of 26 August 2026, with floodwater and debris filling the river valley.',
    position: 'center 91%',
    stamp: { place: 'Rasuwa, Nepal 28.3°N 85.5°E', date: '26 Aug 2026', source: 'ESA, CC BY 4.0' },
  },
  brokenCity: {
    src: url('photos/broken-city.jpg'),
    alt: 'A field of debris where a mobile home park and businesses stood before a river flood.',
    position: 'center 70%',
    stamp: { place: 'Liberty, Kentucky, USA', date: '3 Jun 2010', source: 'Liz Roll / FEMA, public domain' },
  },
}

export const panels: Record<PanelKey, PanelAsset> = {
  bangladesh: {
    src: url('photos/bangladesh.jpg'),
    alt: 'A man wades through chest-deep floodwater carrying a large bundle under an umbrella.',
    position: '50% center',
    flag: url('flags/bd.svg'),
    country: 'Bangladesh',
    stamp: { place: 'Sylhet', date: '2022', source: 'Nayeemibnmatiur / Wikimedia Commons, CC BY-SA 4.0' },
  },
  india: {
    src: url('photos/india.jpg'),
    alt: 'Houses standing in brown floodwater up to their ground-floor roofs.',
    position: '83% center',
    flag: url('flags/in.svg'),
    country: 'India',
    stamp: { place: 'Angamaly, Kerala', date: '16 Aug 2018', source: 'Ranjithsiji / Wikimedia Commons, CC BY-SA 4.0' },
  },
  us: {
    src: url('photos/us.jpg'),
    alt: 'Aerial view of flooded streets around the Superdome in downtown New Orleans.',
    position: '56% center',
    flag: url('flags/us.svg'),
    country: 'United States',
    stamp: { place: 'New Orleans', date: '31 Aug 2005', source: 'Jeremy L. Grisham / U.S. Navy, public domain' },
  },
}

export const allImageUrls = [
  character.src,
  ...Object.values(backdrops).map((b) => b.src),
  ...Object.values(panels).flatMap((p) => [p.src, p.flag]),
]
