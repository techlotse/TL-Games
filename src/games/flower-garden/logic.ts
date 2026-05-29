import { useMatchingGame, type MatchingGame } from '@/games/shared/useMatchingGame'
import { FLOWER_KEYS } from './data'

/**
 * Flower Garden game logic. A colour-matching game: match each flower to the
 * plant pot of the same colour. Difficulty ramps within a session over up to
 * nine levels - more pots (3 -> 6), and from level 3 a few extra flowers whose
 * colour has no pot, so the child must look closely.
 */
export function useFlowerGarden(): MatchingGame {
  return useMatchingGame({
    keys: FLOWER_KEYS,
    count: 3,
    maxCount: 6,
    decoyFrom: 3,
    maxDecoys: 3,
    rampStride: 2,
  })
}
