import { FLOWERS, LEAF_COLOR, SOIL_COLOR, STEM_COLOR, type Flower, type FlowerKey } from './data'

const ANGLES = [0, 60, 120, 180, 240, 300]

/** The flower head, in the plant's own petal style. */
function Bloom({ cx, cy, flower }: { cx: number; cy: number; flower: Flower }) {
  if (flower.style === 'broad') {
    const petals = [
      [0, -13],
      [13, 0],
      [0, 13],
      [-13, 0],
    ]
    return (
      <g>
        {petals.map(([dx, dy], i) => (
          <ellipse key={i} cx={cx + dx} cy={cy + dy} rx={13} ry={14} fill={flower.petal} />
        ))}
        {petals.map(([dx, dy], i) => (
          <ellipse key={`h${i}`} cx={cx + dx * 0.55} cy={cy + dy * 0.55 - 3} rx={4} ry={5} fill="#FFFFFF" opacity={0.22} />
        ))}
        <circle cx={cx} cy={cy} r={9} fill={flower.center} />
        <circle cx={cx - 2} cy={cy - 2} r={3} fill="#FFFFFF" opacity={0.3} />
      </g>
    )
  }
  if (flower.style === 'star') {
    return (
      <g>
        {ANGLES.map((a) => (
          <ellipse
            key={a}
            cx={cx}
            cy={cy - 14}
            rx={6}
            ry={14}
            fill={flower.petal}
            transform={`rotate(${a} ${cx} ${cy})`}
          />
        ))}
        <ellipse cx={cx} cy={cy - 18} rx={2.5} ry={5} fill="#FFFFFF" opacity={0.25} />
        <circle cx={cx} cy={cy} r={9} fill={flower.center} />
        <circle cx={cx - 2} cy={cy - 2} r={3} fill="#FFFFFF" opacity={0.3} />
      </g>
    )
  }
  return (
    <g>
      {ANGLES.map((a) => (
        <circle
          key={a}
          cx={cx}
          cy={cy - 12}
          r={9}
          fill={flower.petal}
          transform={`rotate(${a} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy - 16} r={3.5} fill="#FFFFFF" opacity={0.25} />
      <circle cx={cx} cy={cy} r={9.5} fill={flower.center} />
      <circle cx={cx - 2} cy={cy - 2} r={3} fill="#FFFFFF" opacity={0.3} />
    </g>
  )
}

/** An empty plant pot, in the flower's colour. */
function Pot({ flower }: { flower: Flower }) {
  return (
    <g>
      <ellipse cx="60" cy="116" rx="18" ry="4" fill="#000" opacity="0.10" />
      <path d="M42 84 L78 84 L73 114 L47 114 Z" fill={flower.petalDark} />
      {/* Pot body highlight */}
      <path d="M44 86 L50 112 L47 114 L42 84 Z" fill="#FFFFFF" opacity="0.12" />
      {/* Rim */}
      <rect x="36" y="75" width="48" height="15" rx="7.5" fill={flower.petal} />
      <rect x="40" y="77" width="40" height="5" rx="3" fill="#FFFFFF" opacity="0.20" />
      {/* Soil */}
      <ellipse cx="60" cy="82" rx="20" ry="5" fill={SOIL_COLOR} />
      <ellipse cx="54" cy="80" rx="7" ry="2.5" fill="#A07050" opacity="0.4" />
    </g>
  )
}

/** A single picked flower on a leafy stem - the draggable item. */
export function FlowerArt({ id }: { id: string }) {
  const flower = FLOWERS[id as FlowerKey]
  if (!flower) return null
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" role="img" aria-label={flower.name}>
      <rect x="56" y="50" width="8" height="54" rx="4" fill={STEM_COLOR} />
      <rect x="57" y="52" width="3" height="50" rx="1.5" fill="#FFFFFF" opacity="0.18" />
      <ellipse cx="44" cy="74" rx="14" ry="7.5" fill={LEAF_COLOR} transform="rotate(-30 44 74)" />
      <ellipse cx="44" cy="74" rx="5" ry="3" fill="#FFFFFF" opacity="0.18" transform="rotate(-30 44 74)" />
      <ellipse cx="76" cy="88" rx="14" ry="7.5" fill={LEAF_COLOR} transform="rotate(30 76 88)" />
      <ellipse cx="76" cy="88" rx="5" ry="3" fill="#FFFFFF" opacity="0.18" transform="rotate(30 76 88)" />
      <Bloom cx={60} cy={36} flower={flower} />
    </svg>
  )
}

/** An empty pot in the flower's colour - the colour-match target. */
export function PotArt({ id }: { id: string }) {
  const flower = FLOWERS[id as FlowerKey]
  if (!flower) return null
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" role="img" aria-label="Blumentopf">
      <Pot flower={flower} />
    </svg>
  )
}

/** The flower standing planted in its pot - shown once matched. */
export function PlantedArt({ id }: { id: string }) {
  const flower = FLOWERS[id as FlowerKey]
  if (!flower) return null
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" role="img" aria-label={flower.name}>
      <rect x="56" y="40" width="8" height="46" rx="4" fill={STEM_COLOR} />
      <rect x="57" y="42" width="3" height="42" rx="1.5" fill="#FFFFFF" opacity="0.18" />
      <ellipse cx="45" cy="60" rx="13" ry="7" fill={LEAF_COLOR} transform="rotate(-30 45 60)" />
      <ellipse cx="45" cy="60" rx="5" ry="2.8" fill="#FFFFFF" opacity="0.18" transform="rotate(-30 45 60)" />
      <ellipse cx="75" cy="70" rx="13" ry="7" fill={LEAF_COLOR} transform="rotate(30 75 70)" />
      <ellipse cx="75" cy="70" rx="5" ry="2.8" fill="#FFFFFF" opacity="0.18" transform="rotate(30 75 70)" />
      <Bloom cx={60} cy={28} flower={flower} />
      <Pot flower={flower} />
    </svg>
  )
}

/** Home-screen tile artwork - a flower planted in its pot. */
export function GardenTile() {
  return <PlantedArt id="alpenrose" />
}
