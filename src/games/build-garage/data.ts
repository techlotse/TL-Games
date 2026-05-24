/**
 * Build Garage - static content.
 *
 * An assembly game: drag each part onto the vehicle and it snaps into place.
 * Every vehicle is one coherent drawing - each part stores the exact box it
 * occupies and the shapes that draw it, so the glowing target, the tray piece
 * and the placed part always line up. Each completed vehicle is replaced by a
 * new type with more parts: car, truck, bus, tractor, bulldozer, excavator.
 */

/** Warm "wooden toy" palette. */
export const PART_COLORS = {
  body: '#E0883B',
  bodyTrim: '#C8722B',
  cabin: '#4F86AF',
  glass: '#CFE7EF',
  wheel: '#403A38',
  wheelHub: '#C2E1EA',
  metal: '#9AA3AA',
  metalDark: '#737C84',
  track: '#4A4340',
} as const

const C = PART_COLORS

/** A single drawing primitive in the vehicle's 300 x 220 viewBox. */
export type DrawShape =
  | { t: 'rect'; x: number; y: number; w: number; h: number; rx?: number; fill: string }
  | { t: 'circle'; cx: number; cy: number; r: number; fill: string }
  | { t: 'line'; x1: number; y1: number; x2: number; y2: number; sw: number; fill: string }
  | { t: 'path'; d: string; fill: string }

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

/** A part role. Parts that share a kind (e.g. wheels) are interchangeable. */
export type PartKind = string

export interface Part {
  id: string
  kind: PartKind
  /** The part's box - drives the glow, the tray crop and the drop target. */
  box: Box
  /** The shapes that draw the part, in the vehicle viewBox. */
  shapes: DrawShape[]
}

export interface Vehicle {
  id: string
  /** German name - a hint for the accompanying parent. */
  label: string
  parts: Part[]
}

/** Every vehicle is drawn in this viewBox. */
export const VEHICLE_VIEW = { w: 300, h: 220 } as const

function wheel(cx: number, cy: number, r: number): DrawShape[] {
  return [
    { t: 'circle', cx, cy, r, fill: C.wheel },
    { t: 'circle', cx, cy, r: r * 0.4, fill: C.wheelHub },
  ]
}

const CAR: Vehicle = {
  id: 'car',
  label: 'Auto',
  parts: [
    {
      id: 'body',
      kind: 'body',
      box: { x: 54, y: 74, w: 192, h: 86 },
      shapes: [
        { t: 'rect', x: 54, y: 110, w: 192, h: 48, rx: 20, fill: C.body },
        { t: 'rect', x: 108, y: 74, w: 96, h: 44, rx: 16, fill: C.body },
        { t: 'rect', x: 120, y: 84, w: 72, h: 26, rx: 8, fill: C.glass },
        { t: 'rect', x: 60, y: 140, w: 180, h: 16, rx: 8, fill: C.bodyTrim },
      ],
    },
    { id: 'wheelRear', kind: 'wheel', box: { x: 77, y: 137, w: 50, h: 50 }, shapes: wheel(102, 162, 25) },
    { id: 'wheelFront', kind: 'wheel', box: { x: 185, y: 137, w: 50, h: 50 }, shapes: wheel(210, 162, 25) },
  ],
}

const TRUCK: Vehicle = {
  id: 'truck',
  label: 'Lastwagen',
  parts: [
    {
      id: 'cargo',
      kind: 'cargo',
      box: { x: 48, y: 92, w: 128, h: 66 },
      shapes: [
        { t: 'rect', x: 48, y: 92, w: 128, h: 66, rx: 10, fill: C.body },
        { t: 'rect', x: 56, y: 104, w: 112, h: 10, rx: 5, fill: C.bodyTrim },
        { t: 'rect', x: 56, y: 124, w: 112, h: 10, rx: 5, fill: C.bodyTrim },
      ],
    },
    {
      id: 'cab',
      kind: 'cab',
      box: { x: 182, y: 98, w: 64, h: 60 },
      shapes: [
        { t: 'rect', x: 182, y: 98, w: 64, h: 60, rx: 12, fill: C.cabin },
        { t: 'rect', x: 192, y: 108, w: 32, h: 26, rx: 6, fill: C.glass },
      ],
    },
    { id: 'wheelRear', kind: 'wheel', box: { x: 72, y: 142, w: 48, h: 48 }, shapes: wheel(96, 166, 24) },
    { id: 'wheelFront', kind: 'wheel', box: { x: 188, y: 142, w: 48, h: 48 }, shapes: wheel(212, 166, 24) },
  ],
}

const BUS: Vehicle = {
  id: 'bus',
  label: 'Bus',
  parts: [
    {
      id: 'lowerBody',
      kind: 'body',
      box: { x: 40, y: 118, w: 224, h: 42 },
      shapes: [{ t: 'rect', x: 40, y: 118, w: 224, h: 42, rx: 12, fill: C.body }],
    },
    {
      id: 'upperBody',
      kind: 'upper',
      box: { x: 40, y: 66, w: 224, h: 56 },
      shapes: [
        { t: 'rect', x: 40, y: 66, w: 224, h: 56, rx: 14, fill: C.cabin },
        { t: 'rect', x: 56, y: 78, w: 44, h: 30, rx: 6, fill: C.glass },
        { t: 'rect', x: 112, y: 78, w: 44, h: 30, rx: 6, fill: C.glass },
        { t: 'rect', x: 168, y: 78, w: 40, h: 30, rx: 6, fill: C.glass },
      ],
    },
    {
      id: 'door',
      kind: 'door',
      box: { x: 220, y: 100, w: 32, h: 60 },
      shapes: [
        { t: 'rect', x: 220, y: 100, w: 32, h: 60, rx: 6, fill: C.glass },
        { t: 'rect', x: 234, y: 100, w: 3, h: 60, fill: C.cabin },
      ],
    },
    { id: 'wheelRear', kind: 'wheel', box: { x: 72, y: 144, w: 44, h: 44 }, shapes: wheel(94, 166, 22) },
    { id: 'wheelFront', kind: 'wheel', box: { x: 194, y: 144, w: 44, h: 44 }, shapes: wheel(216, 166, 22) },
  ],
}

const TRACTOR: Vehicle = {
  id: 'tractor',
  label: 'Traktor',
  parts: [
    {
      id: 'body',
      kind: 'body',
      box: { x: 70, y: 112, w: 148, h: 42 },
      shapes: [
        { t: 'rect', x: 70, y: 112, w: 148, h: 42, rx: 14, fill: C.body },
        { t: 'rect', x: 74, y: 138, w: 140, h: 12, rx: 6, fill: C.bodyTrim },
      ],
    },
    {
      id: 'cabin',
      kind: 'cabin',
      box: { x: 150, y: 64, w: 74, h: 56 },
      shapes: [
        { t: 'rect', x: 150, y: 64, w: 74, h: 56, rx: 12, fill: C.cabin },
        { t: 'rect', x: 160, y: 74, w: 42, h: 30, rx: 6, fill: C.glass },
      ],
    },
    {
      id: 'exhaust',
      kind: 'exhaust',
      box: { x: 92, y: 68, w: 12, h: 48 },
      shapes: [{ t: 'rect', x: 92, y: 68, w: 12, h: 48, rx: 6, fill: C.metalDark }],
    },
    { id: 'wheelFront', kind: 'wheelSmall', box: { x: 84, y: 142, w: 48, h: 48 }, shapes: wheel(108, 166, 24) },
    { id: 'wheelRear', kind: 'wheelBig', box: { x: 168, y: 110, w: 80, h: 80 }, shapes: wheel(208, 150, 40) },
  ],
}

const BULLDOZER: Vehicle = {
  id: 'bulldozer',
  label: 'Planierraupe',
  parts: [
    {
      id: 'track',
      kind: 'track',
      box: { x: 52, y: 150, w: 180, h: 40 },
      shapes: [
        { t: 'rect', x: 52, y: 150, w: 180, h: 40, rx: 20, fill: C.track },
        { t: 'circle', cx: 80, cy: 170, r: 10, fill: C.wheelHub },
        { t: 'circle', cx: 122, cy: 170, r: 10, fill: C.wheelHub },
        { t: 'circle', cx: 164, cy: 170, r: 10, fill: C.wheelHub },
        { t: 'circle', cx: 206, cy: 170, r: 10, fill: C.wheelHub },
      ],
    },
    {
      id: 'body',
      kind: 'body',
      box: { x: 96, y: 98, w: 120, h: 56 },
      shapes: [
        { t: 'rect', x: 96, y: 98, w: 120, h: 56, rx: 14, fill: C.body },
        { t: 'rect', x: 100, y: 138, w: 112, h: 14, rx: 7, fill: C.bodyTrim },
      ],
    },
    {
      id: 'cabin',
      kind: 'cabin',
      box: { x: 150, y: 58, w: 70, h: 46 },
      shapes: [
        { t: 'rect', x: 150, y: 58, w: 70, h: 46, rx: 12, fill: C.cabin },
        { t: 'rect', x: 160, y: 68, w: 40, h: 26, rx: 6, fill: C.glass },
      ],
    },
    {
      id: 'blade',
      kind: 'blade',
      box: { x: 22, y: 112, w: 44, h: 82 },
      shapes: [{ t: 'path', d: 'M30 116 Q22 152 36 190 L62 190 L62 116 Z', fill: C.metal }],
    },
    {
      id: 'arm',
      kind: 'arm',
      box: { x: 58, y: 132, w: 48, h: 16 },
      shapes: [{ t: 'rect', x: 58, y: 132, w: 48, h: 16, rx: 8, fill: C.metalDark }],
    },
    {
      id: 'exhaust',
      kind: 'exhaust',
      box: { x: 106, y: 64, w: 13, h: 38 },
      shapes: [{ t: 'rect', x: 106, y: 64, w: 13, h: 38, rx: 6, fill: C.metalDark }],
    },
  ],
}

const EXCAVATOR: Vehicle = {
  id: 'excavator',
  label: 'Bagger',
  parts: [
    {
      id: 'track',
      kind: 'track',
      box: { x: 44, y: 152, w: 156, h: 40 },
      shapes: [
        { t: 'rect', x: 44, y: 152, w: 156, h: 40, rx: 20, fill: C.track },
        { t: 'circle', cx: 70, cy: 172, r: 10, fill: C.wheelHub },
        { t: 'circle', cx: 108, cy: 172, r: 10, fill: C.wheelHub },
        { t: 'circle', cx: 146, cy: 172, r: 10, fill: C.wheelHub },
        { t: 'circle', cx: 184, cy: 172, r: 10, fill: C.wheelHub },
      ],
    },
    {
      id: 'body',
      kind: 'body',
      box: { x: 66, y: 104, w: 128, h: 52 },
      shapes: [
        { t: 'rect', x: 66, y: 104, w: 128, h: 52, rx: 14, fill: C.body },
        { t: 'rect', x: 70, y: 140, w: 120, h: 14, rx: 7, fill: C.bodyTrim },
      ],
    },
    {
      id: 'cabin',
      kind: 'cabin',
      box: { x: 72, y: 64, w: 60, h: 46 },
      shapes: [
        { t: 'rect', x: 72, y: 64, w: 60, h: 46, rx: 12, fill: C.cabin },
        { t: 'rect', x: 80, y: 74, w: 34, h: 26, rx: 6, fill: C.glass },
      ],
    },
    {
      id: 'boom',
      kind: 'boom',
      box: { x: 140, y: 66, w: 102, h: 70 },
      shapes: [{ t: 'line', x1: 150, y1: 126, x2: 232, y2: 76, sw: 18, fill: C.body }],
    },
    {
      id: 'stick',
      kind: 'stick',
      box: { x: 223, y: 69, w: 34, h: 88 },
      shapes: [{ t: 'line', x1: 232, y1: 78, x2: 248, y2: 148, sw: 15, fill: C.body }],
    },
    {
      id: 'bucket',
      kind: 'bucket',
      box: { x: 224, y: 140, w: 52, h: 48 },
      shapes: [{ t: 'path', d: 'M226 146 L272 142 L268 176 Q250 188 234 172 Z', fill: C.metal }],
    },
    {
      id: 'exhaust',
      kind: 'exhaust',
      box: { x: 138, y: 82, w: 11, h: 26 },
      shapes: [{ t: 'rect', x: 138, y: 82, w: 11, h: 26, rx: 5, fill: C.metalDark }],
    },
  ],
}

const RACECAR: Vehicle = {
  id: 'racecar',
  label: 'Rennauto',
  parts: [
    {
      id: 'body',
      kind: 'body',
      box: { x: 54, y: 92, w: 214, h: 64 },
      shapes: [
        { t: 'rect', x: 54, y: 118, w: 188, h: 34, rx: 16, fill: C.body },
        { t: 'rect', x: 120, y: 92, w: 72, h: 32, rx: 12, fill: C.body },
        { t: 'path', d: 'M236 120 L270 134 L236 144 Z', fill: C.body },
        { t: 'rect', x: 130, y: 100, w: 46, h: 20, rx: 6, fill: C.glass },
      ],
    },
    {
      id: 'spoiler',
      kind: 'spoiler',
      box: { x: 40, y: 96, w: 46, h: 42 },
      shapes: [
        { t: 'rect', x: 40, y: 96, w: 46, h: 13, rx: 5, fill: C.metalDark },
        { t: 'rect', x: 58, y: 104, w: 12, h: 30, fill: C.metalDark },
      ],
    },
    { id: 'wheelRear', kind: 'wheel', box: { x: 74, y: 136, w: 48, h: 48 }, shapes: wheel(98, 160, 24) },
    { id: 'wheelFront', kind: 'wheel', box: { x: 190, y: 136, w: 48, h: 48 }, shapes: wheel(214, 160, 24) },
  ],
}

const GARBAGE: Vehicle = {
  id: 'garbage',
  label: 'Müllwagen',
  parts: [
    {
      id: 'hopper',
      kind: 'hopper',
      box: { x: 52, y: 80, w: 142, h: 76 },
      shapes: [
        { t: 'rect', x: 52, y: 80, w: 142, h: 76, rx: 10, fill: C.body },
        { t: 'rect', x: 60, y: 96, w: 126, h: 9, rx: 4, fill: C.bodyTrim },
      ],
    },
    {
      id: 'cab',
      kind: 'cab',
      box: { x: 200, y: 94, w: 54, h: 62 },
      shapes: [
        { t: 'rect', x: 200, y: 94, w: 54, h: 62, rx: 12, fill: C.cabin },
        { t: 'rect', x: 210, y: 104, w: 30, h: 24, rx: 6, fill: C.glass },
      ],
    },
    {
      id: 'loader',
      kind: 'loader',
      box: { x: 24, y: 104, w: 44, h: 54 },
      shapes: [{ t: 'path', d: 'M26 156 L42 104 L66 104 L50 156 Z', fill: C.metal }],
    },
    { id: 'wheelRear', kind: 'wheel', box: { x: 80, y: 142, w: 48, h: 48 }, shapes: wheel(104, 166, 24) },
    { id: 'wheelFront', kind: 'wheel', box: { x: 196, y: 142, w: 48, h: 48 }, shapes: wheel(220, 166, 24) },
  ],
}

const FIRETRUCK: Vehicle = {
  id: 'firetruck',
  label: 'Feuerwehr',
  parts: [
    {
      id: 'body',
      kind: 'body',
      box: { x: 44, y: 106, w: 156, h: 50 },
      shapes: [
        { t: 'rect', x: 44, y: 106, w: 156, h: 50, rx: 10, fill: C.body },
        { t: 'rect', x: 50, y: 138, w: 144, h: 12, rx: 6, fill: C.bodyTrim },
      ],
    },
    {
      id: 'cab',
      kind: 'cab',
      box: { x: 202, y: 96, w: 54, h: 60 },
      shapes: [
        { t: 'rect', x: 202, y: 96, w: 54, h: 60, rx: 12, fill: C.cabin },
        { t: 'rect', x: 212, y: 106, w: 30, h: 24, rx: 6, fill: C.glass },
      ],
    },
    {
      id: 'ladder',
      kind: 'ladder',
      box: { x: 54, y: 84, w: 138, h: 16 },
      shapes: [
        { t: 'rect', x: 54, y: 84, w: 138, h: 16, rx: 8, fill: C.metal },
        { t: 'rect', x: 78, y: 84, w: 4, h: 16, fill: C.metalDark },
        { t: 'rect', x: 108, y: 84, w: 4, h: 16, fill: C.metalDark },
        { t: 'rect', x: 138, y: 84, w: 4, h: 16, fill: C.metalDark },
        { t: 'rect', x: 166, y: 84, w: 4, h: 16, fill: C.metalDark },
      ],
    },
    {
      id: 'light',
      kind: 'light',
      box: { x: 218, y: 76, w: 22, h: 16 },
      shapes: [{ t: 'rect', x: 218, y: 76, w: 22, h: 16, rx: 6, fill: '#E8C24A' }],
    },
    { id: 'wheelRear', kind: 'wheel', box: { x: 74, y: 142, w: 48, h: 48 }, shapes: wheel(98, 166, 24) },
    { id: 'wheelFront', kind: 'wheel', box: { x: 192, y: 142, w: 48, h: 48 }, shapes: wheel(216, 166, 24) },
  ],
}

const CRANE: Vehicle = {
  id: 'crane',
  label: 'Kranwagen',
  parts: [
    {
      id: 'body',
      kind: 'body',
      box: { x: 44, y: 114, w: 166, h: 44 },
      shapes: [
        { t: 'rect', x: 44, y: 114, w: 166, h: 44, rx: 10, fill: C.body },
        { t: 'rect', x: 48, y: 142, w: 158, h: 12, rx: 6, fill: C.bodyTrim },
      ],
    },
    {
      id: 'cab',
      kind: 'cab',
      box: { x: 208, y: 104, w: 48, h: 54 },
      shapes: [
        { t: 'rect', x: 208, y: 104, w: 48, h: 54, rx: 12, fill: C.cabin },
        { t: 'rect', x: 216, y: 112, w: 26, h: 22, rx: 6, fill: C.glass },
      ],
    },
    {
      id: 'boom',
      kind: 'boom',
      box: { x: 50, y: 48, w: 130, h: 84 },
      shapes: [{ t: 'line', x1: 170, y1: 122, x2: 64, y2: 58, sw: 17, fill: C.body }],
    },
    {
      id: 'hook',
      kind: 'hook',
      box: { x: 50, y: 52, w: 32, h: 64 },
      shapes: [
        { t: 'line', x1: 64, y1: 58, x2: 64, y2: 98, sw: 5, fill: C.metalDark },
        { t: 'path', d: 'M56 98 Q54 114 70 110 Q78 104 70 98 Z', fill: C.metal },
      ],
    },
    { id: 'wheelRear', kind: 'wheel', box: { x: 72, y: 142, w: 48, h: 48 }, shapes: wheel(96, 166, 24) },
    { id: 'wheelFront', kind: 'wheel', box: { x: 152, y: 142, w: 48, h: 48 }, shapes: wheel(176, 166, 24) },
  ],
}

/** Ten vehicles in order of difficulty - each completion brings the next type. */
export const VEHICLES: readonly Vehicle[] = [
  CAR,
  RACECAR,
  TRUCK,
  GARBAGE,
  BUS,
  TRACTOR,
  FIRETRUCK,
  BULLDOZER,
  CRANE,
  EXCAVATOR,
]

/** The vehicle built at a given session level (the last one repeats). */
export function vehicleForLevel(level: number): Vehicle {
  return VEHICLES[Math.min(level, VEHICLES.length - 1)]
}
