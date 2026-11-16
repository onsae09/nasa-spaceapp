import type { L } from '../i18n'

/**
 * The NISAR stop at the end of chapter 2: two passes of NASA and ISRO's
 * L-band radar over the lakes around Siling Co on the Tibetan Plateau, and
 * what the team's NISAR pipeline did with the mission's archive.
 *
 * The pictures are NASA/JPL's own browse images of the two products, cut to
 * one window by scripts/build_nisar_layers.py; the lake positions and the
 * brighter / darker / same answers are the ones that script prints. Product
 * names, dates, channels and version are from NASA's catalogue (CMR) and are
 * listed in data/nisar/README.md. The pipeline figures are from the team's
 * repository, github.com/Maha123b/nisar-analysis (PROJECT_STATE.md and
 * config/settings.yaml); change them there first, then here.
 */

const url = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`

export type LakeKey = '1' | '2' | '3'
/** What a lake did between the two passes. */
export type LakeChange = 'brighter' | 'darker' | 'same'
/** What might have caused it. None is marked right: two passes cannot settle it. */
export type DriverKey = 'wind' | 'ice' | 'level'

export const nisar = {
  title: { en: 'Now ask NISAR', ko: '이제 NISAR에게 물어봐요' } satisfies L,
  lead: {
    en: 'Same method, a newer radar. Pick a lake and slide the divider across it.',
    ko: '같은 방법, 더 새로운 레이더. 호수를 고르고 구분선을 그 위로 움직여 보세요.',
  } satisfies L,

  before: url('analysis/nisar-before.webp'),
  after: url('analysis/nisar-after.webp'),
  /** The layers' size in pixels and how wide they are on the ground (printed by the build script). */
  size: { width: 1520, height: 1000 },
  kmWide: 140,

  place: { en: 'Tibetan Plateau, around Siling Co', ko: '티베트 고원, 실링초 호수 일대' } satisfies L,
  beforeDate: { en: 'Before · 28 Oct 2026', ko: '전 · 2026년 10월 28일' } satisfies L,
  afterDate: { en: 'After · 9 Nov 2026', ko: '후 · 2026년 11월 9일' } satisfies L,
  source: {
    en: 'NISAR L-band · HH + HV · NASA/JPL browse image, via ASF',
    ko: 'NISAR L-밴드 · HH + HV · NASA/JPL 미리보기 영상, ASF 제공',
  } satisfies L,
  scale: { en: 'About 140 km across · 12 days apart', ko: '가로 약 140 km · 12일 간격' } satisfies L,
  colour: {
    en: 'False colour from two channels, HH and HV. Calm water sends little back and looks dark.',
    ko: 'HH와 HV 두 채널로 만든 가색 영상이에요. 잔잔한 물은 신호를 거의 돌려보내지 않아 어둡게 보여요.',
  } satisfies L,
  divider: { en: 'Drag to compare the two dates', ko: '끌어서 두 날짜 비교' } satisfies L,
  alt: {
    en: 'A high plateau seen by radar in green and magenta: bright ridges, and lakes that are dark on one date and pale on the other, shown either side of a divider.',
    ko: '레이더로 본 고원. 초록과 자홍빛의 밝은 능선 사이로, 한 날짜에는 어둡고 다른 날짜에는 옅은 호수들이 구분선 양쪽에 보인다.',
  } satisfies L,

  /**
   * The three lakes, as fractions of the layer (`r` is a fraction of its
   * width), with what each did between the passes. Mean browse brightness
   * inside each circle, out of 255: lake 1, 75 → 88; lake 2, 74 → 43;
   * lake 3 (Siling Co), 97 → 98.
   */
  lakes: {
    '1': { x: 0.228, y: 0.248, r: 0.03, answer: 'brighter' },
    '2': { x: 0.657, y: 0.328, r: 0.026, answer: 'darker' },
    '3': { x: 0.868, y: 0.8, r: 0.045, answer: 'same' },
  } satisfies Record<LakeKey, { x: number; y: number; r: number; answer: LakeChange }>,

  task: {
    lake: { en: 'Lake', ko: '호수' },
    ask: { en: 'Between the two passes, lake {lake}…', ko: '두 촬영 사이에 {lake}번 호수는…' },
    changes: {
      brighter: { en: 'Got brighter', ko: '밝아졌다' },
      darker: { en: 'Got darker', ko: '어두워졌다' },
      same: { en: 'Stayed the same', ko: '그대로다' },
    } satisfies Record<LakeChange, L>,
    wrong: { en: 'Slide the divider across it and look again.', ko: '구분선을 그 위로 움직여 다시 보세요.' },
    right: {
      '1': { en: 'Right. Dark on 28 October, paler on 9 November.', ko: '맞아요. 10월 28일엔 어둡고, 11월 9일엔 더 옅어요.' },
      '2': { en: 'Right. The other way round: pale, then dark.', ko: '맞아요. 반대예요. 옅었다가 어두워졌어요.' },
      '3': {
        en: 'Right. Siling Co is water, and bright on both passes.',
        ko: '맞아요. 실링초는 물인데도 두 번 모두 밝아요.',
      },
    } satisfies Record<LakeKey, L>,
  },

  drivers: {
    ask: { en: 'What could change a lake in 12 days?', ko: '12일 만에 호수를 바꿀 수 있는 것은?' },
    locked: { en: 'Read all three lakes first.', ko: '먼저 세 호수를 모두 읽어 보세요.' },
    open: { en: 'No answer is marked wrong. Each one says what would test it.', ko: '틀렸다고 표시되는 답은 없어요. 답마다 무엇으로 확인할 수 있는지 알려 줘요.' },
    options: {
      wind: {
        name: { en: 'Wind on the water', ko: '수면에 부는 바람' },
        note: {
          en: 'The likeliest reading. Wind roughens water and brightens it; calm darkens it. Lakes 1 and 2 went opposite ways, which fits. A wind record would test it.',
          ko: '가장 그럴듯한 해석이에요. 바람은 물결을 일으켜 밝게, 잔잔함은 어둡게 만들어요. 1번과 2번이 반대로 변한 것과 맞아요. 바람 기록이 있으면 확인할 수 있어요.',
        },
      },
      ice: {
        name: { en: 'Ice forming', ko: '얼음이 얼기 시작' },
        note: {
          en: 'Possible in November, above 4,500 m. But ice would not darken one lake while paling its neighbour. A temperature record or a third pass would test it.',
          ko: '해발 4,500 m가 넘는 11월이라 가능해요. 하지만 얼음이라면 한 호수는 어두워지고 옆 호수는 옅어지기 어려워요. 기온 기록이나 세 번째 촬영이 있으면 확인할 수 있어요.',
        },
      },
      level: {
        name: { en: 'The lake filled or drained', ko: '호수가 차거나 빠짐' },
        note: {
          en: 'Unlikely here. The shorelines sit in the same place on both passes: check them with the divider. It is the surface that changed, not the outline.',
          ko: '여기서는 가능성이 낮아요. 두 촬영에서 호숫가의 위치가 같아요. 구분선으로 확인해 보세요. 달라진 것은 윤곽이 아니라 수면이에요.',
        },
      },
    } satisfies Record<DriverKey, { name: L; note: L }>,
    lesson: {
      en: 'Dark is not always water, and water is not always dark. A flag still needs a second source.',
      ko: '어둡다고 늘 물은 아니고, 물이라고 늘 어둡지도 않아요. 그래서 표시에는 두 번째 근거가 필요해요.',
    },
  },

  /** What the newer radar adds to the Sentinel-1 case, and what the team has run on it. */
  facts: {
    title: { en: 'What NISAR adds', ko: 'NISAR가 더하는 것' },
    adds: [
      {
        en: 'Its L-band wave is about 24 cm long, against 5.6 cm for Sentinel-1. Longer waves pass through leaves that hide water.',
        ko: 'L-밴드 파장은 약 24 cm로, Sentinel-1의 5.6 cm보다 길어요. 긴 파장은 물을 가리는 나뭇잎을 더 잘 통과해요.',
      },
      {
        en: 'The same track comes back every 12 days, and the data is free.',
        ko: '같은 궤도가 12일마다 돌아오고, 자료는 무료예요.',
      },
    ],
    team: { en: 'The team’s NISAR run', ko: '팀의 NISAR 분석' },
    counts: [
      { value: '20,029', label: { en: 'products catalogued', ko: '목록에 담은 산출물' } },
      { value: '152', label: { en: 'places with a comparable pair', ko: '비교할 수 있는 쌍이 있는 곳' } },
      { value: '8', label: { en: 'chosen · 4 verified so far', ko: '선정 · 지금까지 4곳 검증' } },
    ],
    ruleTitle: { en: 'How it flags', ko: '표시하는 방법' },
    rule: {
      en: 'It flags ground whose echo fell by more than 3 dB, in patches of 20 pixels or more. This frame is one of the four.',
      ko: '메아리가 3 dB 넘게 약해진 땅을 20픽셀 이상 뭉치로 표시해요. 이 장면은 그 네 곳 중 하나예요.',
    },
    status: {
      en: 'Status: unvalidated. Nothing independent has checked a flag yet, so the team calls each one a candidate.',
      ko: '상태: 미검증. 독립 자료로 확인한 표시가 아직 없어, 팀은 모두 후보라고 불러요.',
    },
    link: { en: 'The pipeline, on GitHub', ko: 'GitHub의 분석 파이프라인' },
    href: 'https://github.com/Maha123b/nisar-analysis',
  } satisfies {
    title: L
    adds: L[]
    team: L
    counts: { value: string; label: L }[]
    ruleTitle: L
    rule: L
    status: L
    link: L
    href: string
  },
}
