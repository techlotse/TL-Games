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
  /** Happy items gathered this run - drives the car's smile. */
  collected: number
  /** True once the goal is reached: the run is complete. */
  done: boolean
}

interface Sim {
  carX: number
  /** Where the finger is steering the car, or null when not held. */
  targetX: number | null
  items: RaceItem[]
  sparkles: Sparkle[]
  collected: number
  speed: number
  spawnTimer: number
  speedTimer: number
  bumped: boolean
  bumpTimer: number
  graceTimer: number
  done: boolean
  lastTime: number
  nextId: number
}

function createSim(run: number): Sim {
  return {
    carX: 50,
    targetX: null,
    items: [],
    sparkles: [],
    collected: 0,
    speed: Math.min(RACE.speedBase + run * RACE.runSpeedStep, RACE.speedMax),
    spawnTimer: 0,
    speedTimer: 0,
    bumped: false,
    bumpTimer: 0,
    graceTimer: RACE.graceMs,
    done: false,
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
    dx < ((RACE.carW + RACE.itemW) / 2) * RACE.hitScaleX &&
    dy < ((RACE.carH + RACE.itemH) / 2) * RACE.hitScaleY
  )
}

export interface RaceGame {
  snapshot: RaceSnapshot
  /** Steer the car toward this x (percent), or null to let go. */
  setTargetX: (x: number | null) => void
  /** Start a fresh, slightly faster run. */
  reset: () => void
}

/**
 * Headless-ish race loop. Runs a requestAnimationFrame simulation while the
 * screen is mounted. The car follows the finger; gathering happy items fills
 * the smile, and reaching the goal ends the run. Each `reset` starts a new,
 * slightly faster run. Everything resets when the player leaves the screen.
 */
export function useRaceGame(): RaceGame {
  const [snapshot, setSnapshot] = useState<RaceSnapshot>({
    carX: 50,
    items: [],
    sparkles: [],
    bumped: false,
    collected: 0,
    done: false,
  })

  const simRef = useRef<Sim | null>(null)
  if (simRef.current === null) simRef.current = createSim(0)
  const runRef = useRef(0)

  useEffect(() => {
    let raf = 0

    const step = (now: number) => {
      const sim = simRef.current as Sim
      if (sim.lastTime === 0) sim.lastTime = now
      const dt = Math.min((now - sim.lastTime) / 1000, 0.05)
      sim.lastTime = now
      const ms = dt * 1000

      // Sparkles always fade, even during a pause or after the goal.
      for (const sp of sim.sparkles) sp.age += ms
      if (sim.sparkles.some((sp) => sp.age >= RACE.sparkleMs)) {
        sim.sparkles = sim.sparkles.filter((sp) => sp.age < RACE.sparkleMs)
      }

      if (!sim.done) {
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
            sim.speed = Math.min(sim.speed + RACE.speedStep, RACE.speedMax)
          }

          // The car eases toward the finger.
          if (sim.targetX != null) {
            const dx = sim.targetX - sim.carX
            const maxStep = RACE.followSpeed * dt
            sim.carX = clamp(
              sim.carX + clamp(dx, -maxStep, maxStep),
              RACE.carMinX,
              RACE.carMaxX,
            )
          }

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
                if (sim.collected >= RACE.goal) sim.done = true
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
      }

      setSnapshot({
        carX: sim.carX,
        items: sim.items.slice(),
        sparkles: sim.sparkles.slice(),
        bumped: sim.bumped,
        collected: sim.collected,
        done: sim.done,
      })
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  const setTargetX = useCallback((x: number | null) => {
    if (simRef.current) simRef.current.targetX = x
  }, [])

  const reset = useCallback(() => {
    runRef.current += 1
    simRef.current = createSim(runRef.current)
    setSnapshot({
      carX: 50,
      items: [],
      sparkles: [],
      bumped: false,
      collected: 0,
      done: false,
    })
  }, [])

  return { snapshot, setTargetX, reset }
}
