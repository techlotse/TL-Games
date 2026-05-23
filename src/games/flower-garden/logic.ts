import { useCallback, useMemo, useState } from 'react'
import { shuffle } from '@/lib/utils'
import {
  COVER_KINDS,
  CREATURE_KINDS,
  decoysForLevel,
  spotCountForLevel,
  type CoverKind,
  type CreatureKind,
} from './data'

export interface Spot {
  id: string
  cover: CoverKind
  creature: CreatureKind | null
}

export interface GardenRound {
  id: number
  spots: Spot[]
  creatureCount: number
}

export interface GardenGame {
  round: GardenRound
  found: ReadonlySet<string>
  isComplete: boolean
  tap: (spotId: string) => 'creature' | 'empty'
  reset: () => void
}

function pick<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function buildRound(id: number): GardenRound {
  const spotCount = spotCountForLevel(id)
  const creatureCount = Math.max(1, spotCount - decoysForLevel(id))
  const creatureSpots = new Set(
    shuffle(Array.from({ length: spotCount }, (_, i) => i)).slice(0, creatureCount),
  )
  const creatures = shuffle(CREATURE_KINDS)
  let next = 0
  const spots: Spot[] = Array.from({ length: spotCount }, (_, i) => ({
    id: `s${i}`,
    cover: pick(COVER_KINDS),
    creature: creatureSpots.has(i) ? creatures[next++ % creatures.length] : null,
  }))
  return { id, spots, creatureCount }
}

/**
 * Flower Garden game logic. Difficulty ramps within a session: more spots and
 * a couple of empty decoys. Resets when the screen is left.
 */
export function useFlowerGarden(): GardenGame {
  const [round, setRound] = useState<GardenRound>(() => buildRound(0))
  const [found, setFound] = useState<Set<string>>(() => new Set())

  const tap = useCallback(
    (spotId: string): 'creature' | 'empty' => {
      const spot = round.spots.find((s) => s.id === spotId)
      if (!spot || !spot.creature) return 'empty'
      setFound((prev) => (prev.has(spotId) ? prev : new Set(prev).add(spotId)))
      return 'creature'
    },
    [round],
  )

  const reset = useCallback(() => {
    setRound((prev) => buildRound(prev.id + 1))
    setFound(new Set())
  }, [])

  const isComplete = round.creatureCount > 0 && found.size === round.creatureCount

  return useMemo(
    () => ({ round, found, isComplete, tap, reset }),
    [round, found, isComplete, tap, reset],
  )
}
