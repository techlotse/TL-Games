import { useAppStore } from '@/store/appStore'
import { GameScreen } from '@/components/layout/GameScreen'
import { AssemblyBoard } from './AssemblyBoard'
import { useBuildGarage } from './logic'

/**
 * Game 1 - Build Garage.
 * Assemble a vehicle: drag (or tap) each part onto its glowing place. The
 * vehicle gains a part every round (3 -> 5 parts). Wrong parts drift gently
 * back - no failure, no score.
 */
export function BuildGarage() {
  const go = useAppStore((s) => s.go)
  const recordRound = useAppStore((s) => s.recordRound)
  const game = useBuildGarage()

  return (
    <GameScreen tone="garage">
      <AssemblyBoard
        game={game}
        onHome={() => go('home')}
        onComplete={() => recordRound('garage')}
      />
    </GameScreen>
  )
}
