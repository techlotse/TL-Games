import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion'
import { useCalmMotion, calmTween } from '@/lib/motion'
import { hapticSuccess, hapticTap } from '@/lib/platform'
import { CompletionOverlay } from '@/components/toddler/CompletionOverlay'
import { DraggablePiece } from '@/games/shared/DraggablePiece'
import type { Point } from '@/games/shared/types'
import { PartArt, VehicleScene } from './art'
import { VEHICLE_VIEW, type Box, type Part } from './data'
import type { AssemblyGame } from './logic'

/* ------------------------------ Slot glow -------------------------------- */

function SlotGlow({ box }: { box: Box }) {
  const calm = useCalmMotion()
  return (
    <motion.span
      className="pointer-events-none absolute rounded-2xl ring-4 ring-focus"
      style={{
        left: `${((box.x + box.w / 2) / VEHICLE_VIEW.w) * 100}%`,
        top: `${((box.y + box.h / 2) / VEHICLE_VIEW.h) * 100}%`,
        width: `${(box.w / VEHICLE_VIEW.w) * 100}%`,
        height: `${(box.h / VEHICLE_VIEW.h) * 100}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0 }}
      animate={calm ? { opacity: 0.75 } : { opacity: [0.4, 0.9, 0.4], scale: [1, 1.05, 1] }}
      transition={calm ? { duration: 0 } : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/* ------------------------------ Tray cell -------------------------------- */

interface TrayCellProps {
  piece: Part
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
            className="absolute inset-[18%] rounded-full bg-surface-2 shadow-inset"
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
              <PartArt part={piece} />
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
 * Build a vehicle by dragging or tapping each part onto it. Placing is
 * forgiving: drop a part anywhere on the vehicle and it snaps to the nearest
 * spot of the right kind. The glow, the tray piece and the placed part all
 * come from one shared part definition, so they always line up.
 */
export function AssemblyBoard({ game, onHome, onComplete }: AssemblyBoardProps) {
  const { round, isComplete } = game
  const calm = useCalmMotion()
  const [activePiece, setActivePiece] = useState<string | null>(null)
  const [showOverlay, setShowOverlay] = useState(false)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const completedRef = useRef(false)
  const driveControls = useAnimationControls()

  useEffect(() => {
    setActivePiece(null)
    setShowOverlay(false)
    completedRef.current = false
    driveControls.set({ x: '0%' })
  }, [round.id, driveControls])

  // Finished vehicle: drive it off the screen, then the well-done screen.
  useEffect(() => {
    if (!isComplete || completedRef.current) return
    completedRef.current = true
    hapticSuccess()
    onComplete?.()
    if (!calm) {
      void driveControls.start({
        x: ['0%', '-8%', '142%'],
        transition: { duration: 0.95, ease: 'easeIn', times: [0, 0.22, 1] },
      })
    }
    const timer = setTimeout(() => setShowOverlay(true), calm ? 250 : 900)
    return () => clearTimeout(timer)
  }, [isComplete, onComplete, calm, driveControls])

  const activeKind =
    activePiece != null ? (round.tray.find((p) => p.id === activePiece)?.kind ?? null) : null

  const placeNearest = useCallback(
    (pieceId: string, kind: string, point: Point | null): boolean => {
      const candidates = round.vehicle.parts.filter(
        (s) => s.kind === kind && !game.placedSlots.has(s.id),
      )
      if (candidates.length === 0) return false
      let chosen = candidates[0]
      const frame = frameRef.current
      if (frame && point) {
        const r = frame.getBoundingClientRect()
        let bestD = Infinity
        for (const s of candidates) {
          const sx = r.left + ((s.box.x + s.box.w / 2) / VEHICLE_VIEW.w) * r.width
          const sy = r.top + ((s.box.y + s.box.h / 2) / VEHICLE_VIEW.h) * r.height
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
        point.x >= r.left - 36 &&
        point.x <= r.right + 36 &&
        point.y >= r.top - 36 &&
        point.y <= r.bottom + 36
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

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex flex-1 flex-col items-center justify-center gap-[3vh] px-3">
        {/* Build frame - the vehicle being assembled */}
        <div
          ref={frameRef}
          onClick={handleTapFrame}
          className="relative w-full max-w-[23rem]"
          style={{ aspectRatio: `${VEHICLE_VIEW.w} / ${VEHICLE_VIEW.h}` }}
        >
          <motion.div animate={driveControls} className="h-full w-full">
            <VehicleScene vehicle={round.vehicle} placed={game.placedSlots} />
          </motion.div>
          {round.id < 2 &&
            round.vehicle.parts.map((slot) =>
              activeKind === slot.kind && !game.placedSlots.has(slot.id) ? (
                <SlotGlow key={slot.id} box={slot.box} />
              ) : null,
            )}
        </div>

        {/* Parts tray */}
        <div className="flex w-full flex-wrap items-center justify-center gap-2.5">
          {round.tray.map((piece, index) => (
            <div key={`${round.id}:${piece.id}`} className="aspect-square w-[21.5%]">
              <TrayCell
                piece={piece}
                placed={game.placedPieces.has(piece.id)}
                selected={activePiece === piece.id}
                floatDelay={index * 0.3}
                onPickUp={() => setActivePiece(piece.id)}
                onLetGo={(point) => handleLetGo(piece.id, piece.kind, point)}
                onTap={() => handleTapPiece(piece.id)}
              />
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showOverlay && (
          <CompletionOverlay key="complete" onAgain={game.reset} onHome={onHome} />
        )}
      </AnimatePresence>
    </div>
  )
}
