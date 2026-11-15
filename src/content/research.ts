import type { L } from '../i18n'

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
  lines: L[]
  body: L[]
  figure: Figure
  paper: { title: string; authors: string; published: string; href: string }
}

const same = (text: string): L => ({ en: text, ko: text })

export const researchFiles: ResearchFile[] = [
  {
    number: '01',
    title: { en: 'Flooding in Nepal', ko: '네팔의 홍수' },
    teaser: { en: 'Six years of radar over the Terai lowlands', ko: '테라이 저지대를 6년간 본 레이더' },
    lines: [
      {
        en: 'This file takes us to the Terai region, a lowland area in southern Nepal.',
        ko: '이 파일은 네팔 남부의 저지대, 테라이 지역으로 우리를 데려가요.',
      },
      {
        en: 'During the rainy season, rivers can overflow and water can spread into nearby communities and farmland.',
        ko: '우기가 되면 강이 넘쳐서 물이 가까운 마을과 농경지로 퍼지곤 해요.',
      },
      {
        en: 'To understand what happened, researchers need to know where water went and how the affected area changed over time.',
        ko: '무슨 일이 있었는지 알려면, 물이 어디로 갔고 피해 지역이 시간에 따라 어떻게 달라졌는지 알아야 해요.',
      },
      {
        en: 'In one study, researchers compared radar images collected between 2019 and 2024.',
        ko: '한 연구에서는 2019년부터 2024년 사이에 찍은 레이더 영상을 비교했어요.',
      },
      {
        en: 'Instead of looking at just one moment, they examined observations from different years to study flooding across the region.',
        ko: '한순간만 본 게 아니라, 여러 해의 관측을 살펴서 지역 전체의 홍수를 연구했어요.',
      },
      { en: 'Think of it like keeping a record of the same place.', ko: '같은 장소를 꾸준히 기록해 두는 것과 비슷해요.' },
      {
        en: 'One image shows where water was on a particular day, but comparing them can help reveal a larger pattern.',
        ko: '영상 한 장은 그날 물이 어디 있었는지만 보여 주지만, 여러 장을 비교하면 더 큰 흐름이 드러나요.',
      },
    ],
    body: [
      {
        en: 'The Terai is a lowland region in southern Nepal, where rivers, farmland and communities share the same landscape. During periods of heavy rainfall, flooding can extend beyond river channels and affect the surrounding area.',
        ko: '테라이는 네팔 남부의 저지대로, 강과 농경지와 마을이 한 땅을 나눠 쓰는 곳입니다. 큰비가 내리면 홍수가 강줄기를 넘어 주변 지역까지 퍼질 수 있습니다.',
      },
      {
        en: 'In the study, researchers used Sentinel-1 Synthetic Aperture Radar, or SAR, observations to investigate flooding between 2019 and 2024. They used change-detection approaches to examine differences between images taken at different times.',
        ko: '이 연구는 Sentinel-1 합성개구레이더(SAR) 관측으로 2019년부터 2024년까지의 홍수를 조사했습니다. 서로 다른 시점의 영상 차이를 살피는 변화 탐지 기법을 썼습니다.',
      },
      {
        en: 'This kind of comparison can help researchers study where water appears to have spread and how flood patterns vary over time. It can also provide information for people working to understand flood-prone areas, although satellite observation needs to be interpreted alongside other evidence.',
        ko: '이런 비교는 물이 어디로 퍼진 것으로 보이는지, 홍수 양상이 시간에 따라 어떻게 달라지는지 연구하는 데 도움이 됩니다. 홍수에 취약한 지역을 이해하려는 사람들에게도 정보를 줍니다. 다만 위성 관측은 다른 근거와 함께 해석해야 합니다.',
      },
    ],
    figure: {
      kind: 'facts',
      heading: { en: 'From the paper’s abstract', ko: '논문 초록에서' },
      items: [
        { value: same('2019–2024'), label: { en: 'monthly Sentinel-1 flood maps', ko: '월별 Sentinel-1 홍수 지도' } },
        { value: { en: '3 districts', ko: '3개 군' }, label: { en: 'Parsa, Bara and Rautahat', ko: '파르사, 바라, 라우타하트' } },
        { value: same('285 km²'), label: { en: 'passed by two extreme floods', ko: '두 번의 극심한 홍수가 넘긴 면적' } },
        { value: same('5.94%'), label: { en: 'of the area flooded 3 or 4 times', ko: '3~4번 잠긴 땅의 비율' } },
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
    title: { en: 'Seeing through the clouds', ko: '구름을 뚫고 보기' },
    teaser: { en: 'Why radar works when a camera cannot', ko: '카메라가 못 볼 때 레이더가 보는 이유' },
    lines: [
      {
        en: 'When you picture a satellite image, you might imagine a photograph taken from space.',
        ko: '위성 영상이라고 하면 우주에서 찍은 사진을 떠올릴 거예요.',
      },
      {
        en: 'But a camera can only show us the ground when it has a clear enough view.',
        ko: '하지만 카메라는 시야가 충분히 트여 있을 때만 땅을 보여 줄 수 있어요.',
      },
      {
        en: 'That can be a problem during a flood. The same storm that brings heavy rain can also cover the area in clouds, hiding what’s happening below.',
        ko: '홍수 때는 그게 문제가 돼요. 큰비를 몰고 온 바로 그 폭풍이 구름으로 땅을 덮어서, 아래에서 벌어지는 일을 가려 버리거든요.',
      },
      { en: 'SAR gives us another way to observe Earth.', ko: 'SAR는 지구를 보는 또 다른 방법이에요.' },
      {
        en: 'Instead of relying on sunlight, it sends radar signals toward the ground and measures the signals that return.',
        ko: '햇빛에 기대지 않고, 땅을 향해 레이더 신호를 보낸 다음 돌아오는 신호를 재요.',
      },
      { en: 'Different surfaces reflect those signals differently.', ko: '표면마다 그 신호를 반사하는 방식이 달라요.' },
      {
        en: 'Researchers can study those differences and compare observations from before and after a flood to look for areas where water may have spread.',
        ko: '연구자들은 그 차이를 살피고 홍수 전후의 관측을 비교해서, 물이 퍼졌을 만한 곳을 찾아요.',
      },
      {
        en: 'It’s not quite the same as taking a photograph, but it gives us information we might otherwise miss.',
        ko: '사진을 찍는 것과 똑같지는 않지만, 놓쳤을지도 모를 정보를 알려 줘요.',
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
      src: url('analysis/amphan-vh.webp'),
      alt: {
        en: 'A slanted strip of land seen by radar, with bright cyan patches where new flooding was mapped.',
        ko: '레이더로 본 비스듬한 띠 모양의 땅. 새로 잠긴 곳은 밝은 청록색 얼룩으로 보인다.',
      },
      caption: {
        en: 'From our own analysis: radar change over Bangladesh, May 2020. Cyan marks new flooding in the reference map.',
        ko: '우리 분석에서: 2020년 5월 방글라데시의 레이더 변화. 청록색은 기준 지도의 신규 침수입니다.',
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
    teaser: { en: 'What a flood map can miss', ko: '홍수 지도가 놓칠 수 있는 것' },
    lines: [
      {
        en: 'From up here, a satellite can observe a large area at once.',
        ko: '이 위에서는 위성이 넓은 지역을 한꺼번에 볼 수 있어요.',
      },
      {
        en: 'That makes it useful during a flood, but a wide view doesn’t always mean a complete one.',
        ko: '홍수 때 큰 도움이 되지만, 넓게 본다고 해서 다 보는 건 아니에요.',
      },
      {
        en: 'In a city, buildings can block radar signals or cause them to bounce in complicated ways.',
        ko: '도시에서는 건물이 레이더 신호를 막거나 복잡하게 튕겨 내요.',
      },
      {
        en: 'Trees and other plants can also make it harder to tell whether water is underneath.',
        ko: '나무와 풀도 그 아래에 물이 있는지 알아보기 어렵게 만들어요.',
      },
      { en: 'There’s another thing to keep in mind.', ko: '기억해 둘 게 하나 더 있어요.' },
      { en: 'A satellite image is a record of one moment.', ko: '위성 영상은 한순간의 기록이에요.' },
      {
        en: 'If it passes before the water reaches its highest point, or after some of the water has drained away, it may not show the full extent of the flood.',
        ko: '물이 가장 높이 차오르기 전에 지나가거나 물이 어느 정도 빠진 뒤에 지나가면, 홍수의 전체 범위를 담지 못할 수 있어요.',
      },
      {
        en: 'So when you look at a flood map, remember that it’s evidence, not a perfect view of everything on the ground.',
        ko: '그러니 홍수 지도를 볼 때는 그게 증거일 뿐, 땅 위의 모든 것을 완벽하게 보여 주는 건 아니라는 걸 기억하세요.',
      },
      {
        en: 'The more carefully we compare it with other information, the better we can understand what really happened.',
        ko: '다른 정보와 꼼꼼히 비교할수록 실제로 무슨 일이 있었는지 더 잘 알 수 있어요.',
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
  lead: { en: 'Open a file to read it', ko: '파일을 열어 읽어 보세요' },
  file: { en: 'File', ko: '파일' },
  read: { en: 'Read', ko: '읽음' },
  basedOn: { en: 'Based on', ko: '바탕이 된 논문:' },
  close: { en: 'Close the file', ko: '파일 닫기' },
} satisfies Record<string, L>
