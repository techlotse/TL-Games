import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Settings2 } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { GAMES } from '@/app/routes'
import { GameTile } from '@/components/toddler/GameTile'
import { ParentGate } from '@/components/toddler/ParentGate'
import { t } from '@/i18n'

/**
 * Home screen. Three big game tiles fill the screen; a small, discreet
 * button in the corner leads (via a hold-gate) to the parent area.
 */
export function HomeScreen() {
  const go = useAppStore((s) => s.go)
  const progress = useAppStore((s) => s.progress)
  const [gateOpen, setGateOpen] = useState(false)

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="safe-t safe-x flex items-center justify-between gap-3 px-5 pt-4">
        <div className="flex flex-col">
          <span className="text-xl font-extrabold leading-tight text-ink">{t.appName}</span>
          <span className="text-xs font-semibold text-ink-soft">{t.tagline}</span>
        </div>
        <button
          type="button"
          aria-label={t.parents}
          onClick={() => setGateOpen(true)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-ink-soft shadow-soft outline-none"
        >
          <Settings2 size={22} strokeWidth={2.2} aria-hidden />
        </button>
      </header>

      <div className="safe-x flex flex-1 flex-col gap-4 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
        {GAMES.map((game) => (
          <GameTile
            key={game.id}
            label={game.label}
            tone={game.tone}
            Art={game.Tile}
            progress={progress[game.id]}
            onPress={() => go(game.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {gateOpen && (
          <ParentGate
            key="parent-gate"
            onUnlock={() => {
              setGateOpen(false)
              go('parents')
            }}
            onClose={() => setGateOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
