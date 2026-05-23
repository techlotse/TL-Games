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
  garage: 'bg-tile-garage',
  garden: 'bg-tile-garden',
  shapes: 'bg-tile-shapes',
}

/**
 * A home-screen game tile. The whole tile is one big tap target with large
 * artwork; the short word is only a hint for the accompanying parent.
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
        'flex w-full flex-1 items-center gap-5 rounded-[2.25rem] p-4 text-left shadow-soft outline-none',
        TONE_BG[tone],
        className,
      )}
    >
      <div className="flex aspect-square h-full max-h-[9.5rem] shrink-0 items-center justify-center rounded-[1.7rem] bg-surface/55 p-3">
        <Art />
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-2xl font-extrabold leading-tight text-ink">{label}</span>
        <ProgressDots value={progress} />
      </div>
    </motion.button>
  )
}
