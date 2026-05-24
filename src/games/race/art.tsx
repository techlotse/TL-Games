import type { ComponentType } from 'react'
import type { GoodKind, ObstacleKind } from './data'

const C = {
  carBody: '#D9614C',
  carDark: '#C24C3B',
  glass: '#C2E1EA',
  tyre: '#33302E',
  light: '#F4E08C',
  face: '#33302E',
  cheek: '#E2607A',
  cone: '#E8853A',
  coneBase: '#C76A2A',
  coneStripe: '#F2EAD9',
  bush: '#6FA86A',
  bushDark: '#5B9157',
  rock: '#AAB0B6',
  rockDark: '#8C9097',
  puddle: '#6E9FC4',
  puddleHi: '#9EC6DF',
  road: '#6E7378',
  roadLine: '#EAE6D8',
  star: '#F4C84E',
  starEdge: '#E0A93C',
  heart: '#E2607A',
  apple: '#D9514C',
  appleHi: '#E8857C',
  appleStem: '#6E4F2E',
  appleLeaf: '#6FA86A',
  sparkle: '#F6D45E',
}

/**
 * The player's car, seen from above. It has a friendly face on the bonnet;
 * `smile` (0-1) deepens the grin and brings out rosy cheeks as happy items
 * are collected.
 */
export function CarArt({ smile = 0 }: { smile?: number }) {
  const s = Math.max(0, Math.min(1, smile))
  const mouthDip = 4 + s * 15
  return (
    <svg viewBox="0 0 84 120" className="block h-auto w-full" role="img" aria-label="Auto">
      <rect x="0" y="24" width="14" height="26" rx="6" fill={C.tyre} />
      <rect x="70" y="24" width="14" height="26" rx="6" fill={C.tyre} />
      <rect x="0" y="72" width="14" height="26" rx="6" fill={C.tyre} />
      <rect x="70" y="72" width="14" height="26" rx="6" fill={C.tyre} />
      <rect x="10" y="4" width="64" height="112" rx="26" fill={C.carBody} />
      <rect x="16" y="64" width="52" height="42" rx="17" fill={C.carDark} />
      <path d="M22 92 Q42 100 62 92 L59 103 Q42 108 25 103 Z" fill={C.glass} />
      <circle cx="22" cy="14" r="6" fill={C.light} />
      <circle cx="62" cy="14" r="6" fill={C.light} />
      {/* Friendly face on the bonnet */}
      <circle cx="24" cy="50" r="4.4" fill={C.cheek} opacity={s} />
      <circle cx="60" cy="50" r="4.4" fill={C.cheek} opacity={s} />
      <circle cx="31" cy="40" r="7" fill="#FBF7EC" />
      <circle cx="53" cy="40" r="7" fill="#FBF7EC" />
      <circle cx="31" cy="41" r="3.6" fill={C.face} />
      <circle cx="53" cy="41" r="3.6" fill={C.face} />
      <path
        d={`M28 55 Q42 ${55 + mouthDip} 56 55`}
        stroke={C.face}
        strokeWidth="4.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* ------------------------------ Obstacles -------------------------------- */

function Cone() {
  return (
    <g>
      <rect x="22" y="74" width="56" height="16" rx="6" fill={C.coneBase} />
      <path d="M50 12 L75 78 L25 78 Z" fill={C.cone} />
      <path d="M39 42 L61 42 L65 56 L35 56 Z" fill={C.coneStripe} />
    </g>
  )
}

function Bush() {
  return (
    <g>
      <circle cx="34" cy="62" r="24" fill={C.bushDark} />
      <circle cx="66" cy="62" r="24" fill={C.bushDark} />
      <circle cx="50" cy="44" r="26" fill={C.bush} />
      <circle cx="40" cy="58" r="20" fill={C.bush} />
      <circle cx="62" cy="58" r="20" fill={C.bush} />
    </g>
  )
}

function Rock() {
  return (
    <g>
      <ellipse cx="42" cy="60" rx="32" ry="26" fill={C.rockDark} />
      <ellipse cx="62" cy="56" rx="27" ry="23" fill={C.rock} />
    </g>
  )
}

function Puddle() {
  return (
    <g>
      <ellipse cx="50" cy="56" rx="42" ry="26" fill={C.puddle} />
      <ellipse cx="40" cy="48" rx="16" ry="8" fill={C.puddleHi} />
    </g>
  )
}

const OBSTACLES: Record<ObstacleKind, ComponentType> = {
  cone: Cone,
  bush: Bush,
  rock: Rock,
  puddle: Puddle,
}

/** A single road obstacle to drive around. */
export function ObstacleArt({ kind }: { kind: ObstacleKind }) {
  const Shape = OBSTACLES[kind]
  return (
    <svg viewBox="0 0 100 100" className="block h-auto w-full" role="img" aria-label="Hindernis">
      <Shape />
    </svg>
  )
}

/* ----------------------------- Collectibles ------------------------------ */

function Star() {
  return (
    <path
      d="M50 16 L58.2 38.7 L82.3 39.5 L63.3 54.3 L70 77.5 L50 64 L30 77.5 L36.7 54.3 L17.7 39.5 L41.8 38.7 Z"
      fill={C.star}
      stroke={C.starEdge}
      strokeWidth="6"
      strokeLinejoin="round"
    />
  )
}

function Heart() {
  return <path d="M50 82 C 14 58 18 26 50 42 C 82 26 86 58 50 82 Z" fill={C.heart} />
}

function Apple() {
  return (
    <g>
      <path
        d="M40 26 Q44 12 58 12"
        stroke={C.appleStem}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx="61" cy="19" rx="13" ry="8" fill={C.appleLeaf} transform="rotate(-28 61 19)" />
      <circle cx="50" cy="58" r="33" fill={C.apple} />
      <ellipse cx="39" cy="47" rx="9" ry="6" fill={C.appleHi} />
    </g>
  )
}

const GOODS: Record<GoodKind, ComponentType> = {
  star: Star,
  heart: Heart,
  apple: Apple,
}

/** A cheerful collectible to drive into. */
export function GoodArt({ kind }: { kind: GoodKind }) {
  const Shape = GOODS[kind]
  return (
    <svg viewBox="0 0 100 100" className="block h-auto w-full" role="img" aria-label="Belohnung">
      <Shape />
    </svg>
  )
}

/** The happy burst shown when a collectible is gathered. */
export function SparkleArt() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <path d="M50 12 L59 41 L88 50 L59 59 L50 88 L41 59 L12 50 L41 41 Z" fill={C.sparkle} />
      <circle cx="22" cy="24" r="6" fill={C.sparkle} />
      <circle cx="80" cy="28" r="5" fill={C.sparkle} />
      <circle cx="76" cy="78" r="6" fill={C.sparkle} />
      <circle cx="24" cy="76" r="5" fill={C.sparkle} />
    </svg>
  )
}

/** Home-screen tile artwork - a little car on a piece of road. */
export function RaceTile() {
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full" role="img" aria-label="Rennen">
      <rect x="8" y="6" width="80" height="84" rx="18" fill={C.road} />
      <rect x="14" y="6" width="6" height="84" fill={C.roadLine} opacity="0.5" />
      <rect x="76" y="6" width="6" height="84" fill={C.roadLine} opacity="0.5" />
      <rect x="45" y="12" width="6" height="18" rx="3" fill={C.roadLine} />
      <rect x="45" y="40" width="6" height="18" rx="3" fill={C.roadLine} />
      <rect x="45" y="68" width="6" height="18" rx="3" fill={C.roadLine} />
      <g transform="translate(31 34)">
        <rect x="-7" y="8" width="9" height="15" rx="4" fill={C.tyre} />
        <rect x="32" y="8" width="9" height="15" rx="4" fill={C.tyre} />
        <rect x="-7" y="34" width="9" height="15" rx="4" fill={C.tyre} />
        <rect x="32" y="34" width="9" height="15" rx="4" fill={C.tyre} />
        <rect x="2" y="2" width="30" height="54" rx="13" fill={C.carBody} />
        <circle cx="12" cy="20" r="4" fill="#FBF7EC" />
        <circle cx="22" cy="20" r="4" fill="#FBF7EC" />
        <path d="M10 30 Q17 36 24 30" stroke={C.face} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}
