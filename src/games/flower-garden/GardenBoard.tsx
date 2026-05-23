import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useCalmMotion, settleSpring } from '@/lib/motion'
import { hapticSuccess, hapticTap } from '@/lib/platform'
import { CompletionOverlay } from '@/components/toddler/CompletionOverlay'
import { CoverArt, CreatureArt } from './art'
import type { GardenGame, Spot } from './logic'

/* ------------------------------ Spot view -------------------------------- */

interface SpotViewProps {
  spot: Spot
  found: boolean
  onTap: () => 'creature' | 'empty'
}

function SpotView({ spot, found, onTap }: SpotViewProps) {
  const calm = useCalmMotion()
  const controls = useAnimationControls()

  const handleClick = () => {
    hapticTap()
    const result = onTap()
    // An empty spot simply rustles - nothing is ever wrong.
    if (result === 'empty' && !calm) {
      void controls.start({ rotate: [0, -8, 8, -6, 6, 0], transition: { duration: 0.42 } })
    }
  }

  return (
    <button
      type="button"
      aria-label="Versteck im Garten"
      onClick={handleClick}
      className="relative aspect-square shrink-0 basis-[27%] outline-none"
    >
      <motion.div className="h-full w-full" animate={controls}>
        <CoverArt kind={spot.cover} />
      </motion.div>

      <AnimatePresence>
        {found && spot.creature && (
          <motion.div
            key="creature"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: calm ? 1 : 0.35 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={calm ? { duration: 0 } : settleSpring}
          >
            <motion.div
              className="h-[58%] w-[58%]"
              animate={calm ? undefined : { y: [0, -7, 0] }}
              transition={
                calm ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <CreatureArt kind={spot.creature} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}

/* ------------------------------ Garden board ----------------------------- */

export interface GardenBoardProps {
  game: GardenGame
  onHome: () => void
  onComplete?: () => void
}

/**
 * Tap the covers to find the creatures hiding in the garden. Empty spots just
 * rustle. When every creature is found, the round is complete.
 */
export function GardenBoard({ game, onHome, onComplete }: GardenBoardProps) {
  const { round, found, isComplete } = game
  const completedRef = useRef(false)

  useEffect(() => {
    completedRef.current = false
  }, [round.id])

  useEffect(() => {
    if (isComplete && !completedRef.current) {
      completedRef.current = true
      hapticSuccess()
      onComplete?.()
    }
  }, [isComplete, onComplete])

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="flex w-full max-w-[27rem] flex-wrap items-center justify-center gap-3">
          {round.spots.map((spot) => (
            <SpotView
              key={`${round.id}:${spot.id}`}
              spot={spot}
              found={found.has(spot.id)}
              onTap={() => game.tap(spot.id)}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isComplete && (
          <CompletionOverlay key="complete" onAgain={game.reset} onHome={onHome} />
        )}
      </AnimatePresence>
    </div>
  )
}
