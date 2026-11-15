import { motion } from 'motion/react'
import { character } from '../assets'
import { useResolved } from '../i18n'
import { EASE } from '../motion'
import { DialogueBox } from './DialogueBox'

/** The astronaut and the line she is saying. Used by the story and by the research files. */
export function Speech({ text, count, done, showHint }: {
  text: string | null
  count: number
  done: boolean
  showHint: boolean
}) {
  const alt = useResolved(character.alt)
  return (
    <>
      {text != null && <DialogueBox text={text} count={count} done={done} showHint={showHint} />}
      <motion.div
        className="character"
        initial={{ opacity: 0, x: -48 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <img className="character-art" src={character.src} alt={alt} draggable={false} />
      </motion.div>
    </>
  )
}
