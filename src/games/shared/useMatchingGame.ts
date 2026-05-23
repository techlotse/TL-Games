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
  attempt: (itemKey: MatchKey, targetKey: MatchKey) => PlaceResult
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
 * Headless engine shared by the matching games. Difficulty ramps within a
 * session: each completed round adds one more item, from `count` up to
 * `maxCount`. It resets when the game screen is left.
 */
export function useMatchingGame(options: {
  keys: readonly MatchKey[]
  count: number
  maxCount?: number
}): MatchingGame {
  const { keys, count, maxCount } = options
  const cap = Math.min(maxCount ?? count, keys.length)
  const startCount = Math.min(count, cap)

  const [round, setRound] = useState<MatchRound>(() => buildRound(0, keys, startCount))
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
    setRound((prev) => {
      const nextLevel = prev.id + 1
      const nextCount = Math.min(startCount + nextLevel, cap)
      return buildRound(nextLevel, keys, nextCount)
    })
    setPlaced(new Set())
  }, [keys, startCount, cap])

  const isPlaced = useCallback((key: MatchKey) => placed.has(key), [placed])
  const isComplete = round.keys.length > 0 && placed.size === round.keys.length

  return useMemo(
    () => ({ round, placed, isComplete, isPlaced, attempt, reset }),
    [round, placed, isComplete, isPlaced, attempt, reset],
  )
}
