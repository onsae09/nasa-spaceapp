import type { L } from '../i18n'

/** The small fixed words of the interface, in every language. */
export const ui = {
  title: {
    stamp: { en: 'NASA Space Apps Challenge 2026', ko: 'NASA Space Apps Challenge 2026' },
    name: { en: 'Dancing with the SARs', ko: 'Dancing with the SARs' },
    line: { en: 'A flood, seen from orbit', ko: '궤도에서 본 홍수' },
    choose: { en: 'Choose a language to begin', ko: '언어를 골라 시작하세요' },
  },
  chapter: { en: 'Chapter', ko: '장' },
  comingSoon: { en: 'Coming soon', ko: '준비 중' },
  backToStart: { en: 'Back to start', ko: '처음으로' },
  continue: { en: 'Continue', ko: '계속' },
  musicOn: { en: 'Turn sound on', ko: '소리 켜기' },
  musicOff: { en: 'Turn sound off', ko: '소리 끄기' },
  scan: {
    lead: { en: 'Synthetic aperture radar', ko: '합성개구레이더(SAR)' },
    rest: { en: 'sees through cloud, day or night', ko: '낮이든 밤이든 구름을 뚫고 봅니다' },
  },
  lesson: {
    sent: { en: 'Signal sent', ko: '보낸 신호' },
    echo: { en: 'Echo', ko: '메아리' },
    away: { en: 'Bounced away', ko: '다른 쪽으로 튕김' },
    dry: { en: 'Dry ground', ko: '마른 땅' },
    wet: { en: 'Calm water', ko: '잔잔한 물' },
    records: { en: 'What the radar records', ko: '레이더에 찍히는 모습' },
    bright: { en: 'Bright', ko: '밝음' },
    dark: { en: 'Dark', ko: '어두움' },
    before: { en: 'Before', ko: '전' },
    after: { en: 'After', ko: '후' },
    darker: { en: 'Darker than before', ko: '전보다 어두워짐' },
    alt: {
      en: 'A diagram of a radar satellite sending a signal to the ground and receiving its echo.',
      ko: '레이더 위성이 땅으로 신호를 보내고 메아리를 받는 모습을 그린 그림.',
    },
  },
} satisfies Record<string, L | Record<string, L>>

/** "Chapter 2" in English, "2장" in Korean. */
export const chapterLabel = (number: number, word: string, lang: 'en' | 'ko') =>
  lang === 'ko' ? `${number}${word}` : `${word} ${number}`
