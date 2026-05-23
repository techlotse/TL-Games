/**
 * Flower Garden - static content.
 *
 * The game is a colour match: a flower is matched to the plant pot of the
 * same colour. Montessori focus: colour matching, classification, sorting.
 */

export interface FlowerColor {
  petal: string
  petalDark: string
  center: string
}

export const FLOWER_KEYS = ['rose', 'sunny', 'sky', 'mint', 'lilac'] as const
export type FlowerKey = (typeof FLOWER_KEYS)[number]

/** Soft, warm pastel garden palette. */
export const FLOWER_COLORS: Record<FlowerKey, FlowerColor> = {
  rose: { petal: '#E48AA6', petalDark: '#CE7090', center: '#F6DE9C' },
  sunny: { petal: '#EBC255', petalDark: '#D4A833', center: '#E59A3C' },
  sky: { petal: '#79A9D1', petalDark: '#5F8FBA', center: '#F6DE9C' },
  mint: { petal: '#77BF9A', petalDark: '#5EA681', center: '#F6DE9C' },
  lilac: { petal: '#B296D0', petalDark: '#997CB9', center: '#F6DE9C' },
}

export const STEM_COLOR = '#6E9C5C'
export const LEAF_COLOR = '#7EAC68'
export const SOIL_COLOR = '#7C5839'

/** Rounds draw 3 flowers from the pool of 5. */
export const ROUND_SIZE = 3
