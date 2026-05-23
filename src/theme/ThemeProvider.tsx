import { useEffect, type ReactNode } from 'react'
import { useAppStore } from '@/store/appStore'

/** Background colors used for the browser/OS UI chrome (`theme-color`). */
const THEME_COLOR = {
  light: '#f3eee0',
  dark: '#1c1f28',
} as const

/**
 * Applies theme + accessibility preferences to the document root.
 * Keeps all DOM-level theming in one place so game code never touches it.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useAppStore((s) => s.theme)
  const highContrast = useAppStore((s) => s.highContrast)
  const reducedMotion = useAppStore((s) => s.reducedMotion)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    root.classList.toggle('contrast-high', highContrast)
    root.classList.toggle('reduce-motion', reducedMotion)

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (meta) meta.content = THEME_COLOR[theme]
  }, [theme, highContrast, reducedMotion])

  return <>{children}</>
}
