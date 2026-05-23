import { useMatchingGame, type MatchingGame } from '@/games/shared/useMatchingGame'
import { FLOWER_KEYS, ROUND_SIZE } from './data'

/**
 * Flower Garden game logic. Thin wrapper over the shared matching engine.
 */
export function useFlowerGarden(): MatchingGame {
  return useMatchingGame({ keys: FLOWER_KEYS, count: ROUND_SIZE })
}
