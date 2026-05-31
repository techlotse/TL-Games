import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Brush, Check, House, PaintBucket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCalmMotion, calmTween } from '@/lib/motion'
import { hapticSuccess, hapticTap } from '@/lib/platform'
import { RoundButton } from '@/components/toddler/RoundButton'
import {
  COLOUR_HEX,
  PICTURES,
  PICTURE_VIEWBOX,
  SHEET,
  SWATCHES,
  type Picture,
  type Shape,
} from './data'
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
  const strokeWidth = decor ? 0 : 4
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

/** A small outline preview of a picture, for the picker. */
function PictureThumb({ picture }: { picture: Picture }) {
  return (
    <svg viewBox={PICTURE_VIEWBOX} className="h-full w-full">
      <rect x={0} y={0} width={200} height={200} rx={12} fill={SHEET.paper} />
      {picture.regions.map((region) =>
        region.shapes.map((shape, i) => (
          <ShapeEl key={`${region.id}-${i}`} shape={shape} fill={SHEET.paper} />
        )),
      )}
      {picture.decor.map((shape, i) => (
        <ShapeEl key={`d-${i}`} shape={shape} fill={SHEET.ink} decor />
      ))}
    </svg>
  )
}

/** The gallery shown when a picture is finished - pick the next one. */
function PicturePicker({
  onPick,
  onHome,
}: {
  onPick: (index: number) => void
  onHome: () => void
}) {
  return (
    <motion.div
      className="absolute inset-0 z-40 flex flex-col bg-background/95"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={calmTween}
    >
      <div className="safe-x flex items-center px-4 pt-3">
        <RoundButton label="Zuhause" onPress={onHome} tone="surface" size="md">
          <House size={28} strokeWidth={2.4} aria-hidden />
        </RoundButton>
      </div>
      <div className="safe-x grid min-h-0 flex-1 grid-cols-3 content-start gap-3 overflow-y-auto px-4 py-3">
        {PICTURES.map((picture, index) => (
          <button
            key={picture.id}
            type="button"
            aria-label={`Bild ${index + 1}`}
            onClick={() => {
              hapticTap()
              onPick(index)
            }}
            className="aspect-square overflow-hidden rounded-[1.3rem] bg-surface p-2 shadow-soft outline-none transition-transform active:scale-95"
          >
            <PictureThumb picture={picture} />
          </button>
        ))}
      </div>
    </motion.div>
  )
}

export interface ColourBoardProps {
  game: ColouringGame
  onHome: () => void
  onComplete?: () => void
}

/**
 * The colouring surface. Pick a colour, then colour the picture. The fill
 * tool fills a whole region with one tap; the brush is true freehand and its
 * strokes always stay. A fill picture finishes on its own once every region
 * has a colour; otherwise the child taps the big check button. When a picture
 * is done, a gallery opens to choose the next one.
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

  // Fresh sheet each picture.
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
              style={{
                backgroundColor: swatch.hex,
                boxShadow: `inset 0 -3px 6px rgba(0,0,0,0.18), inset 0 2px 4px rgba(255,255,255,0.22)`,
              }}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {complete && (
          <PicturePicker key="picker" onPick={(index) => game.pick(index)} onHome={onHome} />
        )}
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
