import type { L } from '../i18n'

/**
 * The team's radar analysis of Cyclone Amphan, as shown in the map viewer.
 * The story walks through it first (src/story/chapter2.ts) and uses the same
 * figures. Numbers come from data/amphan/REPORT.md and its JSON outputs;
 * change them there first, then here.
 *
 * The plain-language figures:
 *   "88 in 100"  – VH ROC-AUC on held-out blocks, 0.883 (VV 0.860 → 86)
 *   "1 in 10"    – precision at the chosen cut-off, 10.4% for both channels
 *   "3 in 4"     – recall at the chosen cut-off, 75.2% (VH) and 72.2% (VV)
 *
 * The map layers are cut from the team's figures by
 * scripts/build_amphan_layers.py. They all show the same window of the OPERA
 * grid, so a position in one is the same place in every other.
 */

const url = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`

export type LayerKey = 'vh' | 'vv'
/** compare: the two passes side by side. change: after minus before. */
export type ViewKey = 'compare' | 'change'
export type RegionKey = 'A' | 'B' | 'C'
export type RegionLabel = 'changed' | 'present' | 'unclear'

/**
 * Where the layers sit on Earth. `grid` is the full OPERA raster (EPSG:32645)
 * with the WGS84 position of its corners, from data/amphan/maps_summary.json;
 * `window` is the part of it the layers show, in metres from the grid's
 * top-left corner.
 */
const GEO = {
  grid: { width: 92760, height: 45660 },
  corners: {
    nw: { lon: 88.32805809, lat: 22.414576 },
    ne: { lon: 89.22888208, lat: 22.40466108 },
    se: { lon: 89.22238252, lat: 21.99246546 },
    sw: { lon: 88.32418288, lat: 22.00217919 },
  },
  window: { left: 5000, top: 4000, width: 83760, height: 35660 },
}

/**
 * Longitude and latitude of a point on the layers, given as fractions of
 * their width and height. Blends the four grid corners, which is right to a
 * few tens of metres over a grid this small.
 */
export function lonLat(u: number, v: number): { lon: number; lat: number } {
  const x = (GEO.window.left + u * GEO.window.width) / GEO.grid.width
  const y = (GEO.window.top + v * GEO.window.height) / GEO.grid.height
  const { nw, ne, se, sw } = GEO.corners
  const blend = (k: 'lon' | 'lat') => (nw[k] * (1 - x) + ne[k] * x) * (1 - y) + (sw[k] * (1 - x) + se[k] * x) * y
  return { lon: blend('lon'), lat: blend('lat') }
}

/** "22.214°N 88.953°E" */
export function formatLonLat({ lon, lat }: { lon: number; lat: number }): string {
  return `${lat.toFixed(3)}°N ${lon.toFixed(3)}°E`
}

export const analysis = {
  title: { en: 'Find the change', ko: '달라진 곳 찾기' } satisfies L,
  place: { en: 'Southwestern Bangladesh', ko: '방글라데시 남서부' } satisfies L,
  dates: { en: '16 → 22 May 2020', ko: '2020년 5월 16일 → 22일' } satisfies L,
  before: { en: 'Before · 16 May 2020', ko: '전 · 2020년 5월 16일' } satisfies L,
  after: { en: 'After · 22 May 2020', ko: '후 · 2020년 5월 22일' } satisfies L,
  /** Beside the divider, where there is less room. */
  beforeShort: { en: 'Before · 16 May', ko: '전 · 5월 16일' } satisfies L,
  afterShort: { en: 'After · 22 May', ko: '후 · 5월 22일' } satisfies L,
  source: { en: 'Sentinel-1 · NASA/JPL OPERA', ko: 'Sentinel-1 · NASA/JPL OPERA' } satisfies L,
  /** From data/amphan/native_resolution_summary.json. */
  summary: {
    en: '9.86 km² marked newly flooded · 1.58% of the land the reference map covers',
    ko: '새로 잠긴 것으로 표시된 땅 9.86 km² · 기준 지도가 덮는 땅의 1.58%',
  } satisfies L,

  /** Every layer is this size in pixels and this wide on the ground. */
  size: { width: 1760, height: 749 },
  kmWide: GEO.window.width / 1000,

  views: {
    compare: { en: 'Before / after', ko: '전 / 후' },
    change: { en: 'Change', ko: '변화량' },
  } satisfies Record<ViewKey, L>,
  viewGroup: { en: 'What the map shows', ko: '지도에 보이는 것' } satisfies L,

  channels: { en: 'Radar channel', ko: '레이더 채널' } satisfies L,
  layers: {
    vh: {
      label: 'VH',
      before: url('analysis/amphan-pre-vh.webp'),
      after: url('analysis/amphan-post-vh.webp'),
      change: url('analysis/amphan-change-vh.webp'),
      explain: {
        en: 'Sends a vertical wave and listens for what comes back horizontal',
        ko: '세로 방향 전파를 쏘고, 가로 방향으로 돌아온 것을 듣습니다',
      } satisfies L,
      /** Out of 100: the ROC-AUC as a share. */
      wins: 88,
      score: { en: '88 in 100', ko: '100번 중 88번' } satisfies L,
    },
    vv: {
      label: 'VV',
      before: url('analysis/amphan-pre-vv.webp'),
      after: url('analysis/amphan-post-vv.webp'),
      change: url('analysis/amphan-change-vv.webp'),
      explain: {
        en: 'Sends a vertical wave and listens for what comes back vertical',
        ko: '세로 방향 전파를 쏘고, 세로 방향으로 돌아온 것을 듣습니다',
      } satisfies L,
      wins: 86,
      score: { en: '86 in 100', ko: '100번 중 86번' } satisfies L,
    },
  },

  /**
   * The published flood map the analysis is compared with. It covers only the
   * eastern part of the strip: `coverage` is its outline, as fractions of the
   * layer (printed by scripts/build_amphan_layers.py).
   */
  reference: {
    src: url('analysis/amphan-reference.png'),
    coverage: [
      [0.6023, 0.263],
      [0.9812, 0.4045],
      [0.946, 0.9586],
      [0.6045, 0.8318],
    ] as [number, number][],
    toggle: { en: 'Reference flood map', ko: '기준 침수 지도' } satisfies L,
    edge: { en: 'The reference map ends here', ko: '기준 지도는 여기까지' } satisfies L,
  },

  legend: {
    compare: [
      { swatch: '#e8eaee', text: { en: 'Bright: a strong echo, from rough ground and plants', ko: '밝음: 거친 땅과 식물에서 돌아온 강한 메아리' } },
      { swatch: '#1b1e26', text: { en: 'Dark: almost no echo, as from calm water', ko: '어두움: 잔잔한 물처럼 메아리가 거의 없음' } },
    ],
    change: [
      { swatch: '#2166ac', text: { en: 'Blue: the echo fell between the two passes', ko: '파랑: 두 촬영 사이 메아리가 약해짐' } },
      { swatch: '#b2182b', text: { en: 'Red: the echo rose', ko: '빨강: 메아리가 강해짐' } },
    ],
    reference: {
      swatch: '#3fe0f0',
      text: { en: 'Cyan: newly flooded, according to the reference map', ko: '청록: 기준 지도에서 새로 잠긴 곳' },
    },
  } satisfies {
    compare: { swatch: string; text: L }[]
    change: { swatch: string; text: L }[]
    reference: { swatch: string; text: L }
  },

  /**
   * Three places to judge, picked from the team's layers. Positions are
   * fractions of the layer; `r` is a fraction of its width.
   *   A – a tidal river: dark on both dates.
   *   B – a field beside a river that turned dark, and that the reference map marks.
   *   C – fields west of a river bend that turned dark, where the reference map has no coverage.
   */
  regions: {
    A: { x: 0.753, y: 0.72, r: 0.024, answer: 'present' },
    B: { x: 0.705, y: 0.41, r: 0.024, answer: 'changed' },
    C: { x: 0.345, y: 0.58, r: 0.024, answer: 'unclear' },
  } satisfies Record<RegionKey, { x: number; y: number; r: number; answer: RegionLabel }>,

  task: {
    lead: { en: 'Find the change. Rule out the old water.', ko: '달라진 곳을 찾고, 원래 있던 물은 가려내세요.' },
    how: {
      en: 'Pick A, B or C. Slide the divider across it, then label it.',
      ko: 'A, B, C 중 하나를 골라 구분선을 움직여 보고, 판단을 붙이세요.',
    },
    region: { en: 'Region', ko: '지점' },
    labels: {
      changed: { en: 'New change', ko: '새로 달라짐' },
      present: { en: 'Already there', ko: '원래 있던 것' },
      unclear: { en: 'Unclear', ko: '불확실' },
    } satisfies Record<RegionLabel, L>,
    empty: { en: 'Not found yet', ko: '아직 못 찾음' },
    done: {
      en: 'Two clues. One question: what caused the change?',
      ko: '단서 둘, 질문 하나: 무엇이 이 변화를 만들었을까요?',
    },
    /** What Sara would say to each label on each region. */
    feedback: {
      A: {
        changed: { en: 'Check the earlier view. Was it already there?', ko: '앞선 촬영을 보세요. 원래 있지 않았나요?' },
        present: { en: 'Right. Dark on both dates: a river, not a flood.', ko: '맞아요. 두 날 모두 어두워요. 홍수가 아니라 강이에요.' },
        unclear: { en: 'Check the earlier view. Was it already there?', ko: '앞선 촬영을 보세요. 원래 있지 않았나요?' },
      },
      B: {
        changed: {
          en: 'Right. Bright before, dark after, and the reference map marks it.',
          ko: '맞아요. 전에는 밝고 후에는 어두워요. 기준 지도도 표시했어요.',
        },
        present: { en: 'Slide back. Did this patch look the same?', ko: '구분선을 되돌려 보세요. 전에도 같았나요?' },
        unclear: {
          en: 'Turn on the reference map. Does it mark this patch?',
          ko: '기준 침수 지도를 켜 보세요. 이곳이 표시돼 있나요?',
        },
      },
      C: {
        changed: {
          en: 'It went dark, yes. But the reference map does not reach here.',
          ko: '어두워진 건 맞아요. 하지만 기준 지도가 여기까지 닿지 않아요.',
        },
        present: { en: 'Slide back. Did this patch look the same?', ko: '구분선을 되돌려 보세요. 전에도 같았나요?' },
        unclear: {
          en: 'Right. It went dark, but nothing here can confirm it.',
          ko: '맞아요. 어두워졌지만 여기서는 확인할 자료가 없어요.',
        },
      },
    } satisfies Record<RegionKey, Record<RegionLabel, L>>,
  },

  question: {
    en: 'How often radar ranks a flooded spot above a dry one',
    ko: '레이더가 잠긴 곳을 마른 곳보다 높게 짚는 횟수',
  } satisfies L,

  notes: [
    {
      en: 'Measured as ROC-AUC on land held back for testing: VH 0.883, VV 0.860',
      ko: '검증용으로 떼어 둔 땅에서 잰 ROC-AUC: VH 0.883, VV 0.860',
    },
    {
      en: 'The reference map (Zenodo 4390084) is Sentinel-1 too: a comparison, not an independent check',
      ko: '기준 지도(Zenodo 4390084)도 Sentinel-1이라, 독립 검증이 아닌 비교입니다',
    },
  ] satisfies L[],

  labels: {
    hint: { en: 'Scroll to zoom · drag to move', ko: '스크롤로 확대 · 끌어서 이동' },
    close: { en: 'Close the map', ko: '지도 닫기' },
    zoomIn: { en: 'Zoom in', ko: '확대' },
    zoomOut: { en: 'Zoom out', ko: '축소' },
    fit: { en: 'Show the whole map', ko: '전체 보기' },
    divider: { en: 'Drag to compare the two dates', ko: '끌어서 두 날짜 비교' },
  } satisfies Record<string, L>,

  alt: {
    compare: {
      en: 'A slanted strip of land seen by radar in grey: bright fields and forest crossed by dark winding rivers, shown on two dates either side of a divider.',
      ko: '레이더로 본 비스듬한 띠 모양의 땅. 밝은 들판과 숲 사이로 어두운 강이 굽이치며, 구분선 양쪽에 두 날짜의 모습이 보인다.',
    },
    change: {
      en: 'The same strip coloured by how the echo changed: red and blue speckle, with a few solid dark blue patches where the echo fell sharply.',
      ko: '메아리 변화량으로 색칠한 같은 띠. 빨강과 파랑 알갱이 무늬 사이로, 메아리가 크게 약해진 짙은 파랑 얼룩이 몇 군데 있다.',
    },
  } satisfies Record<ViewKey, L>,
}
