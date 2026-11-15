import type { L } from '../i18n'

/** The small fixed words of the interface, in every language. */
export const ui = {
  title: {
    stamp: { en: 'NASA Space Apps Challenge 2026', ko: 'NASA Space Apps Challenge 2026' },
    name: { en: 'Dancing with the SARs', ko: 'Dancing with the SARs' },
    line: { en: 'Here is what the world missed', ko: '세상이 놓친 장면이 여기 있어요' },
    choose: { en: 'Choose a language to begin', ko: '언어를 골라 시작하세요' },
  },
  chapter: { en: 'Chapter', ko: '장' },
  inProgress: { en: 'in progress', ko: '준비 중' },
  meanwhile: { en: 'Until it is ready, two things to open', ko: '완성되기 전까지 열어 볼 수 있는 두 가지' },
  back: { en: 'Back', ko: '뒤로' },
  backToStart: { en: 'Back to start', ko: '처음으로' },
  continue: { en: 'Continue', ko: '계속' },
  musicOn: { en: 'Turn sound on', ko: '소리 켜기' },
  musicOff: { en: 'Turn sound off', ko: '소리 끄기' },
  scan: {
    lead: { en: 'Synthetic aperture radar', ko: '합성개구레이더(SAR)' },
    rest: { en: 'illustration over an optical photo', ko: '광학 사진 위에 그린 설명용 그림' },
    drag: { en: 'Drag the radar across', ko: '레이더를 끌어서 훑어 보세요' },
  },
  lesson: {
    yours: { en: 'Your radar', ko: '당신의 레이더' },
    fire: { en: 'Fire', ko: '발사' },
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
