import type { ComponentType } from 'react'
import type { ScreenId, GameId } from '@/store/appStore'
import { t } from '@/i18n'
import { HomeScreen } from '@/screens/HomeScreen'
import { ParentScreen } from '@/screens/ParentScreen'
import { BuildGarage } from '@/games/build-garage/BuildGarage'
import { FlowerGarden } from '@/games/flower-garden/FlowerGarden'
import { ShapeSorting } from '@/games/shape-sorting/ShapeSorting'
import { Race } from '@/games/race/Race'
import { GarageTile } from '@/games/build-garage/art'
import { GardenTile } from '@/games/flower-garden/art'
import { ShapesTile } from '@/games/shape-sorting/art'
import { RaceTile } from '@/games/race/art'

/** Screen registry. A tiny store-driven router keeps navigation native-ready. */
export const ROUTES: Record<ScreenId, ComponentType> = {
  home: HomeScreen,
  garage: BuildGarage,
  garden: FlowerGarden,
  shapes: ShapeSorting,
  race: Race,
  parents: ParentScreen,
}

export type GameTone = 'garage' | 'garden' | 'shapes' | 'race'

export interface GameMeta {
  id: GameId
  /** Short label - shown for the accompanying parent, not required to play. */
  label: string
  /** Large illustration component for the home tile. */
  Tile: ComponentType
  tone: GameTone
}

/** Ordered home-screen games. Max 6 supported; this build ships 4. */
export const GAMES: readonly GameMeta[] = [
  { id: 'garage', label: t.gameGarage, Tile: GarageTile, tone: 'garage' },
  { id: 'garden', label: t.gameGarden, Tile: GardenTile, tone: 'garden' },
  { id: 'shapes', label: t.gameShapes, Tile: ShapesTile, tone: 'shapes' },
  { id: 'race', label: t.gameRace, Tile: RaceTile, tone: 'race' },
]
