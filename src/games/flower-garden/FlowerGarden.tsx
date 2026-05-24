import { useAppStore } from '@/store/appStore'
import { GameScreen } from '@/components/layout/GameScreen'
import { MatchingBoard } from '@/games/shared/MatchingBoard'
import { useFlowerGarden } from './logic'
import { FLOWERS, type FlowerKey } from './data'
import { FlowerArt, PlantedArt, PotArt } from './art'

/** The flower's German name - a small caption to help the parent. */
function NameCaption({ id }: { id: string }) {
  const flower = FLOWERS[id as FlowerKey]
  if (!flower) return null
  return (
    <span className="text-[0.58rem] font-bold leading-none text-ink-soft">{flower.name}</span>
  )
}

/**
 * Game 2 - Flower Garden.
 * Match each flower to the plant pot of the same colour; the flower then
 * stands planted in its pot. Drag or tap. Calm, forgiving colour matching -
 * no score, no failure. One more flower is added each round (3 -> 5).
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
        renderTarget={(key, filled) =>
          filled ? null : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1">
              <div className="min-h-0 flex-1">
                <PotArt id={key} />
              </div>
              <NameCaption id={key} />
            </div>
          )
        }
        renderPlaced={(key) => (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1">
            <div className="min-h-0 flex-1">
              <PlantedArt id={key} />
            </div>
            <NameCaption id={key} />
          </div>
        )}
      />
    </GameScreen>
  )
}
