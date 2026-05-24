/**
 * Colouring ("Malen") - static content and tuning.
 *
 * The child picks a colour, then colours a simple outline picture. Early
 * levels are fill-only: tap a region and it fills solid. From level 2 a tool
 * toggle appears - keep tapping to fill, or pick the brush and sweep a finger
 * across the picture to paint it in. There is no "wrong" colour and no score.
 *
 * All shape coordinates are in the picture's 200 x 200 viewBox.
 */

export type ColourId =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'pink'
  | 'brown'

export interface Swatch {
  id: ColourId
  hex: string
  /** German colour word - used only as an accessibility label. */
  label: string
}

/** The palette - eight calm, friendly crayon colours. */
export const SWATCHES: readonly Swatch[] = [
  { id: 'red', hex: '#E0584C', label: 'Rot' },
  { id: 'orange', hex: '#E89A3C', label: 'Orange' },
  { id: 'yellow', hex: '#F2C94C', label: 'Gelb' },
  { id: 'green', hex: '#6FA86A', label: 'Grün' },
  { id: 'blue', hex: '#5B91C4', label: 'Blau' },
  { id: 'purple', hex: '#9B7BC4', label: 'Lila' },
  { id: 'pink', hex: '#E58FB0', label: 'Rosa' },
  { id: 'brown', hex: '#9A6B45', label: 'Braun' },
]

/** Quick colour-id -> hex lookup. */
export const COLOUR_HEX: Record<ColourId, string> = Object.fromEntries(
  SWATCHES.map((s) => [s.id, s.hex]),
) as Record<ColourId, string>

/**
 * Paper and outline colours for the colouring sheet. A colouring sheet reads
 * as paper in both themes, so these are intentionally literal (artwork).
 */
export const SHEET = {
  paper: '#FCF8EE',
  ink: '#4A4036',
} as const

/** A single drawable shape. Several shapes can make up one colourable region. */
export type Shape =
  | { kind: 'rect'; x: number; y: number; w: number; h: number; rx?: number }
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { kind: 'path'; d: string }

/** One colourable area. Its shapes always fill together, as a single piece. */
export interface Region {
  id: string
  shapes: Shape[]
}

export interface Picture {
  id: string
  /** Ink details drawn on top of the regions (eyes, masts). Not colourable. */
  decor: Shape[]
  regions: Region[]
}

export const PICTURE_VIEWBOX = '0 0 200 200'

/** Picture 1 - a flower (3 regions). */
const FLOWER: Picture = {
  id: 'flower',
  decor: [],
  regions: [
    {
      id: 'stem',
      shapes: [
        { kind: 'rect', x: 95, y: 128, w: 10, h: 58 },
        { kind: 'path', d: 'M99 156 C 74 150 58 162 66 182 C 90 186 101 170 99 156 Z' },
      ],
    },
    {
      id: 'petals',
      shapes: [
        { kind: 'circle', cx: 100, cy: 52, r: 22 },
        { kind: 'circle', cx: 135, cy: 72, r: 22 },
        { kind: 'circle', cx: 135, cy: 112, r: 22 },
        { kind: 'circle', cx: 100, cy: 132, r: 22 },
        { kind: 'circle', cx: 65, cy: 112, r: 22 },
        { kind: 'circle', cx: 65, cy: 72, r: 22 },
      ],
    },
    { id: 'center', shapes: [{ kind: 'circle', cx: 100, cy: 92, r: 25 }] },
  ],
}

/** Picture 2 - a house (4 regions). */
const HOUSE: Picture = {
  id: 'house',
  decor: [],
  regions: [
    { id: 'wall', shapes: [{ kind: 'rect', x: 56, y: 96, w: 88, h: 86 }] },
    { id: 'roof', shapes: [{ kind: 'path', d: 'M44 98 L100 46 L156 98 Z' }] },
    { id: 'door', shapes: [{ kind: 'rect', x: 86, y: 132, w: 28, h: 50, rx: 5 }] },
    { id: 'window', shapes: [{ kind: 'rect', x: 66, y: 112, w: 30, h: 30, rx: 5 }] },
  ],
}

/** Picture 3 - a fish (5 regions). */
const FISH: Picture = {
  id: 'fish',
  decor: [{ kind: 'circle', cx: 116, cy: 92, r: 6 }],
  regions: [
    { id: 'tail', shapes: [{ kind: 'path', d: 'M146 104 L192 72 L192 136 Z' }] },
    { id: 'body', shapes: [{ kind: 'ellipse', cx: 94, cy: 104, rx: 58, ry: 40 }] },
    { id: 'fin', shapes: [{ kind: 'path', d: 'M74 66 Q96 36 118 70 Z' }] },
    { id: 'stripe', shapes: [{ kind: 'ellipse', cx: 68, cy: 104, rx: 15, ry: 36 }] },
    { id: 'bubble', shapes: [{ kind: 'circle', cx: 40, cy: 46, r: 15 }] },
  ],
}

/** Picture 4 - a sailing boat (6 regions). */
const BOAT: Picture = {
  id: 'boat',
  decor: [{ kind: 'rect', x: 101, y: 26, w: 5, h: 100 }],
  regions: [
    { id: 'water', shapes: [{ kind: 'rect', x: 14, y: 150, w: 172, h: 38, rx: 10 }] },
    { id: 'hull', shapes: [{ kind: 'path', d: 'M48 128 L152 128 L134 162 L66 162 Z' }] },
    { id: 'sailBig', shapes: [{ kind: 'path', d: 'M104 34 L104 122 L158 122 Z' }] },
    { id: 'sailSmall', shapes: [{ kind: 'path', d: 'M98 58 L98 122 L56 122 Z' }] },
    { id: 'sun', shapes: [{ kind: 'circle', cx: 40, cy: 46, r: 20 }] },
    { id: 'flag', shapes: [{ kind: 'path', d: 'M104 28 L134 36 L104 44 Z' }] },
  ],
}

/** Pictures, ordered so the region count rises gently with the level. */
export const PICTURES: readonly Picture[] = [FLOWER, HOUSE, FISH, BOAT]

/** From this level on, the fill / paint tool toggle appears. */
export const PAINT_UNLOCK_LEVEL = 2

/** The picture shown at a given session level (the last one repeats). */
export function pictureForLevel(level: number): Picture {
  return PICTURES[Math.min(level, PICTURES.length - 1)]
}
