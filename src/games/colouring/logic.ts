import { useCallback, useMemo, useState } from 'react'
import { PAINT_UNLOCK_LEVEL, pictureForLevel, type ColourId, type Picture } from './data'

/** Fill = tap a whole region solid. Paint = sweep a finger to free-paint. */
export type Tool = 'fill' | 'paint'

export interface ColouringRound {
  id: number
  picture: Picture
  /** True once the level is high enough for the fill / paint toggle. */
  paintUnlocked: boolean
}

export interface ColouringGame {
  round: ColouringRound
  /** Region id -> the colour it has been given. */
  fills: Readonly<Record<string, ColourId>>
  colour: ColourId
  tool: Tool
  isComplete: boolean
  setColour: (colour: ColourId) => void
  setTool: (tool: Tool) => void
  /** Colour a region with the currently selected colour. */
  paint: (regionId: string) => void
  reset: () => void
}

function buildRound(id: number): ColouringRound {
  return {
    id,
    picture: pictureForLevel(id),
    paintUnlocked: id >= PAINT_UNLOCK_LEVEL,
  }
}

/** A blank canvas opens with the brush; an outline picture opens with fill. */
function toolFor(picture: Picture): Tool {
  return picture.regions.length === 0 ? 'paint' : 'fill'
}

/**
 * Colouring game logic. The brush is available from the start. Difficulty
 * ramps within a session: each finished picture is replaced by the next one.
 * Resets when the screen is left.
 */
export function useColouring(): ColouringGame {
  const [round, setRound] = useState<ColouringRound>(() => buildRound(0))
  const [fills, setFills] = useState<Record<string, ColourId>>({})
  const [colour, setColour] = useState<ColourId>('red')
  const [tool, setTool] = useState<Tool>(() => toolFor(pictureForLevel(0)))

  const paint = useCallback(
    (regionId: string) => {
      setFills((prev) => (prev[regionId] === colour ? prev : { ...prev, [regionId]: colour }))
    },
    [colour],
  )

  const reset = useCallback(() => {
    const next = buildRound(round.id + 1)
    setRound(next)
    setFills({})
    setTool(toolFor(next.picture))
  }, [round.id])

  const isComplete =
    round.picture.regions.length > 0 &&
    round.picture.regions.every((region) => fills[region.id] !== undefined)

  return useMemo(
    () => ({ round, fills, colour, tool, isComplete, setColour, setTool, paint, reset }),
    [round, fills, colour, tool, isComplete, paint, reset],
  )
}
