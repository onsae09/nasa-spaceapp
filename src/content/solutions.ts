import type { L } from '../i18n'

/**
 * The solution cards. Taken from the team's solutions paper
 * (data/Wave_of_Change_Flood_Solutions.pdf, section 3.2). The "plain" text is
 * the paper's own "In simple words" line for each idea.
 */

const STAGE = {
  prevent: { en: 'Prevent', ko: '예방' },
  predict: { en: 'Predict', ko: '예측' },
  warn: { en: 'Warn', ko: '경보' },
} satisfies Record<string, L>

const same = (text: string): L => ({ en: text, ko: text })

export type Solution = {
  /** Where it sits in the paper's Prevent / Predict / Warn stages. */
  stage: L
  /** How far ahead it acts. */
  horizon: L
  title: L
  plain: L
  /** One limit or condition the paper states for this idea. */
  note: L
  data: L[]
}

export const solutions: Solution[] = [
  {
    stage: STAGE.predict,
    horizon: { en: 'Months ahead', ko: '몇 달 전' },
    title: { en: 'Slope-creep watch', ko: '비탈 움직임 감시' },
    plain: {
      en: 'Satellites measure how fast a mountain slope creeps. A slope that starts moving faster than its own normal gets a ground sensor and a closer watch.',
      ko: '위성으로 산비탈이 얼마나 빨리 밀려 내려가는지 잽니다. 평소보다 빨라진 비탈에는 지상 센서를 달고 더 자세히 지켜봅니다.',
    },
    note: {
      en: 'NISAR passes every 12 days, too slow to sound a siren. It shows where to put the sensors.',
      ko: 'NISAR는 12일마다 지나가서 사이렌을 울리기엔 느립니다. 대신 센서를 어디에 둘지 알려 줍니다.',
    },
    data: [same('NISAR'), same('ICESat-2'), same('Landsat')],
  },
  {
    stage: STAGE.warn,
    horizon: { en: 'Minutes ahead', ko: '몇 분 전' },
    title: { en: 'Time-of-arrival alerts', ko: '도착 시간 경보' },
    plain: {
      en: 'The alert says “water reaches you in 40 minutes” instead of just “flood danger”.',
      ko: '경보가 그냥 “홍수 위험”이 아니라 “40분 뒤 물이 도착합니다”라고 알려 줍니다.',
    },
    note: {
      en: 'People move when the number is concrete. The travel speeds still have to be measured on real rivers.',
      ko: '숫자가 구체적일 때 사람들은 움직입니다. 다만 물의 속도는 실제 강에서 재야 합니다.',
    },
    data: [{ en: 'NASADEM terrain', ko: 'NASADEM 지형' }],
  },
  {
    stage: STAGE.predict,
    horizon: { en: 'Days ahead', ko: '며칠 전' },
    title: { en: 'Flood Risk Index', ko: '홍수 위험 지수' },
    plain: {
      en: 'A map that scores every place from safe to dangerous using rain, wet soil, steep land and how many people live there.',
      ko: '비, 젖은 땅, 가파른 지형, 사는 사람 수를 합쳐 모든 곳에 안전부터 위험까지 점수를 매긴 지도입니다.',
    },
    note: {
      en: 'A small stream above a school ranks higher than a larger river above empty land.',
      ko: '빈 땅 위의 큰 강보다 학교 위의 작은 개울이 더 높은 점수를 받습니다.',
    },
    data: [same('GPM IMERG'), same('SMAP'), same('NASADEM')],
  },
  {
    stage: STAGE.warn,
    horizon: { en: 'Minutes ahead', ko: '몇 분 전' },
    title: { en: 'Phones and shaking-ground sirens', ko: '휴대폰 제보와 지진계 사이렌' },
    plain: {
      en: 'Phones and shaking-ground sensors can report a flood sooner than a river gauge that does not exist.',
      ko: '수위계가 없는 강에서는 휴대폰과 땅의 흔들림을 재는 센서가 홍수를 더 빨리 알릴 수 있습니다.',
    },
    note: {
      en: 'Phone reports are opt-in and anonymous. A cheap seismometer can fire a siren on its own.',
      ko: '휴대폰 제보는 동의한 사람만, 익명으로 받습니다. 값싼 지진계가 사이렌을 스스로 울릴 수 있습니다.',
    },
    data: [
      { en: 'Ground sensors', ko: '지상 센서' },
      { en: 'Phone reports', ko: '휴대폰 제보' },
    ],
  },
  {
    stage: STAGE.prevent,
    horizon: { en: 'Years ahead', ko: '몇 해 전' },
    title: { en: 'Empty floodplains, open hazard maps', ko: '비워 두는 범람원, 공개하는 위험 지도' },
    plain: {
      en: 'Keep the most dangerous land empty in flood season, and share mountain hazard maps so neighbours are warned in time.',
      ko: '홍수철에는 가장 위험한 땅을 비워 두고, 산악 위험 지도를 공유해 이웃 나라도 제때 경보를 받게 합니다.',
    },
    note: {
      en: 'Warnings have to cross borders as fast as water does.',
      ko: '경보는 물만큼 빨리 국경을 넘어야 합니다.',
    },
    data: [same('NASADEM'), same('Landsat'), same('SWOT')],
  },
]

export const deck = {
  title: { en: 'Five ideas for the next flood', ko: '다음 홍수를 대비하는 다섯 가지 아이디어' },
  lead: { en: 'Choose a card to turn it over', ko: '카드를 골라 뒤집어 보세요' },
  source: {
    en: 'From our team’s solutions paper, 14 Nov 2026. Proposals, not yet tested.',
    ko: '우리 팀의 해결책 문서(2026년 11월 14일)에서. 아직 검증되지 않은 제안입니다.',
  },
  idea: { en: 'Idea', ko: '아이디어' },
  uses: { en: 'Uses', ko: '쓰는 자료' },
  next: { en: 'Next idea', ko: '다음 아이디어' },
  close: { en: 'Close the card', ko: '카드 닫기' },
  turnOver: { en: 'turn over', ko: '뒤집기' },
  readAgain: { en: 'read again', ko: '다시 읽기' },
} satisfies Record<string, L>
