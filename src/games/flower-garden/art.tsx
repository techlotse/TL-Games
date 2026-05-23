import {
  FLOWER_COLORS,
  LEAF_COLOR,
  SOIL_COLOR,
  STEM_COLOR,
  type FlowerKey,
} from './data'

const PETAL_ANGLES = [0, 60, 120, 180, 240, 300]

/** A single flower on a short, leafy stem. */
export function FlowerArt({ id }: { id: string }) {
  const c = FLOWER_COLORS[id as FlowerKey]
  if (!c) return null
  return (
    <svg viewBox="0 0 120 110" className="h-full w-full" role="img" aria-label="Blume">
      <rect x="56.5" y="44" width="7" height="50" rx="3.5" fill={STEM_COLOR} />
      <ellipse
        cx="44"
        cy="64"
        rx="12"
        ry="6.5"
        fill={LEAF_COLOR}
        transform="rotate(-28 44 64)"
      />
      <ellipse
        cx="76"
        cy="76"
        rx="12"
        ry="6.5"
        fill={LEAF_COLOR}
        transform="rotate(28 76 76)"
      />
      {PETAL_ANGLES.map((angle) => (
        <ellipse
          key={angle}
          cx="60"
          cy="22"
          rx="10"
          ry="15"
          fill={c.petal}
          transform={`rotate(${angle} 60 38)`}
        />
      ))}
      <circle cx="60" cy="38" r="11" fill={c.center} />
    </svg>
  )
}

/** A plant pot in the flower's colour - the colour-match target. */
export function BedArt({ id }: { id: string }) {
  const c = FLOWER_COLORS[id as FlowerKey]
  if (!c) return null
  return (
    <svg viewBox="0 0 120 110" className="h-full w-full" role="img" aria-label="Blumentopf">
      <path d="M34 58 L86 58 L80 96 L40 96 Z" fill={c.petalDark} />
      <rect x="27" y="49" width="66" height="15" rx="7.5" fill={c.petal} />
      <ellipse cx="60" cy="53" rx="29" ry="7" fill={SOIL_COLOR} />
    </svg>
  )
}

/** Home-screen tile artwork. */
export function GardenTile() {
  return <FlowerArt id="rose" />
}
