import { chapterTitles } from './titles'
import type { ScriptScene } from './script'

/**
 * Chapter 3 – Choose the next step.
 * What the map cannot tell you, why warning time is what saves people, the
 * team's ideas and the papers behind the story, and the hand-over.
 *
 * The evidence is the team's own: the chart of flooded and other pixels is
 * from the Amphan analysis (data/amphan), and the Texas figures, the 35 km,
 * the warning-time sum and the five ideas are from the solutions paper
 * (data/Wave_of_Change_Flood_Solutions.pdf, sections 1, 3.2 and 4).
 *
 * Every line needs both languages and at most 12 English words.
 */
export const chapter3: ScriptScene[] = [
  {
    id: 'gaps',
    chapter: 3,
    steps: [
      { ui: false },
      { music: 'theme' },
      { bg: 'space' },
      { camera: 'earth' },
      { chapter: { number: 3, title: chapterTitles[3] } },
      { wait: 1600 },
      { chapter: null },
      { bg: 'evidence' },
      { ui: true },
      { sara: { show: true, pose: 'think' } },
      {
        do: 'choice',
        say: {
          en: 'Orange is flooded land, blue is not. Can one line split them?',
          ko: '주황은 잠긴 땅, 파랑은 아닌 땅. 선 하나로 가를 수 있을까요?',
        },
        options: [
          { en: 'Yes', ko: '네' },
          { en: 'No', ko: '아니요' },
        ],
        answer: 1,
      },
      { sara: { pose: 'idle' } },
      {
        say: {
          en: 'No. They overlap, so every cut-off flags dry land too.',
          ko: '아니요. 겹쳐 있어서, 어떤 기준선도 마른 땅까지 짚어요.',
        },
      },
      {
        say: {
          en: 'Buildings, trees and timing leave gaps too.',
          ko: '건물과 나무, 촬영 시점도 빈틈을 남겨요.',
        },
      },
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
          en: 'Three papers stand behind this story. Open any.',
          ko: '이 이야기 뒤에는 논문 세 편이 있어요. 열어 보세요.',
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
