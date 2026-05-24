import { useMatchingGame, type MatchingGame } from '@/games/shared/useMatchingGame'
import { SHAPE_KEYS } from './data'

/**
 * Shape Sorting game logic. Three holes throughout; difficulty ramps within a
 * session over up to nine levels - from level 1 extra blocks with no hole are
 * added (up to nine pieces for three holes), and the blocks come in varied
 * sizes, so the child must sort by shape and not by size.
 */
export function useShapeSorting(): MatchingGame {
  return useMatchingGame({
    keys: SHAPE_KEYS,
    count: 3,
    maxCount: 3,
    decoyFrom: 1,
    maxDecoys: 6,
    varySize: true,
  })
}
