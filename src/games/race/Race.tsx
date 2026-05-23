import { useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { GameScreen } from '@/components/layout/GameScreen'
import { useCalmMotion } from '@/lib/motion'
import { RACE } from './data'
import { useRaceGame } from './logic'
import { CarArt, ObstacleArt } from './art'

/**
 * Game 4 - Race.
 * Hold the left or right side of the road to steer, and drive around the
 * obstacles. A bump just pauses the car for a moment with a soft wobble -
 * there is no score and no "game over". The speed rises a little every 30s.
 */
export function Race() {
  const calm = useCalmMotion()
  const recordRound = useAppStore((s) => s.recordRound)
  const { snapshot, setSteer } = useRaceGame(() => recordRound('race'))
  const carControls = useAnimationControls()

  // A soft wobble when the car bumps an obstacle.
  useEffect(() => {
    if (snapshot.bumped && !calm) {
      void carControls.start({
        rotate: [0, -13, 11, -8, 6, 0],
        transition: { duration: 0.6, ease: 'easeInOut' },
      })
    }
  }, [snapshot.bumped, calm, carControls])

  return (
    <GameScreen tone="race">
      <div className="flex flex-1 flex-col px-3 pb-2">
        <div
          className="relative w-full flex-1 select-none overflow-hidden rounded-[1.75rem] shadow-soft"
          style={{ backgroundColor: '#6E7378' }}
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
              animationPlayState: snapshot.bumped ? 'paused' : 'running',
            }}
          />

          {/* Obstacles */}
          {snapshot.obstacles.map((o) => (
            <div
              key={o.id}
              className="pointer-events-none absolute"
              style={{
                left: `${o.x}%`,
                top: `${o.y}%`,
                width: `${RACE.obstacleW}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <ObstacleArt kind={o.kind} />
            </div>
          ))}

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
              <CarArt />
            </motion.div>
          </div>

          {/* Steering zones - hold a side to steer that way */}
          <button
            type="button"
            aria-label="Nach links lenken"
            onPointerDown={() => setSteer(-1)}
            onPointerUp={() => setSteer(0)}
            onPointerLeave={() => setSteer(0)}
            onPointerCancel={() => setSteer(0)}
            onContextMenu={(event) => event.preventDefault()}
            className="absolute inset-y-0 left-0 w-1/2 touch-none bg-transparent outline-none"
          />
          <button
            type="button"
            aria-label="Nach rechts lenken"
            onPointerDown={() => setSteer(1)}
            onPointerUp={() => setSteer(0)}
            onPointerLeave={() => setSteer(0)}
            onPointerCancel={() => setSteer(0)}
            onContextMenu={(event) => event.preventDefault()}
            className="absolute inset-y-0 right-0 w-1/2 touch-none bg-transparent outline-none"
          />
        </div>
      </div>
      <style>{`@keyframes sg-road{to{background-position-y:58px}}`}</style>
    </GameScreen>
  )
}
