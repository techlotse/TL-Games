import { useCallback, useMemo, useState } from 'react'
import { sampleDistinct, shuffle } from '@/lib/utils'
import type { MatchKey, PlaceResult } from './types'

/**
 * A single round: a set of keys, plus an independent shuffle for the items
 * tray and the target row so they never line up trivially.
 */
export interface MatchRound {
  id: number
  keys: MatchKey[]
  itemOrder: MatchKey[]
  targetOrder: MatchKey[]
}

export interface MatchingGame {
  round: MatchRound
  placed: ReadonlySet<MatchKey>
  isComplete: boolean
  isPlaced: (key: MatchKey) => boolean
  /** Records a placement attempt. Correct only when the keys match. */
  attempt: (itemKey: MatchKey, targetKey: MatchKey) => PlaceResult
  /** Starts a fresh round (re-sampled + re-shuffled). */
  reset: () => void
}

function buildRound(id: number, keys: readonly MatchKey[], count: number): MatchRound {
  const chosen = sampleDistinct(keys, count)
  return {
    id,
    keys: chosen,
    itemOrder: shuffle(chosen),
    targetOrder: shuffle(chosen),
  }
}

/**
 * Headless engine shared by every matching game (Build Garage, Flower Garden,
 * Shape Sorting). It owns no rendering and no browser APIs - only the rules -
 * so it is trivially portable to a future native build.
 */
export function useMatchingGame(options: {
  keys: readonly MatchKey[]
  count: number
}): MatchingGame {
  const { keys, count } = options
  const [round, setRound] = useState<MatchRound>(() => buildRound(0, keys, count))
  const [placed, setPlaced] = useState<Set<MatchKey>>(() => new Set())

  const attempt = useCallback((itemKey: MatchKey, targetKey: MatchKey): PlaceResult => {
    if (itemKey !== targetKey) return 'wrong'
    setPlaced((prev) => {
      if (prev.has(itemKey)) return prev
      const next = new Set(prev)
      next.add(itemKey)
      return next
    })
    return 'correct'
  }, [])

  const reset = useCallback(() => {
    setRound((prev) => buildRound(prev.id + 1, keys, count))
    setPlaced(new Set())
  }, [keys, count])

  const isPlaced = useCallback((key: MatchKey) => placed.has(key), [placed])
  const isComplete = round.keys.length > 0 && placed.size === round.keys.length

  return useMemo(
    () => ({ round, placed, isComplete, isPlaced, attempt, reset }),
    [round, placed, isComplete, isPlaced, attempt, reset],
  )
}
