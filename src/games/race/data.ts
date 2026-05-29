/**
 * Race - static content and tuning.
 *
 * A gentle steering game: press and hold the car, then move it from side to
 * side. Drive around the obstacles and into the cheerful collectibles (stars,
 * hearts, apples). Collecting happy items fills the car's smile - gather a
 * whole row of them to finish the run. A bump just pauses the car for a
 * moment; there is no score and no "game over".
 *
 * All positions are percentages of the play field (x = width, y = height).
 */

export type ObstacleKind = 'cone' | 'bush' | 'rock' | 'puddle'
export type GoodKind = 'star' | 'heart' | 'apple'

export const OBSTACLE_KINDS: readonly ObstacleKind[] = ['cone', 'bush', 'rock', 'puddle']
export const GOOD_KINDS: readonly GoodKind[] = ['star', 'heart', 'apple']

export const RACE = {
  /** Car centre, fixed near the bottom. */
  carY: 80,
  carW: 16,
  carH: 25,
  /** Car steering bounds (keeps it on the road). */
  carMinX: 13,
  carMaxX: 87,

  itemW: 15,
  itemH: 15,

  /** How quickly the car follows the finger, % of width per second. */
  followSpeed: 260,

  /** Downward scroll speed, % of height per second. */
  speedBase: 22,
  /** Added to the speed every interval - intentionally small. */
  speedStep: 3,
  speedMax: 44,
  /** The speed rises one step every 30 seconds. */
  speedIntervalMs: 30_000,
  /** Each completed run starts a little faster than the last. */
  runSpeedStep: 1.5,

  /** A new item appears on this cadence. */
  spawnGapMs: 1_400,
  /** Chance a spawned item is a cheerful collectible (vs an obstacle). */
  goodChance: 0.52,

  /** How long the car pauses after a bump. */
  bumpMs: 700,
  /** Collisions are ignored for a moment after a bump (and at the start). */
  graceMs: 1_300,
  /**
   * Collision-box scales. Kept small - and tighter vertically - so near
   * misses are forgiven and tucking in just behind an obstacle does not clip.
   */
  hitScaleX: 0.66,
  hitScaleY: 0.5,
  /** How long a collect sparkle lives. */
  sparkleMs: 650,

  /** Happy items to collect to fill the car's smile and finish the run. */
  goal: 10,
} as const
