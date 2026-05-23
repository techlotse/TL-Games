import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind class names safely. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/** Returns a shuffled copy of the list (Fisher-Yates). */
export function shuffle<T>(source: readonly T[]): T[] {
  const pool = [...source]
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = pool[i]
    pool[i] = pool[j]
    pool[j] = tmp
  }
  return pool
}

/** Picks `count` random distinct items from the list. */
export function sampleDistinct<T>(source: readonly T[], count: number): T[] {
  return shuffle(source).slice(0, Math.max(0, Math.min(count, source.length)))
}

/** Clamp a number into the [min, max] range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
