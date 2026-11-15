import { chapterLabel, ui } from '../content/ui'
import { useLang, useResolved } from '../i18n'
import { chapterTitles } from '../story'

/**
 * Where the visitor is: a way back to the previous line, the chapter's name,
 * and a dot for each of its stops. The other chapters show as one bar each.
 */
export function StoryNav({ chapter, progress, canBack, onBack, showProgress }: {
  chapter: number
  progress: { index: number; total: number }
  canBack: boolean
  onBack: () => void
  showProgress: boolean
}) {
  const lang = useLang()
  const t = useResolved(ui)
  const titles = useResolved(chapterTitles)
  const chapters = Object.keys(chapterTitles).map(Number)

  return (
    <nav className="nav" onClick={(e) => e.stopPropagation()}>
      {canBack && (
        <button type="button" className="text-button nav-back" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5" />
            <path d="m12 19-7-7 7-7" />
          </svg>
          {t.back}
        </button>
      )}
      {showProgress && (
        <div className="nav-progress">
          <p className="stamp nav-chapter">
            <span className="stamp-lead">{chapterLabel(chapter, t.chapter, lang)}</span> · {titles[chapter]}
          </p>
          <ol className="nav-track" aria-label={`${progress.index} / ${progress.total}`}>
            {chapters.map((n) =>
              n === chapter ? (
                Array.from({ length: progress.total }, (_, i) => (
                  <li
                    key={`${n}-${i}`}
                    className="nav-dot"
                    data-state={i + 1 < progress.index ? 'done' : i + 1 === progress.index ? 'here' : 'ahead'}
                  />
                ))
              ) : (
                <li key={n} className="nav-bar" data-state={n < chapter ? 'done' : 'ahead'} />
              ),
            )}
          </ol>
        </div>
      )}
    </nav>
  )
}
