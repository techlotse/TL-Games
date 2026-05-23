import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { UserRound, X } from 'lucide-react'
import { t } from '@/i18n'
import { calmTween } from '@/lib/motion'
import { hapticSuccess, hapticTap } from '@/lib/platform'

/** How long the parent must hold to enter - long enough to deter a toddler. */
const HOLD_MS = 1500

/**
 * A gentle gate for the parent area. Holding the circle for a moment opens
 * it - effortless for an adult, unlikely to happen by accident.
 */
export function ParentGate({ onUnlock, onClose }: { onUnlock: () => void; onClose: () => void }) {
  const [holding, setHolding] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => clearTimer, [])

  const begin = () => {
    if (timerRef.current != null) return
    setHolding(true)
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null
      setHolding(false)
      hapticSuccess()
      onUnlock()
    }, HOLD_MS)
  }

  const end = () => {
    clearTimer()
    setHolding(false)
  }

  return (
    <motion.div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black/45 px-6 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={calmTween}
      onClick={onClose}
    >
      <motion.div
        className="relative flex w-full max-w-sm flex-col items-center gap-6 rounded-[2.5rem] bg-surface px-7 py-9 shadow-lift"
        initial={{ scale: 0.93, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={calmTween}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label={t.close}
          onClick={() => {
            hapticTap()
            onClose()
          }}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 text-ink-soft outline-none"
        >
          <X size={22} strokeWidth={2.6} aria-hidden />
        </button>

        <h2 className="text-xl font-extrabold text-ink">{t.parentGateTitle}</h2>

        <button
          type="button"
          aria-label={t.parentGateTitle}
          onPointerDown={begin}
          onPointerUp={end}
          onPointerLeave={end}
          onPointerCancel={end}
          onContextMenu={(event) => event.preventDefault()}
          className="relative flex h-36 w-36 touch-none items-center justify-center outline-none"
        >
          <svg viewBox="0 0 128 128" className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="hsl(var(--surface-2))"
              strokeWidth="9"
            />
            <motion.circle
              cx="64"
              cy="64"
              r="56"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="9"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: holding ? 1 : 0 }}
              transition={{ duration: holding ? HOLD_MS / 1000 : 0.25, ease: 'linear' }}
            />
          </svg>
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary-soft text-primary">
            <UserRound size={48} strokeWidth={2.4} aria-hidden />
          </span>
        </button>

        <p className="text-center text-sm font-semibold text-ink-soft">
          {holding ? t.parentGateHolding : t.parentGateHint}
        </p>
      </motion.div>
    </motion.div>
  )
}
