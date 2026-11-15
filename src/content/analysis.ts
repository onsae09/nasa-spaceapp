import type { L } from '../i18n'

/**
 * The team's radar analysis, as shown in the map viewer. The story walks
 * through it first (src/story/chapter2.ts) and uses the same figures.
 * Numbers come from data/amphan/REPORT.md and its JSON outputs; change them
 * there first, then here.
 *
 * The plain-language figures:
 *   "88 in 100"  – VH ROC-AUC on held-out blocks, 0.883 (VV 0.860 → 86)
 *   "1 in 10"    – precision at the chosen cut-off, 10.4% for both channels
 *   "3 in 4"     – recall at the chosen cut-off, 75.2% (VH) and 72.2% (VV)
 */

const url = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`

export type LayerKey = 'vh' | 'vv'

export const analysis = {
  title: { en: 'How the radar echo changed', ko: '레이더 메아리는 어떻게 변했을까' } satisfies L,
  place: { en: 'Southwestern Bangladesh 22.2°N 89.0°E', ko: '방글라데시 남서부 22.2°N 89.0°E' } satisfies L,
  dates: { en: '16 → 22 May 2020', ko: '2020년 5월 16일 → 22일' } satisfies L,
  source: { en: 'Sentinel-1 · NASA/JPL OPERA', ko: 'Sentinel-1 · NASA/JPL OPERA' } satisfies L,
  /** From data/amphan/native_resolution_summary.json. */
  summary: {
    en: '9.86 km² marked newly flooded · 1.58% of the land both passes covered',
    ko: '새로 잠긴 것으로 표시된 땅 9.86 km² · 두 촬영이 모두 지나간 땅의 1.58%',
  } satisfies L,

  /** Both images are 1570×639 and line up exactly, so they can be swapped in place. */
  size: { width: 1570, height: 639 },

  channels: { en: 'Two ways the radar listens for its echo', ko: '레이더가 메아리를 듣는 두 가지 방식' } satisfies L,
  layers: {
    vh: {
      label: 'VH',
      src: url('analysis/amphan-vh.webp'),
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
      src: url('analysis/amphan-vv.webp'),
      explain: {
        en: 'Sends a vertical wave and listens for what comes back vertical',
        ko: '세로 방향 전파를 쏘고, 세로 방향으로 돌아온 것을 듣습니다',
      } satisfies L,
      wins: 86,
      score: { en: '86 in 100', ko: '100번 중 86번' } satisfies L,
    },
  },

  legend: [
    {
      swatch: '#3fe0f0' as string | null,
      text: { en: 'Newly flooded, according to the reference map', ko: '기준 지도에서 새로 잠긴 곳' } satisfies L,
    },
    {
      swatch: null as string | null,
      text: {
        en: 'Everything else: how much the echo changed between the two passes',
        ko: '그 밖: 두 촬영 사이 메아리의 변화량',
      } satisfies L,
    },
  ],

  question: {
    en: 'Take one flooded spot and one that is not. How often does the radar rank the flooded one higher?',
    ko: '잠긴 곳과 안 잠긴 곳을 하나씩 뽑았을 때, 레이더가 잠긴 쪽을 더 높게 짚는 횟수',
  } satisfies L,

  notes: [
    {
      en: 'Measured as ROC-AUC on land held back for testing: VH 0.883, VV 0.860',
      ko: '검증용으로 떼어 둔 땅에서 잰 ROC-AUC: VH 0.883, VV 0.860',
    },
    {
      en: 'At one fixed cut-off, about 1 in 10 flagged places were flooded in the reference map, and about 3 in 4 flooded places were found',
      ko: '기준선 하나로 가르면 짚은 곳 10곳 중 1곳이 실제 잠긴 곳이었고, 잠긴 곳 4곳 중 3곳을 찾았습니다',
    },
    {
      en: 'The reference map was also made from Sentinel-1, so this is a comparison, not an independent check',
      ko: '기준 지도도 Sentinel-1로 만든 것이라, 독립 검증이 아닌 비교입니다',
    },
    { en: 'Reference map: Zenodo record 4390084', ko: '기준 지도: Zenodo 4390084' },
  ] satisfies L[],

  /**
   * Panel D of the analysis summary figure (data/amphan/figures): both
   * channels' change maps with axes, as the analysis drew them.
   */
  figure: {
    src: url('analysis/amphan-comparison.png'),
    open: { en: 'See the analysis figure', ko: '분석 그림 보기' } satisfies L,
    close: { en: 'Close the figure', ko: '그림 닫기' } satisfies L,
    alt: {
      en: 'Two maps side by side, titled OPERA VV change and OPERA VH change in decibels, each showing the same slanted strip of land with eastings and northings on the axes and the reference newly inundated areas marked in cyan.',
      ko: 'OPERA VV 변화와 OPERA VH 변화(dB)라는 제목의 지도 두 장이 나란히 있다. 같은 비스듬한 띠 모양의 땅을 보여 주며, 축에는 좌표가 적혀 있고 기준 지도의 새 침수 지역이 청록색으로 표시돼 있다.',
    } satisfies L,
    caption: {
      en: 'From our analysis: how the radar echo changed in each channel between 16 and 22 May 2020, with the reference map’s newly flooded areas in cyan.',
      ko: '우리 분석에서: 2020년 5월 16일과 22일 사이 채널별 레이더 메아리 변화. 기준 지도의 새 침수 지역은 청록색입니다.',
    } satisfies L,
  },

  labels: {
    hint: { en: 'Scroll to zoom · drag to move', ko: '스크롤로 확대 · 끌어서 이동' },
    close: { en: 'Close the map', ko: '지도 닫기' },
    zoomIn: { en: 'Zoom in', ko: '확대' },
    zoomOut: { en: 'Zoom out', ko: '축소' },
    fit: { en: 'Show the whole map', ko: '전체 보기' },
  } satisfies Record<string, L>,

  alt: {
    en: 'A slanted strip of land seen by radar, mostly dark blue and red speckle, with bright cyan patches where the reference map marks new flooding.',
    ko: '레이더로 본 비스듬한 띠 모양의 땅. 대부분 짙은 파랑과 빨강 알갱이 무늬이고, 기준 지도가 새로 잠겼다고 표시한 곳은 밝은 청록색 얼룩이다.',
  } satisfies L,
}
