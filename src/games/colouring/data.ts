/**
 * Colouring ("Malen") - static content and tuning.
 *
 * The child picks a colour, then colours a simple outline picture. Early
 * levels are fill-only: tap a region and it fills solid. From level 2 a tool
 * toggle appears - keep tapping to fill, or pick the brush for true freehand
 * painting. There is no "wrong" colour and no score.
 *
 * Ten pictures, half of them automobile-related, drawn in a 200 x 200 viewBox.
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

/** Paper and outline colours for the colouring sheet. */
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

/* ------------------------------- Pictures -------------------------------- */

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

const CAR: Picture = {
  id: 'car',
  decor: [],
  regions: [
    { id: 'body', shapes: [{ kind: 'rect', x: 30, y: 104, w: 140, h: 46, rx: 20 }] },
    { id: 'roof', shapes: [{ kind: 'rect', x: 68, y: 64, w: 64, h: 44, rx: 14 }] },
    {
      id: 'wheels',
      shapes: [
        { kind: 'circle', cx: 64, cy: 152, r: 24 },
        { kind: 'circle', cx: 136, cy: 152, r: 24 },
      ],
    },
  ],
}

const SUN: Picture = {
  id: 'sun',
  decor: [],
  regions: [
    {
      id: 'rays',
      shapes: [
        {
          kind: 'path',
          d: 'M100 8 L121 40 L158 32 L150 69 L182 90 L150 111 L158 148 L121 140 L100 172 L79 140 L42 148 L50 111 L18 90 L50 69 L42 32 L79 40 Z',
        },
      ],
    },
    { id: 'core', shapes: [{ kind: 'circle', cx: 100, cy: 90, r: 46 }] },
    {
      id: 'cloud',
      shapes: [
        {
          kind: 'path',
          d: 'M40 182 Q28 182 28 170 Q28 158 42 161 Q46 146 63 151 Q76 142 85 157 Q100 155 98 170 Q104 173 99 182 Z',
        },
      ],
    },
  ],
}

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

const TRUCK: Picture = {
  id: 'truck',
  decor: [],
  regions: [
    { id: 'cargo', shapes: [{ kind: 'rect', x: 24, y: 84, w: 96, h: 64, rx: 10 }] },
    { id: 'cab', shapes: [{ kind: 'rect', x: 124, y: 96, w: 52, h: 52, rx: 12 }] },
    { id: 'window', shapes: [{ kind: 'rect', x: 132, y: 104, w: 30, h: 22, rx: 5 }] },
    {
      id: 'wheels',
      shapes: [
        { kind: 'circle', cx: 56, cy: 156, r: 20 },
        { kind: 'circle', cx: 148, cy: 156, r: 20 },
      ],
    },
  ],
}

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

const BUS: Picture = {
  id: 'bus',
  decor: [],
  regions: [
    { id: 'roofBody', shapes: [{ kind: 'rect', x: 26, y: 74, w: 148, h: 42, rx: 16 }] },
    { id: 'lowerBody', shapes: [{ kind: 'rect', x: 26, y: 112, w: 148, h: 42, rx: 10 }] },
    {
      id: 'windows',
      shapes: [
        { kind: 'rect', x: 40, y: 82, w: 34, h: 24, rx: 5 },
        { kind: 'rect', x: 86, y: 82, w: 34, h: 24, rx: 5 },
        { kind: 'rect', x: 132, y: 82, w: 22, h: 24, rx: 5 },
      ],
    },
    { id: 'door', shapes: [{ kind: 'rect', x: 150, y: 118, w: 22, h: 36, rx: 4 }] },
    {
      id: 'wheels',
      shapes: [
        { kind: 'circle', cx: 62, cy: 158, r: 20 },
        { kind: 'circle', cx: 140, cy: 158, r: 20 },
      ],
    },
  ],
}

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

const TRACTOR: Picture = {
  id: 'tractor',
  decor: [],
  regions: [
    { id: 'body', shapes: [{ kind: 'rect', x: 54, y: 104, w: 108, h: 42, rx: 14 }] },
    { id: 'exhaust', shapes: [{ kind: 'rect', x: 62, y: 62, w: 13, h: 46, rx: 6 }] },
    { id: 'cabin', shapes: [{ kind: 'rect', x: 112, y: 62, w: 58, h: 46, rx: 12 }] },
    { id: 'window', shapes: [{ kind: 'rect', x: 120, y: 70, w: 36, h: 28, rx: 5 }] },
    { id: 'bigWheel', shapes: [{ kind: 'circle', cx: 146, cy: 148, r: 36 }] },
    { id: 'smallWheel', shapes: [{ kind: 'circle', cx: 66, cy: 158, r: 24 }] },
  ],
}

const DIGGER: Picture = {
  id: 'digger',
  decor: [],
  regions: [
    { id: 'track', shapes: [{ kind: 'rect', x: 28, y: 152, w: 118, h: 34, rx: 17 }] },
    { id: 'body', shapes: [{ kind: 'rect', x: 48, y: 106, w: 92, h: 48, rx: 12 }] },
    { id: 'cabin', shapes: [{ kind: 'rect', x: 52, y: 70, w: 50, h: 40, rx: 10 }] },
    { id: 'window', shapes: [{ kind: 'rect', x: 58, y: 78, w: 30, h: 22, rx: 5 }] },
    { id: 'exhaust', shapes: [{ kind: 'rect', x: 110, y: 74, w: 12, h: 34, rx: 5 }] },
    { id: 'arm', shapes: [{ kind: 'path', d: 'M128 132 L168 86 L186 98 L146 146 Z' }] },
    { id: 'bucket', shapes: [{ kind: 'path', d: 'M156 96 L196 92 L192 126 Q176 136 160 122 Z' }] },
  ],
}

/** Ten pictures, ordered so the region count rises gently with the level. */
export const PICTURES: readonly Picture[] = [
  FLOWER,
  CAR,
  SUN,
  HOUSE,
  TRUCK,
  FISH,
  BUS,
  BOAT,
  TRACTOR,
  DIGGER,
]

/** From this level on, the fill / paint tool toggle appears. */
export const PAINT_UNLOCK_LEVEL = 2

/** The picture shown at a given session level (the last one repeats). */
export function pictureForLevel(level: number): Picture {
  return PICTURES[Math.min(level, PICTURES.length - 1)]
}
