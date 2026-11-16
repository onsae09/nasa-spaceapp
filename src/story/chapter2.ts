import { chapterTitles } from './titles'
import type { ScriptScene } from './script'

const same = (text: string) => ({ en: text, ko: text })

/**
 * Chapter 2 – Follow the signal.
 * The visitor fires the radar at dry ground and at water, guesses what comes
 * back, then reads the team's two radar passes over Cyclone Amphan, guesses
 * how far to trust a flag, and judges three places on the map themselves. Every figure is from src/content/analysis.ts.
 * It ends on two NISAR passes over Tibetan lakes (src/content/nisar.ts).
 *
 * Edit lines and their order here; see ./types.ts for what each step does.
 * Every line needs both languages and at most 12 English words.
 */
export const chapter2: ScriptScene[] = [
  {
    id: 'echo',
    chapter: 2,
    steps: [
      { ui: false },
      { music: 'ambience' },
      { bg: 'space' },
      { camera: 'earth' },
      { chapter: { number: 2, title: chapterTitles[2] } },
      { wait: 1600 },
      { chapter: null },
      { bg: 'radarLesson' },
      { lesson: 'send' },
      { ui: true },
      { sara: { show: true, pose: 'idle', point: 'satellite' } },
      {
        say: {
          en: 'This is your radar. It makes its own light.',
          ko: '이게 당신의 레이더예요. 스스로 빛을 쏴요.',
        },
      },
      { sara: { point: 'ground' } },
      { do: 'pulse', say: { en: 'Fire a pulse at dry ground.', ko: '마른 땅에 신호를 쏴 보세요.' } },
      { lesson: 'dry' },
      { sara: { point: 'tile' } },
      {
        say: {
          en: 'Rough ground scatters it. Part comes back. You see bright.',
          ko: '거친 땅은 신호를 흩뜨려요. 일부가 돌아와 밝게 보여요.',
        },
      },
      { lesson: 'flood' },
      { sara: { pose: 'think', point: null } },
      {
        do: 'choice',
        say: { en: 'Now the field floods. What will you see?', ko: '이제 들판이 물에 잠겨요. 어떻게 보일까요?' },
        options: [
          { en: 'Brighter', ko: '더 밝게' },
          { en: 'Darker', ko: '더 어둡게' },
        ],
        answer: 1,
      },
      { sara: { pose: 'idle', point: 'ground' } },
      { do: 'pulse', say: { en: 'Fire again.', ko: '다시 쏴 보세요.' } },
      { lesson: 'wet' },
      { sara: { pose: 'alarm', point: null } },
      {
        say: {
          en: 'Nothing came home. Calm water is a mirror. Dark.',
          ko: '아무것도 안 돌아와요. 잔잔한 물은 거울, 어두워요.',
        },
      },
      { lesson: 'compare' },
      { sara: { pose: 'idle', point: 'tiles' } },
      {
        say: { en: 'So you hunt for ground that went dark.', ko: '그러니 어두워진 땅을 찾으면 돼요.' },
        pace: 'slow',
      },
    ],
  },
  {
    id: 'hunt',
    chapter: 2,
    steps: [
      { bg: 'amphanSwath' },
      // Chapter 1 was in Nepal; say plainly that this map is somewhere else.
      {
        say: {
          en: 'No radar of that valley here yet. Try Bangladesh, May 2020.',
          ko: '그 계곡의 레이더는 아직 없어요. 2020년 5월 방글라데시로 가요.',
        },
      },
      { look: 'after' },
      { sara: { point: 'stamp' } },
      {
        say: {
          en: 'Two passes, six days apart. Cyclone Amphan struck between them.',
          ko: '엿새 간격의 두 번 촬영. 그 사이 사이클론 암판이 덮쳤어요.',
        },
      },
      { look: 'patch' },
      { sara: { point: 'patch' } },
      {
        say: {
          en: 'Cyan marks land another team mapped as newly flooded.',
          ko: '청록색은 다른 연구팀이 새로 잠겼다고 표시한 땅이에요.',
        },
      },
      { look: 'marked' },
      { sara: { pose: 'present', point: null } },
      {
        say: {
          en: 'One flooded spot, one not. Radar ranks them right 88 in 100.',
          ko: '잠긴 곳 하나, 안 잠긴 곳 하나. 레이더는 100번 중 88번 맞혀요.',
        },
      },
      // The honest limit, as a guess the visitor makes before seeing it.
      { sara: { pose: 'think' } },
      {
        do: 'choice',
        say: {
          en: 'Radar flags 10 places as flooded. How many really are?',
          ko: '레이더가 10곳을 침수로 짚었어요. 실제로는 몇 곳일까요?',
        },
        options: [same('9'), same('5'), same('1')],
        answer: 2,
      },
      { fact: 'oneInTen' },
      { sara: { pose: 'alarm' } },
      {
        say: {
          en: 'About 1. The reference map shows the other nine dry.',
          ko: '1곳쯤이에요. 나머지 아홉 곳은 기준 지도에서 마른 땅이에요.',
        },
      },
      { sara: { pose: 'idle' } },
      {
        say: {
          en: 'And that reference map is Sentinel-1 too. A comparison, not proof.',
          ko: '그 기준 지도도 Sentinel-1이에요. 증명이 아닌 비교예요.',
        },
      },
      { fact: null },
      { sara: { point: 'map' } },
      {
        say: {
          en: 'A lead, not a verdict. Three places need your call.',
          ko: '단서일 뿐 판결은 아니에요. 세 곳을 직접 판단해 보세요.',
        },
        button: { label: { en: 'Open the evidence', ko: '근거 살펴보기' }, at: 'corner' },
      },
      { open: 'map' },
      // Page 6 of the plan: hold other evidence against the region they took forward.
      { sara: { pose: 'think', point: null } },
      {
        say: {
          en: 'A claim needs a second source. Check its place and time.',
          ko: '판단에는 두 번째 근거가 필요해요. 장소와 시점을 확인하세요.',
        },
        button: { label: { en: 'Check the evidence', ko: '근거 대조하기' }, at: 'corner' },
      },
      { open: 'clues' },
    ],
  },
  {
    id: 'limits',
    chapter: 2,
    steps: [
      // Why no rule settles it: the team's histogram, with a cut-off to drag.
      { bg: 'evidence' },
      { sara: { pose: 'think' } },
      {
        do: 'cutoff',
        say: {
          en: 'Orange is flooded land, blue is not. Drag one line between them.',
          ko: '주황은 잠긴 땅, 파랑은 아닌 땅. 선 하나로 갈라 보세요.',
        },
      },
      { sara: { pose: 'idle' } },
      {
        say: {
          en: 'They overlap. Catch more floods, and you flag more dry land.',
          ko: '둘은 겹쳐요. 홍수를 더 잡으려 하면 마른 땅도 더 짚게 돼요.',
        },
      },
      // Page 7: what the map itself can miss.
      {
        say: {
          en: 'Buildings, trees and timing leave gaps too.',
          ko: '건물과 나무, 촬영 시점도 빈틈을 남겨요.',
        },
        button: { label: { en: 'Show the gaps', ko: '빈틈 보기' }, at: 'corner' },
      },
      { open: 'gaps' },
      { bg: 'space' },
      { camera: 'earth' },
      // The challenge's own satellite: two NISAR passes, and the team's run on its archive.
      { sara: { pose: 'present' } },
      {
        say: {
          en: 'One more radar: NISAR. Longer waves, a new pass every 12 days.',
          ko: '레이더 하나 더, NISAR예요. 더 긴 파장으로 12일마다 찍어요.',
        },
        button: { label: { en: 'Ask NISAR', ko: 'NISAR에게 묻기' }, at: 'center' },
      },
      { open: 'nisar' },
      { sara: { pose: 'wave' } },
      {
        say: {
          en: 'Next time cloud hides a flood, you know where to look.',
          ko: '다음에 구름이 홍수를 가리면, 어디를 볼지 알 거예요.',
        },
        pace: 'slow',
      },
    ],
  },
]
