import type { ComponentType } from 'react'
import { motion } from 'framer-motion'
import { useCalmMotion, calmTween } from '@/lib/motion'
import { PART_COLORS, type PartKind, type PartPalette } from './data'

const COLOR: PartPalette = { ...PART_COLORS }
const MONO: PartPalette = {
  body: 'currentColor',
  bodyTrim: 'currentColor',
  wheel: 'currentColor',
  wheelHub: 'currentColor',
  cabin: 'currentColor',
  glass: 'currentColor',
  light: 'currentColor',
  lightBase: 'currentColor',
}

/* --------------------- Standalone parts (the tray) ----------------------- */

function Body({ p }: { p: PartPalette }) {
  return (
    <g>
      <rect x="6" y="10" width="188" height="60" rx="26" fill={p.body} />
      <rect x="10" y="50" width="180" height="22" rx="11" fill={p.bodyTrim} />
      <circle cx="180" cy="38" r="9" fill={p.glass} />
    </g>
  )
}

function Wheel({ p }: { p: PartPalette }) {
  return (
    <g>
      <circle cx="50" cy="50" r="46" fill={p.wheel} />
      <circle cx="50" cy="50" r="18" fill={p.wheelHub} />
    </g>
  )
}

function Cabin({ p }: { p: PartPalette }) {
  return (
    <g>
      <rect x="8" y="14" width="88" height="64" rx="16" fill={p.cabin} />
      <rect x="20" y="26" width="44" height="32" rx="9" fill={p.glass} />
    </g>
  )
}

function Light({ p }: { p: PartPalette }) {
  return (
    <g>
      <rect x="38" y="40" width="24" height="20" rx="5" fill={p.lightBase} />
      <rect x="22" y="10" width="56" height="34" rx="15" fill={p.light} />
    </g>
  )
}

const PARTS: Record<PartKind, ComponentType<{ p: PartPalette }>> = {
  body: Body,
  wheel: Wheel,
  cabin: Cabin,
  light: Light,
}

const VIEWBOX: Record<PartKind, string> = {
  body: '0 0 200 90',
  wheel: '0 0 100 100',
  cabin: '0 0 104 86',
  light: '0 0 100 64',
}

/** A single vehicle part, drawn standalone for the tray. */
export function PartArt({ kind, ghost = false }: { kind: PartKind; ghost?: boolean }) {
  const Shape = PARTS[kind]
  const palette = ghost ? MONO : COLOR
  return (
    <svg
      viewBox={VIEWBOX[kind]}
      className="block h-auto max-h-full w-full"
      role="img"
      aria-label="Fahrzeugteil"
    >
      {ghost ? (
        <g className="text-ink" opacity={0.18}>
          <Shape p={palette} />
        </g>
      ) : (
        <Shape p={palette} />
      )}
    </svg>
  )
}

/* ------------------- The vehicle being built (the frame) ----------------- */

/**
 * The whole vehicle as one coherent drawing. Each part is faint until it has
 * been placed, then fades in to full colour - so the parts always line up.
 */
export function VehicleScene({ placed }: { placed: ReadonlySet<string> }) {
  const calm = useCalmMotion()
  const c = PART_COLORS
  const part = (id: string) => ({
    initial: false as const,
    animate: { opacity: placed.has(id) ? 1 : 0.16 },
    transition: calm ? { duration: 0 } : calmTween,
  })
  return (
    <svg viewBox="0 0 300 220" className="h-full w-full" role="img" aria-label="Fahrzeug">
      <motion.g {...part('body')}>
        <rect x="36" y="92" width="228" height="74" rx="28" fill={c.body} />
        <rect x="44" y="142" width="212" height="22" rx="11" fill={c.bodyTrim} />
        <circle cx="250" cy="116" r="9" fill={c.glass} />
      </motion.g>
      <motion.g {...part('wheelBack')}>
        <circle cx="96" cy="172" r="33" fill={c.wheel} />
        <circle cx="96" cy="172" r="13" fill={c.wheelHub} />
      </motion.g>
      <motion.g {...part('wheelFront')}>
        <circle cx="204" cy="172" r="33" fill={c.wheel} />
        <circle cx="204" cy="172" r="13" fill={c.wheelHub} />
      </motion.g>
      <motion.g {...part('cabin')}>
        <rect x="160" y="44" width="104" height="56" rx="20" fill={c.cabin} />
        <rect x="174" y="56" width="50" height="34" rx="9" fill={c.glass} />
      </motion.g>
      <motion.g {...part('light')}>
        <rect x="196" y="20" width="34" height="26" rx="11" fill={c.light} />
      </motion.g>
    </svg>
  )
}

/** Home-screen tile artwork - a finished little truck. */
export function GarageTile() {
  const c = PART_COLORS
  return (
    <svg viewBox="0 0 120 94" className="h-full w-full" role="img" aria-label="Werkstatt">
      <rect x="10" y="40" width="100" height="32" rx="15" fill={c.body} />
      <rect x="14" y="56" width="92" height="14" rx="7" fill={c.bodyTrim} />
      <rect x="60" y="20" width="36" height="28" rx="10" fill={c.cabin} />
      <rect x="66" y="27" width="20" height="14" rx="4" fill={c.glass} />
      <rect x="70" y="7" width="16" height="13" rx="5" fill={c.light} />
      <circle cx="36" cy="76" r="15" fill={c.wheel} />
      <circle cx="36" cy="76" r="6" fill={c.wheelHub} />
      <circle cx="92" cy="76" r="15" fill={c.wheel} />
      <circle cx="92" cy="76" r="6" fill={c.wheelHub} />
    </svg>
  )
}
