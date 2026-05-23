import { useCallback, useMemo, useState } from 'react'
import { shuffle } from '@/lib/utils'
import { slotsForLevel, type PartKind, type Slot } from './data'

export interface TrayPiece {
  id: string
  kind: PartKind
}

export interface AssemblyRound {
  id: number
  slots: Slot[]
  tray: TrayPiece[]
}

export interface AssemblyGame {
  round: AssemblyRound
  placedSlots: ReadonlySet<string>
  placedPieces: ReadonlySet<string>
  isComplete: boolean
  attempt: (pieceId: string, slotId: string) => 'correct' | 'wrong'
  reset: () => void
}

function buildRound(id: number): AssemblyRound {
  const slots = slotsForLevel(id)
  const tray = shuffle(slots.map((slot, index) => ({ id: `p${index}-${slot.kind}`, kind: slot.kind })))
  return { id, slots, tray }
}

/**
 * Build Garage game logic. Difficulty ramps within a session: each finished
 * vehicle gains one more part (3 -> 5). Resets when the screen is left.
 */
export function useBuildGarage(): AssemblyGame {
  const [round, setRound] = useState<AssemblyRound>(() => buildRound(0))
  const [placedSlots, setPlacedSlots] = useState<Set<string>>(() => new Set())
  const [placedPieces, setPlacedPieces] = useState<Set<string>>(() => new Set())

  const attempt = useCallback(
    (pieceId: string, slotId: string): 'correct' | 'wrong' => {
      const piece = round.tray.find((p) => p.id === pieceId)
      const slot = round.slots.find((s) => s.id === slotId)
      if (!piece || !slot) return 'wrong'
      if (placedSlots.has(slotId) || placedPieces.has(pieceId)) return 'wrong'
      if (piece.kind !== slot.kind) return 'wrong'
      setPlacedSlots((prev) => new Set(prev).add(slotId))
      setPlacedPieces((prev) => new Set(prev).add(pieceId))
      return 'correct'
    },
    [round, placedSlots, placedPieces],
  )

  const reset = useCallback(() => {
    setRound((prev) => buildRound(prev.id + 1))
    setPlacedSlots(new Set())
    setPlacedPieces(new Set())
  }, [])

  const isComplete = round.slots.length > 0 && placedSlots.size === round.slots.length

  return useMemo(
    () => ({ round, placedSlots, placedPieces, isComplete, attempt, reset }),
    [round, placedSlots, placedPieces, isComplete, attempt, reset],
  )
}
