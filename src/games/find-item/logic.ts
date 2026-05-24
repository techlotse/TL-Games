import { useCallback, useMemo, useState } from 'react'
import { sampleDistinct, shuffle } from '@/lib/utils'
import { countForLevel, FIND, ITEM_KINDS, type ItemKind } from './data'

/** One scattered item, placed at a percentage position in the scene. */
export interface Placement {
  id: string
  kind: ItemKind
  x: number
  y: number
  /** A small tilt, in degrees, so the scene feels lively. */
  rot: number
}

export interface FindRound {
  id: number
  items: Placement[]
  /** Item ids in the order they are asked for. */
  order: string[]
}

export interface FindGame {
  round: FindRound
  found: ReadonlySet<string>
  /** The item the child is currently looking for, or null when finished. */
  targetId: string | null
  targetKind: ItemKind | null
  isComplete: boolean
  attempt: (id: string) => 'correct' | 'wrong'
  reset: () => void
}

function buildRound(id: number): FindRound {
  const count = countForLevel(id)
  const kinds = sampleDistinct(ITEM_KINDS, count)
  // Distinct grid cells, jittered, so scattered items never overlap.
  const cellCount = FIND.cols * FIND.rows
  const cells = shuffle(Array.from({ length: cellCount }, (_, i) => i)).slice(0, count)
  const items: Placement[] = kinds.map((kind, index) => {
    const cell = cells[index]
    const col = cell % FIND.cols
    const row = Math.floor(cell / FIND.cols)
    return {
      id: `i${index}`,
      kind,
      x: 18 + col * 32 + (Math.random() * 8 - 4),
      y: 19 + row * 31 + (Math.random() * 10 - 5),
      rot: Math.random() * 24 - 12,
    }
  })
  return { id, items, order: shuffle(items.map((it) => it.id)) }
}

/**
 * Find-an-item game logic. One target at a time, in a fixed order; difficulty
 * ramps within a session (4 -> 8 items). Resets when the screen is left.
 */
export function useFindItem(): FindGame {
  const [round, setRound] = useState<FindRound>(() => buildRound(0))
  const [found, setFound] = useState<Set<string>>(() => new Set())

  const targetId = round.order[found.size] ?? null
  const targetKind = targetId
    ? (round.items.find((it) => it.id === targetId)?.kind ?? null)
    : null

  const attempt = useCallback(
    (id: string): 'correct' | 'wrong' => {
      if (id !== targetId) return 'wrong'
      setFound((prev) => {
        if (prev.has(id)) return prev
        const next = new Set(prev)
        next.add(id)
        return next
      })
      return 'correct'
    },
    [targetId],
  )

  const reset = useCallback(() => {
    setRound((prev) => buildRound(prev.id + 1))
    setFound(new Set())
  }, [])

  const isComplete = round.items.length > 0 && found.size === round.items.length

  return useMemo(
    () => ({ round, found, targetId, targetKind, isComplete, attempt, reset }),
    [round, found, targetId, targetKind, isComplete, attempt, reset],
  )
}
