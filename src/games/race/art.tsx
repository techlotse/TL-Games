import type { ComponentType } from 'react'
import type { ObstacleKind } from './data'

const C = {
  carBody: '#D9614C',
  carDark: '#C24C3B',
  glass: '#C2E1EA',
  tyre: '#33302E',
  light: '#F4E08C',
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
}

/** The player's car, seen from above and pointing up the road. */
export function CarArt() {
  return (
    <svg viewBox="0 0 84 120" className="block h-auto w-full" role="img" aria-label="Auto">
      <rect x="0" y="22" width="14" height="24" rx="6" fill={C.tyre} />
      <rect x="70" y="22" width="14" height="24" rx="6" fill={C.tyre} />
      <rect x="0" y="74" width="14" height="24" rx="6" fill={C.tyre} />
      <rect x="70" y="74" width="14" height="24" rx="6" fill={C.tyre} />
      <rect x="10" y="4" width="64" height="112" rx="26" fill={C.carBody} />
      <rect x="18" y="44" width="48" height="42" rx="16" fill={C.carDark} />
      <path d="M21 45 Q42 31 63 45 L59 56 Q42 47 25 56 Z" fill={C.glass} />
      <path d="M25 85 Q42 93 59 85 L56 96 Q42 101 28 96 Z" fill={C.glass} />
      <circle cx="23" cy="15" r="6" fill={C.light} />
      <circle cx="61" cy="15" r="6" fill={C.light} />
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

/** A single road obstacle. */
export function ObstacleArt({ kind }: { kind: ObstacleKind }) {
  const Shape = OBSTACLES[kind]
  return (
    <svg viewBox="0 0 100 100" className="block h-auto w-full" role="img" aria-label="Hindernis">
      <Shape />
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
        <path d="M8 22 Q17 14 26 22 L24 30 Q17 25 10 30 Z" fill={C.glass} />
      </g>
    </svg>
  )
}
