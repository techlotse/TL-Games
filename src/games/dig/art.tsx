import type { Rect } from './data'

/** Bagger artwork palette (literal hex - this is game content). */
export const DC = {
  body: '#E8913C',
  bodyDark: '#CF7A2A',
  cab: '#F2C94C',
  glass: '#BFE0E8',
  track: '#3C3835',
  hub: '#C7CDD2',
  metal: '#AAB2B8',
  metalDark: '#7C858C',
  face: '#33302E',
  grass: '#73B05A',
  grassDark: '#5E9748',
  dirt: '#B98A55',
  dirtDark: '#9A6E3F',
  depot: '#CE9466',
  depotRoof: '#B0563F',
  gem: '#3FB6C6',
  gemMid: '#7FD8E2',
  gemHi: '#B4ECF2',
  hill: '#9AC97D',
  hillFar: '#B7D89E',
  cloud: '#FCFAF1',
  crane: '#CFC09A',
  craneArm: '#D89A3C',
  spark: '#F6D45E',
}

/**
 * The excavator hero. Drawn in local coords - the 40 x 44 collision box has
 * its top-left at (0,0); the bucket reaches a little beyond the box.
 */
export function Excavator() {
  return (
    <g>
      <ellipse cx="20" cy="44" rx="21" ry="3.6" fill="#000000" opacity="0.12" />
      {/* tracks */}
      <rect x="-3" y="29" width="46" height="15" rx="7.5" fill={DC.track} />
      <circle cx="3" cy="36.5" r="3.4" fill={DC.hub} />
      <circle cx="14" cy="36.5" r="3.4" fill={DC.hub} />
      <circle cx="26" cy="36.5" r="3.4" fill={DC.hub} />
      <circle cx="37" cy="36.5" r="3.4" fill={DC.hub} />
      {/* boom + bucket */}
      <path d="M31 16 L49 29" stroke={DC.bodyDark} strokeWidth="6" strokeLinecap="round" fill="none" />
      <path
        d="M44 27 L61 29 L58 41 Q50 45 44 38 Z"
        fill={DC.metal}
        stroke={DC.metalDark}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* body */}
      <rect x="1" y="13" width="33" height="19" rx="6" fill={DC.body} />
      <rect x="1" y="26" width="33" height="6.5" rx="3" fill={DC.bodyDark} />
      {/* cab */}
      <rect x="2" y="-1" width="20" height="17" rx="5" fill={DC.cab} />
      <rect x="5" y="2.5" width="11" height="9" rx="2.5" fill={DC.glass} />
      {/* friendly face */}
      <circle cx="24" cy="20" r="3.2" fill="#FFFFFF" />
      <circle cx="31" cy="20" r="3.2" fill="#FFFFFF" />
      <circle cx="24.7" cy="20.4" r="1.7" fill={DC.face} />
      <circle cx="31.7" cy="20.4" r="1.7" fill={DC.face} />
      <path
        d="M23 25 Q27.5 29 32 25"
        stroke={DC.face}
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  )
}

/** A small puff of dust kicked up while driving. */
export function DustPuff() {
  return (
    <g opacity="0.55">
      <circle cx="0" cy="0" r="5" fill="#E8E1CF" />
      <circle cx="7" cy="2" r="4" fill="#E8E1CF" />
      <circle cx="-6" cy="2" r="3.4" fill="#E8E1CF" />
    </g>
  )
}

/** A grassy earth platform / piece of ground, drawn at its world rect. */
export function PlatformRect({ rect: r }: { rect: Rect }) {
  return (
    <g>
      <rect x={r.x} y={r.y + 6} width={r.w} height={r.h - 6} rx="9" fill={DC.dirt} />
      <rect x={r.x + 5} y={r.y + r.h - 12} width={r.w - 10} height={7} rx="3.5" fill={DC.dirtDark} />
      <rect x={r.x} y={r.y} width={r.w} height={15} rx="8" fill={DC.grass} />
      <rect x={r.x} y={r.y + 9} width={r.w} height={6} fill={DC.grass} />
      <circle cx={r.x + r.w * 0.32} cy={r.y + r.h * 0.6} r="3.4" fill={DC.dirtDark} />
      <circle cx={r.x + r.w * 0.7} cy={r.y + r.h * 0.72} r="2.6" fill={DC.dirtDark} />
    </g>
  )
}

/** A springy bounce pad - landing on it launches the excavator high. */
export function BouncePad({ rect: r }: { rect: Rect }) {
  return (
    <g>
      <rect x={r.x + r.w * 0.3} y={r.y + 9} width={r.w * 0.4} height={r.h} fill={DC.metalDark} />
      <rect x={r.x} y={r.y} width={r.w} height="14" rx="7" fill="#E0584C" />
      <rect x={r.x + 5} y={r.y + 3} width={r.w - 10} height="4.5" rx="2.2" fill="#F1897E" />
    </g>
  )
}

/** A gem to dig up. Drawn centred on (0,0). */
export function Gem() {
  return (
    <g>
      <ellipse cx="0" cy="2" rx="15" ry="15" fill={DC.gemMid} opacity="0.28" />
      <path d="M0 -15 L12 -4 L0 18 L-12 -4 Z" fill={DC.gem} />
      <path d="M0 -15 L12 -4 L0 2 L-12 -4 Z" fill={DC.gemMid} />
      <path d="M0 -15 L0 2 L-12 -4 Z" fill={DC.gemHi} />
    </g>
  )
}

/** A small gem icon for the collected-gems row. */
export function GemIcon() {
  return (
    <svg viewBox="-16 -18 32 38" className="h-full w-full" aria-hidden>
      <path d="M0 -15 L12 -4 L0 18 L-12 -4 Z" fill={DC.gem} />
      <path d="M0 -15 L12 -4 L0 2 L-12 -4 Z" fill={DC.gemMid} />
      <path d="M0 -15 L0 2 L-12 -4 Z" fill={DC.gemHi} />
    </svg>
  )
}

/** A happy collect burst. Drawn centred on (0,0). */
export function Sparkle() {
  return (
    <g>
      <path d="M0 -16 L4 -4 L16 0 L4 4 L0 16 L-4 4 L-16 0 L-4 -4 Z" fill={DC.spark} />
      <circle cx="-12" cy="-11" r="2.6" fill={DC.spark} />
      <circle cx="12" cy="-10" r="2.2" fill={DC.spark} />
      <circle cx="11" cy="12" r="2.4" fill={DC.spark} />
    </g>
  )
}

/** A small friendly truck - a depot friend. Drawn with wheels resting on y=0. */
function FriendTruck() {
  return (
    <g>
      <ellipse cx="22" cy="1" rx="24" ry="3.4" fill="#000000" opacity="0.12" />
      <rect x="2" y="-20" width="26" height="16" rx="4" fill="#6FA1CF" />
      <rect x="28" y="-26" width="16" height="22" rx="4" fill="#5B8FBE" />
      <rect x="31" y="-22" width="10" height="9" rx="2" fill={DC.glass} />
      <circle cx="11" cy="-1" r="6" fill={DC.track} />
      <circle cx="11" cy="-1" r="2.4" fill={DC.hub} />
      <circle cx="35" cy="-1" r="6" fill={DC.track} />
      <circle cx="35" cy="-1" r="2.4" fill={DC.hub} />
      <circle cx="33" cy="-15" r="2.1" fill={DC.face} />
      <circle cx="40" cy="-15" r="2.1" fill={DC.face} />
      <path d="M32 -10 Q36 -7 40 -10" stroke={DC.face} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  )
}

/** The goal depot - the excavator's home, with a flag and a waiting friend. */
export function Depot() {
  return (
    <g>
      <ellipse cx="58" cy="2" rx="86" ry="6" fill="#000000" opacity="0.1" />
      {/* building */}
      <rect x="0" y="-96" width="118" height="96" rx="9" fill={DC.depot} />
      <path d="M-10 -94 L59 -134 L128 -94 Z" fill={DC.depotRoof} strokeLinejoin="round" />
      {/* open garage door */}
      <rect x="13" y="-70" width="60" height="70" rx="7" fill="#403A36" />
      <rect x="18" y="-65" width="50" height="62" rx="4" fill="#544C46" />
      {/* round window */}
      <circle cx="92" cy="-58" r="13" fill={DC.glass} />
      <circle cx="92" cy="-58" r="13" fill="none" stroke={DC.depotRoof} strokeWidth="3" />
      {/* flag */}
      <rect x="56" y="-170" width="5" height="40" rx="2.5" fill={DC.metalDark} />
      <path d="M61 -168 L92 -159 L61 -150 Z" fill="#E0584C" />
      {/* a friend waiting outside */}
      <g transform="translate(86 0)">
        <FriendTruck />
      </g>
    </g>
  )
}

/** A soft background hill. Drawn with its base on y=0. */
export function Hill({ w = 240, h = 130, far = false }: { w?: number; h?: number; far?: boolean }) {
  return (
    <path
      d={`M${-w / 2} 0 Q${-w / 4} ${-h} 0 ${-h} Q${w / 4} ${-h} ${w / 2} 0 Z`}
      fill={far ? DC.hillFar : DC.hill}
    />
  )
}

/** A fluffy cloud, drawn centred on (0,0). */
export function Cloud() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="26" ry="17" fill={DC.cloud} />
      <circle cx="-18" cy="3" r="13" fill={DC.cloud} />
      <circle cx="17" cy="4" r="15" fill={DC.cloud} />
      <circle cx="-2" cy="-11" r="15" fill={DC.cloud} />
    </g>
  )
}

/** A distant construction crane. Drawn with its base on y=0. */
export function Crane() {
  return (
    <g opacity="0.7">
      <rect x="-6" y="-150" width="12" height="150" fill={DC.crane} />
      <rect x="-40" y="-164" width="116" height="11" rx="3" fill={DC.craneArm} />
      <rect x="-44" y="-158" width="14" height="34" rx="3" fill={DC.craneArm} />
      <path d="M58 -153 L58 -136 M52 -136 L64 -136" stroke={DC.crane} strokeWidth="3" />
    </g>
  )
}

/** A round sun for the background. Drawn centred on (0,0). */
export function Sun() {
  return (
    <g opacity="0.9">
      <circle cx="0" cy="0" r="30" fill="#F7D86A" />
      <circle cx="0" cy="0" r="22" fill="#FBE48E" />
    </g>
  )
}

/** Home-screen tile artwork - the excavator on a sunny hill with a gem. */
export function DigTile() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Bagger">
      <rect x="0" y="0" width="100" height="100" rx="14" fill="#BFE3F0" />
      <circle cx="78" cy="22" r="11" fill="#FBE48E" />
      <ellipse cx="30" cy="24" rx="15" ry="9" fill={DC.cloud} />
      <path d="M0 74 Q26 52 54 70 Q78 84 100 66 L100 100 L0 100 Z" fill={DC.grass} />
      <g transform="translate(60 38) scale(0.9)">
        <path d="M0 -15 L9 -5 L0 14 L-9 -5 Z" fill={DC.gem} />
        <path d="M0 -15 L9 -5 L0 0 L-9 -5 Z" fill={DC.gemHi} />
      </g>
      <g transform="translate(16 50) scale(0.92)">
        <Excavator />
      </g>
    </svg>
  )
}
