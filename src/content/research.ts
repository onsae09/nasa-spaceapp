import type { L } from '../i18n'
import type { GameKey } from './games'

/**
 * The research files. Each has the astronaut's spoken lines, the text shown
 * in the open file, and the paper it is based on. Paper details were checked
 * against the publishers' pages; their titles stay in English.
 */

const url = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`

export type Figure =
  /** An image from our own analysis. */
  | { kind: 'image'; src: string; alt: L; caption: L; onLight: boolean }
  /** Key facts from the paper, when we have no image we may show. Keep each label to one line. */
  | { kind: 'facts'; heading: L; items: { value: L; label: L }[] }

export type ResearchFile = {
  number: string
  title: L
  teaser: L
  /** The game behind the file's Play button (components/FileGames.tsx). */
  game: GameKey
  lines: L[]
  body: L[]
  figure: Figure
  paper: { title: string; authors: string; published: string; href: string }
}

const same = (text: string): L => ({ en: text, ko: text })

export const researchFiles: ResearchFile[] = [
  {
    number: '01',
    title: { en: 'The case', ko: '사건' },
    teaser: { en: 'Where, when, and what changed?', ko: '어디서, 언제, 무엇이 달라졌나?' },
    game: 'spot',
    lines: [
      {
        en: 'This is the case you worked on: two radar passes over one delta, six days apart.',
        ko: '당신이 조사한 사건이에요. 한 삼각주를 엿새 간격으로 찍은 두 번의 레이더 촬영이에요.',
      },
      {
        en: 'One image shows where water was on a particular day, but comparing them can help reveal a larger pattern.',
        ko: '영상 한 장은 그날 물이 어디 있었는지만 보여 주지만, 여러 장을 비교하면 더 큰 흐름이 드러나요.',
      },
    ],
    body: [
      {
        en: 'Where: a strip of the Ganges–Brahmaputra delta about 84 km long, between 88.4°E and 89.2°E near 22.2°N, where tidal rivers, farmland, villages and mangrove forest share the same low ground.',
        ko: '어디서: 갠지스–브라마푸트라 삼각주의 약 84km 길이 띠로, 북위 22.2도 부근 동경 88.4도에서 89.2도 사이입니다. 조수가 드나드는 강과 농경지, 마을, 맹그로브 숲이 같은 낮은 땅을 나눠 씁니다.',
      },
      {
        en: 'When: Sentinel-1 passed on 16 May and again on 22 May 2020. Cyclone Amphan came ashore between the two, on 20 May.',
        ko: '언제: Sentinel-1이 2020년 5월 16일과 22일에 지나갔습니다. 사이클론 암판은 그 사이인 5월 20일에 상륙했습니다.',
      },
      {
        en: 'What changed: patches of land beside the rivers returned a weaker echo on the second pass. A published flood map marks 9.86 km² as newly flooded, 1.58% of the land it covers, and the team’s VH change ranks those places above the rest 88 times in 100.',
        ko: '무엇이 달라졌나: 강가의 땅 곳곳에서 두 번째 촬영의 메아리가 약해졌습니다. 공개된 침수 지도는 9.86 km²를 새로 잠긴 곳으로 표시하는데, 이는 그 지도가 덮는 땅의 1.58%입니다. 팀의 VH 변화량은 그 지점들을 나머지보다 100번 중 88번 높게 짚습니다.',
      },
      {
        en: 'What backs it up: only that flood map, which was itself made from Sentinel-1 and covers the east of the strip. Nothing independent of radar has been found yet, so the full extent stays uncertain. The same change-detection approach has been used over six years of floods in Nepal’s Terai, in the paper cited here.',
        ko: '뒷받침하는 것: 그 침수 지도뿐이며, 그 지도도 Sentinel-1로 만들었고 띠의 동쪽만 덮습니다. 레이더와 독립된 자료는 아직 찾지 못했으므로 전체 범위는 불확실합니다. 같은 변화 탐지 방식이 네팔 테라이의 6년치 홍수에도 쓰였고, 그 논문을 여기 인용합니다.',
      },
    ],
    figure: {
      kind: 'facts',
      heading: { en: 'From the team’s analysis', ko: '팀의 분석에서' },
      items: [
        { value: { en: '16 → 22 May', ko: '5월 16 → 22일' }, label: { en: '2020, two Sentinel-1 passes', ko: '2020년, Sentinel-1 두 번 촬영' } },
        { value: same('9.86 km²'), label: { en: 'marked newly flooded', ko: '새로 잠긴 것으로 표시된 땅' } },
        { value: same('1.58%'), label: { en: 'of the land the reference covers', ko: '기준 지도가 덮는 땅 가운데' } },
        { value: { en: '88 in 100', ko: '100번 중 88번' }, label: { en: 'flooded spot ranked above a dry one', ko: '잠긴 곳을 마른 곳보다 높게 짚음' } },
      ],
    },
    paper: {
      title:
        'Multi-temporal flood mapping and dynamics in Nepal’s Terai (2019–2024) using Sentinel-1 SAR and change-detection approaches',
      authors: 'P. Khatiwada, P. Khatiwada, H. L. Shrestha',
      published: 'Remote Sensing Applications: Society and Environment 41, 2025',
      href: 'https://doi.org/10.1016/j.rsase.2025.101860',
    },
  },
  {
    number: '02',
    title: { en: 'The radar', ko: '레이더' },
    teaser: { en: 'Why can radar reveal a hidden surface?', ko: '레이더는 어떻게 가려진 땅을 드러낼까?' },
    game: 'sprint',
    lines: [
      { en: 'SAR gives us another way to observe Earth.', ko: 'SAR는 지구를 보는 또 다른 방법이에요.' },
      {
        en: 'Instead of relying on sunlight, it sends radar signals toward the ground and measures the signals that return.',
        ko: '햇빛에 기대지 않고, 땅을 향해 레이더 신호를 보낸 다음 돌아오는 신호를 재요.',
      },
    ],
    body: [
      {
        en: 'Synthetic Aperture Radar, or SAR, is a radar technology used to create images of Earth’s surface. It sends microwave signals toward the ground and records how those signals are reflected back to the satellite.',
        ko: '합성개구레이더(SAR)는 지구 표면의 영상을 만드는 레이더 기술입니다. 땅을 향해 마이크로파 신호를 보내고, 그 신호가 위성으로 어떻게 반사되어 돌아오는지 기록합니다.',
      },
      {
        en: 'Because SAR does not depend on sunlight and can observe through clouds, it can collect useful data during the day or at night, including in conditions when an ordinary optical image may be obscured by clouds.',
        ko: 'SAR는 햇빛이 필요 없고 구름을 뚫고 볼 수 있어서 낮에도 밤에도 쓸 만한 자료를 모을 수 있습니다. 일반 광학 영상이 구름에 가려지는 상황에서도 그렇습니다.',
      },
      {
        en: 'Calm, open water can reflect radar signals away from the satellite and appear relatively dark in a SAR image. Researchers can compare images from different dates to look for areas that may have become flooded.',
        ko: '잔잔하게 트인 물은 레이더 신호를 위성 반대쪽으로 반사해서 SAR 영상에서 비교적 어둡게 보입니다. 연구자들은 서로 다른 날짜의 영상을 비교해 물에 잠겼을 만한 곳을 찾습니다.',
      },
      {
        en: 'However, a dark area is not automatically floodwater. Other surfaces and observation conditions can produce similar appearances, so researchers use additional information and analysis to interpret the results.',
        ko: '하지만 어두운 곳이 곧 홍수는 아닙니다. 다른 표면이나 관측 조건도 비슷하게 보일 수 있어서, 연구자들은 추가 정보와 분석으로 결과를 해석합니다.',
      },
    ],
    figure: {
      kind: 'image',
      src: url('analysis/amphan-post-vh.webp'),
      alt: {
        en: 'A slanted strip of land seen by radar in grey, with dark winding rivers and dark patches beside them.',
        ko: '레이더로 본 비스듬한 띠 모양의 땅. 어두운 강이 굽이치고 그 옆에 어두운 얼룩들이 보인다.',
      },
      caption: {
        en: 'From our own analysis: the radar pass of 22 May 2020. Rivers and standing water are dark; darkness alone does not establish flooding.',
        ko: '우리 분석에서: 2020년 5월 22일의 레이더 촬영. 강과 고인 물은 어둡게 보이지만, 어둡다는 것만으로 침수가 확정되지는 않습니다.',
      },
      onLight: false,
    },
    paper: {
      title: 'Flood Detection with SAR: A Review of Techniques and Datasets',
      authors: 'D. Amitrano, G. Di Martino, A. Di Simone, P. Imperatore',
      published: 'Remote Sensing 16(4), 656, 2024',
      href: 'https://doi.org/10.3390/rs16040656',
    },
  },
  {
    number: '03',
    title: { en: 'The blind spots', ko: '사각지대' },
    teaser: { en: 'What could this interpretation miss?', ko: '이 해석이 놓칠 수 있는 것은?' },
    game: 'pass',
    lines: [
      { en: 'A satellite image is a record of one moment.', ko: '위성 영상은 한순간의 기록이에요.' },
      {
        en: 'So when you look at a flood map, remember that it’s evidence, not a perfect view of everything on the ground.',
        ko: '그러니 홍수 지도를 볼 때는 그게 증거일 뿐, 땅 위의 모든 것을 완벽하게 보여 주는 건 아니라는 걸 기억하세요.',
      },
    ],
    body: [
      {
        en: 'SAR observations can help researchers map flooded areas, but some environments are more difficult to analyze than others.',
        ko: 'SAR 관측은 침수 지역을 지도로 그리는 데 도움이 되지만, 어떤 환경은 다른 곳보다 분석하기 어렵습니다.',
      },
      {
        en: 'In urban areas, buildings can create radar shadows or cause signals to reflect in ways that make water difficult to distinguish. In vegetated areas, trees and plants can also affect the signal, making it harder to identify water beneath them.',
        ko: '도시에서는 건물이 레이더 그림자를 만들거나 신호를 복잡하게 반사해서 물을 구별하기 어렵습니다. 식생이 있는 곳에서는 나무와 풀이 신호에 영향을 주어 그 아래의 물을 찾기 어렵게 합니다.',
      },
      {
        en: 'The timing of an observation matters as well. A satellite can only record an area when it passes over it, so an image may not capture the moment when flooding is at its greatest extent.',
        ko: '관측 시점도 중요합니다. 위성은 그 위를 지나갈 때만 기록할 수 있어서, 홍수가 가장 넓게 퍼진 순간을 담지 못할 수 있습니다.',
      },
      {
        en: 'For these reasons, researchers may compare SAR results with other sources, such as elevation maps, water-level measurements, optical imagery, and reports from the ground. Using multiple sources helps them check their interpretation and understand what might be missing.',
        ko: '그래서 연구자들은 SAR 결과를 고도 지도, 수위 측정값, 광학 영상, 현장 보고 같은 다른 자료와 비교합니다. 여러 자료를 함께 쓰면 해석을 점검하고 무엇이 빠졌는지 알 수 있습니다.',
      },
    ],
    figure: {
      kind: 'image',
      src: url('analysis/amphan-distributions.png'),
      alt: {
        en: 'Two histograms of radar change. In each, the orange hump for flooded pixels sits to the left of the blue hump for other pixels, and the two overlap.',
        ko: '레이더 변화량의 히스토그램 두 개. 잠긴 화소의 주황색 봉우리가 그 밖의 화소의 파란 봉우리 왼쪽에 있고, 둘이 겹친다.',
      },
      caption: {
        en: 'From our own analysis: flooded pixels (orange) and other pixels (blue) overlap. No single cut-off separates them cleanly.',
        ko: '우리 분석에서: 잠긴 화소(주황)와 그 밖의 화소(파랑)가 겹칩니다. 기준선 하나로는 깔끔하게 나뉘지 않습니다.',
      },
      onLight: true,
    },
    paper: {
      title:
        'Urban Flood Mapping Using Satellite Synthetic Aperture Radar Data: A review of characteristics, approaches, and datasets',
      authors: 'J. Zhao, M. Li, Y. Li, P. Matgen, M. Chini',
      published: 'IEEE Geoscience and Remote Sensing Magazine 13(1), 2025',
      href: 'https://doi.org/10.1109/MGRS.2024.3496075',
    },
  },
]

export const shelf = {
  title: { en: 'Research files', ko: '연구 파일' },
  lead: { en: 'Check the evidence behind your choice', ko: '당신의 선택 뒤에 있는 근거를 확인하세요' },
  /** On the file that bears most on the next step the visitor chose. */
  relevant: { en: 'For your next step', ko: '당신의 다음 단계와 관련' },
  file: { en: 'File', ko: '파일' },
  read: { en: 'Read', ko: '읽음' },
  basedOn: { en: 'Based on', ko: '바탕이 된 논문:' },
  close: { en: 'Close the file', ko: '파일 닫기' },
} satisfies Record<string, L>
