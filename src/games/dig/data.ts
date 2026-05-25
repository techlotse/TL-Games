/**
 * Bagger - static content and tuning.
 *
 * A gentle side-scrolling platform game: a friendly excavator runs and hops
 * through a sunny construction site, digging up gems and rolling home to its
 * depot where its vehicle friends are waiting.
 *
 * Forgiving by design - there is no score, no timer and no "game over". A
 * missed jump just lifts the excavator gently back onto solid ground.
 *
 * All coordinates are in world units. The camera shows a VIEW_W x VIEW_H
 * window of the world.
 */

/** A solid axis-aligned rectangle (a platform or a piece of ground). */
export interface Rect {
  x: number
  y: number
  w: number
  h: number
}

/** A diggable gem. */
export interface Gem {
  id: string
  x: number
  y: number
}

export interface DigLevel {
  id: number
  /** Total world width of the level. */
  width: number
  /** Where the excavator starts (top-left of its collision box). */
  startX: number
  /** Reaching this world x finishes the level. */
  goalX: number
  /** Solid ground and platforms. */
  solids: Rect[]
  /** Bounce pads - solid, but landing on one launches the excavator high. */
  bounces: Rect[]
  gems: Gem[]
}

/** Physics and layout tuning. */
export const DIG = {
  /** Camera window onto the world. */
  viewW: 300,
  viewH: 450,
  /** Top of the standard ground line. */
  groundY: 384,
  /** Excavator collision box. */
  playerW: 40,
  playerH: 44,
  gravity: 1500,
  maxFall: 720,
  runSpeed: 165,
  jumpV: 605,
  /** Launch speed off a bounce pad. */
  bounceV: 820,
  /** A jump still works for a moment after walking off an edge. */
  coyoteMs: 120,
  /** A jump pressed just before landing is remembered for a moment. */
  jumpBufferMs: 140,
  /** Falling below this world y gently returns the excavator to safe ground. */
  fallLine: 540,
  /** The excavator is kept roughly this far from the left of the view. */
  camLead: 116,
  /** How quickly the camera eases toward its target. */
  camEase: 9,
  /** Gem pick-up radius. */
  gemR: 19,
  /** How long a collect sparkle lives, ms. */
  sparkleMs: 620,
} as const

/* --------------------------------- Levels -------------------------------- */

const GROUND_H = 80
const G = 384

const LEVEL_1: DigLevel = {
  id: 0,
  width: 1500,
  startX: 70,
  goalX: 1380,
  solids: [
    { x: -60, y: G, w: 1620, h: GROUND_H },
    { x: 560, y: 300, w: 124, h: 24 },
    { x: 1060, y: 286, w: 132, h: 24 },
  ],
  bounces: [],
  gems: [
    { id: 'g0', x: 220, y: 344 },
    { id: 'g1', x: 430, y: 300 },
    { id: 'g2', x: 622, y: 262 },
    { id: 'g3', x: 700, y: 344 },
    { id: 'g4', x: 910, y: 304 },
    { id: 'g5', x: 1126, y: 248 },
    { id: 'g6', x: 1300, y: 344 },
  ],
}

const LEVEL_2: DigLevel = {
  id: 1,
  width: 2050,
  startX: 70,
  goalX: 1920,
  solids: [
    { x: -60, y: G, w: 2170, h: GROUND_H },
    { x: 560, y: 296, w: 120, h: 24 },
    { x: 1000, y: 282, w: 120, h: 24 },
    { x: 1232, y: 320, w: 92, h: 22 },
    { x: 1520, y: 262, w: 134, h: 24 },
  ],
  bounces: [{ x: 1720, y: 310, w: 78, h: 22 }],
  gems: [
    { id: 'g0', x: 210, y: 344 },
    { id: 'g1', x: 415, y: 296 },
    { id: 'g2', x: 620, y: 258 },
    { id: 'g3', x: 700, y: 344 },
    { id: 'g4', x: 845, y: 300 },
    { id: 'g5', x: 1060, y: 244 },
    { id: 'g6', x: 1278, y: 282 },
    { id: 'g7', x: 1430, y: 300 },
    { id: 'g8', x: 1587, y: 224 },
    { id: 'g9', x: 1757, y: 250 },
  ],
}

const LEVEL_3: DigLevel = {
  id: 2,
  width: 2600,
  startX: 70,
  goalX: 2470,
  solids: [
    { x: -60, y: G, w: 2720, h: GROUND_H },
    { x: 520, y: 300, w: 110, h: 22 },
    { x: 760, y: 250, w: 110, h: 22 },
    { x: 1110, y: 296, w: 96, h: 22 },
    { x: 1330, y: 250, w: 110, h: 22 },
    { x: 1500, y: 196, w: 120, h: 22 },
    { x: 1920, y: 286, w: 96, h: 22 },
    { x: 2180, y: 246, w: 130, h: 24 },
  ],
  bounces: [
    { x: 1015, y: 312, w: 78, h: 22 },
    { x: 1790, y: 300, w: 78, h: 22 },
  ],
  gems: [
    { id: 'g0', x: 200, y: 344 },
    { id: 'g1', x: 380, y: 296 },
    { id: 'g2', x: 575, y: 262 },
    { id: 'g3', x: 705, y: 344 },
    { id: 'g4', x: 815, y: 212 },
    { id: 'g5', x: 980, y: 300 },
    { id: 'g6', x: 1052, y: 196 },
    { id: 'g7', x: 1158, y: 256 },
    { id: 'g8', x: 1385, y: 210 },
    { id: 'g9', x: 1560, y: 156 },
    { id: 'g10', x: 1830, y: 196 },
    { id: 'g11', x: 1968, y: 246 },
    { id: 'g12', x: 2245, y: 206 },
    { id: 'g13', x: 2380, y: 344 },
  ],
}

const LEVEL_4: DigLevel = {
  id: 3,
  width: 2360,
  startX: 70,
  goalX: 2230,
  solids: [
    { x: -60, y: G, w: 400, h: GROUND_H },
    { x: 445, y: G, w: 320, h: GROUND_H },
    { x: 875, y: G, w: 300, h: GROUND_H },
    { x: 1285, y: G, w: 330, h: GROUND_H },
    { x: 1725, y: G, w: 635, h: GROUND_H },
    { x: 530, y: 296, w: 108, h: 22 },
    { x: 960, y: 262, w: 108, h: 22 },
    { x: 1350, y: 298, w: 100, h: 22 },
    { x: 1500, y: 240, w: 108, h: 22 },
    { x: 1980, y: 282, w: 118, h: 24 },
  ],
  bounces: [
    { x: 1080, y: 312, w: 78, h: 22 },
    { x: 2140, y: 300, w: 78, h: 22 },
  ],
  gems: [
    { id: 'g0', x: 200, y: 344 },
    { id: 'g1', x: 430, y: 300 },
    { id: 'g2', x: 584, y: 258 },
    { id: 'g3', x: 690, y: 344 },
    { id: 'g4', x: 1014, y: 224 },
    { id: 'g5', x: 1120, y: 264 },
    { id: 'g6', x: 1230, y: 300 },
    { id: 'g7', x: 1400, y: 344 },
    { id: 'g8', x: 1554, y: 202 },
    { id: 'g9', x: 2035, y: 244 },
    { id: 'g10', x: 2170, y: 196 },
  ],
}

const LEVEL_5: DigLevel = {
  id: 4,
  width: 2810,
  startX: 70,
  goalX: 2680,
  solids: [
    { x: -60, y: G, w: 360, h: GROUND_H },
    { x: 405, y: G, w: 280, h: GROUND_H },
    { x: 795, y: G, w: 250, h: GROUND_H },
    { x: 1155, y: G, w: 270, h: GROUND_H },
    { x: 1535, y: G, w: 300, h: GROUND_H },
    { x: 1945, y: G, w: 865, h: GROUND_H },
    { x: 480, y: 294, w: 100, h: 22 },
    { x: 730, y: 248, w: 100, h: 22 },
    { x: 1080, y: 290, w: 96, h: 22 },
    { x: 1260, y: 244, w: 104, h: 22 },
    { x: 1440, y: 194, w: 110, h: 22 },
    { x: 1660, y: 256, w: 100, h: 22 },
    { x: 2090, y: 280, w: 110, h: 22 },
    { x: 2320, y: 226, w: 120, h: 24 },
  ],
  bounces: [
    { x: 920, y: 308, w: 78, h: 22 },
    { x: 2040, y: 312, w: 78, h: 22 },
  ],
  gems: [
    { id: 'g0', x: 190, y: 344 },
    { id: 'g1', x: 420, y: 294 },
    { id: 'g2', x: 560, y: 344 },
    { id: 'g3', x: 762, y: 206 },
    { id: 'g4', x: 955, y: 218 },
    { id: 'g5', x: 1110, y: 248 },
    { id: 'g6', x: 1310, y: 202 },
    { id: 'g7', x: 1492, y: 150 },
    { id: 'g8', x: 1700, y: 214 },
    { id: 'g9', x: 1900, y: 300 },
    { id: 'g10', x: 2075, y: 214 },
    { id: 'g11', x: 2370, y: 182 },
    { id: 'g12', x: 2560, y: 344 },
  ],
}

const LEVEL_6: DigLevel = {
  id: 5,
  width: 3270,
  startX: 70,
  goalX: 3080,
  solids: [
    { x: -60, y: G, w: 340, h: GROUND_H },
    { x: 385, y: G, w: 260, h: GROUND_H },
    { x: 755, y: G, w: 240, h: GROUND_H },
    { x: 1105, y: G, w: 250, h: GROUND_H },
    { x: 1465, y: G, w: 260, h: GROUND_H },
    { x: 1835, y: G, w: 250, h: GROUND_H },
    { x: 2195, y: G, w: 280, h: GROUND_H },
    { x: 2585, y: G, w: 685, h: GROUND_H },
    { x: 460, y: 298, w: 96, h: 22 },
    { x: 690, y: 248, w: 96, h: 22 },
    { x: 900, y: 300, w: 90, h: 22 },
    { x: 1180, y: 262, w: 100, h: 22 },
    { x: 1400, y: 210, w: 104, h: 22 },
    { x: 1560, y: 158, w: 110, h: 22 },
    { x: 1770, y: 240, w: 96, h: 22 },
    { x: 2000, y: 286, w: 96, h: 22 },
    { x: 2280, y: 240, w: 100, h: 22 },
    { x: 2520, y: 200, w: 110, h: 22 },
    { x: 2770, y: 262, w: 124, h: 24 },
  ],
  bounces: [
    { x: 830, y: 312, w: 78, h: 22 },
    { x: 1640, y: 300, w: 78, h: 22 },
    { x: 2350, y: 312, w: 78, h: 22 },
  ],
  gems: [
    { id: 'g0', x: 180, y: 344 },
    { id: 'g1', x: 340, y: 300 },
    { id: 'g2', x: 504, y: 254 },
    { id: 'g3', x: 615, y: 344 },
    { id: 'g4', x: 736, y: 204 },
    { id: 'g5', x: 865, y: 216 },
    { id: 'g6', x: 1050, y: 300 },
    { id: 'g7', x: 1228, y: 218 },
    { id: 'g8', x: 1450, y: 166 },
    { id: 'g9', x: 1675, y: 112 },
    { id: 'g10', x: 1882, y: 200 },
    { id: 'g11', x: 2046, y: 242 },
    { id: 'g12', x: 2388, y: 216 },
    { id: 'g13', x: 2572, y: 156 },
    { id: 'g14', x: 2900, y: 344 },
  ],
}

export const LEVELS: readonly DigLevel[] = [
  LEVEL_1,
  LEVEL_2,
  LEVEL_3,
  LEVEL_4,
  LEVEL_5,
  LEVEL_6,
]

/** The level played at a given session level (the last one repeats). */
export function levelForIndex(index: number): DigLevel {
  return LEVELS[Math.min(index, LEVELS.length - 1)]
}
