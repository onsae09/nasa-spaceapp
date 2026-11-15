import type { ScriptScene } from './script'

/**
 * Chapter 1 – Hidden in plain sight.
 * No greeting: the visitor falls straight into the flood, loses it under
 * cloud, and clears the cloud with radar themselves before Sara appears.
 * It ends at the investigation desk, where their case is waiting.
 *
 * Edit lines and their order here; see ./types.ts for what each step does.
 * Every line needs both languages, and the tests hold each one to 12 English
 * words, so keep them short.
 */
export const chapter1: ScriptScene[] = [
  {
    id: 'missed',
    chapter: 1,
    steps: [
      // Fall from orbit into the flood.
      { bg: 'space' },
      { camera: 'dive' },
      { ui: false },
      { music: 'silence' },
      { wait: 1800 },
      { bg: 'nepalFlood' },
      { wait: 1000 },
      { ui: true },
      { music: 'theme' },
      {
        say: {
          en: '26 August 2026. Rasuwa, Nepal. A flash flood fills this valley.',
          ko: '2026년 8월 26일, 네팔 라수와. 돌발 홍수가 계곡을 덮쳤어요.',
        },
      },
      { fact: 'nepalToll' },
      { say: { en: '1,455 dead. 5,285 still missing.', ko: '사망 1,455명. 실종 5,285명.' }, pace: 'slow' },
      { fact: null },
      { cover: 'clouds' },
      { say: { en: 'From orbit, a camera gets cloud.', ko: '궤도의 카메라에는 구름만 찍혀요.' } },
      // The visitor drags the radar beam across; the cloud clears behind it.
      { do: 'sweep', say: { en: 'Here is what the world missed.', ko: '세상이 놓친 장면이 여기 있어요.' } },
      { cover: null },
      { sara: { show: true, pose: 'wave', point: 'valley' } },
      {
        say: {
          en: "You just looked through cloud. I'm Sara. That was radar.",
          ko: '방금 구름을 뚫고 봤어요. 저는 사라, 그게 레이더예요.',
        },
      },
    ],
  },
  {
    id: 'reminder',
    chapter: 1,
    steps: [
      // The only two sentimental lines; the photographs carry them.
      { triptych: ['bangladesh', 'india', 'us'] },
      { sara: { pose: 'idle' } },
      {
        say: {
          en: 'The water that gives us life also takes it.',
          ko: '생명을 주는 물이 생명을 앗아 가기도 해요.',
        },
        pace: 'slow',
      },
      { bg: 'brokenCity' },
      { say: { en: 'Floods are a reminder of that.', ko: '홍수는 그 사실을 일깨워요.' }, pace: 'slow' },
      // The investigation desk: the case the visitor will work, with its notes still empty.
      { bg: 'desk' },
      { sara: { pose: 'present' } },
      {
        say: {
          en: 'Your case: two radar views, six days apart. One patch changed.',
          ko: '당신의 사건: 엿새 간격의 레이더 두 장. 한 곳이 달라졌어요.',
        },
      },
      { sara: { pose: 'idle' } },
      {
        say: {
          en: "You'll choose what to investigate. First, learn to read radar.",
          ko: '무엇을 조사할지는 당신이 골라요. 먼저 레이더 읽는 법부터.',
        },
        button: { label: { en: 'Take the controls', ko: '직접 해 보기' }, at: 'corner' },
      },
    ],
  },
]
