import type { ComponentType } from 'react'
import type { CoverKind, CreatureKind } from './data'

const C = {
  leaf: '#7BB36B',
  bushDark: '#5E9B57',
  petalPink: '#E48AA6',
  petalYellow: '#EBC255',
  flowerCenter: '#F4E08C',
  logBody: '#A0744B',
  logRing: '#7C5839',
  capRed: '#D7706A',
  mushStem: '#F0E6D0',
  mushDot: '#F8F1E2',
  rock: '#AAB0B6',
  rockDark: '#8E949B',
  bodyDark: '#4A3F36',
  red: '#D75B57',
  black: '#3A332E',
  beeYellow: '#EAC24E',
  wing: '#E7F0F4',
  shell: '#CC9259',
  shellDark: '#A06B3C',
  snailBody: '#A6B894',
  chick: '#EFC850',
  chickWing: '#D8AE3E',
  beak: '#E0883B',
}

function Bloom({ cx, cy, color }: { cx: number; cy: number; color: string }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx={cx}
          cy={cy - 9}
          rx="6"
          ry="9"
          fill={color}
          transform={`rotate(${a} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r="6" fill={C.flowerCenter} />
    </g>
  )
}

function Bush() {
  return (
    <g>
      <circle cx="33" cy="66" r="25" fill={C.bushDark} />
      <circle cx="67" cy="66" r="25" fill={C.bushDark} />
      <circle cx="50" cy="46" r="28" fill={C.leaf} />
      <circle cx="38" cy="60" r="21" fill={C.leaf} />
      <circle cx="63" cy="60" r="21" fill={C.leaf} />
    </g>
  )
}

function Leaf() {
  return (
    <g>
      <ellipse cx="37" cy="62" rx="30" ry="17" fill={C.bushDark} transform="rotate(-22 37 62)" />
      <ellipse cx="65" cy="59" rx="30" ry="17" fill={C.leaf} transform="rotate(22 65 59)" />
      <ellipse cx="50" cy="45" rx="29" ry="16" fill={C.leaf} transform="rotate(-5 50 45)" />
    </g>
  )
}

function Flower() {
  return (
    <g>
      <circle cx="50" cy="72" r="24" fill={C.bushDark} />
      <Bloom cx={37} cy={48} color={C.petalPink} />
      <Bloom cx={65} cy={54} color={C.petalYellow} />
      <Bloom cx={50} cy={66} color={C.petalPink} />
    </g>
  )
}

function Log() {
  return (
    <g>
      <rect x="10" y="40" width="80" height="36" rx="18" fill={C.logBody} />
      <ellipse cx="29" cy="58" rx="12" ry="15" fill={C.logRing} />
      <ellipse cx="29" cy="58" rx="5" ry="7" fill={C.logBody} />
    </g>
  )
}

function Mushroom() {
  return (
    <g>
      <rect x="40" y="52" width="20" height="34" rx="9" fill={C.mushStem} />
      <path d="M14 58 Q14 22 50 22 Q86 22 86 58 Z" fill={C.capRed} />
      <circle cx="37" cy="44" r="6" fill={C.mushDot} />
      <circle cx="61" cy="49" r="5" fill={C.mushDot} />
      <circle cx="56" cy="34" r="4" fill={C.mushDot} />
    </g>
  )
}

function Rock() {
  return (
    <g>
      <ellipse cx="42" cy="62" rx="31" ry="25" fill={C.rockDark} />
      <ellipse cx="63" cy="58" rx="26" ry="22" fill={C.rock} />
    </g>
  )
}

function Butterfly() {
  return (
    <g>
      <ellipse cx="36" cy="40" rx="21" ry="17" fill={C.petalPink} />
      <ellipse cx="64" cy="40" rx="21" ry="17" fill={C.petalPink} />
      <ellipse cx="39" cy="67" rx="16" ry="13" fill={C.petalYellow} />
      <ellipse cx="61" cy="67" rx="16" ry="13" fill={C.petalYellow} />
      <rect x="46" y="30" width="8" height="46" rx="4" fill={C.bodyDark} />
      <circle cx="50" cy="28" r="6" fill={C.bodyDark} />
      <path d="M50 24 Q42 11 35 12" stroke={C.bodyDark} strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <path d="M50 24 Q58 11 65 12" stroke={C.bodyDark} strokeWidth="3.4" fill="none" strokeLinecap="round" />
    </g>
  )
}

function Ladybug() {
  return (
    <g>
      <circle cx="50" cy="30" r="11" fill={C.black} />
      <circle cx="51" cy="56" r="30" fill={C.red} />
      <rect x="48" y="28" width="6" height="56" rx="3" fill={C.black} />
      <circle cx="37" cy="50" r="5" fill={C.black} />
      <circle cx="65" cy="50" r="5" fill={C.black} />
      <circle cx="41" cy="69" r="5" fill={C.black} />
      <circle cx="61" cy="69" r="5" fill={C.black} />
    </g>
  )
}

function Bee() {
  return (
    <g>
      <ellipse cx="38" cy="38" rx="15" ry="11" fill={C.wing} />
      <ellipse cx="62" cy="38" rx="15" ry="11" fill={C.wing} />
      <ellipse cx="52" cy="58" rx="28" ry="22" fill={C.beeYellow} />
      <ellipse cx="52" cy="51" rx="26" ry="6" fill={C.black} />
      <ellipse cx="52" cy="68" rx="21" ry="6" fill={C.black} />
      <circle cx="52" cy="34" r="9" fill={C.black} />
    </g>
  )
}

function Snail() {
  return (
    <g>
      <path d="M18 74 Q18 54 46 54 L72 54 Q84 54 84 64 Q84 74 72 74 Z" fill={C.snailBody} />
      <line x1="80" y1="58" x2="87" y2="38" stroke={C.snailBody} strokeWidth="7" strokeLinecap="round" />
      <circle cx="87" cy="36" r="6" fill={C.snailBody} />
      <circle cx="87" cy="36" r="2.6" fill={C.bodyDark} />
      <circle cx="44" cy="48" r="27" fill={C.shellDark} />
      <circle cx="44" cy="48" r="19" fill={C.shell} />
      <circle cx="44" cy="48" r="11" fill={C.shellDark} />
      <circle cx="44" cy="48" r="4" fill={C.shell} />
    </g>
  )
}

function Chick() {
  return (
    <g>
      <ellipse cx="50" cy="62" rx="28" ry="25" fill={C.chick} />
      <circle cx="50" cy="34" r="20" fill={C.chick} />
      <path d="M64 33 L84 29 L66 43 Z" fill={C.beak} />
      <circle cx="44" cy="31" r="3.6" fill={C.bodyDark} />
      <circle cx="57" cy="31" r="3.6" fill={C.bodyDark} />
      <path d="M26 64 Q40 80 54 66" fill="none" stroke={C.chickWing} strokeWidth="5" strokeLinecap="round" />
    </g>
  )
}

const COVERS: Record<CoverKind, ComponentType> = {
  bush: Bush,
  leaf: Leaf,
  flower: Flower,
  log: Log,
  mushroom: Mushroom,
  rock: Rock,
}

const CREATURES: Record<CreatureKind, ComponentType> = {
  butterfly: Butterfly,
  ladybug: Ladybug,
  bee: Bee,
  snail: Snail,
  chick: Chick,
}

/** A hiding spot - a bush, leaf pile, flower, log, mushroom or rock. */
export function CoverArt({ kind }: { kind: CoverKind }) {
  const Shape = COVERS[kind]
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Versteck">
      <Shape />
    </svg>
  )
}

/** A garden creature, revealed when its spot is found. */
export function CreatureArt({ kind }: { kind: CreatureKind }) {
  const Shape = CREATURES[kind]
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Tier">
      <Shape />
    </svg>
  )
}

/** Home-screen tile artwork - a bush with a butterfly. */
export function GardenTile() {
  return (
    <svg viewBox="0 0 100 96" className="h-full w-full" role="img" aria-label="Blumengarten">
      <circle cx="32" cy="76" r="22" fill={C.bushDark} />
      <circle cx="66" cy="76" r="22" fill={C.bushDark} />
      <circle cx="49" cy="60" r="25" fill={C.leaf} />
      <Bloom cx={70} cy={48} color={C.petalYellow} />
      <g>
        <ellipse cx="28" cy="26" rx="14" ry="11" fill={C.petalPink} />
        <ellipse cx="48" cy="26" rx="14" ry="11" fill={C.petalPink} />
        <rect x="35" y="18" width="6" height="30" rx="3" fill={C.bodyDark} />
      </g>
    </svg>
  )
}
