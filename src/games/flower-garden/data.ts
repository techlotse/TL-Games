/**
 * Flower Garden - static content.
 *
 * A find-and-tap discovery game: tap the bushes, leaves and flowers to reveal
 * the little creatures hiding in the garden. Montessori focus: observation,
 * cause and effect, gentle exploration.
 */

export type CoverKind = 'bush' | 'leaf' | 'flower' | 'log' | 'mushroom' | 'rock'
export type CreatureKind = 'butterfly' | 'ladybug' | 'bee' | 'snail' | 'chick'

export const COVER_KINDS: readonly CoverKind[] = [
  'bush',
  'leaf',
  'flower',
  'log',
  'mushroom',
  'rock',
]

export const CREATURE_KINDS: readonly CreatureKind[] = [
  'butterfly',
  'ladybug',
  'bee',
  'snail',
  'chick',
]

/** How many hiding spots are shown at a given difficulty level (3 - 7). */
export function spotCountForLevel(level: number): number {
  return Math.min(3 + level, 7)
}

/** How many spots are empty decoys - grows slowly, capped at 2. */
export function decoysForLevel(level: number): number {
  return Math.min(level, 2)
}
