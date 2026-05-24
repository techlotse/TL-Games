import { useAppStore } from '@/store/appStore'
import { GameScreen } from '@/components/layout/GameScreen'
import { FindBoard } from './FindBoard'
import { useFindItem } from './logic'

/**
 * Game 6 - Find-an-item ("Suchen").
 * One item is shown in a frame; the child finds and taps the same item among
 * the others scattered across the scene. A new item is then asked for, until
 * all are found. More items appear the longer the child plays. No score.
 */
export function FindItem() {
  const go = useAppStore((s) => s.go)
  const recordRound = useAppStore((s) => s.recordRound)
  const game = useFindItem()

  return (
    <GameScreen tone="find">
      <FindBoard
        game={game}
        onHome={() => go('home')}
        onComplete={() => recordRound('find')}
      />
    </GameScreen>
  )
}
