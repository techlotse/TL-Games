/**
 * Race - static content and tuning.
 *
 * A gentle steering game: hold the left or right side of the screen to steer,
 * and drive around the obstacles. There is no score and no "game over" - a
 * bump just pauses the car for a moment. The speed rises a little every 30s.
 *
 * All positions are percentages of the play field (x = width, y = height).
 */

export type ObstacleKind = 'cone' | 'bush' | 'rock' | 'puddle'

export const OBSTACLE_KINDS: readonly ObstacleKind[] = ['cone', 'bush', 'rock', 'puddle']

export const RACE = {
  /** Car centre, fixed near the bottom. */
  carY: 80,
  carW: 16,
  carH: 25,
  /** Car steering bounds (keeps it on the road). */
  carMinX: 13,
  carMaxX: 87,

  obstacleW: 15,
  obstacleH: 15,

  /** Sideways steering speed, % of width per second. */
  steerSpeed: 64,
  /** Downward scroll speed, % of height per second. */
  speedBase: 22,
  /** Added to the speed at each interval - intentionally small. */
  speedStep: 3,
  speedMax: 42,
  /** The speed rises one step every 30 seconds. */
  speedIntervalMs: 30_000,

  /** A new obstacle appears on this cadence. */
  spawnGapMs: 1_600,
  /** How long the car pauses after a bump. */
  bumpMs: 700,
  /** Collisions are ignored for a moment after a bump (and at the start). */
  graceMs: 1_300,
  /** Collision boxes are shrunk a little so near-misses are forgiven. */
  collisionScale: 0.78,
} as const
