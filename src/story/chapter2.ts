import type { ScriptScene } from './script'

/**
 * Chapter 2 – Observation.
 * How radar sees water, the team's radar analysis, the solution cards, and
 * the research files. Edit lines and their order here; see ./types.ts for
 * what each step does. Every line needs both languages.
 */
export const chapter2: ScriptScene[] = [
  {
    id: 'observation',
    steps: [
      { ui: false },
      { music: 'ambience' },
      { bg: 'space' },
      { camera: 'earth' },
      { chapter: { number: 2, title: { en: 'Observation', ko: '관측' } } },
      { wait: 2600 },
      { chapter: null },
      { bg: 'amphanSwath' },
      { ui: true },
      { say: { en: "Here's what we found from above.", ko: '위에서 찾아낸 걸 보여 드릴게요.' } },
      // Added to the plan's lines: chapter 1 was in Nepal, so say where this is.
      {
        say: {
          en: 'This is southwestern Bangladesh in May 2020. Cyclone Amphan came ashore between these two radar passes.',
          ko: '여기는 2020년 5월의 방글라데시 남서부예요. 두 번의 레이더 촬영 사이에 사이클론 암판이 상륙했어요.',
        },
      },
      {
        say: {
          en: 'These observations show the area before and after the flood.',
          ko: '이 관측 자료는 홍수 전과 후의 모습을 보여 줘요.',
        },
      },
      {
        say: {
          en: 'They use something called SAR: a kind of radar that can observe Earth through clouds, day or night.',
          ko: '여기에 쓰인 건 SAR라는 레이더예요. 낮이든 밤이든 구름을 뚫고 지구를 볼 수 있어요.',
        },
      },

      // Added: how to read a radar image, before showing one to explore.
      { bg: 'radarLesson' },
      { lesson: 'send' },
      {
        say: {
          en: 'A radar satellite does not wait for sunlight. It sends its own signal down and listens for the echo.',
          ko: '레이더 위성은 햇빛을 기다리지 않아요. 직접 신호를 쏘고, 돌아오는 메아리를 들어요.',
        },
      },
      { lesson: 'dry' },
      {
        say: {
          en: 'Dry, rough ground scatters the signal in every direction, so part of it comes back. The radar sees that as bright.',
          ko: '마르고 울퉁불퉁한 땅은 신호를 사방으로 흩뜨려서 일부가 되돌아와요. 레이더에는 밝게 보여요.',
        },
      },
      { lesson: 'wet' },
      {
        say: {
          en: 'Calm water works like a mirror and bounces the signal away. Almost nothing comes back, so it looks dark.',
          ko: '잔잔한 물은 거울처럼 신호를 다른 쪽으로 튕겨 내요. 돌아오는 게 거의 없어서 어둡게 보여요.',
        },
      },
      { lesson: 'compare' },
      {
        say: {
          en: 'So when a place turns darker between two passes, water may have arrived there.',
          ko: '그래서 두 번의 촬영 사이에 어두워진 곳은 물이 들어찼을 가능성이 있어요.',
        },
        pace: 'slow',
      },

      { bg: 'amphanSwath' },
      {
        say: {
          en: 'By comparing the two, we can look for places where water appears to have spread.',
          ko: '이렇게 둘을 비교하면 물이 퍼진 것으로 보이는 곳을 찾을 수 있어요.',
        },
      },
      {
        say: {
          en: 'You can always come back by pressing X on the top right.',
          ko: '오른쪽 위의 X를 누르면 언제든 돌아올 수 있어요.',
        },
        button: { label: { en: 'Open the map', ko: '지도 열기' }, at: 'corner' },
      },
      { open: 'map' },
    ],
  },
  {
    id: 'solutions',
    steps: [
      { bg: 'space' },
      { camera: 'earth' },
      { say: { en: 'Seeing the flood is just the first part.', ko: '홍수를 보는 건 시작일 뿐이에요.' } },
      {
        say: {
          en: 'The next part is figuring out how to reduce the damage.',
          ko: '다음은 피해를 어떻게 줄일지 찾는 일이에요.',
        },
        button: { label: { en: 'See the ideas', ko: '아이디어 보기' }, at: 'center' },
      },
      { open: 'cards' },
      {
        say: {
          en: 'No single action can solve the problem, but together they can make a difference.',
          ko: '한 가지 방법만으로는 해결할 수 없지만, 함께라면 달라질 수 있어요.',
        },
        pace: 'slow',
        button: { label: { en: 'Continue', ko: '계속' }, at: 'corner' },
      },
    ],
  },
  {
    id: 'deeper-observations',
    steps: [
      { say: { en: "There's more to the story.", ko: '이야기는 여기서 끝이 아니에요.' } },
      {
        say: {
          en: 'Researchers use satellite data to study when floods happen and how water moves across the land.',
          ko: '연구자들은 위성 자료로 홍수가 언제 일어나고 물이 땅 위를 어떻게 움직이는지 연구해요.',
        },
      },
      { say: { en: 'But every observation has limits.', ko: '하지만 모든 관측에는 한계가 있어요.' }, pace: 'slow' },
      {
        say: {
          en: 'Buildings and plants can make floodwater hard to detect, and a satellite can only show us what it observed at a particular time.',
          ko: '건물과 식물은 물을 알아보기 어렵게 만들고, 위성은 지나가는 그 순간에 본 것만 보여 줄 수 있어요.',
        },
      },
      {
        say: {
          en: 'So we compare what we see with other information, and keep asking questions.',
          ko: '그래서 우리는 본 것을 다른 정보와 비교하고, 계속 질문해요.',
        },
        button: { label: { en: 'Open the files', ko: '파일 열기' }, at: 'center' },
      },
      { open: 'files' },
    ],
  },
]
