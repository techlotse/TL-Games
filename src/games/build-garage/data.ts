/**
 * Build Garage - static content.
 *
 * The game is a silhouette match: a coloured vehicle is matched to its
 * grey outline. Montessori focus: shape recognition, sorting, organisation.
 */

export interface VehiclePalette {
  body: string
  cab: string
  glass: string
  wheel: string
  trim: string
}

export const VEHICLE_KEYS = ['truck', 'bus', 'car', 'digger'] as const
export type VehicleKey = (typeof VEHICLE_KEYS)[number]

/** Warm, slightly desaturated "wooden toy" palette. */
export const VEHICLE_PALETTE: Record<VehicleKey, VehiclePalette> = {
  truck: { body: '#E0883B', cab: '#C8722B', glass: '#C2E1EA', wheel: '#403A38', trim: '#9C5820' },
  bus: { body: '#4F86AF', cab: '#3B6C92', glass: '#CFE7EF', wheel: '#403A38', trim: '#2E5878' },
  car: { body: '#6FA267', cab: '#5A8B55', glass: '#CFE7EF', wheel: '#403A38', trim: '#4A7245' },
  digger: { body: '#E4B340', cab: '#CD9A2C', glass: '#C2E1EA', wheel: '#403A38', trim: '#A67B1E' },
}

/** Rounds draw 3 vehicles from the pool of 4. */
export const ROUND_SIZE = 3
