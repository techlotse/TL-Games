import { useRef, type KeyboardEvent, type ReactNode } from 'react'
import { motion, type PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useCalmMotion, returnSpring } from '@/lib/motion'
import { hapticTap } from '@/lib/platform'
import type { Point } from './types'

export interface DraggablePieceProps {
  pieceKey: string
  /** True while tap-selected (a calm lift + ring). */
  selected: boolean
  /** Stagger offset for the idle float, in seconds. */
  floatDelay?: number
  onPickUp: () => void
  /** Drag finished - reports the release point, or null if cancelled. */
  onLetGo: (point: Point | null) => void
  /** A tap (no drag) - used for tap-to-place. */
  onTap: () => void
  children: ReactNode
}

/**
 * A forgiving toddler-friendly piece. It supports BOTH interaction styles:
 *  - drag-and-drop (wrong / missed drops spring gently back home), and
 *  - tap-to-place (tap to pick up, tap a target to drop).
 * It never reports failure - the board decides what a release means.
 */
export function DraggablePiece({
  pieceKey,
  selected,
  floatDelay = 0,
  onPickUp,
  onLetGo,
  onTap,
  children,
}: DraggablePieceProps) {
  const calm = useCalmMotion()
  const draggingRef = useRef(false)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onTap()
    }
  }

  return (
    <motion.div
      data-piece={pieceKey}
      role="button"
      aria-label="Spielstein"
      aria-pressed={selected}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex h-full w-full touch-none select-none items-center justify-center',
        'rounded-[1.5rem] outline-none',
      )}
      drag
      dragSnapToOrigin
      dragElastic={0.14}
      dragMomentum={false}
      whileDrag={{ scale: 1.12, zIndex: 50 }}
      onDragStart={() => {
        draggingRef.current = true
        onPickUp()
        hapticTap()
      }}
      onDragEnd={(_event, info: PanInfo) => {
        draggingRef.current = false
        onLetGo({ x: info.point.x, y: info.point.y })
      }}
      onTap={() => {
        if (draggingRef.current) return
        onTap()
        hapticTap()
      }}
      animate={{ scale: selected ? 1.07 : 1 }}
      transition={calm ? { duration: 0 } : returnSpring}
    >
      {/* Calm selection ring */}
      {selected && (
        <span className="pointer-events-none absolute -inset-1.5 rounded-[1.8rem] ring-4 ring-focus/70" />
      )}

      {/* A gentle idle float keeps pieces feeling alive - never busy. */}
      <motion.div
        className="flex h-full w-full items-center justify-center"
        animate={calm ? undefined : { y: [0, -5, 0] }}
        transition={
          calm
            ? undefined
            : { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: floatDelay }
        }
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
