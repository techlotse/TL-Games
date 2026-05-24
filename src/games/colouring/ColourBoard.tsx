import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Brush, PaintBucket } from 'lucide-react'
import { cn, clamp } from '@/lib/utils'
import { useCalmMotion } from '@/lib/motion'
import { hapticSuccess, hapticTap } from '@/lib/platform'
import { CompletionOverlay } from '@/components/toddler/CompletionOverlay'
import { COLOUR_HEX, PICTURE_VIEWBOX, SHEET, SWATCHES, type Shape } from './data'
import type { ColouringGame } from './logic'

interface Dab {
  id: number
  x: number
  y: number
  c: string
}

/** Freehand coverage is tracked over a 10 x 10 grid of the 200-unit sheet. */
const COVER_CELLS = 10
const COVER_SIZE = 200 / COVER_CELLS
/** Painted cells needed for a freehand picture to count as coloured in. */
const COVER_TARGET = 48

function cellIndex(x: number, y: number): number {
  const col = clamp(Math.floor(x / COVER_SIZE), 0, COVER_CELLS - 1)
  const row = clamp(Math.floor(y / COVER_SIZE), 0, COVER_CELLS - 1)
  return row * COVER_CELLS + col
}

/** A single picture shape, drawn as the matching SVG element. */
function ShapeEl({
  shape,
  fill,
  regionId,
  decor,
}: {
  shape: Shape
  fill: string
  regionId?: string
  decor?: boolean
}) {
  const stroke = decor ? 'none' : SHEET.ink
  const strokeWidth = decor ? 0 : 3
  const style = decor ? { pointerEvents: 'none' as const } : undefined
  switch (shape.kind) {
    case 'rect':
      return (
        <rect
          data-region={regionId}
          x={shape.x}
          y={shape.y}
          width={shape.w}
          height={shape.h}
          rx={shape.rx}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          style={style}
        />
      )
    case 'circle':
      return (
        <circle
          data-region={regionId}
          cx={shape.cx}
          cy={shape.cy}
          r={shape.r}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          style={style}
        />
      )
    case 'ellipse':
      return (
        <ellipse
          data-region={regionId}
          cx={shape.cx}
          cy={shape.cy}
          rx={shape.rx}
          ry={shape.ry}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          style={style}
        />
      )
    case 'path':
      return (
        <path
          data-region={regionId}
          d={shape.d}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
          style={style}
        />
      )
  }
}

export interface ColourBoardProps {
  game: ColouringGame
  onHome: () => void
  onComplete?: () => void
}

/**
 * The colouring surface. Pick a colour, then colour the picture. The fill
 * tool fills a whole region with one tap; the brush is true freehand - sweep
 * a finger to paint, the strokes land wherever the finger goes. A fill
 * picture is done when every region has a colour; a freehand picture is done
 * once enough of the sheet has been painted over. Nothing is ever "wrong".
 */
export function ColourBoard({ game, onHome, onComplete }: ColourBoardProps) {
  const { round, fills, colour, tool, isComplete } = game
  const calm = useCalmMotion()
  const svgRef = useRef<SVGSVGElement | null>(null)
  const paintingRef = useRef(false)
  const lastDabRef = useRef<{ x: number; y: number } | null>(null)
  const dabIdRef = useRef(0)
  const paintedCellsRef = useRef<Set<number>>(new Set())
  const completedRef = useRef(false)
  const [dabs, setDabs] = useState<Dab[]>([])
  const [coverage, setCoverage] = useState(0)

  // Fresh sheet each level.
  useEffect(() => {
    setDabs([])
    setCoverage(0)
    paintedCellsRef.current = new Set()
    paintingRef.current = false
    lastDabRef.current = null
    completedRef.current = false
  }, [round.id])

  const complete = isComplete || coverage >= COVER_TARGET

  useEffect(() => {
    if (complete && !completedRef.current) {
      completedRef.current = true
      hapticSuccess()
      onComplete?.()
    }
  }, [complete, onComplete])

  const toSvg = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current
    if (!svg) return null
    const r = svg.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return null
    return {
      x: ((clientX - r.left) / r.width) * 200,
      y: ((clientY - r.top) / r.height) * 200,
    }
  }, [])

  const regionAt = useCallback((clientX: number, clientY: number): string | null => {
    const el = document.elementFromPoint(clientX, clientY)
    return el?.getAttribute('data-region') ?? null
  }, [])

  const addDab = useCallback(
    (x: number, y: number) => {
      const dab: Dab = { id: dabIdRef.current++, x, y, c: COLOUR_HEX[colour] }
      setDabs((prev) => {
        const next = [...prev, dab]
        return next.length > 240 ? next.slice(next.length - 240) : next
      })
      const cells = paintedCellsRef.current
      const cell = cellIndex(x, y)
      if (!cells.has(cell)) {
        cells.add(cell)
        setCoverage(cells.size)
      }
    },
    [colour],
  )

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (tool === 'fill') {
        const region = regionAt(event.clientX, event.clientY)
        if (region) {
          game.paint(region)
          hapticTap()
        }
        return
      }
      // Brush: start a freehand stroke.
      paintingRef.current = true
      svgRef.current?.setPointerCapture(event.pointerId)
      const point = toSvg(event.clientX, event.clientY)
      if (point) {
        addDab(point.x, point.y)
        lastDabRef.current = point
      }
      hapticTap()
    },
    [tool, game, regionAt, toSvg, addDab],
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (!paintingRef.current || tool !== 'paint') return
      const point = toSvg(event.clientX, event.clientY)
      if (!point) return
      const last = lastDabRef.current
      if (!last || (point.x - last.x) ** 2 + (point.y - last.y) ** 2 >= 49) {
        addDab(point.x, point.y)
        lastDabRef.current = point
      }
    },
    [tool, toSvg, addDab],
  )

  const endStroke = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    paintingRef.current = false
    lastDabRef.current = null
    try {
      svgRef.current?.releasePointerCapture(event.pointerId)
    } catch {
      /* capture may already be gone */
    }
  }, [])

  const inviting = round.id === 0 && Object.keys(fills).length === 0

  return (
    <div className="relative flex flex-1 flex-col px-4 pb-2">
      <div className="flex min-h-0 flex-1 items-center justify-center py-2">
        <div className="relative aspect-square max-h-full w-full max-w-[20rem]">
          {inviting && (
            <motion.span
              className="pointer-events-none absolute -inset-1 rounded-[1.9rem] ring-4 ring-focus"
              initial={{ opacity: 0 }}
              animate={calm ? { opacity: 0.6 } : { opacity: [0.35, 0.85, 0.35] }}
              transition={
                calm ? { duration: 0 } : { duration: 1.8, repeat: Infinity, ease: 'easeInOut' }
              }
              aria-hidden
            />
          )}
          <div className="h-full w-full rounded-[1.6rem] bg-surface p-3 shadow-soft">
            <svg
              ref={svgRef}
              viewBox={PICTURE_VIEWBOX}
              className="block h-full w-full touch-none select-none"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endStroke}
              onPointerCancel={endStroke}
              onContextMenu={(event) => event.preventDefault()}
            >
              {round.picture.regions.map((region) => {
                const filled = fills[region.id]
                const fill = filled ? COLOUR_HEX[filled] : SHEET.paper
                return region.shapes.map((shape, index) => (
                  <ShapeEl
                    key={`${region.id}-${index}`}
                    shape={shape}
                    fill={fill}
                    regionId={region.id}
                  />
                ))
              })}

              <g pointerEvents="none">
                {dabs.map((dab) => (
                  <circle key={dab.id} cx={dab.x} cy={dab.y} r={9} fill={dab.c} opacity={0.82} />
                ))}
              </g>

              {round.picture.decor.map((shape, index) => (
                <ShapeEl key={`decor-${index}`} shape={shape} fill={SHEET.ink} decor />
              ))}
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-1">
        {round.paintUnlocked && (
          <div className="flex justify-center gap-3">
            <ToolButton
              label="Füllen"
              active={tool === 'fill'}
              onPress={() => {
                game.setTool('fill')
                hapticTap()
              }}
            >
              <PaintBucket size={32} strokeWidth={2.4} aria-hidden />
            </ToolButton>
            <ToolButton
              label="Pinsel"
              active={tool === 'paint'}
              onPress={() => {
                game.setTool('paint')
                hapticTap()
              }}
            >
              <Brush size={32} strokeWidth={2.4} aria-hidden />
            </ToolButton>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2.5">
          {SWATCHES.map((swatch) => (
            <button
              key={swatch.id}
              type="button"
              aria-label={swatch.label}
              aria-pressed={colour === swatch.id}
              onClick={() => {
                game.setColour(swatch.id)
                hapticTap()
              }}
              className={cn(
                'aspect-square min-h-[4rem] rounded-full shadow-soft outline-none transition-transform',
                colour === swatch.id
                  ? 'scale-105 ring-4 ring-focus ring-offset-2 ring-offset-background'
                  : 'scale-100',
              )}
              style={{ backgroundColor: swatch.hex }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {complete && <CompletionOverlay key="complete" onAgain={game.reset} onHome={onHome} />}
      </AnimatePresence>
    </div>
  )
}

/** A large fill / brush tool button. */
function ToolButton({
  label,
  active,
  onPress,
  children,
}: {
  label: string
  active: boolean
  onPress: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onPress}
      className={cn(
        'flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.4rem] shadow-soft outline-none transition-colors',
        active ? 'bg-surface text-ink ring-4 ring-focus' : 'bg-surface/60 text-ink-soft',
      )}
    >
      {children}
    </button>
  )
}
