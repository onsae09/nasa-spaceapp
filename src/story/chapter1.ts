import type { L } from '../i18n'
import type { ScriptScene } from './script'

/** Placeholder until the team picks a name. */
export const CHARACTER_NAME: L = { en: 'SARA', ko: '사라' }

/**
 * Chapter 1 – Introduction.
 * Edit lines and their order here; see ./types.ts for what each step does.
 * Every line needs both languages.
 */
export const chapter1: ScriptScene[] = [
  {
    id: 'character-intro',
    steps: [
      { bg: 'space' },
      { camera: 'far' },
      { music: 'ambience' },
      { ui: true },
      {
        say: { en: `Hello! I'm ${CHARACTER_NAME.en}!`, ko: `안녕하세요! 저는 ${CHARACTER_NAME.ko}예요!` },
        pace: 'quick',
      },
      // The camera closes in on Earth as she mentions it.
      { camera: 'earth' },
      {
        say: {
          en: "I've been keeping an eye on Earth from up here.",
          ko: '저는 이 위에서 지구를 쭉 지켜보고 있었어요.',
        },
      },
      { say: { en: 'And you must be the one taking over.', ko: '이제 당신이 이어받을 차례인가 봐요.' } },
      {
        say: { en: "Come on, let me show you what I've found.", ko: '자, 제가 찾아낸 걸 보여 드릴게요.' },
        button: { label: { en: "Let's start", ko: '시작하기' }, at: 'center' },
      },
    ],
  },
  {
    id: 'trigger-line',
    steps: [
      // Fall from orbit into the flood: the music cuts, the screen whites out,
      // and the photo is left alone in silence before anyone speaks.
      { ui: false },
      { music: 'silence' },
      { camera: 'dive' },
      { wait: 1800 },
      { bg: 'nepalFlood' },
      { wait: 3000 },
      { ui: true },
      { music: 'theme' },
      {
        say: {
          en: 'What if the water that gives us life becomes the reason we lose our homes and our lives?',
          ko: '우리에게 생명을 주는 물이, 집과 목숨을 앗아 가는 이유가 된다면 어떨까요?',
        },
        pace: 'slow',
      },
      {
        say: {
          en: 'Just like we can see from the recent flood in Nepal.',
          ko: '최근 네팔에서 일어난 홍수가 바로 그랬어요.',
        },
      },
      { fact: 'nepalToll' },
      {
        say: {
          en: 'It caused at least 1,455 deaths and left 5,285 people missing in Nepal alone, and there are more victims in the Tibet Autonomous Region of China.',
          ko: '네팔에서만 최소 1,455명이 숨지고 5,285명이 실종됐고, 중국 티베트 자치구에서도 희생자가 나왔어요.',
        },
        pace: 'slow',
      },
      {
        say: {
          en: 'This is how countless families lost their loved ones and their everyday lives.',
          ko: '수많은 가족이 이렇게 사랑하는 사람과 평범한 일상을 잃었어요.',
        },
        pace: 'slow',
      },
      { fact: null },
      { triptych: ['bangladesh', 'india', 'us'] },
      {
        say: {
          en: "It's not just this flood… Many other floods have repeatedly devastated different parts of the world!",
          ko: '이 홍수만이 아니에요… 세계 곳곳이 홍수로 거듭 큰 피해를 입어 왔어요!',
        },
      },
    ],
  },
  {
    id: 'the-problem',
    steps: [
      { bg: 'space' },
      { camera: 'earth' },
      { say: { en: "Floods don't just leave water behind.", ko: '홍수는 물만 남기고 가지 않아요.' } },
      { bg: 'brokenCity' },
      {
        say: {
          en: 'They can damage homes, cut off roads, and keep people from getting the help they need.',
          ko: '집을 무너뜨리고, 길을 끊고, 사람들이 도움을 받지 못하게 만들어요.',
        },
      },
      // Back above Nepal. Cloud closes over the valley as she says it is hard
      // to see; then a radar sweep clears it, which is what chapter 2 is about.
      { bg: 'nepalFlood' },
      { cover: 'clouds' },
      {
        say: {
          en: "And when the rain doesn't stop, it can be difficult to see where the water has spread.",
          ko: '비가 그치지 않으면 물이 어디까지 퍼졌는지 알기도 어려워요.',
        },
      },
      { cover: 'scan' },
      {
        say: { en: "That's why we need a better view.", ko: '그래서 우리에겐 더 잘 볼 방법이 필요해요.' },
        pace: 'slow',
        button: { label: { en: 'Continue', ko: '계속' }, at: 'corner' },
      },
    ],
  },
]
