import { motion } from 'framer-motion'
import { House, RotateCcw } from 'lucide-react'
import { RoundButton } from './RoundButton'
import { useCalmMotion, calmTween, settleSpring } from '@/lib/motion'
import { t } from '@/i18n'

/** A calm "well done" pictogram - readable-free, friendly, never loud. */
function HappySun() {
  const rays = [
    [104, 60, 117, 60],
    [91.1, 28.9, 100.3, 19.7],
    [60, 16, 60, 3],
    [28.9, 28.9, 19.7, 19.7],
    [16, 60, 3, 60],
    [28.9, 91.1, 19.7, 100.3],
    [60, 104, 60, 117],
    [91.1, 91.1, 100.3, 100.3],
  ]
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <g stroke="#E6A93C" strokeWidth="7" strokeLinecap="round">
        {rays.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <circle cx="60" cy="60" r="31" fill="#F4C84E" />
      <circle cx="50.5" cy="56" r="4.3" fill="#6B4F1E" />
      <circle cx="69.5" cy="56" r="4.3" fill="#6B4F1E" />
      <path
        d="M49 67 Q60 78 71 67"
        stroke="#6B4F1E"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

/**
 * Shown when a round is finished. There is no win/lose - just a gentle
 * acknowledgement and two big choices: play again, or go home.
 */
export function CompletionOverlay({
  onAgain,
  onHome,
}: {
  onAgain: () => void
  onHome: () => void
}) {
  const calm = useCalmMotion()
  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-10 bg-background/82 px-6 backdrop-blur-[2px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={calmTween}
    >
      <motion.div
        className="relative h-36 w-36"
        initial={{ opacity: 0, scale: calm ? 1 : 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={calm ? { duration: 0 } : { ...settleSpring, delay: 0.05 }}
      >
        <span className="absolute -inset-6 rounded-full bg-accent/25 blur-2xl" aria-hidden />
        <motion.div
          className="relative h-full w-full"
          animate={calm ? undefined : { scale: [1, 1.04, 1] }}
          transition={
            calm ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <HappySun />
        </motion.div>
      </motion.div>

      <div className="flex items-end gap-7">
        <RoundButton label={t.home} caption={t.home} onPress={onHome} tone="surface" size="lg">
          <House size={32} strokeWidth={2.4} aria-hidden />
        </RoundButton>
        <RoundButton label={t.again} caption={t.again} onPress={onAgain} tone="accent" size="xl">
          <RotateCcw size={42} strokeWidth={2.6} aria-hidden />
        </RoundButton>
      </div>
    </motion.div>
  )
}
