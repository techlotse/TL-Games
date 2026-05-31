import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { GameScreen } from '@/components/layout/GameScreen'
import { CompletionOverlay } from '@/components/toddler/CompletionOverlay'
import { useCalmMotion } from '@/lib/motion'
import { RACE, type GoodKind, type ObstacleKind } from './data'
import { useRaceGame } from './logic'
import { CarArt, GoodArt, ObstacleArt, SparkleArt } from './art'

/** Where the cheerful celebration sparkles appear when the goal is reached. */
const CELEBRATE = [
  { x: 22, y: 30 },
  { x: 74, y: 24 },
  { x: 50, y: 15 },
  { x: 30, y: 58 },
  { x: 80, y: 52 },
  { x: 60, y: 40 },
  { x: 18, y: 46 },
]

/**
 * Game 4 - Race.
 * Press and hold the car, then move it from side to side. Drive AROUND the
 * obstacles and INTO the cheerful collectibles - each happy item fills the
 * car's smile. Gather a whole row of them and the car zooms happily off the
 * road in a shower of sparkles, then a gentle "well done" offers another,
 * slightly faster run. A bump just pauses the car for a moment.
 */
export function Race() {
  const calm = useCalmMotion()
  const go = useAppStore((s) => s.go)
  const recordRound = useAppStore((s) => s.recordRound)
  const { snapshot, setTargetX, reset } = useRaceGame()
  const carControls = useAnimationControls()
  const fieldRef = useRef<HTMLDivElement | null>(null)
  const holdingRef = useRef(false)
  const recordedRef = useRef(false)
  const [showOverlay, setShowOverlay] = useState(false)

  // A soft wobble when the car bumps an obstacle.
  useEffect(() => {
    if (snapshot.bumped && !calm) {
      void carControls.start({
        rotate: [0, -13, 11, -8, 6, 0],
        transition: { duration: 0.6, ease: 'easeInOut' },
      })
    }
  }, [snapshot.bumped, calm, carControls])

  // A happy hop when a collectible is gathered.
  useEffect(() => {
    if (snapshot.collected > 0 && !snapshot.done && !calm) {
      void carControls.start({
        scale: [1, 1.16, 1],
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      })
    }
  }, [snapshot.collected, snapshot.done, calm, carControls])

  // Reaching the goal: record the round, zoom the car off, then celebrate.
  useEffect(() => {
    if (!snapshot.done) return
    if (!recordedRef.current) {
      recordedRef.current = true
      recordRound('race')
    }
    if (!calm) {
      void carControls.start({
        y: [0, 16, -820],
        scale: [1, 1.14, 1.14],
        transition: { duration: 1, ease: 'easeIn', times: [0, 0.18, 1] },
      })
    }
    const timer = setTimeout(() => setShowOverlay(true), calm ? 250 : 980)
    return () => clearTimeout(timer)
  }, [snapshot.done, calm, carControls, recordRound])

  // First-touch hint: show a pulsing ring around the car until the child
  // touches the field for the first time.
  const [hintDismissed, setHintDismissed] = useState(false)

  const steerTo = (clientX: number) => {
    const field = fieldRef.current
    if (!field) return
    const r = field.getBoundingClientRect()
    if (r.width === 0) return
    setTargetX(((clientX - r.left) / r.width) * 100)
  }

  const handleAgain = () => {
    recordedRef.current = false
    holdingRef.current = false
    setShowOverlay(false)
    setHintDismissed(false)
    carControls.set({ y: 0, scale: 1, rotate: 0 })
    reset()
  }

  const smile = Math.min(1, snapshot.collected / RACE.goal)

  return (
    <GameScreen tone="race">
      <div className="relative flex flex-1 flex-col px-3 pb-2">
        <div
          ref={fieldRef}
          className="relative w-full flex-1 touch-none select-none overflow-hidden rounded-[1.75rem] shadow-soft"
          style={{ backgroundColor: '#6E7378' }}
          onPointerDown={(event) => {
            holdingRef.current = true
            setHintDismissed(true)
            event.currentTarget.setPointerCapture(event.pointerId)
            steerTo(event.clientX)
          }}
          onPointerMove={(event) => {
            if (holdingRef.current) steerTo(event.clientX)
          }}
          onPointerUp={() => {
            holdingRef.current = false
            setTargetX(null)
          }}
          onPointerCancel={() => {
            holdingRef.current = false
            setTargetX(null)
          }}
          onContextMenu={(event) => event.preventDefault()}
        >
          {/* Curbs */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-[4%]"
            style={{
              background: 'repeating-linear-gradient(180deg,#E7E3D8 0 16px,#CF5E48 16px 32px)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-[4%]"
            style={{
              background: 'repeating-linear-gradient(180deg,#E7E3D8 0 16px,#CF5E48 16px 32px)',
            }}
          />

          {/* Scrolling centre line */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-full w-[3%] -translate-x-1/2"
            style={{
              backgroundImage:
                'repeating-linear-gradient(180deg,#EBE7D9 0 24px,transparent 24px 58px)',
              animation: 'sg-road 0.8s linear infinite',
              animationPlayState: snapshot.bumped || snapshot.done ? 'paused' : 'running',
            }}
          />

          {/* Obstacles and collectibles */}
          {snapshot.items.map((item) => (
            <div
              key={item.id}
              className="pointer-events-none absolute"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                width: `${RACE.itemW}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {item.good ? (
                <GoodArt kind={item.kind as GoodKind} />
              ) : (
                <ObstacleArt kind={item.kind as ObstacleKind} />
              )}
            </div>
          ))}

          {/* Collect sparkles */}
          {snapshot.sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              className="pointer-events-none absolute"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                width: '22%',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0.4, opacity: 0.95 }}
              animate={{ scale: 1.7, opacity: 0 }}
              transition={{ duration: RACE.sparkleMs / 1000, ease: 'easeOut' }}
            >
              <SparkleArt />
            </motion.div>
          ))}

          {/* Celebration sparkles when the goal is reached */}
          {snapshot.done &&
            CELEBRATE.map((p, i) => (
              <motion.div
                key={`cel-${i}`}
                className="pointer-events-none absolute"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: '18%',
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  calm
                    ? { scale: 1, opacity: 0.9 }
                    : { scale: [0, 1.2, 0.9, 1.15, 0.9], opacity: [0, 1, 0.85, 1, 0.85] }
                }
                transition={
                  calm
                    ? { duration: 0.2 }
                    : {
                        duration: 1.7,
                        delay: i * 0.11,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                      }
                }
              >
                <SparkleArt />
              </motion.div>
            ))}

          {/* First-touch hint: pulsing ring around the car */}
          <AnimatePresence>
            {!hintDismissed && !snapshot.done && (
              <motion.div
                key="hint-ring"
                className="pointer-events-none absolute"
                style={{
                  left: `${snapshot.carX}%`,
                  top: `${RACE.carY}%`,
                  width: `${RACE.carW * 2.6}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                initial={{ opacity: 0 }}
                animate={calm ? { opacity: 0.7 } : { opacity: [0.3, 0.85, 0.3], scale: [1, 1.12, 1] }}
                exit={{ opacity: 0, scale: 1.3 }}
                transition={calm ? { duration: 0 } : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
                  <circle cx="50" cy="50" r="44" fill="none" stroke="#F4C84E" strokeWidth="5" strokeDasharray="8 6" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Car */}
          <div
            className="pointer-events-none absolute"
            style={{
              left: `${snapshot.carX}%`,
              top: `${RACE.carY}%`,
              width: `${RACE.carW}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <motion.div animate={carControls}>
              <CarArt smile={smile} />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {showOverlay && (
            <CompletionOverlay key="done" onAgain={handleAgain} onHome={() => go('home')} />
          )}
        </AnimatePresence>
      </div>
      <style>{`@keyframes sg-road{to{background-position-y:58px}}`}</style>
    </GameScreen>
  )
}
