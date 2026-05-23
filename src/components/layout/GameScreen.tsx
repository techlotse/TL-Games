import type { ReactNode } from 'react'
import { House } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { RoundButton } from '@/components/toddler/RoundButton'
import { cn } from '@/lib/utils'
import { t } from '@/i18n'
import type { GameTone } from '@/app/routes'

const TONE_WASH: Record<GameTone, string> = {
  garage: 'bg-tile-garage/35',
  garden: 'bg-tile-garden/35',
  shapes: 'bg-tile-shapes/35',
}

/**
 * Standard frame for every game screen: a gently tinted background and one
 * single, obvious way out - the large house button.
 */
export function GameScreen({ tone, children }: { tone: GameTone; children: ReactNode }) {
  const go = useAppStore((s) => s.go)
  return (
    <div className={cn('flex h-full flex-col', TONE_WASH[tone])}>
      <header className="safe-t safe-x flex items-center px-4 pt-3">
        <RoundButton label={t.home} onPress={() => go('home')} tone="surface" size="md">
          <House size={30} strokeWidth={2.4} aria-hidden />
        </RoundButton>
      </header>
      <div className="safe-x flex flex-1 flex-col pb-[max(1rem,env(safe-area-inset-bottom))]">
        {children}
      </div>
    </div>
  )
}
