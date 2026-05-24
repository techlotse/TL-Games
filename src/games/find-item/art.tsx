import type { ComponentType } from 'react'
import type { ItemKind } from './data'

const C = {
  apple: '#D9514C',
  appleHi: '#E8857C',
  stem: '#6E4F2E',
  leaf: '#6FA86A',
  star: '#F2C94C',
  starEdge: '#E0A93C',
  heart: '#E58FB0',
  petal: '#6FA1CF',
  petalCenter: '#F2C94C',
  fish: '#E8983C',
  fishFin: '#D9822E',
  eye: '#3C342C',
  wing: '#9B7BC4',
  wingDark: '#876AAE',
  body: '#4A4036',
  ball: '#E0584C',
  ballBand: '#FBF7EC',
  sparkle: '#F6D45E',
}

/** German item words - used only as accessibility labels. */
export const ITEM_LABEL: Record<ItemKind, string> = {
  apple: 'Apfel',
  star: 'Stern',
  heart: 'Herz',
  flower: 'Blume',
  leaf: 'Blatt',
  fish: 'Fisch',
  butterfly: 'Schmetterling',
  ball: 'Ball',
}

function Apple() {
  return (
    <g>
      <path d="M44 30 Q48 16 62 16" stroke={C.stem} strokeWidth="6" fill="none" strokeLinecap="round" />
      <ellipse cx="64" cy="22" rx="13" ry="8" fill={C.leaf} transform="rotate(-28 64 22)" />
      <circle cx="50" cy="60" r="33" fill={C.apple} />
      <ellipse cx="39" cy="49" rx="9" ry="6" fill={C.appleHi} />
    </g>
  )
}

function Star() {
  return (
    <path
      d="M50 14 L59 39 L85 40 L64 56 L72 81 L50 66 L28 81 L36 56 L15 40 L41 39 Z"
      fill={C.star}
      stroke={C.starEdge}
      strokeWidth="5"
      strokeLinejoin="round"
    />
  )
}

function Heart() {
  return <path d="M50 84 C 12 58 17 24 50 42 C 83 24 88 58 50 84 Z" fill={C.heart} />
}

function Flower() {
  const petals = [
    [50, 26],
    [71, 41],
    [63, 66],
    [37, 66],
    [29, 41],
  ]
  return (
    <g>
      <rect x="46" y="58" width="8" height="30" rx="4" fill={C.leaf} />
      {petals.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="15" fill={C.petal} />
      ))}
      <circle cx="50" cy="48" r="13" fill={C.petalCenter} />
    </g>
  )
}

function Leaf() {
  return (
    <g>
      <path d="M50 14 C 78 30 82 64 50 88 C 18 64 22 30 50 14 Z" fill={C.leaf} />
      <path d="M50 24 L50 80" stroke="#5B9157" strokeWidth="4" strokeLinecap="round" />
    </g>
  )
}

function Fish() {
  return (
    <g>
      <path d="M70 52 L94 34 L94 70 Z" fill={C.fishFin} />
      <ellipse cx="46" cy="52" rx="32" ry="23" fill={C.fish} />
      <path d="M40 30 Q48 18 58 32 Z" fill={C.fishFin} />
      <circle cx="30" cy="46" r="4.5" fill={C.eye} />
    </g>
  )
}

function Butterfly() {
  return (
    <g>
      <ellipse cx="33" cy="38" rx="19" ry="21" fill={C.wing} />
      <ellipse cx="67" cy="38" rx="19" ry="21" fill={C.wing} />
      <ellipse cx="35" cy="67" rx="14" ry="15" fill={C.wingDark} />
      <ellipse cx="65" cy="67" rx="14" ry="15" fill={C.wingDark} />
      <path d="M50 26 Q42 16 36 14" stroke={C.body} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M50 26 Q58 16 64 14" stroke={C.body} strokeWidth="4" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="52" rx="6" ry="26" fill={C.body} />
    </g>
  )
}

function Ball() {
  return (
    <g>
      <circle cx="50" cy="54" r="32" fill={C.ball} />
      <path d="M28 34 Q50 50 30 80" stroke={C.ballBand} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M58 26 Q66 54 56 82" stroke={C.ballBand} strokeWidth="9" fill="none" strokeLinecap="round" />
    </g>
  )
}

const ITEMS: Record<ItemKind, ComponentType> = {
  apple: Apple,
  star: Star,
  heart: Heart,
  flower: Flower,
  leaf: Leaf,
  fish: Fish,
  butterfly: Butterfly,
  ball: Ball,
}

/** A single find-an-item picture. */
export function ItemArt({ kind }: { kind: ItemKind }) {
  const Shape = ITEMS[kind]
  return (
    <svg
      viewBox="0 0 100 100"
      className="block h-full w-full"
      role="img"
      aria-label={ITEM_LABEL[kind]}
    >
      <Shape />
    </svg>
  )
}

/** The gentle burst shown when the right item is found. */
export function FindSparkle() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <path d="M50 12 L59 41 L88 50 L59 59 L50 88 L41 59 L12 50 L41 41 Z" fill={C.sparkle} />
      <circle cx="22" cy="24" r="6" fill={C.sparkle} />
      <circle cx="80" cy="28" r="5" fill={C.sparkle} />
      <circle cx="76" cy="78" r="6" fill={C.sparkle} />
    </svg>
  )
}

/** Home-screen tile artwork - a magnifying glass over a hidden star. */
export function FindTile() {
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full" role="img" aria-label="Suchen">
      <circle cx="26" cy="70" r="7" fill={C.heart} opacity="0.55" />
      <circle cx="74" cy="24" r="7" fill={C.petal} opacity="0.55" />
      <circle cx="40" cy="40" r="24" fill="#FBF7EC" stroke={C.body} strokeWidth="6" />
      <path
        d="M40 28 L44.5 38 L55 38.5 L46.5 45 L49.5 55 L40 49 L30.5 55 L33.5 45 L25 38.5 L35.5 38 Z"
        fill={C.star}
      />
      <path d="M57 57 L80 80" stroke={C.body} strokeWidth="11" strokeLinecap="round" />
    </svg>
  )
}
