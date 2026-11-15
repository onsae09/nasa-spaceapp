import type { L } from './i18n'
import type { BackdropKey, FactKey, PanelKey } from './story/types'

/**
 * Every image and sound the story uses. To swap one, drop the new file into
 * public/assets/ and change its path here.
 *
 * PLACEHOLDER marks art that is waiting for the final illustration.
 * Photos are real and openly licensed. Each carries a stamp (where, when,
 * who) that is shown on screen; keep it in sync when replacing a photo.
 * Text is given in every language; components pick one with `useResolved`.
 */

const url = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`

/** Where and when an image was captured, and by whom (with its licence). */
export type Stamp = {
  place: L
  date: L
  source: L
}

/** A slow zoom that keeps a still photo alive. Scale never goes below 1. */
export type Drift = {
  from: number
  to: number
  seconds: number
  /** settle: fast then slow, for arriving at a place. steady: constant. */
  pace: 'settle' | 'steady'
}

type BackdropAsset = {
  src: string
  alt: L
  /** CSS object-position: which part stays visible when the image is cropped to 16:9. */
  position?: string
  stamp?: Stamp
  drift?: Drift
  /** contain: show the whole image on a dark ground instead of filling the frame. */
  fit?: 'contain'
}

type PanelAsset = {
  src: string
  alt: L
  position?: string
  flag: string
  country: L
  stamp: Stamp
}

const same = (text: string): L => ({ en: text, ko: text })
const PUBLIC_DOMAIN: L = { en: 'public domain', ko: '퍼블릭 도메인' }

export const character = {
  // PLACEHOLDER – replace with the Canva astronaut (transparent PNG, about 520×900).
  src: url('character/astronaut.svg'),
  alt: { en: 'An astronaut', ko: '우주비행사' } satisfies L,
}

/** NASA Blue Marble, Eastern Hemisphere (2002). Public domain. */
export const earth = {
  src: url('bg/earth.jpg'),
  alt: {
    en: 'The Earth seen from orbit, with Asia and the Indian Ocean facing us.',
    ko: '궤도에서 본 지구. 아시아와 인도양이 보인다.',
  } satisfies L,
}

export const music = {
  src: url('music/evening-fall-piano.mp3'),
  /** Shown on screen. CC BY requires the credit; see README for the full line. */
  credit: {
    en: 'Music: "Evening Fall (Piano)" by Kevin MacLeod (incompetech.com), CC BY 4.0',
    ko: '음악: Kevin MacLeod의 "Evening Fall (Piano)" (incompetech.com), CC BY 4.0',
  } satisfies L,
}

/** A backdrop that is a picture. `radarLesson` is drawn in code (components/RadarLesson.tsx). */
export type PhotoKey = Exclude<BackdropKey, 'radarLesson'>

export const backdrops: Record<PhotoKey, BackdropAsset> = {
  space: {
    // PLACEHOLDER – replace with the Canva space background (1920×1080).
    src: url('bg/space.svg'),
    alt: same(''),
  },
  nepalFlood: {
    src: url('photos/nepal-flood.jpg'),
    alt: {
      en: 'Satellite image of the Nepal–China border after the flash flood of 26 August 2026, with floodwater and debris filling the river valley.',
      ko: '2026년 8월 26일 돌발 홍수 직후의 네팔-중국 국경 위성 영상. 홍수와 토사가 강 계곡을 메우고 있다.',
    },
    position: 'center 91%',
    stamp: {
      place: { en: 'Rasuwa, Nepal 28.3°N 85.5°E', ko: '네팔 라수와 28.3°N 85.5°E' },
      date: { en: '26 Aug 2026', ko: '2026년 8월 26일' },
      source: same('ESA, CC BY 4.0'),
    },
    // Arrives still falling, then comes to rest.
    drift: { from: 1.3, to: 1, seconds: 6, pace: 'settle' },
  },
  brokenCity: {
    src: url('photos/broken-city.jpg'),
    alt: {
      en: 'A field of debris where a mobile home park and businesses stood before a river flood.',
      ko: '강이 범람하기 전 이동식 주택 단지와 가게들이 있던 자리에 잔해가 널려 있다.',
    },
    position: 'center 70%',
    stamp: {
      place: { en: 'Liberty, Kentucky, USA', ko: '미국 켄터키주 리버티' },
      date: { en: '3 Jun 2010', ko: '2010년 6월 3일' },
      source: { en: `Liz Roll / FEMA, ${PUBLIC_DOMAIN.en}`, ko: `Liz Roll / FEMA, ${PUBLIC_DOMAIN.ko}` },
    },
    drift: { from: 1, to: 1.08, seconds: 30, pace: 'steady' },
  },
  // The radar change map from the team's Cyclone Amphan analysis (see data/amphan).
  amphanSwath: {
    src: url('analysis/amphan-vh.webp'),
    alt: {
      en: 'A slanted strip of land seen by radar, mostly dark speckle, with bright cyan patches where new flooding was mapped.',
      ko: '레이더로 본 비스듬한 띠 모양의 땅. 대부분 어두운 알갱이 무늬이고, 새로 잠긴 곳은 밝은 청록색 얼룩으로 보인다.',
    },
    fit: 'contain',
    stamp: {
      place: { en: 'Southwestern Bangladesh 22.2°N 89.0°E', ko: '방글라데시 남서부 22.2°N 89.0°E' },
      date: { en: '16 → 22 May 2020', ko: '2020년 5월 16일 → 22일' },
      source: same('Sentinel-1 · NASA/JPL OPERA'),
    },
  },
}

export const panels: Record<PanelKey, PanelAsset> = {
  bangladesh: {
    src: url('photos/bangladesh.jpg'),
    alt: {
      en: 'A man wades through chest-deep floodwater carrying a large bundle under an umbrella.',
      ko: '한 남자가 우산을 쓴 채 큰 짐을 메고 가슴까지 차오른 물을 헤치고 간다.',
    },
    position: '50% center',
    flag: url('flags/bd.svg'),
    country: { en: 'Bangladesh', ko: '방글라데시' },
    stamp: {
      place: { en: 'Sylhet', ko: '실렛' },
      date: { en: '2022', ko: '2022년' },
      source: {
        en: 'Nayeemibnmatiur / Wikimedia Commons, CC BY-SA 4.0',
        ko: 'Nayeemibnmatiur / 위키미디어 공용, CC BY-SA 4.0',
      },
    },
  },
  india: {
    src: url('photos/india.jpg'),
    alt: {
      en: 'Houses standing in brown floodwater up to their ground-floor roofs.',
      ko: '집들이 1층 지붕까지 흙탕물에 잠겨 있다.',
    },
    position: '83% center',
    flag: url('flags/in.svg'),
    country: { en: 'India', ko: '인도' },
    stamp: {
      place: { en: 'Angamaly, Kerala', ko: '케랄라주 앙가말리' },
      date: { en: '16 Aug 2018', ko: '2018년 8월 16일' },
      source: {
        en: 'Ranjithsiji / Wikimedia Commons, CC BY-SA 4.0',
        ko: 'Ranjithsiji / 위키미디어 공용, CC BY-SA 4.0',
      },
    },
  },
  us: {
    src: url('photos/us.jpg'),
    alt: {
      en: 'Aerial view of flooded streets around the Superdome in downtown New Orleans.',
      ko: '뉴올리언스 도심 슈퍼돔 주변의 물에 잠긴 거리를 하늘에서 본 모습.',
    },
    position: '56% center',
    flag: url('flags/us.svg'),
    country: { en: 'United States', ko: '미국' },
    stamp: {
      place: { en: 'New Orleans', ko: '뉴올리언스' },
      date: { en: '31 Aug 2005', ko: '2005년 8월 31일' },
      source: {
        en: `Jeremy L. Grisham / U.S. Navy, ${PUBLIC_DOMAIN.en}`,
        ko: `Jeremy L. Grisham / 미 해군, ${PUBLIC_DOMAIN.ko}`,
      },
    },
  },
}

/** Figures shown large beside the dialogue, always with where they come from. */
export const facts: Record<FactKey, { rows: { figure: string; label: L }[]; source: L }> = {
  nepalToll: {
    rows: [
      { figure: '1,455', label: { en: 'confirmed dead', ko: '확인된 사망' } },
      { figure: '5,285', label: { en: 'still missing', ko: '아직 실종' } },
    ],
    source: { en: 'Nepal · NDRRMA, 5 Oct 2026', ko: '네팔 재난관리청(NDRRMA) · 2026년 10월 5일' },
  },
}

export const allImageUrls = [
  character.src,
  earth.src,
  ...Object.values(backdrops).map((b) => b.src),
  ...Object.values(panels).flatMap((p) => [p.src, p.flag]),
  url('analysis/amphan-vv.webp'),
  url('analysis/amphan-distributions.png'),
]
