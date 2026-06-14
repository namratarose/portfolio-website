import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Tailwind class merger ────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Date / text helpers ──────────────────────────────────────────────────────

/**
 * Formats a Date (or date string) to a human-readable string.
 * @example formatDate(new Date()) => "June 13, 2026"
 */
export function formatDate(date: Date | string, locale = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Estimates reading time in minutes for a given body of text.
 * Assumes ~200 wpm average reading speed.
 */
export function readingTime(text: string, wpm = 200): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wpm))
}

/**
 * Converts a string to a URL-friendly slug.
 * @example slugify("Hello World!") => "hello-world"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Truncates text to the specified length, appending an ellipsis if needed.
 */
export function truncate(text: string, maxLength: number, ellipsis = '...'): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - ellipsis.length) + ellipsis
}

// ─── Function timing helpers ──────────────────────────────────────────────────

/**
 * Returns a debounced version of fn that fires after `wait` ms of silence.
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), wait)
  }
}

/**
 * Returns a throttled version of fn that fires at most once per `limit` ms.
 */
export function throttle<T extends (...args: Parameters<T>) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  return (...args) => {
    const now = Date.now()
    if (now - lastCall >= limit) {
      lastCall = now
      fn(...args)
    }
  }
}

// ─── Math helpers ─────────────────────────────────────────────────────────────

/** Linear interpolation between a and b at position t (0–1). */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Clamps value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Re-maps a number from one range to another.
 * @example mapRange(50, 0, 100, 0, 1) => 0.5
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin
}

/** Generates a random alphanumeric ID of the given length. */
export function generateId(length = 8): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
    .padEnd(length, '0')
}

// ─── Color utilities ──────────────────────────────────────────────────────────

/**
 * Converts a hex colour string to an {r, g, b} object.
 * Returns null for invalid input.
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace(/^#/, '')
  if (clean.length !== 3 && clean.length !== 6) return null
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const num = parseInt(full, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

/** Converts r, g, b (0–255) values to a hex colour string. */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0'))
      .join('')
  )
}

/**
 * Linearly mixes two hex colours by ratio t (0 = colourA, 1 = colourB).
 */
export function colorMix(colorA: string, colorB: string, t: number): string {
  const a = hexToRgb(colorA)
  const b = hexToRgb(colorB)
  if (!a || !b) return colorA
  return rgbToHex(
    lerp(a.r, b.r, t),
    lerp(a.g, b.g, t),
    lerp(a.b, b.b, t)
  )
}

// ─── Environment helpers ──────────────────────────────────────────────────────

/** True when running in a browser context (SSR-safe). */
export const isClient = typeof window !== 'undefined'

/** True when the viewport is below 768 px wide (client-side only). */
export function isMobile(): boolean {
  if (!isClient) return false
  return window.matchMedia('(max-width: 767px)').matches
}

/** True when the OS reports a preference for reduced motion (client-side only). */
export function prefersReducedMotion(): boolean {
  if (!isClient) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
