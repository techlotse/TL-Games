import { BOARD_WOOD, BOARD_WOOD_EDGE, HOLE_DARK, SHAPE_COLORS, type ShapeKey } from './data'

const STAR_PATH =
  'M50 20 L57.1 40.3 L78.5 40.7 L61.4 53.7 L67.6 74.3 L50 62 ' +
  'L32.4 74.3 L38.6 53.7 L21.5 40.7 L42.9 40.3 Z'

const HEART_PATH = 'M50 78 C 20 58 23 30 50 43 C 77 30 80 58 50 78 Z'

const HEXAGON_PATH = 'M50 24 L74 37 L74 63 L50 76 L26 63 L26 37 Z'

const DIAMOND_PATH = 'M50 22 L76 50 L50 78 L24 50 Z'

const PENTAGON_PATH = 'M50 24 L76 43 L66 73 L34 73 L24 43 Z'

/** A single chunky, rounded shape - used for both the block and the hole. */
function ShapePrimitive({ shape, color }: { shape: ShapeKey; color: string }) {
  const style = {
    fill: color,
    stroke: color,
    strokeWidth: 9,
    strokeLinejoin: 'round' as const,
    strokeLinecap: 'round' as const,
  }
  switch (shape) {
    case 'circle':
      return <circle cx={50} cy={50} r={26} {...style} />
    case 'square':
      return <rect x={26} y={26} width={48} height={48} rx={9} {...style} />
    case 'triangle':
      return <path d="M50 25 L77 71 L23 71 Z" {...style} />
    case 'star':
      return <path d={STAR_PATH} {...style} />
    case 'heart':
      return <path d={HEART_PATH} {...style} />
    case 'hexagon':
      return <path d={HEXAGON_PATH} {...style} />
    case 'diamond':
      return <path d={DIAMOND_PATH} {...style} />
    case 'oval':
      return <ellipse cx={50} cy={50} rx={30} ry={22} {...style} />
    case 'pentagon':
      return <path d={PENTAGON_PATH} {...style} />
    default:
      return null
  }
}

/** A coloured wooden block - the draggable item. */
export function ShapeBlockArt({ id }: { id: string }) {
  const color = SHAPE_COLORS[id as ShapeKey]
  if (!color) return null
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Form">
      <ShapePrimitive shape={id as ShapeKey} color={color} />
    </svg>
  )
}

/** A wooden board with a cut-out hole - the shape-match target. */
export function HoleArt({ id }: { id: string }) {
  const shape = id as ShapeKey
  if (!SHAPE_COLORS[shape]) return null
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Holzbrett">
      <rect x="3" y="7" width="94" height="91" rx="16" fill={BOARD_WOOD_EDGE} />
      <rect x="3" y="3" width="94" height="91" rx="16" fill={BOARD_WOOD} />
      <ShapePrimitive shape={shape} color={HOLE_DARK} />
    </svg>
  )
}

/** Home-screen tile artwork - a small cluster of shapes. */
export function ShapesTile() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Formen">
      <circle cx="33" cy="35" r="19" fill={SHAPE_COLORS.circle} />
      <rect x="50" y="18" width="34" height="34" rx="8" fill={SHAPE_COLORS.square} />
      <path
        d="M50 60 L73 96 L27 96 Z"
        fill={SHAPE_COLORS.triangle}
        stroke={SHAPE_COLORS.triangle}
        strokeWidth="8"
        strokeLinejoin="round"
      />
    </svg>
  )
}
