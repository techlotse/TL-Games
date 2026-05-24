/**
 * Find-an-item ("Suchen") - static content and tuning.
 *
 * One item is shown in a frame; the child finds and taps that same item among
 * the others scattered across the scene. A new item is then shown, until every
 * item has been found. Difficulty ramps within a session: more items appear
 * the longer the child plays. There is no score and no failure.
 */

export type ItemKind =
  | 'apple'
  | 'star'
  | 'heart'
  | 'flower'
  | 'leaf'
  | 'fish'
  | 'butterfly'
  | 'ball'

/** Every item kind. Each appears at most once per scene, so a target is unambiguous. */
export const ITEM_KINDS: readonly ItemKind[] = [
  'apple',
  'star',
  'heart',
  'flower',
  'leaf',
  'fish',
  'butterfly',
  'ball',
]

export const FIND = {
  /** Items in the first scene of a session. */
  startCount: 4,
  /** Items never exceed this (also the scatter grid capacity). */
  maxCount: 8,
  /** The scene is scattered over a cols x rows grid, one item per cell. */
  cols: 3,
  rows: 3,
} as const

/** Number of items to scatter at a given session level. */
export function countForLevel(level: number): number {
  return Math.min(FIND.startCount + level, FIND.maxCount)
}
