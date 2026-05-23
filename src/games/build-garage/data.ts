/**
 * Build Garage - static content.
 *
 * An assembly game: drag each part onto its place on the vehicle. The vehicle
 * gains one part per round. Montessori focus: construction, part-whole
 * relationships, fine motor coordination.
 */

export type PartKind = 'body' | 'wheel' | 'cabin' | 'light'

export interface Slot {
  id: string
  kind: PartKind
  x: number
  y: number
  size: number
}

/** The whole vehicle. Level N builds the first (3 + N) parts, capped at 5. */
export const ALL_SLOTS: readonly Slot[] = [
  { id: 'body', kind: 'body', x: 50, y: 58, size: 84 },
  { id: 'wheelBack', kind: 'wheel', x: 30, y: 82, size: 26 },
  { id: 'wheelFront', kind: 'wheel', x: 70, y: 82, size: 26 },
  { id: 'cabin', kind: 'cabin', x: 65, y: 34, size: 34 },
  { id: 'light', kind: 'light', x: 65, y: 14, size: 20 },
]

export const MIN_PARTS = 3
export const MAX_PARTS = 5

/** Slots active at a given difficulty level. */
export function slotsForLevel(level: number): Slot[] {
  return ALL_SLOTS.slice(0, Math.min(MIN_PARTS + level, MAX_PARTS))
}

/** Warm, "wooden toy" vehicle palette. */
export const PART_COLORS = {
  body: '#E0883B',
  bodyTrim: '#C8722B',
  wheel: '#403A38',
  wheelHub: '#C2E1EA',
  cabin: '#4F86AF',
  glass: '#CFE7EF',
  light: '#E6B23C',
  lightBase: '#403A38',
} as const

export type PartPalette = Record<keyof typeof PART_COLORS, string>
