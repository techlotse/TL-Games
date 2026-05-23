import { useMatchingGame, type MatchingGame } from '@/games/shared/useMatchingGame'
import { SHAPE_KEYS, ROUND_SIZE } from './data'

/**
 * Shape Sorting game logic. Thin wrapper over the shared matching engine.
 */
export function useShapeSorting(): MatchingGame {
  return useMatchingGame({ keys: SHAPE_KEYS, count: ROUND_SIZE })
}
