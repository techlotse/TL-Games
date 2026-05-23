import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useCalmMotion, calmTween, settleSpring } from '@/lib/motion'
import { hapticSuccess, hapticTap } from '@/lib/platform'
import { CompletionOverlay } from '@/components/toddler/CompletionOverlay'
import { DraggablePiece } from './DraggablePiece'
import type { MatchKey, Point } from './types'
import type { MatchingGame } from './useMatchingGame'

export interface MatchingBoardProps {
  game: MatchingGame
  renderItem: (key: MatchKey) => ReactNode
  renderTarget: (key: MatchKey, filled: boolean) => ReactNode
  onHome: () => void
  onComplete?: () => void
}

interface TargetSlotProps {
  slotKey: MatchKey
  filled: boolean
  glowing: boolean
  shakeSeq: number
  renderTarget: (key: MatchKey, filled: boolean) => ReactNode
  renderItem: (key: MatchKey) => ReactNode
  registerRef: (el: HTMLDivElement | null) => void
  onTap: () => void
}

function TargetSlot({
  slotKey,
  filled,
  glowing,
  shakeSeq,
  renderTarget,
  renderItem,
  registerRef,
  onTap,
}: TargetSlotProps) {
  const calm = useCalmMotion()
  const controls = useAnimationControls()

  useEffect(() => {
    if (shakeSeq > 0 && !calm) {
      void controls.start({ x: [0, -7, 7, -5, 5, 0], transition: { duration: 0.36 } })
    }
  }, [shakeSeq, calm, controls])

  return (
    <motion.div
      ref={registerRef}
      animate={controls}
      onClick={onTap}
      className="relative flex h-full w-full items-center justify-center rounded-[1.6rem] bg-surface shadow-soft"
    >
      <div className="absolute inset-0 flex items-center justify-center p-[12%]">
        {renderTarget(slotKey, filled)}
      </div>

      <AnimatePresence>
        {glowing && !filled && (
          <motion.div
            key="hint"
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={calmTween}
          >
            <motion.span
              className="absolute -inset-1 rounded-[1.9rem] ring-4 ring-focus"
              animate={calm ? undefined : { opacity: [0.4, 0.9, 0.4], scale: [1, 1.03, 1] }}
              transition={
                calm ? undefined : { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
              }
            />
            <motion.span
              className="absolute -top-9 left-1/2 -ml-[18px] text-focus"
              animate={calm ? undefined : { y: [0, 6, 0] }}
              transition={
                calm ? undefined : { duration: 1.1, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <ChevronDown size={36} strokeWidth={3} aria-hidden />
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {filled && (
          <motion.div
            key="placed"
            className="absolute inset-0 flex items-center justify-center p-[10%]"
            initial={{ opacity: 0, scale: calm ? 1 : 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={calm ? { duration: 0 } : settleSpring}
          >
            {renderItem(slotKey)}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface ItemCellProps {
  itemKey: MatchKey
  placed: boolean
  selected: boolean
  floatDelay: number
  renderItem: (key: MatchKey) => ReactNode
  onPickUp: () => void
  onLetGo: (point: Point | null) => void
  onTap: () => void
}

function ItemCell({
  itemKey,
  placed,
  selected,
  floatDelay,
  renderItem,
  onPickUp,
  onLetGo,
  onTap,
}: ItemCellProps) {
  const calm = useCalmMotion()
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <AnimatePresence mode="wait">
        {placed ? (
          <motion.div
            key="socket"
            className="absolute inset-[14%] rounded-full bg-surface-2 shadow-inset"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={calmTween}
          />
        ) : (
          <motion.div
            key="piece"
            className="absolute inset-0 flex items-center justify-center p-[6%]"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: calm ? 1 : 0.55 }}
            transition={calm ? { duration: 0 } : calmTween}
          >
            <DraggablePiece
              pieceKey={itemKey}
              selected={selected}
              floatDelay={floatDelay}
              onPickUp={onPickUp}
              onLetGo={onLetGo}
              onTap={onTap}
            >
              {renderItem(itemKey)}
            </DraggablePiece>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/**
 * The shared play surface for the matching game. Targets sit on top, the
 * items tray below. Pieces can be dragged or tapped onto targets; wrong
 * choices bounce back, correct ones settle in. The row adapts to 3 - 5 items.
 */
export function MatchingBoard({
  game,
  renderItem,
  renderTarget,
  onHome,
  onComplete,
}: MatchingBoardProps) {
  const { round, isComplete } = game
  const [activeKey, setActiveKey] = useState<MatchKey | null>(null)
  const [shake, setShake] = useState<{ key: MatchKey; seq: number } | null>(null)
  const targetRefs = useRef(new Map<MatchKey, HTMLElement>())
  const completedRef = useRef(false)

  const count = round.keys.length
  const cellBasis = `calc((100% - ${(count - 1) * 0.5}rem) / ${count})`

  useEffect(() => {
    setActiveKey(null)
    setShake(null)
    completedRef.current = false
  }, [round.id])

  useEffect(() => {
    if (isComplete && !completedRef.current) {
      completedRef.current = true
      hapticSuccess()
      onComplete?.()
    }
  }, [isComplete, onComplete])

  const targetAtPoint = useCallback((point: Point): MatchKey | null => {
    for (const [key, el] of targetRefs.current) {
      const r = el.getBoundingClientRect()
      const left = r.left + window.scrollX
      const top = r.top + window.scrollY
      if (
        point.x >= left &&
        point.x <= left + r.width &&
        point.y >= top &&
        point.y <= top + r.height
      ) {
        return key
      }
    }
    return null
  }, [])

  const tryMatch = useCallback(
    (itemKey: MatchKey, targetKey: MatchKey): boolean => {
      if (game.isPlaced(targetKey)) return false
      if (game.attempt(itemKey, targetKey) === 'correct') {
        hapticTap()
        return true
      }
      setShake((prev) => ({ key: targetKey, seq: (prev?.seq ?? 0) + 1 }))
      return false
    },
    [game],
  )

  const handleLetGo = useCallback(
    (itemKey: MatchKey, point: Point | null) => {
      setActiveKey(null)
      if (!point) return
      const targetKey = targetAtPoint(point)
      if (targetKey) tryMatch(itemKey, targetKey)
    },
    [targetAtPoint, tryMatch],
  )

  const handleTapItem = useCallback((key: MatchKey) => {
    setActiveKey((prev) => (prev === key ? null : key))
  }, [])

  const handleTapTarget = useCallback(
    (targetKey: MatchKey) => {
      if (activeKey == null) return
      if (tryMatch(activeKey, targetKey)) setActiveKey(null)
    },
    [activeKey, tryMatch],
  )

  const registerTarget = useCallback(
    (key: MatchKey) => (el: HTMLDivElement | null) => {
      if (el) targetRefs.current.set(key, el)
      else targetRefs.current.delete(key)
    },
    [],
  )

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-[6vh] px-4">
        <div className="flex w-full items-center justify-center gap-2">
          {round.targetOrder.map((key) => (
            <div
              key={`${round.id}:t:${key}`}
              className="aspect-square shrink-0"
              style={{ flexBasis: cellBasis }}
            >
              <TargetSlot
                slotKey={key}
                filled={game.isPlaced(key)}
                glowing={activeKey === key}
                shakeSeq={shake?.key === key ? shake.seq : 0}
                renderTarget={renderTarget}
                renderItem={renderItem}
                registerRef={registerTarget(key)}
                onTap={() => handleTapTarget(key)}
              />
            </div>
          ))}
        </div>

        <div className="flex w-full items-center justify-center gap-2">
          {round.itemOrder.map((key, index) => (
            <div
              key={`${round.id}:i:${key}`}
              className="aspect-square shrink-0"
              style={{ flexBasis: cellBasis }}
            >
              <ItemCell
                itemKey={key}
                placed={game.isPlaced(key)}
                selected={activeKey === key}
                floatDelay={index * 0.4}
                renderItem={renderItem}
                onPickUp={() => setActiveKey(key)}
                onLetGo={(point) => handleLetGo(key, point)}
                onTap={() => handleTapItem(key)}
              />
            </div>
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
