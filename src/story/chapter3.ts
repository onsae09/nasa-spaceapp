import { chapterTitles } from './titles'
import type { ScriptScene } from './script'

/**
 * Chapter 3 – Choose the next step.
 * The visitor chooses a next step for their case, sees why warning time is
 * what saves people, then the team's ideas, the files behind the story with
 * their games, and the hand-over.
 *
 * The evidence is the team's own: the Texas figures, the 35 km,
 * the warning-time sum and the five ideas are from the solutions paper
 * (data/Wave_of_Change_Flood_Solutions.pdf, sections 1, 3.2 and 4).
 *
 * Every line needs both languages and at most 12 English words.
 */
export const chapter3: ScriptScene[] = [
  {
    id: 'choose',
    chapter: 3,
    steps: [
      { ui: false },
      { music: 'theme' },
      { bg: 'space' },
      { camera: 'earth' },
      { chapter: { number: 3, title: chapterTitles[3] } },
      { wait: 1600 },
      { chapter: null },
      { ui: true },
      { sara: { show: true, pose: 'present' } },
      // Page 8 of the plan: three next steps, face up.
      {
        say: {
          en: 'You have a clue. What happens next?',
          ko: '단서가 생겼어요. 다음은 무엇일까요?',
        },
        button: { label: { en: 'Choose a next step', ko: '다음 단계 고르기' }, at: 'center' },
      },
      { open: 'steps' },
    ],
  },
  {
    id: 'window',
    chapter: 3,
    steps: [
      { bg: 'space' },
      { sara: { pose: 'present' } },
      {
        say: {
          en: "A map alone can't keep people safe. Warning time can.",
          ko: '지도만으로는 사람을 지킬 수 없어요. 경보 시간이 지켜요.',
        },
      },
      { fact: 'texas' },
      { sara: { pose: 'idle' } },
      {
        say: {
          en: 'Texas, July 2025: 136 dead. July 2026, with sirens: 2.',
          ko: '텍사스 2025년 7월 136명 사망. 사이렌을 단 이듬해엔 2명.',
        },
        pace: 'slow',
      },
      { fact: null },
      // The visitor works the team's warning-time sum for the Nepal case.
      { bg: 'warningWindow' },
      { sara: { pose: 'think' } },
      {
        do: 'window',
        say: {
          en: "Nepal's flood began about 35 km upstream. Buy the village 15 minutes.",
          ko: '네팔 홍수는 약 35km 상류에서 시작됐어요. 15분을 벌어 주세요.',
        },
      },
      { sara: { pose: 'present' } },
      {
        say: {
          en: 'Ten minutes back at every speed, with no one in the loop.',
          ko: '어떤 속도에서도 10분을 되찾아요. 사람 손을 거치지 않고요.',
        },
      },
      { bg: 'space' },
      { sara: { pose: 'idle' } },
      {
        say: {
          en: 'Five ideas from the team. Turn them over.',
          ko: '팀이 낸 다섯 가지 아이디어예요. 뒤집어 보세요.',
        },
        button: { label: { en: 'See the ideas', ko: '아이디어 보기' }, at: 'center' },
      },
      { open: 'cards' },
    ],
  },
  {
    id: 'briefing',
    chapter: 3,
    steps: [
      {
        say: {
          en: 'Three files stand behind your case. Open one, or play.',
          ko: '당신의 사건 뒤에는 파일 세 개가 있어요. 열거나 놀아 보세요.',
        },
        button: { label: { en: 'Open the files', ko: '파일 열기' }, at: 'center' },
      },
      { open: 'files' },
      { sara: { pose: 'present' } },
      {
        say: {
          en: 'Someone has to read the map, share it, and act.',
          ko: '누군가는 지도를 읽고, 알리고, 행동해야 해요.',
        },
        pace: 'slow',
      },
      { sara: { pose: 'wave' } },
      {
        say: { en: 'So, are you ready to take over?', ko: '이제 이어받을 준비가 됐나요?' },
        button: { label: { en: "I'm ready", ko: '준비됐어요' }, at: 'center' },
      },
    ],
  },
]
