import { useMatchingGame, type MatchingGame } from '@/games/shared/useMatchingGame'
import { SHAPE_KEYS } from './data'

/**
 * Shape Sorting game logic. The classic sort-into-holes matching game with
 * three holes. Difficulty ramps within a session: from level 1 extra shapes
 * with no hole appear (up to 5 pieces for 3 holes), and the pieces come in
 * varied sizes - so the child must look at shape, not size.
 */
export function useShapeSorting(): MatchingGame {
  return useMatchingGame({
    keys: SHAPE_KEYS,
    count: 3,
    maxCount: 3,
    decoyFrom: 1,
    maxDecoys: 2,
    varySize: true,
  })
}
