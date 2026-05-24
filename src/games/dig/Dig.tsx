import { useAppStore } from '@/store/appStore'
import { GameScreen } from '@/components/layout/GameScreen'
import { DigBoard } from './DigBoard'
import { useDigGame } from './logic'

/**
 * Game 7 - Bagger.
 * A gentle side-scrolling platform game: a friendly excavator runs and hops
 * through a sunny construction site, digging up gems and rolling home to its
 * depot. Press and hold to move, tap to jump. A missed jump just lifts the
 * excavator gently back onto safe ground - no score, no "game over".
 */
export function Dig() {
  const go = useAppStore((s) => s.go)
  const recordRound = useAppStore((s) => s.recordRound)
  const game = useDigGame()

  return (
    <GameScreen tone="dig">
      <DigBoard game={game} onHome={() => go('home')} onComplete={() => recordRound('dig')} />
    </GameScreen>
  )
}
