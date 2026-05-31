import { motion } from 'framer-motion'
import { useCalmMotion, calmTween } from '@/lib/motion'
import { PART_COLORS, VEHICLE_VIEW, type DrawShape, type Part, type Vehicle } from './data'

/** One drawing primitive. */
function DrawShapeEl({ shape }: { shape: DrawShape }) {
  switch (shape.t) {
    case 'rect':
      return (
        <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.rx} fill={shape.fill} />
      )
    case 'circle':
      return <circle cx={shape.cx} cy={shape.cy} r={shape.r} fill={shape.fill} />
    case 'line':
      return (
        <line
          x1={shape.x1}
          y1={shape.y1}
          x2={shape.x2}
          y2={shape.y2}
          stroke={shape.fill}
          strokeWidth={shape.sw}
          strokeLinecap="round"
        />
      )
    case 'path':
      return <path d={shape.d} fill={shape.fill} strokeLinejoin="round" />
  }
}

function PartShapes({ part }: { part: Part }) {
  return (
    <>
      {part.shapes.map((shape, index) => (
        <DrawShapeEl key={index} shape={shape} />
      ))}
    </>
  )
}

/** A single vehicle part, cropped to its own box - drawn standalone for the tray. */
export function PartArt({ part }: { part: Part }) {
  const { x, y, w, h } = part.box
  return (
    <svg
      viewBox={`${x - 4} ${y - 4} ${w + 8} ${h + 8}`}
      className="block h-full w-full"
      role="img"
      aria-label="Fahrzeugteil"
    >
      <defs>
        <filter id="part-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#3A2A18" floodOpacity="0.28" />
        </filter>
      </defs>
      <g filter="url(#part-shadow)">
        <PartShapes part={part} />
      </g>
    </svg>
  )
}

/**
 * A ghost outline for an unplaced part — dashed stroke in the part's first
 * shape colour so the child can see exactly where each piece belongs.
 */
function GhostShapeEl({ shape }: { shape: DrawShape }) {
  const stroke = shape.fill
  const common = { fill: 'none', stroke, strokeWidth: 2.5, strokeDasharray: '5 4', opacity: 0.55 }
  switch (shape.t) {
    case 'rect':
      return <rect x={shape.x} y={shape.y} width={shape.w} height={shape.h} rx={shape.rx} {...common} />
    case 'circle':
      return <circle cx={shape.cx} cy={shape.cy} r={shape.r} {...common} />
    case 'path':
      return <path d={shape.d} {...common} />
    case 'line':
      return null
  }
}

/**
 * The whole vehicle as one coherent drawing. Unplaced parts show as a dashed
 * ghost outline so the child can see exactly where each piece belongs; placed
 * parts fade in to full colour.
 */
export function VehicleScene({
  vehicle,
  placed,
}: {
  vehicle: Vehicle
  placed: ReadonlySet<string>
}) {
  const calm = useCalmMotion()
  return (
    <svg
      viewBox={`0 0 ${VEHICLE_VIEW.w} ${VEHICLE_VIEW.h}`}
      className="h-full w-full"
      role="img"
      aria-label={vehicle.label}
    >
      <ellipse cx={VEHICLE_VIEW.w / 2} cy={203} rx={134} ry={13} fill="#000000" opacity={0.07} />
      {vehicle.parts.map((part) =>
        placed.has(part.id) ? (
          <motion.g
            key={part.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={calm ? { duration: 0 } : calmTween}
          >
            <PartShapes part={part} />
          </motion.g>
        ) : (
          <g key={part.id}>
            {part.shapes.map((shape, i) => (
              <GhostShapeEl key={i} shape={shape} />
            ))}
          </g>
        ),
      )}
    </svg>
  )
}

/** Home-screen tile artwork - a finished little car. */
export function GarageTile() {
  const c = PART_COLORS
  return (
    <svg viewBox="0 0 120 100" className="h-full w-full" role="img" aria-label="Werkstatt">
      <ellipse cx="60" cy="86" rx="50" ry="6" fill="#000000" opacity="0.07" />
      <rect x="14" y="46" width="92" height="26" rx="12" fill={c.body} />
      <rect x="40" y="26" width="46" height="24" rx="9" fill={c.body} />
      <rect x="47" y="32" width="32" height="14" rx="5" fill={c.glass} />
      <rect x="18" y="60" width="84" height="9" rx="4" fill={c.bodyTrim} />
      <circle cx="38" cy="76" r="13" fill={c.wheel} />
      <circle cx="38" cy="76" r="5" fill={c.wheelHub} />
      <circle cx="84" cy="76" r="13" fill={c.wheel} />
      <circle cx="84" cy="76" r="5" fill={c.wheelHub} />
    </svg>
  )
}
