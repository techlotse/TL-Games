import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useCalmMotion } from '@/lib/motion'
import { hapticTap } from '@/lib/platform'

type Tone = 'surface' | 'primary' | 'accent'
type Size = 'md' | 'lg' | 'xl'

export interface RoundButtonProps {
  /** Accessible name (also the optional visible caption). */
  label: string
  /** Show a tiny caption under the button (for the accompanying parent). */
  caption?: string
  onPress: () => void
  children: ReactNode
  tone?: Tone
  size?: Size
  className?: string
}

const SIZE: Record<Size, string> = {
  md: 'h-16 w-16', // 64px - the minimum toddler touch target
  lg: 'h-[4.75rem] w-[4.75rem]', // 76px
  xl: 'h-[5.75rem] w-[5.75rem]', // 92px
}

const TONE: Record<Tone, string> = {
  surface: 'bg-surface text-ink',
  primary: 'bg-primary text-surface',
  accent: 'bg-accent text-surface',
}

/**
 * A large, obvious, round, icon-first button - the only button style a
 * toddler ever needs to use. Always at least 64px.
 */
export function RoundButton({
  label,
  caption,
  onPress,
  children,
  tone = 'surface',
  size = 'lg',
  className,
}: RoundButtonProps) {
  const calm = useCalmMotion()
  return (
    <div className={cn('flex flex-col items-center gap-1.5', className)}>
      <motion.button
        type="button"
        aria-label={label}
        onClick={() => {
          hapticTap()
          onPress()
        }}
        whileTap={calm ? undefined : { scale: 0.9 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'flex items-center justify-center rounded-full shadow-soft outline-none',
          SIZE[size],
          TONE[tone],
        )}
      >
        {children}
      </motion.button>
      {caption ? (
        <span className="text-xs font-bold tracking-wide text-ink-soft">{caption}</span>
      ) : null}
    </div>
  )
}
