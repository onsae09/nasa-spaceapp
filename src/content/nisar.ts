import type { L } from '../i18n'
import haorCsv from '../../data/nisar/haor_water_area.csv?raw'
import lakesCsv from '../../data/nisar/tibet_lakes.csv?raw'

/**
 * The two NISAR stops at the end of chapter 2, both measured from NISAR
 * L2 GCOV products (frequency B, 80 m, HH and HV) read from NASA's archive
 * by scripts/fetch_nisar_gcov.py and worked up by
 * scripts/build_nisar_analysis.py:
 *
 *   haor  – twelve passes over the haor basin of north-east Bangladesh,
 *           18 June to 9 November 2026: how much of it was open water.
 *   nisar – two passes over the lakes around Siling Co on the Tibetan
 *           Plateau, 28 October and 9 November 2026: what three lakes did.
 *
 * Every number on these screens is read from the two tables that script
 * writes, data/nisar/haor_water_area.csv and data/nisar/tibet_lakes.csv, so
 * running it again updates the app. data/nisar/README.md says what was
 * measured and what was not. The pipeline counts are from the team's
 * repository, github.com/Maha123b/nisar-analysis.
 */

const url = (path: string) => `${import.meta.env.BASE_URL}assets/${path}`

export type LakeKey = '1' | '2' | '3'
/** What a lake did between the two passes. */
export type LakeChange = 'brighter' | 'darker' | 'same'
/** What might have caused it. None is marked right: two passes cannot settle it. */
export type DriverKey = 'wind' | 'ice' | 'level'

/** Rows of a small comma-separated table, keyed by its header. */
function table(csv: string): Record<string, string>[] {
  const [head, ...lines] = csv.trim().split(/\r?\n/)
  const names = head.split(',')
  return lines.map((line) => Object.fromEntries(line.split(',').map((cell, i) => [names[i], cell])))
}

/** "2026-07-24" as "24 Jul 2026" and "2026년 7월 24일". */
export function passDate(iso: string): L {
  const [year, month, day] = iso.split('-').map(Number)
  const name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1]
  return { en: `${day} ${name} ${year}`, ko: `${year}년 ${month}월 ${day}일` }
}

/** One pass over the haor: its date and the open water measured in it, in km². */
export type HaorPass = { date: string; key: string; km2: number; low: number; high: number }

const passes: HaorPass[] = table(haorCsv).map((row) => ({
  date: row.date,
  key: row.date.replaceAll('-', ''),
  km2: Number(row.water_km2),
  /** The same count with the threshold 2 dB stricter and 2 dB looser. */
  low: Number(row.water_km2_at_minus22),
  high: Number(row.water_km2_at_minus18),
}))
const peak = passes.reduce((best, pass) => (pass.km2 > best.km2 ? pass : best))
const last = passes[passes.length - 1]
const km = (value: number) => value.toLocaleString('en-US')

export const haor = {
  title: { en: 'Watch a flood season with NISAR', ko: 'NISAR로 홍수철 한 번을 지켜봐요' } satisfies L,
  lead: {
    en: 'Twelve passes over Bangladesh’s haor basin. Move through them and find the widest water.',
    ko: '방글라데시 하오르 분지를 찍은 열두 번의 촬영. 넘겨 보며 물이 가장 넓은 날을 찾으세요.',
  } satisfies L,

  passes,
  peak,
  last,
  frame: (key: string) => url(`analysis/nisar-haor-${key}.webp`),
  water: (key: string) => url(`analysis/nisar-haor-water-${key}.webp`),
  size: { width: 816, height: 900 },

  place: { en: 'Haor basin, north-east Bangladesh', ko: '방글라데시 북동부 하오르 분지' } satisfies L,
  scale: { en: '109 km across · a pass every 12 days', ko: '가로 109 km · 12일마다 촬영' } satisfies L,
  source: { en: 'NISAR L-band · HV, 80 m · NASA/JPL, via ASF', ko: 'NISAR L-밴드 · HV, 80 m · NASA/JPL, ASF 제공' } satisfies L,
  alt: {
    en: 'A river basin seen by radar in grey: a wide dark sheet of water laced with pale embankments, which shrinks pass by pass through the autumn.',
    ko: '레이더로 본 강 유역. 옅은 둑이 얽힌 넓고 어두운 물이 가을로 갈수록 촬영마다 줄어든다.',
  } satisfies L,

  labels: {
    pass: { en: 'Pass', ko: '촬영' },
    slider: { en: 'Move through the passes', ko: '촬영 넘겨 보기' },
    play: { en: 'Play', ko: '재생' },
    pause: { en: 'Pause', ko: '멈춤' },
    flag: { en: 'Colour the open water', ko: '물로 판정한 곳 칠하기' },
    pick: { en: 'This pass has the most water', ko: '이 촬영에 물이 가장 많다' },
    again: { en: 'Guess again', ko: '다시 고르기' },
    chart: { en: 'Open water in the window, km²', ko: '창 안의 수면 면적, km²' },
    yours: { en: 'your pick', ko: '당신의 선택' },
    gap: { en: 'no pass on 5 Aug', ko: '8월 5일 촬영 없음' },
  } satisfies Record<string, L>,

  how: {
    en: 'Dark is open water. Bright threads are embankments, villages and trees standing above it.',
    ko: '어두운 곳이 물이에요. 밝은 실선은 물 위로 솟은 둑과 마을, 나무예요.',
  } satisfies L,

  result: {
    right: {
      en: `Right. ${passDate(peak.date).en}: ${km(peak.km2)} km² of open water, the most of the twelve.`,
      ko: `맞아요. ${passDate(peak.date).ko}, 수면 ${km(peak.km2)} km²로 열두 번 중 가장 넓어요.`,
    },
    /** `{date}` and `{km2}` are the visitor's own pick. */
    wrong: {
      en: `Not quite. {date} had {km2} km². The widest was ${passDate(peak.date).en}, with ${km(peak.km2)} km².`,
      ko: `조금 달라요. {date}은 {km2} km²였어요. 가장 넓은 날은 ${passDate(peak.date).ko}, ${km(peak.km2)} km²예요.`,
    },
  } satisfies Record<string, L>,

  findings: [
    {
      en: `By ${passDate(last.date).en} it had fallen to ${km(last.km2)} km²: ${km(peak.km2 - last.km2)} km² of land came back, ${Math.round((1 - last.km2 / peak.km2) * 100)}% of the peak.`,
      ko: `${passDate(last.date).ko}에는 ${km(last.km2)} km²로 줄었어요. 땅 ${km(peak.km2 - last.km2)} km²가 돌아왔고, 정점의 ${Math.round((1 - last.km2 / peak.km2) * 100)}%예요.`,
    },
    {
      en: 'Why: monsoon rain and rivers fill this basin every summer. It drains through the autumn, and farmers plant rice on the land that returns.',
      ko: '이유: 해마다 여름이면 장맛비와 강물이 이 분지를 채워요. 가을에 물이 빠지면 농부들은 돌아온 땅에 벼를 심어요.',
    },
    {
      en: 'How: a pixel counts as water when its HV echo is below −20 dB. Move that line 2 dB and the totals shift (the thin bars), but the season keeps its shape.',
      ko: '방법: HV 메아리가 −20 dB보다 약한 픽셀을 물로 셌어요. 기준을 2 dB 옮기면 합계는 달라지지만(가는 막대), 계절의 모양은 그대로예요.',
    },
    {
      en: 'Not checked: no gauge or optical image has been held against these maps. Smooth wet mud can look like water.',
      ko: '확인 안 됨: 수위계나 광학 영상과 대조하지 않았어요. 매끈한 젖은 진흙은 물처럼 보일 수 있어요.',
    },
  ] satisfies L[],
}

/** What each lake's echo did, from data/nisar/tibet_lakes.csv, in dB. */
const lakeRows = Object.fromEntries(table(lakesCsv).map((row) => [row.lake, row]))
const signed = (value: string) => `${Number(value) > 0 ? '+' : Number(value) < 0 ? '−' : ''}${Math.abs(Number(value)).toFixed(1)}`
const minus = (value: string) => value.replace('-', '−')
/** "HH −18.9 → −22.8 dB (−3.9) · HV −0.1" */
const measured = (lake: string) => {
  const row = lakeRows[lake]
  return `HH ${minus(row.hh_db_before)} → ${minus(row.hh_db_after)} dB (${signed(row.hh_change_db)}) · HV ${signed(row.hv_change_db)}`
}

export const nisar = {
  title: { en: 'Twelve days, three lakes', ko: '12일, 호수 세 곳' } satisfies L,
  lead: {
    en: 'A change is not always a flood. Pick a lake and slide the divider across it.',
    ko: '달라졌다고 다 홍수는 아니에요. 호수를 고르고 구분선을 그 위로 움직여 보세요.',
  } satisfies L,

  before: url('analysis/nisar-before.webp'),
  after: url('analysis/nisar-after.webp'),
  change: url('analysis/nisar-change.webp'),
  views: {
    compare: { en: 'Before / after', ko: '전 / 후' },
    change: { en: 'Change in HH', ko: 'HH 변화량' },
  } satisfies Record<'compare' | 'change', L>,
  viewGroup: { en: 'What the picture shows', ko: '그림에 보이는 것' } satisfies L,
  /** The layers' size in pixels and how wide they are on the ground (printed by the build script). */
  size: { width: 1520, height: 1000 },
  kmWide: 140,

  place: { en: 'Tibetan Plateau, around Siling Co', ko: '티베트 고원, 실링초 호수 일대' } satisfies L,
  beforeDate: { en: 'Before · 28 Oct 2026', ko: '전 · 2026년 10월 28일' } satisfies L,
  afterDate: { en: 'After · 9 Nov 2026', ko: '후 · 2026년 11월 9일' } satisfies L,
  source: {
    en: 'NISAR L-band · HH + HV, 80 m · NASA/JPL, via ASF',
    ko: 'NISAR L-밴드 · HH + HV, 80 m · NASA/JPL, ASF 제공',
  } satisfies L,
  scale: { en: 'About 140 km across · 12 days apart', ko: '가로 약 140 km · 12일 간격' } satisfies L,
  colour: {
    en: 'Magenta: the HH echo is the stronger. Green: HV is. Calm water sends little back and looks dark.',
    ko: '자홍: HH 메아리가 더 강한 곳. 초록: HV가 더 강한 곳. 잔잔한 물은 신호를 거의 돌려보내지 않아 어두워요.',
  } satisfies L,
  changeKey: {
    en: 'Blue: the HH echo fell between the passes. Orange: it rose. Black: it held.',
    ko: '파랑: 두 촬영 사이 HH 메아리가 약해진 곳. 주황: 강해진 곳. 검정: 그대로인 곳.',
  } satisfies L,
  divider: { en: 'Drag to compare the two dates', ko: '끌어서 두 날짜 비교' } satisfies L,
  alt: {
    en: 'A high plateau seen by radar in green and magenta: bright ridges, and lakes that are dark on one date and pale on the other, shown either side of a divider.',
    ko: '레이더로 본 고원. 초록과 자홍빛의 밝은 능선 사이로, 한 날짜에는 어둡고 다른 날짜에는 옅은 호수들이 구분선 양쪽에 보인다.',
  } satisfies L,

  /**
   * The three lakes, as fractions of the layer (`r` is a fraction of its
   * width), with what each did between the passes. The measured echo of
   * each is in data/nisar/tibet_lakes.csv and is quoted in `right` below.
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
      '1': { en: `Right, it brightened. ${measured('1')}`, ko: `맞아요, 밝아졌어요. ${measured('1')}` },
      '2': { en: `Right, it darkened. ${measured('2')}`, ko: `맞아요, 어두워졌어요. ${measured('2')}` },
      '3': {
        en: `Right. Siling Co is water, yet bright both times. ${measured('3')}`,
        ko: `맞아요. 실링초는 물인데도 두 번 다 밝아요. ${measured('3')}`,
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
          en: 'The likeliest reading. Wind roughens water and lifts HH; calm lowers it. Lakes 1 and 2 went opposite ways and HV never moved, which fits. A wind record would test it.',
          ko: '가장 그럴듯한 해석이에요. 바람은 물결을 일으켜 HH를 올리고, 잔잔하면 내려요. 1번과 2번이 반대로 변했고 HV는 그대로라 잘 맞아요. 바람 기록이 있으면 확인할 수 있어요.',
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
      en: `Lake 2 fell ${minus(lakeRows['2'].hh_change_db).replace('−', '')} dB in HH: past the team’s 3 dB flood flag, on a lake that was a lake both times. HV did not move. That is why a flag needs a second channel and a second source.`,
      ko: `2번 호수는 HH가 ${minus(lakeRows['2'].hh_change_db).replace('−', '')} dB 떨어졌어요. 팀의 홍수 표시 기준 3 dB를 넘지만, 두 번 다 그냥 호수였어요. HV는 움직이지 않았어요. 그래서 표시에는 두 번째 채널과 두 번째 근거가 필요해요.`,
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
      en: 'It flags ground whose echo fell by more than 3 dB, in patches of 20 pixels or more. This frame is one of the four it verified.',
      ko: '메아리가 3 dB 넘게 약해진 땅을 20픽셀 이상 뭉치로 표시해요. 이 장면은 검증한 네 곳 중 하나예요.',
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
