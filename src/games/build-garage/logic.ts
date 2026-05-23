import { useMatchingGame, type MatchingGame } from '@/games/shared/useMatchingGame'
import { VEHICLE_KEYS, ROUND_SIZE } from './data'

/**
 * Build Garage game logic. Thin wrapper over the shared matching engine so
 * the rules stay isolated and reusable for a future native build.
 */
export function useBuildGarage(): MatchingGame {
  return useMatchingGame({ keys: VEHICLE_KEYS, count: ROUND_SIZE })
}
