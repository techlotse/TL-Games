/**
 * Thin wrappers around browser-only capabilities.
 *
 * Game logic never calls these APIs directly - keeping them isolated here
 * makes a later move to Capacitor / Expo / React Native straightforward
 * (only this file needs a native implementation).
 */

/** A short, soft haptic tap. Safely no-ops where unsupported. */
export function hapticTap(): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10)
    }
  } catch {
    /* haptics are a non-essential enhancement */
  }
}

/** A gentle double pulse used when an activity is completed. */
export function hapticSuccess(): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([14, 70, 22])
    }
  } catch {
    /* ignore */
  }
}

/** True when the app is running as an installed (standalone) PWA. */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const standaloneNav = (window.navigator as Navigator & { standalone?: boolean }).standalone
  return window.matchMedia?.('(display-mode: standalone)').matches === true || standaloneNav === true
}
