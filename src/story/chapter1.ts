import type { Scene } from './types'

/** Placeholder until the team picks a name. */
export const CHARACTER_NAME = 'SARA'

/**
 * Chapter 1 – Introduction.
 * Edit lines and their order here; see ./types.ts for what each step does.
 */
export const chapter1: Scene[] = [
  {
    id: 'character-intro',
    steps: [
      { bg: 'space' },
      { ui: true },
      { say: `Hello! I'm ${CHARACTER_NAME}!` },
      { say: "I've been keeping an eye on Earth from up here." },
      { say: 'And you must be the one taking over.' },
      {
        say: "Come on, let me show you what I've found.",
        button: { label: "Let's start", at: 'center' },
      },
    ],
  },
  {
    id: 'trigger-line',
    steps: [
      { ui: false },
      { bg: 'nepalFlood' },
      { wait: 3000 },
      { ui: true },
      { say: 'What if the water that gives us life becomes the reason we lose our homes and our lives?' },
      { say: 'Just like we can see from the recent flood in Nepal.' },
      {
        say: 'It caused at least 1,455 deaths and left 5,285 people missing in Nepal alone, and there are more victims in the Tibet Autonomous Region of China.',
      },
      { say: 'This is how countless families lost their loved ones and their everyday lives.' },
      { triptych: ['bangladesh', 'india', 'us'] },
      { say: "It's not just this flood… Many other floods have repeatedly devastated different parts of the world!" },
    ],
  },
  {
    id: 'the-problem',
    steps: [
      { bg: 'space' },
      { say: "Floods don't just leave water behind." },
      { bg: 'brokenCity' },
      { say: 'They can damage homes, cut off roads, and keep people from getting the help they need.' },
      { say: "And when the rain doesn't stop, it can be difficult to see where the water has spread." },
      {
        say: "That's why we need a better view.",
        button: { label: 'Continue', at: 'corner' },
      },
    ],
  },
]
