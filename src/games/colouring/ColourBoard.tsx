import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Brush, Check, PaintBucket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCalmMotion } from '@/lib/motion'
import { hapticSuccess, hapticTap } from '@/lib/platform'
import { CompletionOverlay } from '@/components/toddler/CompletionOverlay'
import { COLOUR_HEX, PICTURE_VIEWBOX, SHEET, SWATCHES, type Shape } from './data'
import type { ColouringGame } from './logic'

/** One freehand brush stroke - a colour and a polyline of points. */
interface Stroke {
  id: number
  c: string
  pts: number[]
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

/** One freehand stroke as an SVG element. */
function StrokeEl({ stroke }: { stroke: Stroke }) {
  const { pts, c } = stroke
  if (pts.length <= 2) {
    return <circle cx={pts[0]} cy={pts[1]} r={9} fill={c} />
  }
  let d = ''
  for (let i = 0; i < pts.length; i += 2) {
    d += `${i === 0 ? 'M' : 'L'}${pts[i]} ${pts[i + 1]} `
  }
  return (
    <path
      d={d}
      fill="none"
      stroke={c}
      strokeWidth={17}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

export interface ColourBoardProps {
  game: ColouringGame
  onHome: () => void
  onComplete?: () => void
}

/**
 * The colouring surface. Pick a colour, then colour the picture. The fill
 * tool fills a whole region with one tap; the brush is true freehand and
 * its strokes always stay - painting never rubs out earlier strokes. A fill
 * picture finishes on its own once every region has a colour; otherwise the
 * child taps the big check button to say the picture is done.
 */
export function ColourBoard({ game, onHome, onComplete }: ColourBoardProps) {
  const { round, fills, colour, tool, isComplete } = game
  const calm = useCalmMotion()
  const svgRef = useRef<SVGSVGElement | null>(null)
  const paintingRef = useRef(false)
  const lastPtRef = useRef<{ x: number; y: number } | null>(null)
  const strokeIdRef = useRef(0)
  const currentStrokeRef = useRef<Stroke | null>(null)
  const completedRef = useRef(false)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [doneTapped, setDoneTapped] = useState(false)

  // Fresh sheet each level.
  useEffect(() => {
    setStrokes([])
    setDoneTapped(false)
    paintingRef.current = false
    lastPtRef.current = null
    currentStrokeRef.current = null
    completedRef.current = false
  }, [round.id])

  const complete = isComplete || doneTapped

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
      // Brush: begin a freehand stroke.
      paintingRef.current = true
      svgRef.current?.setPointerCapture(event.pointerId)
      const point = toSvg(event.clientX, event.clientY)
      if (point) {
        const stroke: Stroke = {
          id: strokeIdRef.current++,
          c: COLOUR_HEX[colour],
          pts: [point.x, point.y],
        }
        currentStrokeRef.current = stroke
        lastPtRef.current = point
        setStrokes((prev) => [...prev, stroke])
      }
      hapticTap()
    },
    [tool, game, regionAt, toSvg, colour],
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      if (!paintingRef.current || tool !== 'paint') return
      const point = toSvg(event.clientX, event.clientY)
      if (!point) return
      const cur = currentStrokeRef.current
      const last = lastPtRef.current
      if (cur && (!last || (point.x - last.x) ** 2 + (point.y - last.y) ** 2 >= 36)) {
        cur.pts.push(point.x, point.y)
        lastPtRef.current = point
        setStrokes((prev) => [...prev])
      }
    },
    [tool, toSvg],
  )

  const endStroke = useCallback((event: React.PointerEvent<SVGSVGElement>) => {
    paintingRef.current = false
    lastPtRef.current = null
    currentStrokeRef.current = null
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
              <rect x={0} y={0} width={200} height={200} fill={SHEET.paper} />

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
                {strokes.map((stroke) => (
                  <StrokeEl key={stroke.id} stroke={stroke} />
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
        <div className="flex items-center justify-center gap-3">
          {round.paintUnlocked && (
            <>
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
            </>
          )}
          <button
            type="button"
            aria-label="Fertig"
            onClick={() => {
              hapticTap()
              setDoneTapped(true)
            }}
            className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-[1.4rem] bg-accent text-surface shadow-soft outline-none transition-transform active:scale-95"
          >
            <Check size={36} strokeWidth={3.2} aria-hidden />
          </button>
        </div>

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
