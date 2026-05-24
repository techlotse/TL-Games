import { useAppStore } from '@/store/appStore'
import { GameScreen } from '@/components/layout/GameScreen'
import { ColourBoard } from './ColourBoard'
import { useColouring } from './logic'

/**
 * Game 5 - Colouring ("Malen").
 * Pick a colour, then colour the picture. Early levels are tap-to-fill; from
 * level 2 a brush is unlocked too, for free finger-painting. The picture gains
 * regions as the child plays. No "wrong" colour, no score.
 */
export function Colouring() {
  const go = useAppStore((s) => s.go)
  const recordRound = useAppStore((s) => s.recordRound)
  const game = useColouring()

  return (
    <GameScreen tone="colouring">
      <ColourBoard
        game={game}
        onHome={() => go('home')}
        onComplete={() => recordRound('colouring')}
      />
    </GameScreen>
  )
}
