import type { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useCalmMotion } from '@/lib/motion'
import { hapticTap } from '@/lib/platform'
import type { GameTone } from '@/app/routes'
import { ProgressDots } from './ProgressDots'

export interface GameTileProps {
  label: string
  tone: GameTone
  /** Large illustration for the tile - the main, readable-free cue. */
  Art: ComponentType
  progress: number
  onPress: () => void
  className?: string
}

const TONE_BG: Record<GameTone, string> = {
  garage: 'bg-gradient-to-br from-tile-garage to-tile-garage/70',
  garden: 'bg-gradient-to-br from-tile-garden to-tile-garden/70',
  shapes: 'bg-gradient-to-br from-tile-shapes to-tile-shapes/70',
  race: 'bg-gradient-to-br from-tile-race to-tile-race/70',
  colouring: 'bg-gradient-to-br from-tile-colouring to-tile-colouring/70',
  find: 'bg-gradient-to-br from-tile-find to-tile-find/70',
  dig: 'bg-gradient-to-br from-tile-dig to-tile-dig/70',
}

/**
 * A home-screen game tile - a vertical card with large square artwork on top
 * and a short word below. The whole card is one big tap target; the word is
 * only a hint for the accompanying parent.
 */
export function GameTile({ label, tone, Art, progress, onPress, className }: GameTileProps) {
  const calm = useCalmMotion()
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={() => {
        hapticTap()
        onPress()
      }}
      whileTap={calm ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'flex w-full flex-col items-center gap-2 rounded-[2rem] p-3 text-center shadow-lift outline-none ring-1 ring-ink/5',
        TONE_BG[tone],
        className,
      )}
    >
      <div className="flex aspect-square w-full items-center justify-center rounded-[1.5rem] bg-surface/55 p-2.5">
        <Art />
      </div>
      <span className="text-tile font-extrabold text-ink">{label}</span>
      <ProgressDots value={progress} className="pb-0.5" />
    </motion.button>
  )
}
