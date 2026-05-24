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
      <PartShapes part={part} />
    </svg>
  )
}

/**
 * The whole vehicle as one coherent drawing. Each part is faint until it has
 * been placed, then fades in to full colour - so the parts always line up.
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
      {vehicle.parts.map((part) => (
        <motion.g
          key={part.id}
          initial={false}
          animate={{ opacity: placed.has(part.id) ? 1 : 0.16 }}
          transition={calm ? { duration: 0 } : calmTween}
        >
          <PartShapes part={part} />
        </motion.g>
      ))}
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
