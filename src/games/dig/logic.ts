import { useCallback, useEffect, useRef, useState } from 'react'
import { clamp } from '@/lib/utils'
import { hapticTap } from '@/lib/platform'
import { DIG, LEVELS, levelForIndex, type DigLevel, type Rect } from './data'

export interface Sparkle {
  id: number
  x: number
  y: number
  age: number
}

export interface DigSnapshot {
  /** Excavator collision-box top-left, world coords. */
  px: number
  py: number
  /** 1 = facing right, -1 = facing left. */
  facing: number
  walking: boolean
  airborne: boolean
  /** Gentle vertical bob - the walk cycle, or the victory hop when won. */
  bob: number
  camX: number
  collected: string[]
  sparkles: Sparkle[]
  /** 0 = invisible (mid-respawn), 1 = solid. */
  fade: number
  won: boolean
  levelIndex: number
}

/** -1 left, 0 still, 1 right. */
export type Move = -1 | 0 | 1

const RESPAWN_MS = 380

interface Sim {
  px: number
  py: number
  vx: number
  vy: number
  facing: number
  onGround: boolean
  move: Move
  jumpBuffer: number
  coyote: number
  walkPhase: number
  camX: number
  collected: Set<string>
  sparkles: Sparkle[]
  lastSafe: { x: number; y: number }
  respawn: number
  won: boolean
  wonTimer: number
  wonSpawned: boolean
  lastTime: number
  nextId: number
}

function createSim(level: DigLevel): Sim {
  const py = DIG.groundY - DIG.playerH
  return {
    px: level.startX,
    py,
    vx: 0,
    vy: 0,
    facing: 1,
    onGround: true,
    move: 0,
    jumpBuffer: 0,
    coyote: 0,
    walkPhase: 0,
    camX: clamp(level.startX - DIG.camLead, 0, level.width - DIG.viewW),
    collected: new Set(),
    sparkles: [],
    lastSafe: { x: level.startX, y: py },
    respawn: 0,
    won: false,
    wonTimer: 0,
    wonSpawned: false,
    lastTime: 0,
    nextId: 1,
  }
}

function hits(ax: number, ay: number, aw: number, ah: number, b: Rect): boolean {
  return ax < b.x + b.w && ax + aw > b.x && ay < b.y + b.h && ay + ah > b.y
}

export interface DigGame {
  snapshot: DigSnapshot
  setMove: (dir: Move) => void
  jump: () => void
  /** Advance to the next level (a fresh, slightly longer course). */
  reset: () => void
}

/**
 * Bagger physics. A requestAnimationFrame loop runs while the screen is
 * mounted: run + hop with gravity, forgiving AABB platform collision, coyote
 * time and a jump buffer, bounce pads, gem pick-ups, a gentle return to safe
 * ground after a fall, and a camera that follows the excavator. On reaching
 * the depot the excavator does a happy victory hop. Everything resets when
 * the player leaves the screen.
 */
export function useDigGame(): DigGame {
  const levelIndexRef = useRef(0)
  const simRef = useRef<Sim | null>(null)
  if (simRef.current === null) simRef.current = createSim(levelForIndex(0))

  const [snapshot, setSnapshot] = useState<DigSnapshot>(() => {
    const level = levelForIndex(0)
    const py = DIG.groundY - DIG.playerH
    return {
      px: level.startX,
      py,
      facing: 1,
      walking: false,
      airborne: false,
      bob: 0,
      camX: clamp(level.startX - DIG.camLead, 0, level.width - DIG.viewW),
      collected: [],
      sparkles: [],
      fade: 1,
      won: false,
      levelIndex: 0,
    }
  })

  useEffect(() => {
    let raf = 0
    const pw = DIG.playerW
    const ph = DIG.playerH

    const step = (now: number) => {
      const sim = simRef.current as Sim
      const level = levelForIndex(levelIndexRef.current)
      if (sim.lastTime === 0) sim.lastTime = now
      const dt = Math.min((now - sim.lastTime) / 1000, 0.04)
      sim.lastTime = now
      const ms = dt * 1000

      // Sparkles always fade.
      for (const sp of sim.sparkles) sp.age += ms
      if (sim.sparkles.some((sp) => sp.age >= DIG.sparkleMs)) {
        sim.sparkles = sim.sparkles.filter((sp) => sp.age < DIG.sparkleMs)
      }

      if (sim.won) {
        // Victory: a happy hop and a burst of sparkles at the depot.
        sim.wonTimer += ms
        if (!sim.wonSpawned) {
          sim.wonSpawned = true
          for (let i = 0; i < 6; i += 1) {
            sim.sparkles.push({
              id: sim.nextId++,
              x: sim.px + pw / 2 + (i - 2.5) * 24,
              y: sim.py - 6 - (i % 2) * 20,
              age: 0,
            })
          }
        }
      } else if (sim.respawn > 0) {
        sim.respawn = Math.max(0, sim.respawn - ms)
      } else {
        // ---- Horizontal ----
        sim.vx = sim.move * DIG.runSpeed
        if (sim.move !== 0) sim.facing = sim.move
        sim.px = clamp(sim.px + sim.vx * dt, 0, level.width - pw)
        for (const s of level.solids) {
          if (hits(sim.px, sim.py, pw, ph, s)) {
            sim.px = sim.vx > 0 ? s.x - pw : s.x + s.w
          }
        }
        for (const b of level.bounces) {
          if (hits(sim.px, sim.py, pw, ph, b)) {
            sim.px = sim.vx > 0 ? b.x - pw : b.x + b.w
          }
        }

        // ---- Jump (buffered + coyote) ----
        sim.jumpBuffer = Math.max(0, sim.jumpBuffer - ms)
        sim.coyote = Math.max(0, sim.coyote - ms)
        if (sim.jumpBuffer > 0 && (sim.onGround || sim.coyote > 0)) {
          sim.vy = -DIG.jumpV
          sim.onGround = false
          sim.coyote = 0
          sim.jumpBuffer = 0
          hapticTap()
        }

        // ---- Vertical ----
        sim.vy = Math.min(sim.vy + DIG.gravity * dt, DIG.maxFall)
        sim.py += sim.vy * dt
        const wasOnGround = sim.onGround
        sim.onGround = false
        for (const s of level.solids) {
          if (hits(sim.px, sim.py, pw, ph, s)) {
            if (sim.vy > 0) {
              sim.py = s.y - ph
              sim.vy = 0
              sim.onGround = true
            } else if (sim.vy < 0) {
              sim.py = s.y + s.h
              sim.vy = 0
            }
          }
        }
        for (const b of level.bounces) {
          if (hits(sim.px, sim.py, pw, ph, b)) {
            if (sim.vy > 0) {
              sim.py = b.y - ph
              sim.vy = -DIG.bounceV
              hapticTap()
            } else if (sim.vy < 0) {
              sim.py = b.y + b.h
              sim.vy = 0
            }
          }
        }
        if (wasOnGround && !sim.onGround && sim.vy >= 0) sim.coyote = DIG.coyoteMs

        // ---- Safe ground for a gentle respawn ----
        if (sim.onGround) sim.lastSafe = { x: sim.px, y: sim.py }

        // ---- Fell off: gently return to safe ground ----
        if (sim.py > DIG.fallLine) {
          sim.px = sim.lastSafe.x
          sim.py = sim.lastSafe.y
          sim.vx = 0
          sim.vy = 0
          sim.onGround = true
          sim.respawn = RESPAWN_MS
          sim.camX = clamp(sim.px + pw / 2 - DIG.camLead, 0, level.width - DIG.viewW)
        }

        // ---- Walk cycle ----
        if (sim.onGround && Math.abs(sim.vx) > 1) sim.walkPhase += dt * 9
        else sim.walkPhase = 0

        // ---- Gems ----
        for (const gem of level.gems) {
          if (sim.collected.has(gem.id)) continue
          if (
            hits(sim.px, sim.py, pw, ph, {
              x: gem.x - DIG.gemR,
              y: gem.y - DIG.gemR,
              w: DIG.gemR * 2,
              h: DIG.gemR * 2,
            })
          ) {
            sim.collected.add(gem.id)
            sim.sparkles.push({ id: sim.nextId++, x: gem.x, y: gem.y, age: 0 })
            hapticTap()
          }
        }

        // ---- Goal ----
        if (sim.px + pw / 2 >= level.goalX) {
          sim.won = true
          hapticTap()
        }
      }

      // ---- Camera ----
      const camTarget = clamp(sim.px + pw / 2 - DIG.camLead, 0, level.width - DIG.viewW)
      sim.camX += (camTarget - sim.camX) * Math.min(1, dt * DIG.camEase)

      const walking = sim.respawn <= 0 && !sim.won && sim.onGround && Math.abs(sim.vx) > 1
      const wonHop = sim.won ? -Math.abs(Math.sin(sim.wonTimer * 0.013)) * 18 : 0
      setSnapshot({
        px: sim.px,
        py: sim.py,
        facing: sim.facing,
        walking,
        airborne: sim.respawn <= 0 && !sim.won && !sim.onGround,
        bob: walking ? Math.sin(sim.walkPhase) * 2.4 : wonHop,
        camX: sim.camX,
        collected: Array.from(sim.collected),
        sparkles: sim.sparkles.slice(),
        fade: sim.respawn > 0 ? 1 - sim.respawn / RESPAWN_MS : 1,
        won: sim.won,
        levelIndex: levelIndexRef.current,
      })
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [])

  const setMove = useCallback((dir: Move) => {
    if (simRef.current && !simRef.current.won) simRef.current.move = dir
  }, [])

  const jump = useCallback(() => {
    const sim = simRef.current
    if (sim && !sim.won && sim.respawn <= 0) sim.jumpBuffer = DIG.jumpBufferMs
  }, [])

  const reset = useCallback(() => {
    levelIndexRef.current = Math.min(levelIndexRef.current + 1, LEVELS.length - 1)
    simRef.current = createSim(levelForIndex(levelIndexRef.current))
  }, [])

  return { snapshot, setMove, jump, reset }
}
