import { motion } from 'framer-motion'
import type { Rect } from './data'

/** Bagger artwork palette (literal hex - this is game content). */
export const DC = {
  track: '#34302D',
  trackHi: '#4A443F',
  hub: '#C7CDD2',
  hubDark: '#8A9097',
  metal: '#AEB6BC',
  metalDark: '#7C858C',
  face: '#33302E',
  cheek: '#E98C8C',
  glass: '#CFEAF2',
  bodyHi: '#FBC079',
  grassBlade: '#5E9748',
  dirtDark: '#8E5F38',
  pebble: '#7A5436',
  flowerPink: '#E58FB0',
  flowerYellow: '#F2C94C',
  bounce: '#E0584C',
  bounceHi: '#F1897E',
  gemEdge: '#2A8FA0',
  gemShine: '#EAFBFD',
  depotRoof: '#B0563F',
  depotDoor: '#403A36',
  trunk: '#8A5A38',
  leaf: '#74AC5C',
  leafDark: '#5E9748',
  bird: '#6B6F77',
  cloud: '#FCFAF1',
  craneArm: '#D89A3C',
  craneTower: '#CFC09A',
  spark: '#F6D45E',
}

/** Shared gradient definitions. Drop one <DigDefs/> into every <svg>. */
export function DigDefs() {
  return (
    <defs>
      <linearGradient id="dg-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F4AC5C" />
        <stop offset="1" stopColor="#D9762A" />
      </linearGradient>
      <linearGradient id="dg-cab" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F8DA72" />
        <stop offset="1" stopColor="#E3AE3A" />
      </linearGradient>
      <linearGradient id="dg-track" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4A443F" />
        <stop offset="1" stopColor="#2C2825" />
      </linearGradient>
      <linearGradient id="dg-gem" x1="0.15" y1="0" x2="0.6" y2="1">
        <stop offset="0" stopColor="#AEEDF3" />
        <stop offset="1" stopColor="#2BA3B8" />
      </linearGradient>
      <linearGradient id="dg-grass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8AC96D" />
        <stop offset="1" stopColor="#669F4F" />
      </linearGradient>
      <linearGradient id="dg-dirt" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C49058" />
        <stop offset="1" stopColor="#8C5C36" />
      </linearGradient>
      <linearGradient id="dg-hill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#A8D389" />
        <stop offset="1" stopColor="#80B466" />
      </linearGradient>
      <linearGradient id="dg-hill-far" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C6E0B0" />
        <stop offset="1" stopColor="#A9CE92" />
      </linearGradient>
      <linearGradient id="dg-depot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#DCA378" />
        <stop offset="1" stopColor="#BC8254" />
      </linearGradient>
      <radialGradient id="dg-sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0.4" stopColor="#FCE6A4" stopOpacity="0.9" />
        <stop offset="1" stopColor="#FCE6A4" stopOpacity="0" />
      </radialGradient>
    </defs>
  )
}

/**
 * The excavator hero. Drawn in local coords - the 40 x 44 collision box has
 * its top-left at (0,0); the bucket reaches a little beyond the box.
 */
export function Excavator() {
  return (
    <g>
      <ellipse cx="20" cy="44" rx="22" ry="3.8" fill="#000000" opacity="0.14" />
      {/* tracks */}
      <rect x="-3" y="29" width="46" height="15" rx="7.5" fill="url(#dg-track)" />
      <rect x="-3" y="39" width="46" height="3" rx="1.5" fill={DC.track} />
      {[2, 13, 24, 35].map((x) => (
        <rect key={x} x={x} y="40.5" width="4" height="2.4" rx="1" fill={DC.trackHi} />
      ))}
      {[3, 14, 26, 37].map((x) => (
        <g key={x}>
          <circle cx={x} cy="35" r="4" fill={DC.hub} />
          <circle cx={x} cy="35" r="1.8" fill={DC.hubDark} />
        </g>
      ))}
      {/* boom + bucket — gentle idle bob */}
      <motion.g
        animate={{ rotate: [0, 3, 0, -2, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.2 }}
        style={{ originX: '30px', originY: '16px' }}
      >
        <path d="M30 16 L50 30" stroke="#C8722B" strokeWidth="6.5" strokeLinecap="round" />
        <path
          d="M44 26 L62 28 L59 41 Q50 46 44 38 Z"
          fill={DC.metal}
          stroke={DC.metalDark}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        {[47, 52, 57].map((x) => (
          <path key={x} d={`M${x} 40 L${x + 3.4} 40 L${x + 1.7} 45 Z`} fill={DC.metalDark} />
        ))}
      </motion.g>
      {/* body */}
      <rect x="1" y="13" width="33" height="19" rx="6.5" fill="url(#dg-body)" />
      <rect x="4" y="15.5" width="22" height="5" rx="2.5" fill={DC.bodyHi} opacity="0.7" />
      <rect x="1" y="27" width="33" height="5.5" rx="2.7" fill="#C8722B" />
      {/* little exhaust */}
      <rect x="6" y="6" width="5" height="9" rx="2.4" fill={DC.metalDark} />
      {/* cab */}
      <rect x="13" y="-1" width="20" height="17" rx="5" fill="url(#dg-cab)" />
      <rect x="16" y="2.5" width="11" height="9" rx="2.5" fill={DC.glass} />
      <path d="M16 4 L21 2.5 L19 11.5 L16 11.5 Z" fill="#FFFFFF" opacity="0.5" />
      {/* friendly face */}
      <circle cx="23" cy="22" r="3.3" fill="#FFFFFF" />
      <circle cx="31" cy="22" r="3.3" fill="#FFFFFF" />
      <circle cx="23.8" cy="22.4" r="1.8" fill={DC.face} />
      <circle cx="31.8" cy="22.4" r="1.8" fill={DC.face} />
      <ellipse cx="19" cy="26" rx="2.8" ry="2" fill={DC.cheek} opacity="0.7" />
      <ellipse cx="34.5" cy="26" rx="2.8" ry="2" fill={DC.cheek} opacity="0.7" />
      <path
        d="M22 27 Q27.5 31.5 33 27"
        stroke={DC.face}
        strokeWidth="2.3"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  )
}

/** A small puff of dust kicked up while driving. */
export function DustPuff() {
  return (
    <g opacity="0.5">
      <circle cx="0" cy="0" r="5" fill="#EBE4D2" />
      <circle cx="7" cy="2" r="4" fill="#EBE4D2" />
      <circle cx="-6" cy="2" r="3.4" fill="#EBE4D2" />
    </g>
  )
}

/** A grassy earth platform / piece of ground, drawn at its world rect. */
export function PlatformRect({ rect: r }: { rect: Rect }) {
  // Varied blade spacing: alternate 18px and 26px gaps for a natural look
  const blades: { x: number; lean: number; h: number }[] = []
  let bx = r.x + 10
  let toggle = false
  while (bx < r.x + r.w - 8) {
    blades.push({ x: bx, lean: toggle ? 3 : -3, h: toggle ? 9 : 11 })
    bx += toggle ? 18 : 26
    toggle = !toggle
  }
  return (
    <g>
      <rect x={r.x} y={r.y + 7} width={r.w} height={r.h - 7} rx="9" fill="url(#dg-dirt)" />
      <rect x={r.x + 6} y={r.y + r.h - 13} width={r.w - 12} height="7" rx="3.5" fill={DC.dirtDark} />
      <circle cx={r.x + r.w * 0.3} cy={r.y + r.h * 0.58} r="3.4" fill={DC.pebble} />
      <circle cx={r.x + r.w * 0.72} cy={r.y + r.h * 0.7} r="2.6" fill={DC.pebble} />
      <rect x={r.x} y={r.y} width={r.w} height="16" rx="8" fill="url(#dg-grass)" />
      <rect x={r.x} y={r.y + 10} width={r.w} height="6" fill="#669F4F" />
      {blades.map(({ x, lean, h }, i) => (
        <path
          key={i}
          d={`M${x} ${r.y + 2} q ${lean} -${h} ${lean > 0 ? 1 : -1} -${h + 2} q ${-lean * 0.7} ${h * 0.5} ${lean > 0 ? -3 : 3} ${h + 2} Z`}
          fill={DC.grassBlade}
        />
      ))}
      {r.w > 150 && (
        <g transform={`translate(${r.x + r.w * 0.5} ${r.y - 4})`}>
          <circle cx="0" cy="0" r="3.4" fill={DC.flowerPink} />
          <circle cx="6" cy="2" r="3.4" fill={DC.flowerPink} />
          <circle cx="-6" cy="2" r="3.4" fill={DC.flowerPink} />
          <circle cx="0" cy="6" r="3.4" fill={DC.flowerPink} />
          <circle cx="0" cy="3" r="2.6" fill={DC.flowerYellow} />
        </g>
      )}
    </g>
  )
}

/** A springy bounce pad - landing on it launches the excavator high. */
export function BouncePad({ rect: r }: { rect: Rect }) {
  return (
    <g>
      <path
        d={`M${r.x + r.w * 0.32} ${r.y + 11} L${r.x + r.w * 0.68} ${r.y + 11} L${
          r.x + r.w * 0.6
        } ${r.y + r.h} L${r.x + r.w * 0.4} ${r.y + r.h} Z`}
        fill={DC.metalDark}
      />
      <rect x={r.x} y={r.y} width={r.w} height="15" rx="7.5" fill={DC.bounce} />
      <rect x={r.x + 5} y={r.y + 3} width={r.w - 10} height="5" rx="2.5" fill={DC.bounceHi} />
    </g>
  )
}

/** A gem to dig up. Drawn centred on (0,0). */
export function Gem() {
  return (
    <g>
      <circle cx="0" cy="2" r="17" fill="#7FD8E2" opacity="0.3" />
      <path
        d="M0 -16 L13 -4 L0 19 L-13 -4 Z"
        fill="url(#dg-gem)"
        stroke={DC.gemEdge}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M0 -16 L13 -4 L0 1 L-13 -4 Z" fill="#FFFFFF" opacity="0.34" />
      <path d="M-5 -8 L-1 -4 L-3 4 Z" fill={DC.gemShine} opacity="0.85" />
    </g>
  )
}

/** A small gem icon for the collected-gems row. */
export function GemIcon() {
  return (
    <svg viewBox="-17 -19 34 40" className="h-full w-full" aria-hidden>
      <DigDefs />
      <path d="M0 -16 L13 -4 L0 19 L-13 -4 Z" fill="url(#dg-gem)" />
      <path d="M0 -16 L13 -4 L0 1 L-13 -4 Z" fill="#FFFFFF" opacity="0.34" />
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

/** A small friendly truck - a depot friend. Wheels rest on y=0. */
function FriendTruck() {
  return (
    <g>
      <ellipse cx="22" cy="1" rx="25" ry="3.4" fill="#000000" opacity="0.13" />
      <rect x="2" y="-21" width="27" height="17" rx="4" fill="#6FA1CF" />
      <rect x="29" y="-27" width="16" height="23" rx="4" fill="#5B8FBE" />
      <rect x="32" y="-23" width="10" height="9" rx="2" fill={DC.glass} />
      <circle cx="11" cy="-1" r="6" fill={DC.track} />
      <circle cx="11" cy="-1" r="2.4" fill={DC.hub} />
      <circle cx="36" cy="-1" r="6" fill={DC.track} />
      <circle cx="36" cy="-1" r="2.4" fill={DC.hub} />
      <circle cx="34" cy="-16" r="2.1" fill={DC.face} />
      <circle cx="41" cy="-16" r="2.1" fill={DC.face} />
      <path d="M33 -11 Q37.5 -8 42 -11" stroke={DC.face} strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </g>
  )
}

/** The goal depot - the excavator's home, with a flag and a waiting friend. */
export function Depot() {
  return (
    <g>
      <ellipse cx="58" cy="2" rx="92" ry="6" fill="#000000" opacity="0.12" />
      <rect x="0" y="-98" width="118" height="98" rx="9" fill="url(#dg-depot)" />
      <path d="M-12 -96 L59 -138 L130 -96 Z" fill={DC.depotRoof} strokeLinejoin="round" />
      <path d="M-12 -96 L59 -138 L59 -126 L4 -96 Z" fill="#C56A50" />
      <rect x="13" y="-72" width="60" height="72" rx="7" fill={DC.depotDoor} />
      <rect x="18" y="-67" width="50" height="64" rx="4" fill="#544C46" />
      <circle cx="92" cy="-60" r="14" fill={DC.glass} />
      <circle cx="92" cy="-60" r="14" fill="none" stroke={DC.depotRoof} strokeWidth="3.4" />
      <path d="M85 -68 L99 -52 M99 -68 L85 -52" stroke={DC.depotRoof} strokeWidth="2.4" />
      <rect x="56" y="-174" width="5" height="40" rx="2.5" fill={DC.metalDark} />
      <path d="M61 -172 L94 -163 L61 -154 Z" fill="#E0584C" />
      <g transform="translate(88 0)">
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
      fill={far ? 'url(#dg-hill-far)' : 'url(#dg-hill)'}
    />
  )
}

/** A fluffy cloud, drawn centred on (0,0). */
export function Cloud() {
  return (
    <g>
      <ellipse cx="0" cy="3" rx="28" ry="16" fill={DC.cloud} />
      <circle cx="-19" cy="2" r="13" fill={DC.cloud} />
      <circle cx="18" cy="3" r="15" fill={DC.cloud} />
      <circle cx="-2" cy="-12" r="16" fill={DC.cloud} />
      <circle cx="-8" cy="-4" r="11" fill="#FFFFFF" opacity="0.7" />
    </g>
  )
}

/** A leafy tree. Drawn with its base on y=0. */
export function Tree() {
  return (
    <g>
      <rect x="-7" y="-44" width="14" height="46" rx="5" fill={DC.trunk} />
      <circle cx="0" cy="-66" r="30" fill={DC.leafDark} />
      <circle cx="-20" cy="-52" r="22" fill={DC.leaf} />
      <circle cx="20" cy="-54" r="23" fill={DC.leaf} />
      <circle cx="2" cy="-74" r="22" fill={DC.leaf} />
    </g>
  )
}

/** A small bird, drawn centred on (0,0). */
export function Bird() {
  return (
    <path
      d="M-11 0 Q-5 -8 0 0 Q5 -8 11 0"
      stroke={DC.bird}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
    />
  )
}

/** A distant construction crane. Drawn with its base on y=0. */
export function Crane() {
  return (
    <g opacity="0.78">
      <rect x="-6" y="-150" width="12" height="150" fill={DC.craneTower} />
      <rect x="-40" y="-164" width="116" height="11" rx="3" fill={DC.craneArm} />
      <rect x="-44" y="-158" width="14" height="34" rx="3" fill={DC.craneArm} />
      <path d="M58 -153 L58 -136 M52 -136 L64 -136" stroke={DC.craneTower} strokeWidth="3" />
    </g>
  )
}

/** A glowing sun. Drawn centred on (0,0). */
export function Sun() {
  return (
    <g>
      <circle cx="0" cy="0" r="58" fill="url(#dg-sun)" />
      <circle cx="0" cy="0" r="28" fill="#F8D662" />
      <circle cx="0" cy="0" r="21" fill="#FBE48E" />
    </g>
  )
}

/** Home-screen tile artwork - the excavator on a sunny hill with a gem. */
export function DigTile() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" role="img" aria-label="Bagger">
      <DigDefs />
      <rect x="0" y="0" width="100" height="100" rx="14" fill="#BFE3F0" />
      <circle cx="79" cy="22" r="20" fill="url(#dg-sun)" />
      <circle cx="79" cy="22" r="10" fill="#F8D662" />
      <g transform="translate(28 26) scale(0.7)">
        <Cloud />
      </g>
      <path d="M0 76 Q26 54 54 72 Q78 86 100 68 L100 100 L0 100 Z" fill="url(#dg-grass)" />
      <g transform="translate(62 40) scale(0.82)">
        <Gem />
      </g>
      <g transform="translate(14 52) scale(0.94)">
        <Excavator />
      </g>
    </svg>
  )
}
