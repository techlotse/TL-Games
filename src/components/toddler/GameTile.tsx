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
  race: 'bg-tile-race',
  colouring: 'bg-tile-colouring',
  find: 'bg-tile-find',
}

/**
 * A home-screen game tile - a vertical card with large artwork on top and a
 * short word below. The whole card is one big tap target; the word is only a
 * hint for the accompanying parent.
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
        'flex h-full w-full flex-col items-center gap-2 rounded-[2rem] p-3 text-center shadow-soft outline-none',
        TONE_BG[tone],
        className,
      )}
    >
      <div className="flex w-full flex-1 items-center justify-center rounded-[1.5rem] bg-surface/55 p-2.5">
        <div className="h-full w-full">
          <Art />
        </div>
      </div>
      <span className="text-tile font-extrabold text-ink">{label}</span>
      <ProgressDots value={progress} className="pb-0.5" />
    </motion.button>
  )
}
