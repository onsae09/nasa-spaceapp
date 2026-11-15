import { nextSteps, type NextStepKey } from '../content/investigation'
import { ui } from '../content/ui'
import { useResolved } from '../i18n'
import { caseNotes, useCaseNotes } from '../story/caseNotes'
import { CaseStrip } from './CaseDesk'

const OPTIONS: NextStepKey[] = ['map', 'warn', 'plan']

/**
 * Three next steps, face up from the start. Choosing one shows what Sara
 * says to it and the evidence it still needs; the choice goes into the case
 * notes and can be changed without losing the earlier investigation.
 */
export function NextStep({ onClose }: { onClose: () => void }) {
  const t = useResolved(nextSteps)
  const words = useResolved(ui)
  const notes = useCaseNotes()
  const chosen = notes.nextStep

  return (
    <div className="steps" onClick={(e) => e.stopPropagation()}>
      <header className="steps-head">
        <h2 className="overlay-title">{t.title}</h2>
        <p className="overlay-lead">{t.lead}</p>
      </header>

      <ul className="steps-row">
        {OPTIONS.map((key, i) => (
          <li key={key}>
            <button
              type="button"
              className="steps-card"
              aria-pressed={key === chosen}
              onClick={() => caseNotes.chooseNextStep(key)}
            >
              <span className="deck-card-number">0{i + 1}</span>
              <span className="steps-name">{t.options[key].name}</span>
              <span className="steps-line">{t.options[key].line}</span>
              {key === chosen && (
                <span className="steps-needs">
                  <span className="steps-response">{t.options[key].response}</span>
                  <span className="steps-needs-lead">{t.needs}</span>
                  {t.options[key].needs.map((need) => (
                    <span key={need} className="steps-need">
                      {need}
                    </span>
                  ))}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <CaseStrip />

      <button type="button" className="story-button story-button--corner" onClick={onClose}>
        {words.continue}
      </button>
    </div>
  )
}
