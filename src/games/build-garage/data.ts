/**
 * Build Garage - static content.
 *
 * An assembly game: drag each part onto the vehicle and it snaps into its
 * place. The vehicle is drawn as one coherent picture, so parts always line
 * up. Montessori focus: construction, part-whole relationships, fine motor.
 */

export type PartKind = 'body' | 'wheel' | 'cabin' | 'light'

export interface Slot {
  id: string
  kind: PartKind
  /** Centre x / y as a percentage of the build frame (used for glow + drop). */
  x: number
  y: number
  /** Glow-ring diameter as a percentage of the frame width. */
  size: number
}

/** The whole vehicle. Level N builds the first (3 + N) parts, capped at 5. */
export const ALL_SLOTS: readonly Slot[] = [
  { id: 'body', kind: 'body', x: 50, y: 59, size: 58 },
  { id: 'wheelBack', kind: 'wheel', x: 32, y: 78, size: 26 },
  { id: 'wheelFront', kind: 'wheel', x: 68, y: 78, size: 26 },
  { id: 'cabin', kind: 'cabin', x: 71, y: 33, size: 36 },
  { id: 'light', kind: 'light', x: 71, y: 15, size: 18 },
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
