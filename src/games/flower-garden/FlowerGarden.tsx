import { useAppStore } from '@/store/appStore'
import { GameScreen } from '@/components/layout/GameScreen'
import { GardenBoard } from './GardenBoard'
import { useFlowerGarden } from './logic'

/**
 * Game 2 - Flower Garden.
 * A gentle discovery game: tap the bushes, leaves and flowers to find the
 * little creatures hiding in the garden. Empty spots simply rustle - nothing
 * is ever wrong. More spots and decoys appear as the child keeps playing.
 */
export function FlowerGarden() {
  const go = useAppStore((s) => s.go)
  const recordRound = useAppStore((s) => s.recordRound)
  const game = useFlowerGarden()

  return (
    <GameScreen tone="garden">
      <GardenBoard
        game={game}
        onHome={() => go('home')}
        onComplete={() => recordRound('garden')}
      />
    </GameScreen>
  )
}
