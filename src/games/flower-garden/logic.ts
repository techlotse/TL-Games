import { useMatchingGame, type MatchingGame } from '@/games/shared/useMatchingGame'
import { FLOWER_KEYS } from './data'

/**
 * Flower Garden game logic. A colour-matching game: match each flower to the
 * plant pot of the same colour. Difficulty ramps within a session: each
 * finished round adds one more flower, from 3 up to 5.
 */
export function useFlowerGarden(): MatchingGame {
  return useMatchingGame({ keys: FLOWER_KEYS, count: 3, maxCount: 5 })
}
