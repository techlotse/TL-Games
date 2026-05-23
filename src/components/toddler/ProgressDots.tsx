import { MAX_PROGRESS } from '@/store/appStore'
import { cn } from '@/lib/utils'

/**
 * A quiet, non-competitive progress indicator: a few dots that fill in as
 * the child completes rounds. No numbers, no streaks, no pressure.
 */
export function ProgressDots({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-1.5', className)} aria-hidden>
      {Array.from({ length: MAX_PROGRESS }).map((_, index) => (
        <span
          key={index}
          className={cn(
            'h-2.5 w-2.5 rounded-full transition-colors duration-200',
            index < value ? 'bg-accent' : 'bg-ink-soft/25',
          )}
        />
      ))}
    </div>
  )
}
