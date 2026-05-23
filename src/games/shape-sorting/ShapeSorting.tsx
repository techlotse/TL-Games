import { useAppStore } from '@/store/appStore'
import { GameScreen } from '@/components/layout/GameScreen'
import { MatchingBoard } from '@/games/shared/MatchingBoard'
import { useShapeSorting } from './logic'
import { HoleArt, ShapeBlockArt } from './art'

/**
 * Game 3 - Shape Sorting.
 * Match each wooden block to the cut-out hole of the same shape. Drag or
 * tap. A calm, tactile classic - fully playable in this MVP.
 */
export function ShapeSorting() {
  const go = useAppStore((s) => s.go)
  const recordRound = useAppStore((s) => s.recordRound)
  const game = useShapeSorting()

  return (
    <GameScreen tone="shapes">
      <MatchingBoard
        game={game}
        onHome={() => go('home')}
        onComplete={() => recordRound('shapes')}
        renderItem={(key) => <ShapeBlockArt id={key} />}
        renderTarget={(key) => <HoleArt id={key} />}
      />
    </GameScreen>
  )
}
