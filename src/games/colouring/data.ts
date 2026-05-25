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

/** A blank sheet - free painting, no outline. */
const BLANK: Picture = { id: 'blank', decor: [], regions: [] }

const CAT: Picture = {
  id: 'cat',
  decor: [
    { kind: 'circle', cx: 84, cy: 80, r: 5 },
    { kind: 'circle', cx: 116, cy: 80, r: 5 },
    { kind: 'path', d: 'M93 92 L107 92 L100 100 Z' },
  ],
  regions: [
    { id: 'tail', shapes: [{ kind: 'path', d: 'M142 154 Q182 150 176 108 Q168 132 148 136 Q160 152 142 154 Z' }] },
    { id: 'body', shapes: [{ kind: 'ellipse', cx: 100, cy: 142, rx: 48, ry: 36 }] },
    { id: 'head', shapes: [{ kind: 'circle', cx: 100, cy: 82, r: 42 }] },
    {
      id: 'ears',
      shapes: [
        { kind: 'path', d: 'M70 52 L58 18 L96 44 Z' },
        { kind: 'path', d: 'M130 52 L142 18 L104 44 Z' },
      ],
    },
  ],
}

const ROCKET: Picture = {
  id: 'rocket',
  decor: [],
  regions: [
    { id: 'flame', shapes: [{ kind: 'path', d: 'M76 132 Q86 178 100 150 Q114 178 124 132 Z' }] },
    {
      id: 'fins',
      shapes: [
        { kind: 'path', d: 'M70 110 L46 154 L70 148 Z' },
        { kind: 'path', d: 'M130 110 L154 154 L130 148 Z' },
      ],
    },
    { id: 'body', shapes: [{ kind: 'path', d: 'M100 22 Q132 64 130 134 L70 134 Q68 64 100 22 Z' }] },
    { id: 'window', shapes: [{ kind: 'circle', cx: 100, cy: 80, r: 19 }] },
  ],
}

const BUTTERFLY: Picture = {
  id: 'butterfly',
  decor: [],
  regions: [
    {
      id: 'leftWing',
      shapes: [
        { kind: 'ellipse', cx: 66, cy: 80, rx: 32, ry: 30 },
        { kind: 'ellipse', cx: 60, cy: 134, rx: 25, ry: 26 },
      ],
    },
    {
      id: 'rightWing',
      shapes: [
        { kind: 'ellipse', cx: 134, cy: 80, rx: 32, ry: 30 },
        { kind: 'ellipse', cx: 140, cy: 134, rx: 25, ry: 26 },
      ],
    },
    {
      id: 'body',
      shapes: [
        { kind: 'ellipse', cx: 100, cy: 108, rx: 11, ry: 50 },
        { kind: 'circle', cx: 100, cy: 52, r: 9 },
      ],
    },
  ],
}

const BALLOON: Picture = {
  id: 'balloon',
  decor: [
    { kind: 'rect', x: 78, y: 150, w: 3, h: 16 },
    { kind: 'rect', x: 119, y: 150, w: 3, h: 16 },
  ],
  regions: [
    { id: 'envelope', shapes: [{ kind: 'path', d: 'M100 28 Q152 34 152 100 Q152 132 100 152 Q48 132 48 100 Q48 34 100 28 Z' }] },
    { id: 'stripe', shapes: [{ kind: 'path', d: 'M88 30 Q80 92 90 150 Q100 152 110 150 Q120 92 112 30 Q100 28 88 30 Z' }] },
    { id: 'basket', shapes: [{ kind: 'rect', x: 82, y: 162, w: 36, h: 26, rx: 4 }] },
  ],
}

const TRAIN: Picture = {
  id: 'train',
  decor: [],
  regions: [
    { id: 'carriage', shapes: [{ kind: 'rect', x: 18, y: 112, w: 64, h: 44, rx: 8 }] },
    { id: 'body', shapes: [{ kind: 'rect', x: 88, y: 96, w: 92, h: 60, rx: 10 }] },
    { id: 'funnel', shapes: [{ kind: 'rect', x: 100, y: 56, w: 22, h: 42, rx: 5 }] },
    { id: 'cabin', shapes: [{ kind: 'rect', x: 140, y: 60, w: 40, h: 40, rx: 8 }] },
    {
      id: 'wheels',
      shapes: [
        { kind: 'circle', cx: 40, cy: 162, r: 14 },
        { kind: 'circle', cx: 112, cy: 166, r: 16 },
        { kind: 'circle', cx: 160, cy: 166, r: 16 },
      ],
    },
  ],
}

const ICECREAM: Picture = {
  id: 'icecream',
  decor: [],
  regions: [
    { id: 'cone', shapes: [{ kind: 'path', d: 'M70 112 L130 112 L100 188 Z' }] },
    { id: 'scoop1', shapes: [{ kind: 'circle', cx: 100, cy: 98, r: 36 }] },
    { id: 'scoop2', shapes: [{ kind: 'circle', cx: 100, cy: 58, r: 31 }] },
    { id: 'cherry', shapes: [{ kind: 'circle', cx: 100, cy: 28, r: 13 }] },
  ],
}

const SMILEY: Picture = {
  id: 'smiley',
  decor: [
    { kind: 'circle', cx: 74, cy: 84, r: 9 },
    { kind: 'circle', cx: 126, cy: 84, r: 9 },
    { kind: 'path', d: 'M60 112 Q100 164 140 112 Q100 138 60 112 Z' },
  ],
  regions: [
    { id: 'face', shapes: [{ kind: 'circle', cx: 100, cy: 100, r: 74 }] },
    { id: 'cheekLeft', shapes: [{ kind: 'circle', cx: 60, cy: 120, r: 13 }] },
    { id: 'cheekRight', shapes: [{ kind: 'circle', cx: 140, cy: 120, r: 13 }] },
  ],
}

const HEART: Picture = {
  id: 'heart',
  decor: [],
  regions: [
    { id: 'heart', shapes: [{ kind: 'path', d: 'M100 172 C 30 120 40 44 100 84 C 160 44 170 120 100 172 Z' }] },
    { id: 'shine', shapes: [{ kind: 'path', d: 'M70 70 Q56 96 70 116 Q84 98 80 76 Q76 68 70 70 Z' }] },
  ],
}

const STAR: Picture = {
  id: 'star',
  decor: [
    { kind: 'circle', cx: 84, cy: 92, r: 6 },
    { kind: 'circle', cx: 116, cy: 92, r: 6 },
    { kind: 'path', d: 'M82 108 Q100 134 118 108 Q100 122 82 108 Z' },
  ],
  regions: [
    { id: 'star', shapes: [{ kind: 'path', d: 'M100 22 L123 80 L185 84 L137 122 L153 182 L100 148 L47 182 L63 122 L15 84 L77 80 Z' }] },
  ],
}

/** Twenty pictures - a blank canvas, everyday objects and three emojis. */
export const PICTURES: readonly Picture[] = [
  FLOWER,
  BLANK,
  CAR,
  BUTTERFLY,
  SUN,
  BALLOON,
  HOUSE,
  SMILEY,
  TRUCK,
  CAT,
  FISH,
  HEART,
  BUS,
  ROCKET,
  ICECREAM,
  BOAT,
  STAR,
  TRAIN,
  TRACTOR,
  DIGGER,
]

/**
 * From this level the fill / paint toggle appears. It is 0 - the brush is
 * available from the very start, so the child can free-style straight away.
 */
export const PAINT_UNLOCK_LEVEL = 0

/** The picture shown at a given session level (the last one repeats). */
export function pictureForLevel(level: number): Picture {
  return PICTURES[Math.min(level, PICTURES.length - 1)]
}
