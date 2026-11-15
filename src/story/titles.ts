import type { L } from '../i18n'

/** Chapter names, shown in the progress display and on chapter cards. */
export const chapterTitles: Record<number, L> = {
  1: { en: 'What the world missed', ko: '세상이 놓친 것' },
  2: { en: 'Your turn at the radar', ko: '이제 당신이 레이더를' },
  3: { en: 'What comes next', ko: '다음 이야기' },
}

/** The chapter the closing card announces. It is not built yet. */
export const nextChapter = 3
