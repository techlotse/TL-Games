import { SHEET } from './data'

const C = {
  red: '#E0584C',
  yellow: '#F2C94C',
  blue: '#5B91C4',
  orange: '#E89A3C',
  green: '#6FA86A',
}

/**
 * Home-screen tile artwork - a flower being coloured in. Some petals are
 * coloured, some are still blank paper: the readable-free cue for "Malen".
 */
export function ColouringTile() {
  const outline = { stroke: SHEET.ink, strokeWidth: 4, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 96 96" className="h-full w-full" role="img" aria-label="Malen">
      <rect x="44" y="56" width="8" height="32" rx="4" fill={C.green} {...outline} />
      <circle cx="48" cy="18" r="13" fill={C.red} {...outline} />
      <circle cx="67" cy="29" r="13" fill={SHEET.paper} {...outline} />
      <circle cx="67" cy="51" r="13" fill={C.blue} {...outline} />
      <circle cx="48" cy="62" r="13" fill={SHEET.paper} {...outline} />
      <circle cx="29" cy="51" r="13" fill={C.yellow} {...outline} />
      <circle cx="29" cy="29" r="13" fill={SHEET.paper} {...outline} />
      <circle cx="48" cy="40" r="12" fill={C.orange} {...outline} />
    </svg>
  )
}
