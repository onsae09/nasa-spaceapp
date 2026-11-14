/**
 * The line being spoken. The part not yet typed is rendered invisibly so the
 * centred text does not shift while it types.
 */
export function DialogueBox({ text, count, done, showHint }: {
  text: string
  count: number
  done: boolean
  showHint: boolean
}) {
  return (
    <div className="dialogue">
      {/* Screen readers get the whole line at once instead of letter by letter. */}
      <p className="sr-only" aria-live="polite">{text}</p>
      <p className="dialogue-text" aria-hidden="true">
        {text.slice(0, count)}
        <span className="dialogue-rest">{text.slice(count)}</span>
      </p>
      {done && showHint && (
        <svg
          className="dialogue-hint"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      )}
    </div>
  )
}
