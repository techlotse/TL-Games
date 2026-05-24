/**
 * Flower Garden - static content.
 *
 * A colour-matching game: each flower is matched to the plant pot of the same
 * colour, then it stands planted in the pot. The flowers are six plants seen
 * across Switzerland; their German names are shown as a hint for the parent.
 */

export type FlowerKey = 'enzian' | 'alpenrose' | 'loewenzahn' | 'krokus' | 'edelweiss' | 'mohn'

export type PetalStyle = 'star' | 'round' | 'broad'

export interface Flower {
  /** German name - a hint for the accompanying parent. */
  name: string
  petal: string
  petalDark: string
  center: string
  style: PetalStyle
}

/** Six Swiss flowers, each a clear and distinct colour for matching. */
export const FLOWERS: Record<FlowerKey, Flower> = {
  enzian: { name: 'Enzian', petal: '#3F73B8', petalDark: '#335E97', center: '#F2D98C', style: 'star' },
  alpenrose: { name: 'Alpenrose', petal: '#D96A86', petalDark: '#C2566F', center: '#F2D98C', style: 'round' },
  loewenzahn: { name: 'Löwenzahn', petal: '#EBC24A', petalDark: '#D2A630', center: '#C8881F', style: 'star' },
  krokus: { name: 'Krokus', petal: '#9B7BC4', petalDark: '#8366AE', center: '#F2D98C', style: 'round' },
  edelweiss: { name: 'Edelweiss', petal: '#F1ECDC', petalDark: '#D7CFB8', center: '#E2B23C', style: 'star' },
  mohn: { name: 'Mohn', petal: '#D64B45', petalDark: '#BE3C37', center: '#33302E', style: 'broad' },
}

export const FLOWER_KEYS = Object.keys(FLOWERS) as FlowerKey[]

export const STEM_COLOR = '#6E9C5C'
export const LEAF_COLOR = '#7EAC68'
export const SOIL_COLOR = '#6E4A30'
