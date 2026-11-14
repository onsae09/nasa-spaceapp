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
      { camera: 'stars' },
      { music: 'ambience' },
      { ui: true },
      { say: `Hello! I'm ${CHARACTER_NAME}!`, pace: 'quick' },
      // Earth swings into view as she mentions it.
      { camera: 'earth' },
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
      // Fall from orbit into the flood: the music cuts, the screen whites out,
      // and the photo is left alone in silence before anyone speaks.
      { ui: false },
      { music: 'silence' },
      { camera: 'dive' },
      { wait: 1800 },
      { bg: 'nepalFlood' },
      { wait: 3000 },
      { ui: true },
      { music: 'theme' },
      {
        say: 'What if the water that gives us life becomes the reason we lose our homes and our lives?',
        pace: 'slow',
      },
      { say: 'Just like we can see from the recent flood in Nepal.' },
      { fact: 'nepalToll' },
      {
        say: 'It caused at least 1,455 deaths and left 5,285 people missing in Nepal alone, and there are more victims in the Tibet Autonomous Region of China.',
        pace: 'slow',
      },
      { say: 'This is how countless families lost their loved ones and their everyday lives.', pace: 'slow' },
      { fact: null },
      { triptych: ['bangladesh', 'india', 'us'] },
      { say: "It's not just this flood… Many other floods have repeatedly devastated different parts of the world!" },
    ],
  },
  {
    id: 'the-problem',
    steps: [
      { bg: 'space' },
      { camera: 'earth' },
      { say: "Floods don't just leave water behind." },
      { bg: 'brokenCity' },
      { say: 'They can damage homes, cut off roads, and keep people from getting the help they need.' },
      // Back above Nepal. Cloud closes over the valley as she says it is hard
      // to see; then a radar sweep clears it, which is what chapter 2 is about.
      { bg: 'nepalFlood' },
      { cover: 'clouds' },
      { say: "And when the rain doesn't stop, it can be difficult to see where the water has spread." },
      { cover: 'scan' },
      {
        say: "That's why we need a better view.",
        pace: 'slow',
        button: { label: 'Continue', at: 'corner' },
      },
    ],
  },
]
