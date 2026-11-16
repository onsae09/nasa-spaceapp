import type { L } from '../i18n'

/**
 * What the story is built on, listed on the closing card. Each entry is
 * documented in full, with its licence, in README.md; keep the two in step.
 * An entry has a link only where the README gives one.
 */
export const sources: { label: L; href?: string }[] = [
  {
    label: {
      en: 'Radar: OPERA RTC-S1, NASA/JPL (Sentinel-1A 16 May 2020, Sentinel-1B 22 May 2020)',
      ko: '레이더: OPERA RTC-S1, NASA/JPL (Sentinel-1A 2020년 5월 16일, Sentinel-1B 5월 22일)',
    },
  },
  {
    label: {
      en: 'NISAR: 14 L2 GCOV products, NASA/JPL via ASF (track 69, frames 14 and 18; 18 Jun to 9 Nov 2026)',
      ko: 'NISAR: L2 GCOV 산출물 14개, NASA/JPL, ASF 제공 (트랙 69, 프레임 14와 18; 2026년 6월 18일~11월 9일)',
    },
    href: 'https://search.asf.alaska.edu/',
  },
  {
    label: { en: 'NISAR pipeline: the team’s nisar-analysis', ko: 'NISAR 분석 파이프라인: 팀의 nisar-analysis' },
    href: 'https://github.com/Maha123b/nisar-analysis',
  },
  {
    label: { en: 'Reference flood map: Zenodo 4390084', ko: '기준 침수 지도: Zenodo 4390084' },
    href: 'https://zenodo.org/records/4390084',
  },
  {
    label: { en: 'Amphan landfall, 20 May 2020: India Meteorological Department', ko: '암판 상륙일 2020년 5월 20일: 인도 기상청' },
  },
  {
    label: { en: 'Nepal image: ESA, CC BY 4.0', ko: '네팔 영상: ESA, CC BY 4.0' },
    href: 'https://commons.wikimedia.org/wiki/File:Nepal_glacier_collapse_and_flood_(after)_(55504451912).jpg',
  },
  {
    label: { en: 'Nepal toll: NDRRMA, 5 Oct 2026', ko: '네팔 피해 집계: NDRRMA, 2026년 10월 5일' },
  },
  {
    label: { en: 'Texas and warning time: the team’s solutions paper', ko: '텍사스와 경보 시간: 팀의 해결책 문서' },
  },
  { label: { en: 'Khatiwada 2025', ko: 'Khatiwada 2025' }, href: 'https://doi.org/10.1016/j.rsase.2025.101860' },
  { label: { en: 'Amitrano 2024', ko: 'Amitrano 2024' }, href: 'https://doi.org/10.3390/rs16040656' },
  { label: { en: 'Zhao 2025', ko: 'Zhao 2025' }, href: 'https://doi.org/10.1109/MGRS.2024.3496075' },
]
