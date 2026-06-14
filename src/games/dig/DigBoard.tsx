import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, House, Play } from 'lucide-react'
import { useCalmMotion, calmTween, settleSpring } from '@/lib/motion'
import { RoundButton } from '@/components/toddler/RoundButton'
import { DIG, levelForIndex } from './data'
import type { DigGame, Move } from './logic'
import {
  Bird,
  BouncePad,
  Cloud,
  Crane,
  Depot,
  DigDefs,
  DustPuff,
  Excavator,
  Gem,
  GemIcon,
  Hill,
  PlatformRect,
  Sparkle,
  Sun,
  Tree,
} from './art'

const SKY = 'linear-gradient(180deg,#5BAED6 0%,#8ECFE8 38%,#BFE6E2 72%,#D2EFD9 100%)'

/* ------------------------------ Intro story ------------------------------ */

function IntroScene() {
  return (
    <svg viewBox="0 0 300 150" className="w-full" aria-hidden>
      <DigDefs />
      <path d="M0 122 Q150 108 300 122 L300 150 L0 150 Z" fill="url(#dg-grass)" />
      <g transform="translate(26 78) scale(1.05)">
        <Excavator />
      </g>
      {[
        [120, 86],
        [158, 70],
        [196, 86],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(0.62)`}>
          <Gem />
        </g>
      ))}
      <g stroke="#C7A86A" strokeWidth="3" strokeLinecap="round">
        {[96, 110, 124, 138].map((x) => (
          <line key={x} x1={x} y1={106} x2={x + 5} y2={106} />
        ))}
      </g>
      <g transform="translate(244 122) scale(0.4)">
        <Depot />
      </g>
    </svg>
  )
}

function IntroOverlay({ onGo }: { onGo: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-7 bg-background/92 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={calmTween}
    >
      <div className="w-full max-w-[20rem] rounded-[1.6rem] bg-surface p-4 shadow-soft">
        <IntroScene />
      </div>
      <RoundButton label="Los" caption="Los" onPress={onGo} tone="accent" size="xl">
        <Play size={44} strokeWidth={2.6} aria-hidden />
      </RoundButton>
    </motion.div>
  )
}

/* ------------------------------- Win scene ------------------------------- */

function WinOverlay({
  total,
  found,
  onHome,
  onNext,
}: {
  total: number
  found: number
  onHome: () => void
  onNext: () => void
}) {
  const calm = useCalmMotion()
  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-background/90 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={calmTween}
    >
      <motion.div
        className="relative h-40 w-full max-w-[19rem]"
        initial={{ opacity: 0, scale: calm ? 1 : 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={calm ? { duration: 0 } : { ...settleSpring, delay: 0.05 }}
      >
        <svg viewBox="0 0 240 150" className="h-full w-full" aria-hidden>
          <DigDefs />
          <path d="M0 124 Q120 112 240 124 L240 150 L0 150 Z" fill="url(#dg-grass)" />
          <g transform="translate(126 124) scale(0.62)">
            <Depot />
          </g>
          <g transform="translate(34 80) scale(1.15)">
            <Excavator />
          </g>
          {[
            [70, 36],
            [128, 24],
            [186, 40],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y}) scale(0.7)`}>
              <Sparkle />
            </g>
          ))}
        </svg>
      </motion.div>

      <div className="flex max-w-[18rem] flex-wrap items-center justify-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className="h-6 w-6" style={{ opacity: i < found ? 1 : 0.22 }}>
            <GemIcon />
          </span>
        ))}
      </div>

      <div className="flex items-end gap-7">
        <RoundButton label="Zuhause" caption="Zuhause" onPress={onHome} tone="surface" size="lg">
          <House size={32} strokeWidth={2.4} aria-hidden />
        </RoundButton>
        <RoundButton label="Weiter" caption="Weiter" onPress={onNext} tone="accent" size="xl">
          <ChevronRight size={44} strokeWidth={2.8} aria-hidden />
        </RoundButton>
      </div>
    </motion.div>
  )
}

/* ------------------------------- Dig board ------------------------------- */

export interface DigBoardProps {
  game: DigGame
  onHome: () => void
  onComplete: () => void
}

/**
 * The Bagger play surface: a parallax world the excavator runs and hops
 * through, big touch controls (and keyboard), and the intro and win scenes.
 */
export function DigBoard({ game, onHome, onComplete }: DigBoardProps) {
  const { snapshot } = game
  const calm = useCalmMotion()
  const level = levelForIndex(snapshot.levelIndex)
  const [started, setStarted] = useState(false)
  const [showWin, setShowWin] = useState(false)
  const leftRef = useRef(false)
  const rightRef = useRef(false)
  const wonRef = useRef(false)

  const applyMove = useCallback(() => {
    const m = (rightRef.current ? 1 : 0) + (leftRef.current ? -1 : 0)
    game.setMove(m as Move)
  }, [game])

  // Win: record the round, then show the win scene after the victory hop.
  // onComplete is held in a ref so the show-win timer is never cancelled by
  // the parent re-rendering (the game loop re-renders on every frame).
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    if (!snapshot.won || wonRef.current) return
    wonRef.current = true
    onCompleteRef.current()
    const timer = setTimeout(() => setShowWin(true), 1150)
    return () => clearTimeout(timer)
  }, [snapshot.won])

  // Keyboard play (desktop + accessibility).
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.repeat) return
      if (event.key === 'ArrowLeft' || event.key === 'a') {
        leftRef.current = true
        applyMove()
      } else if (event.key === 'ArrowRight' || event.key === 'd') {
        rightRef.current = true
        applyMove()
      } else if (event.key === 'ArrowUp' || event.key === ' ' || event.key === 'w') {
        event.preventDefault()
        game.jump()
      }
    }
    const up = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' || event.key === 'a') {
        leftRef.current = false
        applyMove()
      } else if (event.key === 'ArrowRight' || event.key === 'd') {
        rightRef.current = false
        applyMove()
      }
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [applyMove, game])

  const handleNext = useCallback(() => {
    wonRef.current = false
    leftRef.current = false
    rightRef.current = false
    setShowWin(false)
    game.setMove(0)
    game.reset()
  }, [game])

  const farDecos = useMemo(() => {
    const reach = level.width * 0.62
    const hills: { x: number; s: number }[] = []
    for (let x = 90; x < reach; x += 360) hills.push({ x, s: 0.78 + ((x * 7) % 46) / 100 })
    const clouds: { x: number; y: number }[] = []
    for (let x = 40, i = 0; x < reach; x += 232, i += 1) clouds.push({ x, y: 52 + (i % 3) * 46 })
    const cranes: number[] = []
    for (let x = 320; x < reach; x += 740) cranes.push(x)
    const trees: { x: number; s: number }[] = []
    for (let x = 210, i = 0; x < reach; x += 286, i += 1) trees.push({ x, s: 0.72 + (i % 3) * 0.15 })
    const birds: { x: number; y: number }[] = []
    for (let x = 150, i = 0; x < reach; x += 350, i += 1) birds.push({ x, y: 64 + (i % 3) * 30 })
    return { hills, clouds, cranes, trees, birds }
  }, [level])

  const camX = snapshot.camX

  return (
    <div className="relative flex flex-1 flex-col px-3 pb-3">
      <div
        className="relative flex-1 select-none overflow-hidden rounded-[1.5rem] shadow-soft"
        style={{ background: SKY }}
      >
        <svg viewBox="0 0 300 450" preserveAspectRatio="xMidYMid meet" className="h-full w-full">
          <DigDefs />
          <g transform="translate(248 60)">
            <Sun />
          </g>

          {/* Far parallax layer */}
          <g transform={`translate(${-camX * 0.4} 0)`}>
            {farDecos.hills.map((h, i) => (
              <g key={`h${i}`} transform={`translate(${h.x} ${DIG.groundY}) scale(${h.s})`}>
                <Hill far />
              </g>
            ))}
            {farDecos.cranes.map((x, i) => (
              <g key={`r${i}`} transform={`translate(${x} ${DIG.groundY})`}>
                <Crane />
              </g>
            ))}
            {farDecos.trees.map((t, i) => (
              <g key={`t${i}`} transform={`translate(${t.x} ${DIG.groundY}) scale(${t.s})`}>
                <Tree />
              </g>
            ))}
            {farDecos.clouds.map((c, i) => (
              <g key={`c${i}`} transform={`translate(${c.x} ${c.y})`}>
                <Cloud />
              </g>
            ))}
            {farDecos.birds.map((b, i) => (
              <g key={`b${i}`} transform={`translate(${b.x} ${b.y})`}>
                <Bird />
              </g>
            ))}
          </g>

          {/* World */}
          <g transform={`translate(${-camX} 0)`}>
            {level.solids.map((r, i) => (
              <PlatformRect key={`s${i}`} rect={r} />
            ))}
            {level.bounces.map((b, i) => (
              <BouncePad key={`p${i}`} rect={b} />
            ))}
            <g transform={`translate(${level.goalX - 36} ${DIG.groundY})`}>
              <Depot />
            </g>
            {level.gems
              .filter((gem) => !snapshot.collected.includes(gem.id))
              .map((gem) => (
                <g key={gem.id} transform={`translate(${gem.x} ${gem.y})`}>
                  <g className={calm ? undefined : 'dig-gem'}>
                    <Gem />
                  </g>
                </g>
              ))}
            {snapshot.sparkles.map((sp) => {
              const k = sp.age / DIG.sparkleMs
              return (
                <g
                  key={sp.id}
                  transform={`translate(${sp.x} ${sp.y}) scale(${0.5 + k * 1.6})`}
                  opacity={Math.max(0, 1 - k)}
                >
                  <Sparkle />
                </g>
              )
            })}
            <g
              opacity={snapshot.fade}
              transform={`translate(${snapshot.px} ${snapshot.py + snapshot.bob})`}
            >
              <g transform={snapshot.facing < 0 ? 'translate(40 0) scale(-1 1)' : undefined}>
                {snapshot.walking && (
                  <g transform="translate(3 41)">
                    <DustPuff />
                  </g>
                )}
                <Excavator />
              </g>
            </g>
          </g>
        </svg>

        {/* One-finger touch controls for a 3-year-old:
            Bottom half = hold to drive forward (the excavator only goes
            forward). Top half = tap to jump. Multiple fingers are tracked
            independently so a child can hold forward AND tap to jump.
            Keyboard (Arrow keys / Space) still supports both directions for
            desktop and accessibility. */}
        {started && !snapshot.won && (
          <div className="pointer-events-none absolute inset-0">
            {/* Drive-forward zone — bottom half, full width */}
            <div
              aria-label="Fahren"
              className="pointer-events-auto absolute bottom-0 left-0 right-0 h-1/2 touch-none"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                rightRef.current = true
                applyMove()
              }}
              onPointerUp={() => { rightRef.current = false; applyMove() }}
              onPointerCancel={() => { rightRef.current = false; applyMove() }}
              onContextMenu={(e) => e.preventDefault()}
            />
            {/* Jump zone — top half, full width */}
            <div
              aria-label="Springen"
              className="pointer-events-auto absolute left-0 right-0 top-0 h-1/2 touch-none"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId)
                game.jump()
              }}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {!started && <IntroOverlay key="intro" onGo={() => setStarted(true)} />}
        {showWin && (
          <WinOverlay
            key="win"
            total={level.gems.length}
            found={snapshot.collected.length}
            onHome={onHome}
            onNext={handleNext}
          />
        )}
      </AnimatePresence>

      <style>{`@keyframes dig-gem{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}.dig-gem{animation:dig-gem 2.4s ease-in-out infinite}`}</style>
    </div>
  )
}
