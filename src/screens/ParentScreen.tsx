import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Moon, RotateCcw, Sun } from 'lucide-react'
import { useAppStore, type ThemeName } from '@/store/appStore'
import { GAMES } from '@/app/routes'
import { Button } from '@/components/ui/button'
import { ProgressDots } from '@/components/toddler/ProgressDots'
import { calmTween } from '@/lib/motion'
import { cn } from '@/lib/utils'
import { t } from '@/i18n'

const APP_VERSION = __APP_VERSION__

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-7 first:mt-2">
      <h2 className="mb-2.5 px-1 text-xs font-extrabold uppercase tracking-[0.08em] text-ink-soft">
        {title}
      </h2>
      <div className="flex flex-col gap-2.5">{children}</div>
    </section>
  )
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl bg-surface p-4 text-left shadow-soft outline-none"
    >
      <span className="flex flex-col gap-0.5">
        <span className="font-bold text-ink">{label}</span>
        {hint ? <span className="text-sm text-ink-soft">{hint}</span> : null}
      </span>
      <span
        className={cn(
          'relative h-8 w-14 shrink-0 rounded-full p-1 transition-colors duration-200',
          checked ? 'bg-primary' : 'bg-surface-2',
        )}
      >
        <motion.span
          className="block h-6 w-6 rounded-full bg-white shadow-soft"
          animate={{ x: checked ? 24 : 0 }}
          transition={calmTween}
        />
      </span>
    </button>
  )
}

function ThemeChoice({ theme, onPick }: { theme: ThemeName; onPick: (theme: ThemeName) => void }) {
  const options: { value: ThemeName; label: string; icon: ReactNode }[] = [
    { value: 'light', label: t.themeLight, icon: <Sun size={20} aria-hidden /> },
    { value: 'dark', label: t.themeDark, icon: <Moon size={20} aria-hidden /> },
  ]
  return (
    <div className="flex gap-2 rounded-2xl bg-surface p-2 shadow-soft">
      {options.map((option) => {
        const active = theme === option.value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onPick(option.value)}
            className={cn(
              'flex h-12 flex-1 items-center justify-center gap-2 rounded-xl font-bold transition-colors duration-150',
              active ? 'bg-primary text-surface' : 'text-ink-soft',
            )}
          >
            {option.icon}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Parent area: appearance, accessibility, progress and an about section.
 * No accounts, no cloud sync - everything stays on this device.
 */
export function ParentScreen() {
  const go = useAppStore((s) => s.go)
  const theme = useAppStore((s) => s.theme)
  const setTheme = useAppStore((s) => s.setTheme)
  const highContrast = useAppStore((s) => s.highContrast)
  const setHighContrast = useAppStore((s) => s.setHighContrast)
  const reducedMotion = useAppStore((s) => s.reducedMotion)
  const setReducedMotion = useAppStore((s) => s.setReducedMotion)
  const progress = useAppStore((s) => s.progress)
  const resetProgress = useAppStore((s) => s.resetProgress)

  const [confirmingReset, setConfirmingReset] = useState(false)

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="safe-t safe-x flex items-center justify-between gap-3 px-5 pb-2 pt-4">
        <h1 className="text-2xl font-extrabold text-ink">{t.parentTitle}</h1>
        <Button variant="soft" onClick={() => go('home')}>
          {t.done}
        </Button>
      </header>

      <div className="safe-x flex-1 overflow-y-auto px-5 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <Section title={t.appearance}>
          <ThemeChoice theme={theme} onPick={setTheme} />
          <ToggleRow
            label={t.highContrast}
            hint={t.highContrastHint}
            checked={highContrast}
            onChange={setHighContrast}
          />
          <ToggleRow
            label={t.reducedMotion}
            hint={t.reducedMotionHint}
            checked={reducedMotion}
            onChange={setReducedMotion}
          />
        </Section>

        <Section title={t.progressTitle}>
          <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-soft">
            {GAMES.map((game) => (
              <div key={game.id} className="flex items-center justify-between">
                <span className="font-bold text-ink">{game.label}</span>
                <ProgressDots value={progress[game.id]} />
              </div>
            ))}
          </div>
          {confirmingReset ? (
            <div className="flex flex-col gap-2.5 rounded-2xl bg-surface p-4 shadow-soft">
              <span className="font-bold text-ink">{t.resetConfirmTitle}</span>
              <div className="flex gap-2.5">
                <Button
                  variant="solid"
                  size="block"
                  onClick={() => {
                    resetProgress()
                    setConfirmingReset(false)
                  }}
                >
                  {t.resetConfirmYes}
                </Button>
                <Button variant="soft" size="block" onClick={() => setConfirmingReset(false)}>
                  {t.resetConfirmNo}
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="outline" size="block" onClick={() => setConfirmingReset(true)}>
              <RotateCcw size={20} aria-hidden />
              {t.resetProgress}
            </Button>
          )}
        </Section>

        <Section title={t.aboutTitle}>
          <div className="flex flex-col gap-3 rounded-2xl bg-surface p-5 shadow-soft">
            <p className="text-[15px] leading-relaxed text-ink-soft">{t.aboutBody}</p>
            <p className="text-sm font-bold text-ink-soft">
              {t.aboutVersion} {APP_VERSION}
            </p>
          </div>
        </Section>
      </div>
    </div>
  )
}
