import type { ReactNode } from 'react'

/** Line icons, all drawn on a 24px grid with a 1.5 stroke (lucide's shapes). */
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export const CloseIcon = () => (
  <Icon>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </Icon>
)

export const PlusIcon = () => (
  <Icon>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </Icon>
)

export const MinusIcon = () => (
  <Icon>
    <path d="M5 12h14" />
  </Icon>
)

/** Four corners pointing outward: fit the whole image in view. */
export const FitIcon = () => (
  <Icon>
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </Icon>
)

export const ArrowRightIcon = () => (
  <Icon>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </Icon>
)
