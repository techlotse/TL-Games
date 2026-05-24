import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCalmMotion, calmTween } from '@/lib/motion'
import { hapticSuccess, hapticTap } from '@/lib/platform'
import { CompletionOverlay } from '@/components/toddler/CompletionOverlay'
import { DraggablePiece } from '@/games/shared/DraggablePiece'
import type { Point } from '@/games/shared/types'
import { PartArt, VehicleScene } from './art'
import type { Slot } from './data'
import type { AssemblyGame, TrayPiece } from './logic'

/* ------------------------------ Slot glow -------------------------------- */

function SlotGlow({ slot }: { slot: Slot }) {
  const calm = useCalmMotion()
  return (
    <motion.span
      className="pointer-events-none absolute rounded-full ring-4 ring-focus"
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        width: `${slot.size}%`,
        aspectRatio: '1',
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0 }}
      animate={calm ? { opacity: 0.75 } : { opacity: [0.4, 0.9, 0.4], scale: [1, 1.08, 1] }}
      transition={calm ? { duration: 0 } : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
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
 * Build a vehicle by dragging or tapping each part onto the car. Placing is
 * forgiving: drop a part anywhere on the vehicle and it snaps to the nearest
 * spot that fits. The vehicle is one coherent drawing, so parts always align.
 */
export function AssemblyBoard({ game, onHome, onComplete }: AssemblyBoardProps) {
  const { round, isComplete } = game
  const [activePiece, setActivePiece] = useState<string | null>(null)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const completedRef = useRef(false)

  useEffect(() => {
    setActivePiece(null)
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

  const placeNearest = useCallback(
    (pieceId: string, kind: string, point: Point | null): boolean => {
      const candidates = round.slots.filter(
        (s) => s.kind === kind && !game.placedSlots.has(s.id),
      )
      if (candidates.length === 0) return false
      let chosen = candidates[0]
      const frame = frameRef.current
      if (frame && point) {
        const r = frame.getBoundingClientRect()
        let bestD = Infinity
        for (const s of candidates) {
          const sx = r.left + (s.x / 100) * r.width
          const sy = r.top + (s.y / 100) * r.height
          const d = (point.x - sx) ** 2 + (point.y - sy) ** 2
          if (d < bestD) {
            bestD = d
            chosen = s
          }
        }
      }
      if (game.attempt(pieceId, chosen.id) === 'correct') {
        hapticTap()
        return true
      }
      return false
    },
    [round, game],
  )

  const handleLetGo = useCallback(
    (pieceId: string, kind: string, point: Point | null) => {
      setActivePiece(null)
      const frame = frameRef.current
      if (!point || !frame) return
      const r = frame.getBoundingClientRect()
      const inside =
        point.x >= r.left - 28 &&
        point.x <= r.right + 28 &&
        point.y >= r.top - 28 &&
        point.y <= r.bottom + 28
      if (inside) placeNearest(pieceId, kind, point)
    },
    [placeNearest],
  )

  const handleTapPiece = useCallback((id: string) => {
    setActivePiece((prev) => (prev === id ? null : id))
  }, [])

  const handleTapFrame = useCallback(() => {
    if (activeKind == null || activePiece == null) return
    if (placeNearest(activePiece, activeKind, null)) setActivePiece(null)
  }, [activeKind, activePiece, placeNearest])

  const trayCount = round.tray.length
  const cellBasis = `calc((100% - ${(trayCount - 1) * 0.5}rem) / ${trayCount})`

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-[5vh] px-4">
        {/* Build frame - the vehicle being assembled */}
        <div
          ref={frameRef}
          onClick={handleTapFrame}
          className="relative w-full max-w-[23rem]"
          style={{ aspectRatio: '300 / 220' }}
        >
          <VehicleScene placed={game.placedSlots} />
          {round.slots.map((slot) =>
            round.id < 2 && activeKind === slot.kind && !game.placedSlots.has(slot.id) ? (
              <SlotGlow key={slot.id} slot={slot} />
            ) : null,
          )}
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
                onLetGo={(point) => handleLetGo(piece.id, piece.kind, point)}
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
