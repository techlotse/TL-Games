import { useCallback, useMemo, useState } from 'react'
import { sampleDistinct, shuffle } from '@/lib/utils'
import type { MatchKey, PlaceResult } from './types'

/** A tray item - a key plus the size it is drawn at. */
export interface MatchItem {
  key: MatchKey
  /** Render scale for the tray piece (1 = normal). */
  scale: number
}

/**
 * A single round: the matchable keys (one target each), the target row order,
 * and the tray items - which may include decoys (items with no target) and
 * carry their own render scale.
 */
export interface MatchRound {
  id: number
  keys: MatchKey[]
  targetOrder: MatchKey[]
  items: MatchItem[]
}

export interface MatchingGame {
  round: MatchRound
  placed: ReadonlySet<MatchKey>
  isComplete: boolean
  isPlaced: (key: MatchKey) => boolean
  attempt: (itemKey: MatchKey, targetKey: MatchKey) => PlaceResult
  reset: () => void
}

export interface MatchingOptions {
  keys: readonly MatchKey[]
  /** Starting number of targets. */
  count: number
  /** Cap on the number of targets. */
  maxCount?: number
  /** From this level on, extra decoy items (with no target) appear. */
  decoyFrom?: number
  /** The most decoy items ever added. */
  maxDecoys?: number
  /** When true, tray pieces are drawn at varied sizes. */
  varySize?: boolean
}

/** Tray-piece scales when size variation is on - mostly normal, some smaller. */
const SCALES = [0.62, 0.8, 1, 1]

/**
 * Headless engine shared by the matching games. Difficulty ramps within a
 * session: more targets (up to `maxCount`), and - if configured - decoy
 * pieces with no home and pieces of varied size. Resets when the screen is left.
 */
export function useMatchingGame(options: MatchingOptions): MatchingGame {
  const { keys, count, maxCount, decoyFrom, maxDecoys = 0, varySize = false } = options
  const targetCap = Math.min(maxCount ?? count, keys.length)
  const startCount = Math.min(count, targetCap)

  const build = useCallback(
    (id: number): MatchRound => {
      const targetCount = Math.min(startCount + id, targetCap)
      const targets = sampleDistinct(keys, targetCount)
      let decoyCount = 0
      if (decoyFrom != null && id >= decoyFrom) {
        decoyCount = Math.min(maxDecoys, id - decoyFrom + 1, keys.length - targetCount)
      }
      const rest = keys.filter((k) => !targets.includes(k))
      const decoys = sampleDistinct(rest, decoyCount)
      const items: MatchItem[] = shuffle([...targets, ...decoys]).map((key) => ({
        key,
        scale: varySize ? SCALES[Math.floor(Math.random() * SCALES.length)] : 1,
      }))
      return { id, keys: targets, targetOrder: shuffle(targets), items }
    },
    [keys, startCount, targetCap, decoyFrom, maxDecoys, varySize],
  )

  const [round, setRound] = useState<MatchRound>(() => build(0))
  const [placed, setPlaced] = useState<Set<MatchKey>>(() => new Set())

  const attempt = useCallback(
    (itemKey: MatchKey, targetKey: MatchKey): PlaceResult => {
      if (itemKey !== targetKey || !round.keys.includes(targetKey)) return 'wrong'
      setPlaced((prev) => {
        if (prev.has(itemKey)) return prev
        const next = new Set(prev)
        next.add(itemKey)
        return next
      })
      return 'correct'
    },
    [round],
  )

  const reset = useCallback(() => {
    setRound((prev) => build(prev.id + 1))
    setPlaced(new Set())
  }, [build])

  const isPlaced = useCallback((key: MatchKey) => placed.has(key), [placed])
  const isComplete = round.keys.length > 0 && placed.size === round.keys.length

  return useMemo(
    () => ({ round, placed, isComplete, isPlaced, attempt, reset }),
    [round, placed, isComplete, isPlaced, attempt, reset],
  )
}
