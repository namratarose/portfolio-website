// ─── Types ────────────────────────────────────────────────────────────────────

export interface Vec2 {
  x: number
  y: number
}

export interface Particle {
  position: Vec2
  velocity: Vec2
  acceleration: Vec2
  mass: number
  radius: number
  life: number      // 0–1; 0 = dead
  decay: number     // life units lost per second
}

// ─── Orbital physics ──────────────────────────────────────────────────────────

/**
 * Returns the Cartesian position of a point on a circle.
 *
 * @param angle   - angle in radians
 * @param radius  - orbital radius
 * @param centerX - X origin (default 0)
 * @param centerY - Y origin (default 0)
 */
export function calculateOrbitalPosition(
  angle: number,
  radius: number,
  centerX = 0,
  centerY = 0
): Vec2 {
  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius,
  }
}

// ─── Spring / force helpers ───────────────────────────────────────────────────

/**
 * Calculates a spring restoring force using Hooke's law with damping.
 *
 * F = -k * displacement - b * velocity
 *
 * @param displacement - current displacement from rest
 * @param velocity     - current velocity
 * @param stiffness    - spring constant k
 * @param damping      - damping coefficient b
 */
export function calculateSpringForce(
  displacement: number,
  velocity: number,
  stiffness: number,
  damping: number
): number {
  return -stiffness * displacement - damping * velocity
}

/**
 * Newton's law of universal gravitation (simplified, 2-D magnitude).
 *
 * F = G * (m1 * m2) / d²
 *
 * Uses G = 6.674e-11 by default (can be overridden for UI purposes).
 */
export function calculateGravity(
  mass1: number,
  mass2: number,
  distance: number,
  G = 6.674e-11
): number {
  const safeDist = Math.max(distance, 0.001)
  return (G * mass1 * mass2) / (safeDist * safeDist)
}

// ─── Particle simulation ──────────────────────────────────────────────────────

/**
 * Advances a particle by one timestep using semi-implicit Euler integration.
 * Returns a new particle object (immutable update).
 */
export function simulateParticle(particle: Particle, deltaTime: number): Particle {
  const newVelocity: Vec2 = {
    x: particle.velocity.x + particle.acceleration.x * deltaTime,
    y: particle.velocity.y + particle.acceleration.y * deltaTime,
  }

  const newPosition: Vec2 = {
    x: particle.position.x + newVelocity.x * deltaTime,
    y: particle.position.y + newVelocity.y * deltaTime,
  }

  return {
    ...particle,
    position: newPosition,
    velocity: newVelocity,
    life: Math.max(0, particle.life - particle.decay * deltaTime),
  }
}

// ─── Easing functions ─────────────────────────────────────────────────────────

/** Smooth ease-in-out with a cubic curve. */
export function easeInOutCubic(t: number): number {
  const c = Math.max(0, Math.min(1, t))
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2
}

/**
 * Ease-out with a slight overshoot (back easing).
 * c1 controls the overshoot magnitude (default ≈ 1.70158).
 */
export function easeOutBack(t: number, c1 = 1.70158): number {
  const c3 = c1 + 1
  const c = Math.max(0, Math.min(1, t))
  return 1 + c3 * Math.pow(c - 1, 3) + c1 * Math.pow(c - 1, 2)
}

/**
 * Elastic ease-in-out — bouncy spring effect.
 * amplitude and period tune the oscillation.
 */
export function easeInOutElastic(t: number): number {
  const c5 = (2 * Math.PI) / 4.5
  const c = Math.max(0, Math.min(1, t))

  if (c === 0) return 0
  if (c === 1) return 1

  return c < 0.5
    ? -(Math.pow(2, 20 * c - 10) * Math.sin((20 * c - 11.125) * c5)) / 2
    : (Math.pow(2, -20 * c + 10) * Math.sin((20 * c - 11.125) * c5)) / 2 + 1
}
