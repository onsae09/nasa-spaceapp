/**
 * The small games behind the research files' Play buttons. All three are
 * simplified illustrations, and say so on screen; none uses measured data.
 */
export type GameKey = 'spot' | 'sprint' | 'pass'

export const games = {
  play: { en: 'Play', ko: '해 보기' },
  back: { en: 'Return to file', ko: '파일로 돌아가기' },
  again: { en: 'Play again', ko: '다시 하기' },
  illustration: { en: 'A simplified illustration, not measured data', ko: '설명을 위한 단순화된 그림이며 측정 자료가 아닙니다' },

  /** File 01: find what changed between two grids. */
  spot: {
    title: { en: 'Spot the change', ko: '달라진 곳 찾기' },
    lead: {
      en: 'Three squares went dark between the two passes. Find them in the later one.',
      ko: '두 촬영 사이에 세 칸이 어두워졌어요. 나중 촬영에서 찾아보세요.',
    },
    before: { en: 'Before', ko: '전' },
    after: { en: 'After', ko: '후' },
    cell: { en: 'Row {row}, column {column}', ko: '{row}행 {column}열' },
    found: { en: 'Found {count} of 3', ko: '3곳 중 {count}곳 찾음' },
    river: { en: 'That one was already dark before: a river, not a flood.', ko: '거긴 전에도 어두웠어요. 홍수가 아니라 강이에요.' },
    same: { en: 'No change there. Compare it with the earlier pass.', ko: '거긴 달라지지 않았어요. 앞선 촬영과 비교해 보세요.' },
    hit: { en: 'Bright before, dark after. That is a change.', ko: '전에는 밝고 후에는 어두워요. 달라진 곳이에요.' },
    done: {
      en: 'All three found, and the river ruled out. One image shows a day; two show a change.',
      ko: '세 곳을 모두 찾고 강은 가려냈어요. 한 장은 하루를, 두 장은 변화를 보여 줘요.',
    },
  },

  /** File 02: Satellite Signal Sprint, from the story plan. */
  sprint: {
    title: { en: 'Satellite Signal Sprint', ko: '위성 신호 스프린트' },
    intro: {
      en: 'Incoming mission! Clouds are covering the area, and people need a better view. You have 90 seconds to solve as many observation problems as you can.',
      ko: '임무 수신! 구름이 지역을 덮었고, 사람들에겐 더 나은 시야가 필요해요. 90초 동안 관측 문제를 최대한 많이 풀어 보세요.',
    },
    start: { en: 'Ready', ko: '준비 완료' },
    time: { en: 'Time', ko: '시간' },
    score: { en: 'Score', ko: '점수' },
    mission: { en: 'Mission', ko: '임무' },
    next: { en: 'Next mission', ko: '다음 임무' },
    finish: { en: 'See the result', ko: '결과 보기' },
    complete: { en: 'Mission complete', ko: '임무 완료' },
    solved: { en: 'You solved {score} observation problems!', ko: '관측 문제 {score}개를 풀었어요!' },
    closing: { en: 'Every image is a clue. Keep comparing and asking questions!', ko: '모든 영상은 단서예요. 계속 비교하고 질문하세요!' },
    missions: [
      {
        ask: {
          en: 'A storm has covered the ground in thick clouds. Which tool can still observe the area?',
          ko: '폭풍이 두꺼운 구름으로 땅을 덮었어요. 그래도 이 지역을 볼 수 있는 도구는?',
        },
        options: [
          { en: 'Optical camera', ko: '광학 카메라' },
          { en: 'SAR', ko: 'SAR' },
        ],
        answer: 1,
        right: { en: 'Signal received! SAR can observe through clouds.', ko: '신호 수신! SAR는 구름을 뚫고 볼 수 있어요.' },
        wrong: {
          en: 'An optical camera needs a clear enough view. Try the tool that sends radar signals.',
          ko: '광학 카메라는 시야가 트여야 해요. 레이더 신호를 보내는 도구를 골라 보세요.',
        },
      },
      {
        ask: {
          en: 'A lake is dark in both the before and the after image. Did this dark area necessarily flood during the event?',
          ko: '호수가 전후 영상 모두에서 어두워요. 이 어두운 곳은 이번에 꼭 잠긴 걸까요?',
        },
        options: [
          { en: 'Yes', ko: '네' },
          { en: 'No', ko: '아니요' },
        ],
        answer: 1,
        right: { en: 'Exactly! It was already dark before the flood.', ko: '맞아요! 홍수 전에도 이미 어두웠어요.' },
        wrong: { en: 'Think again.', ko: '다시 생각해 보세요.' },
      },
      {
        ask: {
          en: 'The satellite passes over the area at night. Can SAR still collect an observation?',
          ko: '위성이 밤에 이 지역 위를 지나가요. SAR는 그래도 관측할 수 있을까요?',
        },
        options: [
          { en: 'Yes', ko: '네' },
          { en: 'No', ko: '아니요' },
        ],
        answer: 0,
        right: { en: 'Yes! SAR does not depend on sunlight.', ko: '네! SAR는 햇빛에 기대지 않아요.' },
        wrong: { en: 'Think again.', ko: '다시 생각해 보세요.' },
      },
      {
        ask: {
          en: 'A field is bright on the first pass and dark on the second. What is the best reading?',
          ko: '들판이 첫 촬영에서는 밝고 두 번째에서는 어두워요. 가장 알맞은 해석은?',
        },
        options: [
          { en: 'It flooded, for certain', ko: '확실히 잠겼다' },
          { en: 'It may have flooded', ko: '잠겼을 수 있다' },
        ],
        answer: 1,
        right: { en: 'Right. It is a lead worth checking, not a verdict.', ko: '맞아요. 판결이 아니라 확인해 볼 단서예요.' },
        wrong: { en: 'Darkness alone does not establish flooding. Think again.', ko: '어두움만으로 침수가 확정되진 않아요. 다시 생각해 보세요.' },
      },
      {
        ask: {
          en: 'A flood peaks and drains between two satellite passes. Will the images show its full extent?',
          ko: '두 번의 촬영 사이에 홍수가 정점을 찍고 빠졌어요. 영상에 전체 범위가 담길까요?',
        },
        options: [
          { en: 'Yes', ko: '네' },
          { en: 'No', ko: '아니요' },
        ],
        answer: 1,
        right: { en: 'Right. An image records one moment.', ko: '맞아요. 영상은 한순간의 기록이에요.' },
        wrong: { en: 'Think again.', ko: '다시 생각해 보세요.' },
      },
      {
        ask: {
          en: 'Calm open water bounces radar away from the satellite. How does it look in the image?',
          ko: '잔잔한 물은 레이더를 위성 반대쪽으로 튕겨요. 영상에서는 어떻게 보일까요?',
        },
        options: [
          { en: 'Dark', ko: '어둡게' },
          { en: 'Bright', ko: '밝게' },
        ],
        answer: 0,
        right: { en: 'Dark. Little of the signal comes home.', ko: '어둡게 보여요. 돌아오는 신호가 거의 없어요.' },
        wrong: { en: 'Think again.', ko: '다시 생각해 보세요.' },
      },
    ],
  },

  /** File 03: when the satellite passes decides what it sees. */
  pass: {
    title: { en: 'Catch the peak', ko: '정점을 잡아라' },
    lead: {
      en: 'A satellite passes every six days. Slide the first pass and see how much of the flood its images catch.',
      ko: '위성은 엿새마다 지나가요. 첫 촬영 날짜를 움직여, 영상이 홍수를 얼마나 담는지 보세요.',
    },
    slider: { en: 'Day of the first pass', ko: '첫 촬영 날짜' },
    day: { en: 'Day', ko: '일차' },
    pass: { en: 'Pass', ko: '촬영' },
    extent: { en: 'Flooded area', ko: '침수 면적' },
    caught: { en: 'of the peak flood is in the best image', ko: '가장 잘 찍힌 영상에 담긴 정점 침수의 비율' },
    good: {
      en: 'Close to the peak. A real satellite does not get to choose its day.',
      ko: '정점에 가까워요. 하지만 실제 위성은 날짜를 고를 수 없어요.',
    },
    poor: {
      en: 'The peak fell between passes. The map would show less flood than there was.',
      ko: '정점이 촬영 사이에 지나갔어요. 지도에는 실제보다 적은 홍수가 담겨요.',
    },
  },
} satisfies Record<string, unknown>

/** The flood in the pass game: dry until day 3, peak on day 4.5, drained by day 9. */
export function floodExtent(day: number): number {
  if (day <= 3) return 0
  if (day <= 4.5) return (day - 3) / 1.5
  return Math.max(0, 1 - (day - 4.5) / 4.5)
}

export const PASS = { days: 12, revisit: 6 }

/** The most flood any pass sees, with passes every `revisit` days from `first`. */
export function bestPass(first: number): number {
  let best = 0
  for (let day = first; day <= PASS.days; day += PASS.revisit) best = Math.max(best, floodExtent(day))
  return best
}

/**
 * The grids of the spot game: how bright each square is on each pass, 0 to 1.
 * A river runs dark down both; three fields turn dark on the second pass.
 */
const ROWS = 5
const COLUMNS = 7
const RIVER = [2, 2, 3, 3, 4]
export const FLOODED: [number, number][] = [
  [1, 1],
  [2, 4],
  [4, 2],
]

const speckle = (row: number, column: number, pass: number) =>
  0.62 + 0.3 * (((row * 37 + column * 17 + pass * 11) % 10) / 10)

export const spotGrid = Array.from({ length: ROWS }, (_, row) =>
  Array.from({ length: COLUMNS }, (_, column) => {
    const river = RIVER[row] === column
    const flooded = FLOODED.some(([r, c]) => r === row && c === column)
    return {
      river,
      flooded,
      before: river ? 0.08 : speckle(row, column, 0),
      after: river || flooded ? 0.1 : speckle(row, column, 1),
    }
  }),
)
