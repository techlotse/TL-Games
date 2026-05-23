import { useAppStore } from '@/store/appStore'
import { GameScreen } from '@/components/layout/GameScreen'
import { MatchingBoard } from '@/games/shared/MatchingBoard'
import { useBuildGarage } from './logic'
import { VehicleArt } from './art'

/**
 * Game 1 - Build Garage.
 * Match each coloured vehicle to its grey outline. Drag it, or tap the
 * vehicle then tap its space. Wrong choices drift gently back.
 */
export function BuildGarage() {
  const go = useAppStore((s) => s.go)
  const recordRound = useAppStore((s) => s.recordRound)
  const game = useBuildGarage()

  return (
    <GameScreen tone="garage">
      <MatchingBoard
        game={game}
        onHome={() => go('home')}
        onComplete={() => recordRound('garage')}
        renderItem={(key) => <VehicleArt id={key} />}
        renderTarget={(key) => <VehicleArt id={key} mono />}
      />
    </GameScreen>
  )
}
