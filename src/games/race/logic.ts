import { useCallback, useEffect, useRef, useState } from 'react'
import { clamp } from '@/lib/utils'
import { hapticTap } from '@/lib/platform'
import { OBSTACLE_KINDS, RACE, type ObstacleKind } from './data'

export interface Obstacle {
  id: number
  x: number
  y: number
  kind: ObstacleKind
}

export interface RaceSnapshot {
  carX: number
  obstacles: Obstacle[]
  bumped: boolean
}

export type Steer = -1 | 0 | 1

interface Sim {
  carX: number
  obstacles: Obstacle[]
  speed: number
  steer: Steer
  spawnTimer: number
  speedTimer: number
  bumped: boolean
  bumpTimer: number
  graceTimer: number
  lastTime: number
  nextId: number
}

function createSim(): Sim {
  return {
    carX: 50,
    obstacles: [],
    speed: RACE.speedBase,
    steer: 0,
    spawnTimer: 0,
    speedTimer: 0,
    bumped: false,
    bumpTimer: 0,
    graceTimer: RACE.graceMs,
    lastTime: 0,
    nextId: 1,
  }
}

function spawnObstacle(id: number): Obstacle {
  const margin = RACE.obstacleW / 2 + 5
  return {
    id,
    x: margin + Math.random() * (100 - margin * 2),
    y: -14,
    kind: OBSTACLE_KINDS[Math.floor(Math.random() * OBSTACLE_KINDS.length)],
  }
}

function hits(carX: number, o: Obstacle): boolean {
  const dx = Math.abs(carX - o.x)
  const dy = Math.abs(RACE.carY - o.y)
  return (
    dx < ((RACE.carW + RACE.obstacleW) / 2) * RACE.collisionScale &&
    dy < ((RACE.carH + RACE.obstacleH) / 2) * RACE.collisionScale
  )
}

export interface RaceGame {
  snapshot: RaceSnapshot
  setSteer: (dir: Steer) => void
}

/**
 * Headless-ish race loop. Runs a requestAnimationFrame simulation while the
 * screen is mounted; everything resets when the player leaves (the component
 * unmounts), which is exactly the "resets at home" difficulty behaviour.
 *
 * `onMilestone` fires each time the speed steps up (roughly every 30s played).
 */
export function useRaceGame(onMilestone?: () => void): RaceGame {
  const [snapshot, setSnapshot] = useState<RaceSnapshot>({
    carX: 50,
    obstacles: [],
    bumped: false,
  })

  const simRef = useRef<Sim | null>(null)
  if (simRef.current === null) simRef.current = createSim()

  const milestoneRef = useRef(onMilestone)
  milestoneRef.current = onMilestone

  useEffect(() => {
    const sim = simRef.current as Sim
    sim.lastTime = 0
    let raf = 0

    const step = (now: number) => {
      if (sim.lastTime === 0) sim.lastTime = now
      const dt = Math.min((now - sim.lastTime) / 1000, 0.05)
      sim.lastTime = now
      const ms = dt * 1000

      if (sim.bumped) {
        // Brief pause + wobble, then carry on from the same spot.
        sim.bumpTimer -= ms
        if (sim.bumpTimer <= 0) {
          sim.bumped = false
          sim.graceTimer = RACE.graceMs
        }
      } else {
        if (sim.graceTimer > 0) sim.graceTimer -= ms

        sim.speedTimer += ms
        if (sim.speedTimer >= RACE.speedIntervalMs) {
          sim.speedTimer -= RACE.speedIntervalMs
          if (sim.speed < RACE.speedMax) {
            sim.speed = Math.min(sim.speed + RACE.speedStep, RACE.speedMax)
          }
          milestoneRef.current?.()
        }

        sim.carX = clamp(
          sim.carX + sim.steer * RACE.steerSpeed * dt,
          RACE.carMinX,
          RACE.carMaxX,
        )

        for (const o of sim.obstacles) o.y += sim.speed * dt
        sim.obstacles = sim.obstacles.filter((o) => o.y < 120)

        sim.spawnTimer += ms
        if (sim.spawnTimer >= RACE.spawnGapMs) {
          sim.spawnTimer -= RACE.spawnGapMs
          sim.obstacles.push(spawnObstacle(sim.nextId++))
        }

        if (sim.graceTimer <= 0) {
          for (const o of sim.obstacles) {
            if (hits(sim.carX, o)) {
              sim.bumped = true
              sim.bumpTimer = RACE.bumpMs
              hapticTap()
              break
            }
          }
        }
      }

      setSnapshot({ carX: sim.carX, obstacles: sim.obstacles.slice(), bumped: sim.bumped })
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  const setSteer = useCallback((dir: Steer) => {
    if (simRef.current) simRef.current.steer = dir
  }, [])

  return { snapshot, setSteer }
}
