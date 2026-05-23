/**
 * Shape Sorting - static content.
 *
 * The game is a shape match: a coloured wooden block is matched to the
 * cut-out hole of the same shape. Montessori focus: shape discrimination,
 * fine motor coordination.
 */

export const SHAPE_KEYS = ['circle', 'square', 'triangle', 'star', 'heart'] as const
export type ShapeKey = (typeof SHAPE_KEYS)[number]

/** Friendly, distinct block colours. */
export const SHAPE_COLORS: Record<ShapeKey, string> = {
  circle: '#5B91C0',
  square: '#E0883B',
  triangle: '#6FA868',
  star: '#E6B23C',
  heart: '#D77E94',
}

export const BOARD_WOOD = '#CFA074'
export const BOARD_WOOD_EDGE = '#B6855A'
export const HOLE_DARK = '#5B4229'

/** Rounds draw 3 shapes from the pool of 5. */
export const ROUND_SIZE = 3
