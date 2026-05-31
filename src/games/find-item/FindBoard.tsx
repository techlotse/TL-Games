import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { useCalmMotion, calmTween, settleSpring } from '@/lib/motion'
import { hapticSuccess, hapticTap } from '@/lib/platform'
import { CompletionOverlay } from '@/components/toddler/CompletionOverlay'
import { FindSparkle, ItemArt, ITEM_LABEL } from './art'
import type { FindGame, Placement } from './logic'

interface SceneItemProps {
  placement: Placement
  found: boolean
  hint: boolean
  wrongSeq: number
  onTap: () => void
}

/** One scattered, tappable item in the scene. */
function SceneItem({ placement, found, hint, wrongSeq, onTap }: SceneItemProps) {
  const calm = useCalmMotion()
  const controls = useAnimationControls()

  useEffect(() => {
    if (wrongSeq > 0 && !calm) {
      void controls.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.36 } })
    }
  }, [wrongSeq, calm, controls])

  return (
    <div
      className="absolute aspect-square w-[20%] min-h-[64px] min-w-[64px]"
      style={{ left: `${placement.x}%`, top: `${placement.y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <motion.button
        type="button"
        aria-label={ITEM_LABEL[placement.kind]}
        onClick={onTap}
        animate={controls}
        whileTap={calm || found ? undefined : { scale: 0.92 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full w-full outline-none"
      >
        <div
          className={found ? 'h-full w-full opacity-60' : 'h-full w-full'}
          style={{
            transform: `rotate(${placement.rot}deg)`,
            filter: found ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))',
          }}
        >
          <ItemArt kind={placement.kind} />
        </div>

        {hint && !found && (
          <motion.span
            className="pointer-events-none absolute -inset-2 rounded-full ring-4 ring-focus"
            initial={{ opacity: 0 }}
            animate={calm ? { opacity: 0.7 } : { opacity: [0.4, 0.9, 0.4], scale: [1, 1.06, 1] }}
            transition={
              calm ? { duration: 0 } : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
            }
            aria-hidden
          />
        )}

        {found && (
          <>
            <motion.span
              className="pointer-events-none absolute -inset-1 rounded-full ring-4 ring-tile-garden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={calmTween}
              aria-hidden
            />
            <span className="pointer-events-none absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-tile-garden text-ink shadow-soft">
              <Check size={16} strokeWidth={3.4} aria-hidden />
            </span>
            <motion.div
              className="pointer-events-none absolute inset-0"
              initial={{ scale: 0.4, opacity: 0.95 }}
              animate={{ scale: calm ? 1 : 1.5, opacity: 0 }}
              transition={{ duration: 0.65, ease: 'easeOut' }}
              aria-hidden
            >
              <FindSparkle />
            </motion.div>
          </>
        )}
      </motion.button>
    </div>
  )
}

export interface FindBoardProps {
  game: FindGame
  onHome: () => void
  onComplete?: () => void
}

/**
 * The find-an-item surface. One item is shown in the frame at the top; the
 * child finds and taps the same item in the scene below. A wrong tap just
 * gives a soft wobble. On the first levels the target also glows in the scene;
 * later the child searches unaided.
 */
export function FindBoard({ game, onHome, onComplete }: FindBoardProps) {
  const { round, found, targetId, targetKind, isComplete } = game
  const calm = useCalmMotion()
  const completedRef = useRef(false)
  const [wrong, setWrong] = useState<{ id: string; seq: number } | null>(null)

  useEffect(() => {
    setWrong(null)
    completedRef.current = false
  }, [round.id])

  useEffect(() => {
    if (isComplete && !completedRef.current) {
      completedRef.current = true
      hapticSuccess()
      onComplete?.()
    }
  }, [isComplete, onComplete])

  const handleTap = useCallback(
    (id: string) => {
      if (found.has(id)) return
      if (game.attempt(id) === 'correct') {
        hapticTap()
      } else {
        hapticTap()
        setWrong((prev) => ({ id, seq: (prev?.seq ?? 0) + 1 }))
      }
    },
    [found, game],
  )

  return (
    <div className="relative flex flex-1 flex-col gap-2 px-3 pb-2">
      {/* What to find */}
      <div className="flex justify-center pt-1">
        <div className="relative flex flex-col items-center">
          <div className="relative h-24 w-24">
            <motion.span
              className="pointer-events-none absolute -inset-1.5 rounded-[1.7rem] ring-4 ring-focus"
              initial={{ opacity: 0 }}
              animate={calm ? { opacity: 0.6 } : { opacity: [0.35, 0.8, 0.35] }}
              transition={
                calm ? { duration: 0 } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
              }
              aria-hidden
            />
            <div className="relative flex h-full w-full items-center justify-center rounded-[1.5rem] bg-surface p-2.5 shadow-soft">
              <AnimatePresence mode="wait">
                {targetKind && (
                  <motion.div
                    key={targetId}
                    className="h-full w-full"
                    initial={{ opacity: 0, scale: calm ? 1 : 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: calm ? 1 : 0.7 }}
                    transition={calm ? { duration: 0 } : settleSpring}
                  >
                    <ItemArt kind={targetKind} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <motion.span
            className="mt-0.5 text-focus"
            animate={calm ? undefined : { y: [0, 5, 0] }}
            transition={calm ? undefined : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          >
            <ChevronDown size={30} strokeWidth={3} />
          </motion.span>
        </div>
      </div>

      {/* The scene to search — warm play-mat background */}
      <div
        className="relative flex-1 overflow-hidden rounded-[1.6rem] shadow-soft"
        style={{
          background:
            'radial-gradient(ellipse at 30% 30%, #F5EDD8 0%, #EDE0C4 55%, #E4D4B0 100%)',
        }}
      >
        {round.items.map((item) => (
          <SceneItem
            key={`${round.id}:${item.id}`}
            placement={item}
            found={found.has(item.id)}
            hint={round.id < 2 && item.id === targetId}
            wrongSeq={wrong?.id === item.id ? wrong.seq : 0}
            onTap={() => handleTap(item.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {isComplete && <CompletionOverlay key="complete" onAgain={game.reset} onHome={onHome} />}
      </AnimatePresence>
    </div>
  )
}
