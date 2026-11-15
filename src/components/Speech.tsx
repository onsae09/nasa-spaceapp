import { DialogueBox } from './DialogueBox'

/** The line being said. Sara herself is drawn once by the app (see Sara.tsx). */
export function Speech({ text, count, done, showHint }: {
  text: string | null
  count: number
  done: boolean
  showHint: boolean
}) {
  return text == null ? null : <DialogueBox text={text} count={count} done={done} showHint={showHint} />
}
