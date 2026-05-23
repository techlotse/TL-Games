import { useAppStore } from '@/store/appStore'
import { GameScreen } from '@/components/layout/GameScreen'
import { MatchingBoard } from '@/games/shared/MatchingBoard'
import { useFlowerGarden } from './logic'
import { BedArt, FlowerArt } from './art'

/**
 * Game 2 - Flower Garden.
 * Match each flower to the plant pot of the same colour. Drag or tap.
 * Calm, forgiving colour-matching - no score, no failure.
 */
export function FlowerGarden() {
  const go = useAppStore((s) => s.go)
  const recordRound = useAppStore((s) => s.recordRound)
  const game = useFlowerGarden()

  return (
    <GameScreen tone="garden">
      <MatchingBoard
        game={game}
        onHome={() => go('home')}
        onComplete={() => recordRound('garden')}
        renderItem={(key) => <FlowerArt id={key} />}
        renderTarget={(key) => <BedArt id={key} />}
      />
    </GameScreen>
  )
}
