import type { ComponentType } from 'react'
import { VEHICLE_PALETTE, type VehicleKey, type VehiclePalette } from './data'

/* -------------------------------- Parts --------------------------------- */

function Wheel({
  cx,
  cy,
  r,
  p,
}: {
  cx: number
  cy: number
  r: number
  p: VehiclePalette
}) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={p.wheel} />
      <circle cx={cx} cy={cy} r={r * 0.4} fill={p.glass} />
    </g>
  )
}

/* ------------------------------- Vehicles -------------------------------- */

function Truck({ p }: { p: VehiclePalette }) {
  return (
    <g>
      <rect x="10" y="58" width="100" height="9" rx="4.5" fill={p.trim} />
      <rect x="10" y="20" width="58" height="42" rx="9" fill={p.body} />
      <path d="M70 62 V46 q0 -8 8 -8 h12 l16 13 V62 Z" fill={p.cab} />
      <rect x="86" y="44" width="15" height="12" rx="3" fill={p.glass} />
      <Wheel cx={34} cy={70} r={13} p={p} />
      <Wheel cx={92} cy={70} r={13} p={p} />
    </g>
  )
}

function Bus({ p }: { p: VehiclePalette }) {
  return (
    <g>
      <rect x="8" y="22" width="104" height="44" rx="13" fill={p.body} />
      <rect x="16" y="30" width="17" height="14" rx="3.5" fill={p.glass} />
      <rect x="37" y="30" width="17" height="14" rx="3.5" fill={p.glass} />
      <rect x="58" y="30" width="17" height="14" rx="3.5" fill={p.glass} />
      <rect x="80" y="30" width="20" height="28" rx="4" fill={p.cab} />
      <rect x="10" y="48" width="100" height="7" fill={p.trim} />
      <Wheel cx={34} cy={70} r={13} p={p} />
      <Wheel cx={90} cy={70} r={13} p={p} />
    </g>
  )
}

function Car({ p }: { p: VehiclePalette }) {
  return (
    <g>
      <rect x="34" y="22" width="50" height="26" rx="11" fill={p.body} />
      <rect x="6" y="40" width="108" height="26" rx="13" fill={p.body} />
      <rect x="42" y="28" width="34" height="14" rx="4" fill={p.glass} />
      <rect x="8" y="56" width="104" height="8" rx="4" fill={p.trim} />
      <Wheel cx={34} cy={68} r={13} p={p} />
      <Wheel cx={88} cy={68} r={13} p={p} />
    </g>
  )
}

function Digger({ p }: { p: VehiclePalette }) {
  return (
    <g>
      <path
        d="M52 50 L84 28 L100 44"
        fill="none"
        stroke={p.trim}
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M92 36 L114 42 L108 60 L90 54 Z" fill={p.body} />
      <rect x="8" y="60" width="68" height="22" rx="11" fill={p.wheel} />
      <circle cx="22" cy="71" r="5.5" fill={p.glass} />
      <circle cx="42" cy="71" r="5.5" fill={p.glass} />
      <circle cx="62" cy="71" r="5.5" fill={p.glass} />
      <rect x="16" y="40" width="46" height="24" rx="7" fill={p.body} />
      <rect x="20" y="20" width="32" height="24" rx="7" fill={p.cab} />
      <rect x="25" y="25" width="20" height="12" rx="3" fill={p.glass} />
    </g>
  )
}

const SHAPES: Record<VehicleKey, ComponentType<{ p: VehiclePalette }>> = {
  truck: Truck,
  bus: Bus,
  car: Car,
  digger: Digger,
}

const MONO: VehiclePalette = {
  body: 'currentColor',
  cab: 'currentColor',
  glass: 'currentColor',
  wheel: 'currentColor',
  trim: 'currentColor',
}

/* ------------------------------ Public art ------------------------------ */

/**
 * A vehicle drawing. `mono` renders a soft grey silhouette used as the
 * match-to-outline target.
 */
export function VehicleArt({ id, mono = false }: { id: string; mono?: boolean }) {
  const key = id as VehicleKey
  const Shape = SHAPES[key]
  if (!Shape) return null
  const palette = mono ? MONO : VEHICLE_PALETTE[key]
  return (
    <svg viewBox="0 0 120 100" className="h-full w-full" role="img" aria-label="Fahrzeug">
      {mono ? (
        <g className="text-ink" opacity={0.16}>
          <Shape p={palette} />
        </g>
      ) : (
        <Shape p={palette} />
      )}
    </svg>
  )
}

/** Home-screen tile artwork. */
export function GarageTile() {
  return <VehicleArt id="truck" />
}
