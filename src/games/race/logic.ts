import { useCallback, useEffect, useRef, useState } from 'react'
import { clamp } from '@/lib/utils'
import { hapticTap } from '@/lib/platform'
import { GOOD_KINDS, OBSTACLE_KINDS, RACE, type GoodKind, type ObstacleKind } from './data'

export interface RaceItem {
  id: number
  x: number
  y: number
  /** True for a cheerful collectible, false for an obstacle to avoid. */
  good: boolean
  kind: ObstacleKind | GoodKind
}

export interface Sparkle {
  id: number
  x: number
  y: number
  age: number
}

export interface RaceSnapshot {
  carX: number
  items: RaceItem[]
  sparkles: Sparkle[]
  bumped: boolean
  /** Number of collectibles gathered - drives the car's happy hop. */
  collected: number
}

export type Steer = -1 | 0 | 1

interface Sim {
  carX: number
  items: RaceItem[]
  sparkles: Sparkle[]
  collected: number
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
    items: [],
    sparkles: [],
    collected: 0,
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

function spawnItem(id: number): RaceItem {
  const margin = RACE.itemW / 2 + 5
  const x = margin + Math.random() * (100 - margin * 2)
  const good = Math.random() < RACE.goodChance
  const kind = good
    ? GOOD_KINDS[Math.floor(Math.random() * GOOD_KINDS.length)]
    : OBSTACLE_KINDS[Math.floor(Math.random() * OBSTACLE_KINDS.length)]
  return { id, x, y: -14, good, kind }
}

function hits(carX: number, item: RaceItem): boolean {
  const dx = Math.abs(carX - item.x)
  const dy = Math.abs(RACE.carY - item.y)
  return (
    dx < ((RACE.carW + RACE.itemW) / 2) * RACE.collisionScale &&
    dy < ((RACE.carH + RACE.itemH) / 2) * RACE.collisionScale
  )
}

export interface RaceGame {
  snapshot: RaceSnapshot
  setSteer: (dir: Steer) => void
}

/**
 * Headless-ish race loop. Runs a requestAnimationFrame simulation while the
 * screen is mounted; everything resets when the player leaves.
 *
 * `onMilestone` fires each time the speed steps up (roughly every 30s played).
 */
export function useRaceGame(onMilestone?: () => void): RaceGame {
  const [snapshot, setSnapshot] = useState<RaceSnapshot>({
    carX: 50,
    items: [],
    sparkles: [],
    bumped: false,
    collected: 0,
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

      // Sparkles always fade, even during a pause.
      for (const sp of sim.sparkles) sp.age += ms
      if (sim.sparkles.some((sp) => sp.age >= RACE.sparkleMs)) {
        sim.sparkles = sim.sparkles.filter((sp) => sp.age < RACE.sparkleMs)
      }

      if (sim.bumped) {
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

        for (const it of sim.items) it.y += sim.speed * dt

        sim.spawnTimer += ms
        if (sim.spawnTimer >= RACE.spawnGapMs) {
          sim.spawnTimer -= RACE.spawnGapMs
          sim.items.push(spawnItem(sim.nextId++))
        }

        // Collect good items, bump on obstacles, drop off-screen items.
        const survivors: RaceItem[] = []
        let bumpedNow = false
        for (const it of sim.items) {
          if (it.y >= 120) continue
          if (hits(sim.carX, it)) {
            if (it.good) {
              sim.sparkles.push({ id: sim.nextId++, x: it.x, y: it.y, age: 0 })
              sim.collected += 1
              hapticTap()
              continue
            }
            if (sim.graceTimer <= 0) bumpedNow = true
          }
          survivors.push(it)
        }
        sim.items = survivors
        if (bumpedNow) {
          sim.bumped = true
          sim.bumpTimer = RACE.bumpMs
          hapticTap()
        }
      }

      setSnapshot({
        carX: sim.carX,
        items: sim.items.slice(),
        sparkles: sim.sparkles.slice(),
        bumped: sim.bumped,
        collected: sim.collected,
      })
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
