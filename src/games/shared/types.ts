import type { ReactNode } from 'react'

/** Identifies a matchable concept (a vehicle type, a colour, a shape ...). */
export type MatchKey = string

/** Outcome of attempting to place an item onto a target. */
export type PlaceResult = 'correct' | 'wrong'

/** A viewport coordinate. */
export interface Point {
  x: number
  y: number
}

/** Per-game artwork supplied to the shared MatchingBoard. */
export interface MatchRenderers {
  /** Draggable item artwork for the given key. */
  renderItem: (key: MatchKey) => ReactNode
  /** Target / outline artwork. `filled` becomes true once matched. */
  renderTarget: (key: MatchKey, filled: boolean) => ReactNode
}
