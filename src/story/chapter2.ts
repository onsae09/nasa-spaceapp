import { chapterTitles } from './titles'
import type { ScriptScene } from './script'

const same = (text: string) => ({ en: text, ko: text })

/**
 * Chapter 2 – Follow the signal.
 * The visitor fires the radar at dry ground and at water, guesses what comes
 * back, then reads the team's Cyclone Amphan change map and guesses how far
 * to trust it. Every figure is from src/content/analysis.ts.
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
      { look: 'whole' },
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
          en: 'Now draw one cut-off. Of 10 places flagged, how many flooded?',
          ko: '기준선을 하나 그어요. 짚은 10곳 중 몇 곳이 잠겼을까요?',
        },
        options: [same('9'), same('5'), same('1')],
        answer: 2,
      },
      { fact: 'oneInTen' },
      { sara: { pose: 'alarm' } },
      {
        say: {
          en: 'About 1. The other nine were not flooded in the reference map.',
          ko: '1곳쯤이에요. 나머지 아홉 곳은 기준 지도에서 잠기지 않았어요.',
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
          en: 'Radar gives you a lead, not a verdict. Look closer.',
          ko: '레이더는 단서를 줄 뿐 판결은 아니에요. 더 가까이 봐요.',
        },
        button: { label: { en: 'Explore the map', ko: '지도 살펴보기' }, at: 'corner' },
      },
      { open: 'map' },
      { bg: 'space' },
      { camera: 'earth' },
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
