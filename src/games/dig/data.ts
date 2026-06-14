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
  solids: [{ x: -60, y: G, w: 1620, h: GROUND_H }],
  bounces: [],
  gems: [
    { id: 'g0', x: 266, y: 340 },
    { id: 'g1', x: 393, y: 346 },
    { id: 'g2', x: 520, y: 345 },
    { id: 'g3', x: 646, y: 344 },
    { id: 'g4', x: 773, y: 343 },
    { id: 'g5', x: 900, y: 342 },
    { id: 'g6', x: 1026, y: 341 },
    { id: 'g7', x: 1153, y: 340 },
  ],
}

const LEVEL_2: DigLevel = {
  id: 1,
  width: 1700,
  startX: 70,
  goalX: 1580,
  solids: [{ x: -60, y: G, w: 1820, h: GROUND_H }],
  bounces: [],
  gems: [
    { id: 'g0', x: 274, y: 340 },
    { id: 'g1', x: 408, y: 346 },
    { id: 'g2', x: 542, y: 345 },
    { id: 'g3', x: 676, y: 344 },
    { id: 'g4', x: 810, y: 343 },
    { id: 'g5', x: 944, y: 342 },
    { id: 'g6', x: 1078, y: 341 },
    { id: 'g7', x: 1212, y: 340 },
    { id: 'g8', x: 1346, y: 346 },
  ],
}

const LEVEL_3: DigLevel = {
  id: 2,
  width: 1900,
  startX: 70,
  goalX: 1780,
  solids: [{ x: -60, y: G, w: 2020, h: GROUND_H }],
  bounces: [],
  gems: [
    { id: 'g0', x: 280, y: 340 },
    { id: 'g1', x: 420, y: 346 },
    { id: 'g2', x: 560, y: 345 },
    { id: 'g3', x: 700, y: 344 },
    { id: 'g4', x: 840, y: 343 },
    { id: 'g5', x: 980, y: 342 },
    { id: 'g6', x: 1120, y: 341 },
    { id: 'g7', x: 1260, y: 340 },
    { id: 'g8', x: 1400, y: 346 },
    { id: 'g9', x: 1540, y: 345 },
  ],
}

const LEVEL_4: DigLevel = {
  id: 3,
  width: 2100,
  startX: 70,
  goalX: 1980,
  solids: [{ x: -60, y: G, w: 2220, h: GROUND_H }],
  bounces: [],
  gems: [
    { id: 'g0', x: 285, y: 340 },
    { id: 'g1', x: 430, y: 346 },
    { id: 'g2', x: 575, y: 345 },
    { id: 'g3', x: 720, y: 344 },
    { id: 'g4', x: 865, y: 343 },
    { id: 'g5', x: 1010, y: 342 },
    { id: 'g6', x: 1155, y: 341 },
    { id: 'g7', x: 1300, y: 340 },
    { id: 'g8', x: 1445, y: 346 },
    { id: 'g9', x: 1590, y: 345 },
    { id: 'g10', x: 1735, y: 344 },
  ],
}

const LEVEL_5: DigLevel = {
  id: 4,
  width: 2300,
  startX: 70,
  goalX: 2180,
  solids: [{ x: -60, y: G, w: 2420, h: GROUND_H }],
  bounces: [],
  gems: [
    { id: 'g0', x: 289, y: 340 },
    { id: 'g1', x: 438, y: 346 },
    { id: 'g2', x: 587, y: 345 },
    { id: 'g3', x: 736, y: 344 },
    { id: 'g4', x: 886, y: 343 },
    { id: 'g5', x: 1035, y: 342 },
    { id: 'g6', x: 1184, y: 341 },
    { id: 'g7', x: 1333, y: 340 },
    { id: 'g8', x: 1483, y: 346 },
    { id: 'g9', x: 1632, y: 345 },
    { id: 'g10', x: 1781, y: 344 },
    { id: 'g11', x: 1930, y: 343 },
  ],
}

const LEVEL_6: DigLevel = {
  id: 5,
  width: 2500,
  startX: 70,
  goalX: 2380,
  solids: [{ x: -60, y: G, w: 2620, h: GROUND_H }],
  bounces: [],
  gems: [
    { id: 'g0', x: 292, y: 340 },
    { id: 'g1', x: 445, y: 346 },
    { id: 'g2', x: 598, y: 345 },
    { id: 'g3', x: 751, y: 344 },
    { id: 'g4', x: 904, y: 343 },
    { id: 'g5', x: 1057, y: 342 },
    { id: 'g6', x: 1210, y: 341 },
    { id: 'g7', x: 1362, y: 340 },
    { id: 'g8', x: 1515, y: 346 },
    { id: 'g9', x: 1668, y: 345 },
    { id: 'g10', x: 1821, y: 344 },
    { id: 'g11', x: 1974, y: 343 },
    { id: 'g12', x: 2127, y: 342 },
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

/** Total session levels - hand-crafted + procedurally generated, flat. */
export const TOTAL_LEVELS = 20

/* ------------------------- Procedural generator -------------------------- */

/** Seedable PRNG so each level index always produces the same level. */
function rng(seed: number): () => number {
  let s = (seed | 0) >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Build a flat level for index >= LEVELS.length. Length and gem count grow
 * with the level index; the ground is always one continuous strip and every
 * gem is reachable by simply driving forward - no required platforming.
 */
function generateLevel(index: number): DigLevel {
  const spanIdx = index - LEVELS.length
  const r = rng(index * 1031 + 17)
  const width = 2500 + spanIdx * 140
  const gemCount = 14 + spanIdx

  const solids: Rect[] = [{ x: -60, y: G, w: width + 120, h: GROUND_H }]
  const gems: Gem[] = []
  const span = width - 240
  for (let i = 0; i < gemCount; i += 1) {
    const gx = 140 + Math.floor((span * (i + 0.5)) / gemCount + (r() - 0.5) * 50)
    const gy = 340 + Math.floor(r() * 8)
    gems.push({ id: `g${i}`, x: gx, y: gy })
  }

  return {
    id: index,
    width,
    startX: 70,
    goalX: width - 80,
    solids,
    bounces: [],
    gems,
  }
}

/** The level played at a given session level (hand-built then generated). */
export function levelForIndex(index: number): DigLevel {
  const i = Math.min(Math.max(index, 0), TOTAL_LEVELS - 1)
  if (i < LEVELS.length) return LEVELS[i]
  return generateLevel(i)
}
