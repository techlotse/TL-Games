import { useCallback, useMemo, useState } from 'react'
import { shuffle } from '@/lib/utils'
import { vehicleForLevel, type Part, type Vehicle } from './data'

export interface AssemblyRound {
  id: number
  vehicle: Vehicle
  tray: Part[]
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
  const vehicle = vehicleForLevel(id)
  return { id, vehicle, tray: shuffle(vehicle.parts) }
}

/**
 * Build Garage game logic. Each completed vehicle is replaced by the next
 * type - a little larger, a few more parts. Resets when the screen is left.
 */
export function useBuildGarage(): AssemblyGame {
  const [round, setRound] = useState<AssemblyRound>(() => buildRound(0))
  const [placedSlots, setPlacedSlots] = useState<Set<string>>(() => new Set())
  const [placedPieces, setPlacedPieces] = useState<Set<string>>(() => new Set())

  const attempt = useCallback(
    (pieceId: string, slotId: string): 'correct' | 'wrong' => {
      const piece = round.tray.find((p) => p.id === pieceId)
      const slot = round.vehicle.parts.find((s) => s.id === slotId)
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

  const isComplete =
    round.vehicle.parts.length > 0 && placedSlots.size === round.vehicle.parts.length

  return useMemo(
    () => ({ round, placedSlots, placedPieces, isComplete, attempt, reset }),
    [round, placedSlots, placedPieces, isComplete, attempt, reset],
  )
}
