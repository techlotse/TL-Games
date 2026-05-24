/**
 * Shape Sorting - static content.
 *
 * A shape match: a coloured wooden block is matched to the cut-out hole of
 * the same shape. There are three holes; harder levels add extra blocks with
 * no hole, and the blocks come in varied sizes. Montessori focus: shape
 * discrimination over size, fine motor coordination.
 */

export const SHAPE_KEYS = [
  'circle',
  'square',
  'triangle',
  'star',
  'heart',
  'hexagon',
  'diamond',
  'oval',
  'pentagon',
] as const
export type ShapeKey = (typeof SHAPE_KEYS)[number]

/** Friendly, distinct block colours. */
export const SHAPE_COLORS: Record<ShapeKey, string> = {
  circle: '#5B91C0',
  square: '#E0883B',
  triangle: '#6FA868',
  star: '#E6B23C',
  heart: '#D77E94',
  hexagon: '#8E76C0',
  diamond: '#56B0A6',
  oval: '#D9685C',
  pentagon: '#C9943C',
}

export const BOARD_WOOD = '#CFA074'
export const BOARD_WOOD_EDGE = '#B6855A'
export const HOLE_DARK = '#5B4229'
