import { useMatchingGame, type MatchingGame } from '@/games/shared/useMatchingGame'
import { SHAPE_KEYS } from './data'

/**
 * Shape Sorting game logic. The classic sort-into-holes matching game.
 * Difficulty ramps within a session: each finished round adds one more
 * shape, from 3 up to 5.
 */
export function useShapeSorting(): MatchingGame {
  return useMatchingGame({ keys: SHAPE_KEYS, count: 3, maxCount: 5 })
}
