import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useCalmMotion, calmTween, settleSpring } from '@/lib/motion'
import { hapticSuccess, hapticTap } from '@/lib/platform'
import { CompletionOverlay } from '@/components/toddler/CompletionOverlay'
import { DraggablePiece } from '@/games/shared/DraggablePiece'
import type { Point } from '@/games/shared/types'
import { PartArt } from './art'
import type { Slot } from './data'
import type { AssemblyGame, TrayPiece } from './logic'

/* ------------------------------ Slot view -------------------------------- */

interface SlotViewProps {
  slot: Slot
  placed: boolean
  glowing: boolean
  shakeSeq: number
  registerRef: (el: HTMLDivElement | null) => void
  onTap: () => void
}

function SlotView({ slot, placed, glowing, shakeSeq, registerRef, onTap }: SlotViewProps) {
  const calm = useCalmMotion()
  const controls = useAnimationControls()

  useEffect(() => {
    if (shakeSeq > 0 && !calm) {
      void controls.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.34 } })
    }
  }, [shakeSeq, calm, controls])

  return (
    <div
      ref={registerRef}
      className="absolute"
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        width: `${slot.size}%`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <motion.div animate={controls} onClick={onTap} className="relative">
        <AnimatePresence>
          {glowing && (
            <motion.span
              key="glow"
              className="pointer-events-none absolute -inset-[15%] rounded-[32%] ring-4 ring-focus"
              initial={{ opacity: 0 }}
              animate={
                calm ? { opacity: 0.7 } : { opacity: [0.35, 0.85, 0.35], scale: [1, 1.05, 1] }
              }
              exit={{ opacity: 0 }}
              transition={
                calm ? { duration: 0 } : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
              }
            />
          )}
        </AnimatePresence>

        {placed ? (
          <motion.div
            initial={{ opacity: 0, scale: calm ? 1 : 0.55 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={calm ? { duration: 0 } : settleSpring}
          >
            <PartArt kind={slot.kind} />
          </motion.div>
        ) : (
          <PartArt kind={slot.kind} ghost />
        )}
      </motion.div>
    </div>
  )
}

/* ------------------------------ Tray cell -------------------------------- */

interface TrayCellProps {
  piece: TrayPiece
  placed: boolean
  selected: boolean
  floatDelay: number
  onPickUp: () => void
  onLetGo: (point: Point | null) => void
  onTap: () => void
}

function TrayCell({
  piece,
  placed,
  selected,
  floatDelay,
  onPickUp,
  onLetGo,
  onTap,
}: TrayCellProps) {
  const calm = useCalmMotion()
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <AnimatePresence mode="wait">
        {placed ? (
          <motion.div
            key="socket"
            className="absolute inset-[16%] rounded-full bg-surface-2 shadow-inset"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={calmTween}
          />
        ) : (
          <motion.div
            key="piece"
            className="absolute inset-0 flex items-center justify-center p-[8%]"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: calm ? 1 : 0.55 }}
            transition={calm ? { duration: 0 } : calmTween}
          >
            <DraggablePiece
              pieceKey={piece.id}
              selected={selected}
              floatDelay={floatDelay}
              onPickUp={onPickUp}
              onLetGo={onLetGo}
              onTap={onTap}
            >
              <PartArt kind={piece.kind} />
            </DraggablePiece>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ----------------------------- Assembly board ---------------------------- */

export interface AssemblyBoardProps {
  game: AssemblyGame
  onHome: () => void
  onComplete?: () => void
}

/**
 * Build a vehicle by dragging or tapping each part onto its glowing place on
 * the frame. Wrong parts bounce gently back; correct ones settle in.
 */
export function AssemblyBoard({ game, onHome, onComplete }: AssemblyBoardProps) {
  const { round, isComplete } = game
  const [activePiece, setActivePiece] = useState<string | null>(null)
  const [shake, setShake] = useState<{ slotId: string; seq: number } | null>(null)
  const slotRefs = useRef(new Map<string, HTMLElement>())
  const completedRef = useRef(false)

  useEffect(() => {
    setActivePiece(null)
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

  const activeKind =
    activePiece != null ? (round.tray.find((p) => p.id === activePiece)?.kind ?? null) : null

  const slotAtPoint = useCallback((point: Point): string | null => {
    for (const [id, el] of slotRefs.current) {
      const r = el.getBoundingClientRect()
      const left = r.left + window.scrollX
      const top = r.top + window.scrollY
      if (
        point.x >= left &&
        point.x <= left + r.width &&
        point.y >= top &&
        point.y <= top + r.height
      ) {
        return id
      }
    }
    return null
  }, [])

  const tryPlace = useCallback(
    (pieceId: string, slotId: string): boolean => {
      if (game.attempt(pieceId, slotId) === 'correct') {
        hapticTap()
        return true
      }
      setShake((prev) => ({ slotId, seq: (prev?.seq ?? 0) + 1 }))
      return false
    },
    [game],
  )

  const handleLetGo = useCallback(
    (pieceId: string, point: Point | null) => {
      setActivePiece(null)
      if (!point) return
      const slotId = slotAtPoint(point)
      if (slotId) tryPlace(pieceId, slotId)
    },
    [slotAtPoint, tryPlace],
  )

  const handleTapPiece = useCallback((id: string) => {
    setActivePiece((prev) => (prev === id ? null : id))
  }, [])

  const handleTapSlot = useCallback(
    (slotId: string) => {
      if (activePiece == null) return
      if (tryPlace(activePiece, slotId)) setActivePiece(null)
    },
    [activePiece, tryPlace],
  )

  const registerSlot = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) slotRefs.current.set(id, el)
      else slotRefs.current.delete(id)
    },
    [],
  )

  const trayCount = round.tray.length
  const cellBasis = `calc((100% - ${(trayCount - 1) * 0.5}rem) / ${trayCount})`

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-[5vh] px-4">
        {/* Build frame */}
        <div className="relative w-full max-w-[23rem]" style={{ aspectRatio: '3 / 2' }}>
          <div className="absolute inset-x-[6%] bottom-[7%] h-[4%] rounded-full bg-ink/10" />
          {round.slots.map((slot) => (
            <SlotView
              key={`${round.id}:${slot.id}`}
              slot={slot}
              placed={game.placedSlots.has(slot.id)}
              glowing={activeKind === slot.kind && !game.placedSlots.has(slot.id)}
              shakeSeq={shake?.slotId === slot.id ? shake.seq : 0}
              registerRef={registerSlot(slot.id)}
              onTap={() => handleTapSlot(slot.id)}
            />
          ))}
        </div>

        {/* Parts tray */}
        <div className="flex w-full items-center justify-center gap-2">
          {round.tray.map((piece, index) => (
            <div
              key={`${round.id}:${piece.id}`}
              className="aspect-square shrink-0"
              style={{ flexBasis: cellBasis }}
            >
              <TrayCell
                piece={piece}
                placed={game.placedPieces.has(piece.id)}
                selected={activePiece === piece.id}
                floatDelay={index * 0.35}
                onPickUp={() => setActivePiece(piece.id)}
                onLetGo={(point) => handleLetGo(piece.id, point)}
                onTap={() => handleTapPiece(piece.id)}
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
