import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type GameId = 'garage' | 'garden' | 'shapes' | 'race' | 'colouring' | 'find' | 'dig'
export type ScreenId = 'home' | GameId | 'parents'
export type ThemeName = 'light' | 'dark'

/** Highest number of progress dots shown per game (kept small + calm). */
export const MAX_PROGRESS = 3

const EMPTY_PROGRESS: Record<GameId, number> = {
  garage: 0,
  garden: 0,
  shapes: 0,
  race: 0,
  colouring: 0,
  find: 0,
  dig: 0,
}

interface AppState {
  /** Current screen. Intentionally NOT persisted - the app always opens at home. */
  screen: ScreenId
  theme: ThemeName
  highContrast: boolean
  reducedMotion: boolean
  /** Rounds completed per game, capped at MAX_PROGRESS for display. */
  progress: Record<GameId, number>

  go: (screen: ScreenId) => void
  setTheme: (theme: ThemeName) => void
  toggleTheme: () => void
  setHighContrast: (value: boolean) => void
  setReducedMotion: (value: boolean) => void
  recordRound: (game: GameId) => void
  resetProgress: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      screen: 'home',
      theme: 'dark',
      highContrast: false,
      reducedMotion: false,
      progress: { ...EMPTY_PROGRESS },

      go: (screen) => set({ screen }),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setHighContrast: (highContrast) => set({ highContrast }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      recordRound: (game) =>
        set((s) => ({
          progress: {
            ...s.progress,
            [game]: Math.min(MAX_PROGRESS, s.progress[game] + 1),
          },
        })),
      resetProgress: () => set({ progress: { ...EMPTY_PROGRESS } }),
    }),
    {
      name: 'spielgarten-v1',
      // Only durable preferences are saved locally - no accounts, no cloud.
      partialize: (s) => ({
        theme: s.theme,
        highContrast: s.highContrast,
        reducedMotion: s.reducedMotion,
        progress: s.progress,
      }),
      // Deep-merge so new games (added in later versions) always have a value.
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<AppState>
        return {
          ...current,
          ...saved,
          progress: { ...EMPTY_PROGRESS, ...(saved.progress ?? {}) },
        }
      },
    },
  ),
)
