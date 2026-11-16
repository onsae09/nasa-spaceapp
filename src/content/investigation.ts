import type { L } from '../i18n'
import type { RegionKey } from './analysis'

/**
 * The investigation the visitor carries through the story: the desk it
 * starts on, the evidence they hold against their region, the gaps a radar
 * map leaves, and the next step they choose. Wording follows the story plan
 * (pages 3, 6, 7 and 8); the facts are the team's Amphan analysis.
 */

/** Other things to hold against a region. */
export type EvidenceKey = 'reference' | 'vv' | 'ground'
/** What a source shows about a region: a change, no change, or nothing at all. */
export type SupportKey = 'change' | 'none' | 'silent'
export type InterpretationKey = 'flood' | 'existing' | 'uncertain'
export type GapKey = 'buildings' | 'plants' | 'timing' | 'coverage'
export type NextStepKey = 'map' | 'warn' | 'plan'

export const desk = {
  lead: { en: 'One patch changed. What does it mean?', ko: '한 곳이 달라졌어요. 무슨 뜻일까요?' },
  support: { en: 'Compare the views. Build your case.', ko: '두 장면을 비교하고 사건을 정리하세요.' },
  enlarge: { en: 'Enlarge', ko: '크게 보기' },
  shrink: { en: 'Back to the desk', ko: '책상으로' },
  notes: {
    title: { en: 'Case notes', ko: '사건 노트' },
    change: { en: 'Change', ko: '변화' },
    uncertainty: { en: 'Uncertainty', ko: '불확실성' },
    next: { en: 'Next step', ko: '다음 단계' },
    empty: { en: 'Empty', ko: '비어 있음' },
  },
} satisfies Record<string, L | Record<string, L>>

export const clues = {
  title: { en: 'Does this evidence fit your claim?', ko: '이 근거가 당신의 판단과 맞나요?' },
  how: { en: 'Check the place and time. Then match the coverage.', ko: '장소와 시점을 확인하고, 덮는 범위를 맞춰 보세요.' },
  pick: { en: 'No region taken forward. Pick one:', ko: '가져온 지점이 없어요. 하나 고르세요:' },
  yours: { en: 'Your region', ko: '당신의 지점' },
  place: { en: 'Covers', ko: '범위' },
  date: { en: 'When', ko: '시점' },
  ask: { en: 'What does it show at region {region}?', ko: '{region} 지점에서 이 자료는 무엇을 보여 주나요?' },
  support: {
    change: { en: 'A change', ko: '변화 있음' },
    none: { en: 'No change', ko: '변화 없음' },
    silent: { en: 'Nothing: no coverage', ko: '자료 없음' },
  } satisfies Record<SupportKey, L>,
  right: { en: 'Right.', ko: '맞아요.' },
  wrong: { en: 'Look again.', ko: '다시 보세요.' },
  record: { en: 'Record your interpretation', ko: '해석을 기록하세요' },
  interpretations: {
    flood: { en: 'Possible flooding', ko: '침수 가능성' },
    existing: { en: 'Existing water, no new flooding', ko: '원래 있던 물, 새 침수 아님' },
    uncertain: { en: 'Still uncertain', ko: '아직 불확실' },
  } satisfies Record<InterpretationKey, L>,
  keep: { en: 'Keep the clue. Keep the uncertainty.', ko: '단서는 남기고, 불확실성도 남겨 두세요.' },

  /**
   * Each source, where and when it applies, and what it really shows at each
   * region (measured on the team's layers: B and C fall in both channels, A
   * does not; the reference map marks B, leaves A unmarked and stops short of C).
   */
  sources: {
    reference: {
      name: { en: 'Reference flood map', ko: '기준 침수 지도' },
      place: { en: 'Only the east of the strip', ko: '띠의 동쪽만' },
      date: { en: 'May 2020, made from Sentinel-1', ko: '2020년 5월, Sentinel-1로 제작' },
      truth: { A: 'none', B: 'change', C: 'silent' },
      note: {
        A: { en: 'It covers A and marks no new flooding: old water.', ko: 'A를 덮고 있지만 새 침수 표시는 없어요. 원래 있던 물이에요.' },
        B: { en: 'It marks part of B newly flooded, not all of it.', ko: 'B의 일부를 새 침수로 표시해요. 전부는 아니에요.' },
        C: { en: 'It stops before C. It can neither back you nor correct you.', ko: 'C에 닿기 전에 끝나요. 맞다고도 틀리다고도 할 수 없어요.' },
      },
    },
    vv: {
      name: { en: 'The other radar channel (VV)', ko: '다른 레이더 채널 (VV)' },
      place: { en: 'The whole strip', ko: '띠 전체' },
      date: { en: '16 and 22 May 2020, the same two passes', ko: '2020년 5월 16일과 22일, 같은 두 촬영' },
      truth: { A: 'none', B: 'change', C: 'change' },
      note: {
        A: { en: 'Dark on both dates in VV too.', ko: 'VV에서도 두 날 모두 어두워요.' },
        B: { en: 'The echo fell in VV too. Same satellite, same passes: a second look, not a second witness.', ko: 'VV에서도 메아리가 약해졌어요. 같은 위성, 같은 촬영이라 두 번째 증인은 아니에요.' },
        C: { en: 'The echo fell in VV too. Same satellite, same passes: a second look, not a second witness.', ko: 'VV에서도 메아리가 약해졌어요. 같은 위성, 같은 촬영이라 두 번째 증인은 아니에요.' },
      },
    },
    ground: {
      name: { en: 'Ground report or optical image', ko: '현장 보고나 광학 영상' },
      place: { en: 'None in hand', ko: '확보한 자료 없음' },
      date: { en: 'Not yet found for these dates', ko: '이 날짜의 자료를 아직 찾지 못함' },
      truth: { A: 'silent', B: 'silent', C: 'silent' },
      note: {
        A: { en: 'The team has none yet. This is the evidence still missing.', ko: '팀이 아직 구하지 못했어요. 이것이 아직 빠진 근거예요.' },
        B: { en: 'The team has none yet. This is the evidence still missing.', ko: '팀이 아직 구하지 못했어요. 이것이 아직 빠진 근거예요.' },
        C: { en: 'The team has none yet. This is the evidence still missing.', ko: '팀이 아직 구하지 못했어요. 이것이 아직 빠진 근거예요.' },
      },
    },
  } satisfies Record<
    EvidenceKey,
    { name: L; place: L; date: L; truth: Record<RegionKey, SupportKey>; note: Record<RegionKey, L> }
  >,
}

export const gaps = {
  title: { en: 'What might your map miss?', ko: '이 지도가 놓칠 수 있는 것은?' },
  how: { en: 'Pick a marker. You do not have to open them all.', ko: '표시를 골라 보세요. 전부 열 필요는 없어요.' },
  /** Positions are fractions of the map layers; `timing` has no place on the map. */
  items: {
    buildings: {
      at: { x: 0.2, y: 0.36 },
      name: { en: 'Buildings', ko: '건물' },
      text: {
        en: 'Buildings can obscure the signal. A pixel here is 30 m wide, larger than a house, and walls bounce radar in ways that hide water between them.',
        ko: '건물은 신호를 가릴 수 있어요. 이 지도의 한 픽셀은 30m로 집 한 채보다 크고, 벽이 레이더를 튕겨 그 사이의 물을 숨겨요.',
      },
    },
    plants: {
      at: { x: 0.72, y: 0.66 },
      name: { en: 'Plants', ko: '식물' },
      text: {
        en: 'Plants can complicate the return. Under this forest the signal scatters in the canopy, so water beneath it may never show as dark. Longer waves, like NISAR’s, reach further in.',
        ko: '식물은 돌아오는 신호를 복잡하게 해요. 이 숲에서는 신호가 나무에서 흩어져, 아래의 물이 어둡게 보이지 않을 수 있어요. NISAR처럼 파장이 길면 더 깊이 들어가요.',
      },
    },
    coverage: {
      at: { x: 0.6, y: 0.5 },
      name: { en: 'No reference', ko: '기준 자료 없음' },
      text: {
        en: 'West of this line there is no reference map. A change there can be seen, but not checked.',
        ko: '이 선의 서쪽에는 기준 지도가 없어요. 변화는 보이지만 확인할 수는 없어요.',
      },
    },
    timing: {
      at: null,
      name: { en: 'One moment', ko: '한순간' },
      text: {
        en: 'This view captures one time: 22 May, two days after the cyclone came ashore. Water that had already drained, or had not yet arrived, is not in it.',
        ko: '이 장면은 한 시점만 담아요. 사이클론이 상륙한 지 이틀 뒤인 5월 22일이에요. 이미 빠진 물도, 아직 오지 않은 물도 여기 없어요.',
      },
    },
  } satisfies Record<GapKey, { at: { x: number; y: number } | null; name: L; text: L }>,
}

export const nextSteps = {
  title: { en: 'You have a clue. What happens next?', ko: '단서가 생겼어요. 다음은 무엇일까요?' },
  lead: { en: 'Choose a next step for your briefing', ko: '브리핑에 넣을 다음 단계를 고르세요' },
  needs: { en: 'Still needed', ko: '아직 필요한 것' },
  options: {
    map: {
      name: { en: 'Map the change', ko: '변화를 지도로' },
      line: { en: 'Compare observations and check possible flood extent.', ko: '관측을 비교해 침수 가능 범위를 확인해요.' },
      response: { en: 'Keep the uncertain areas visible.', ko: '불확실한 곳도 지도에 남겨 두세요.' },
      needs: [
        { en: 'A check that is not radar, for the west of the strip', ko: '띠의 서쪽을 확인할, 레이더가 아닌 자료' },
        { en: 'A pass closer to the flood peak', ko: '홍수 정점에 더 가까운 촬영' },
      ],
    },
    warn: {
      name: { en: 'Support warnings', ko: '경보를 돕기' },
      line: { en: 'Combine forecasts, river levels, and trusted local information.', ko: '예보와 강 수위, 믿을 수 있는 지역 정보를 함께 써요.' },
      response: { en: 'A map is one piece of the warning.', ko: '지도는 경보의 한 조각이에요.' },
      needs: [
        { en: 'Forecasts', ko: '기상 예보' },
        { en: 'River levels', ko: '강 수위' },
        { en: 'Local reports', ko: '지역의 보고' },
      ],
    },
    plan: {
      name: { en: 'Plan for future floods', ko: '다음 홍수에 대비' },
      line: { en: 'Explore locally suitable floodplain and wetland protection.', ko: '그 지역에 맞는 범람원과 습지 보호를 살펴봐요.' },
      response: { en: 'The right measure depends on the place.', ko: '알맞은 대책은 장소마다 달라요.' },
      needs: [
        { en: 'Where water could be given room: land use and elevation', ko: '물에 자리를 내줄 수 있는 곳: 토지 이용과 고도' },
        { en: 'What the people who live there say', ko: '그곳에 사는 사람들의 이야기' },
      ],
    },
  } satisfies Record<NextStepKey, { name: L; line: L; response: L; needs: L[] }>,
}
