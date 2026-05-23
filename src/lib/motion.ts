import { useReducedMotion, type Transition } from 'framer-motion'
import { useAppStore } from '@/store/appStore'

/**
 * True when motion should be minimised - either the OS "reduce motion"
 * setting is on, or the parent enabled it inside the app.
 */
export function useCalmMotion(): boolean {
  const osReduced = useReducedMotion()
  const appReduced = useAppStore((s) => s.reducedMotion)
  return Boolean(osReduced) || appReduced
}

/** Gentle spring for pieces settling softly into place. */
export const settleSpring: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 30,
  mass: 0.7,
}

/** Soft spring for a wrong piece drifting back home - never abrupt. */
export const returnSpring: Transition = {
  type: 'spring',
  stiffness: 240,
  damping: 24,
  mass: 0.8,
}

/** Standard calm tween (~200ms) for fades and scales. */
export const calmTween: Transition = {
  duration: 0.2,
  ease: [0.22, 1, 0.36, 1],
}

/** Slightly quicker calm tween (~180ms). */
export const calmTweenFast: Transition = {
  duration: 0.18,
  ease: [0.22, 1, 0.36, 1],
}
