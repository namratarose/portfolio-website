'use client'

import { useSpring, useMotionValue, MotionValue } from 'framer-motion'

interface SpringConfig {
  stiffness?: number
  damping?: number
  mass?: number
}

interface Vec2 {
  x: number
  y: number
}

const DEFAULT_SPRING: SpringConfig = {
  stiffness: 200,
  damping: 20,
  mass: 1,
}

/**
 * Provides physics helpers built on Framer Motion spring primitives.
 */
export function usePhysics() {
  /**
   * Creates a spring-animated MotionValue that tracks a target value.
   */
  const springTo = (initialValue: number, config: SpringConfig = {}): MotionValue<number> => {
    const merged = { ...DEFAULT_SPRING, ...config }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const raw = useMotionValue(initialValue)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSpring(raw, merged)
  }

  /**
   * Returns the Cartesian position for a point on a circle.
   */
  const orbitalPosition = (angle: number, radius: number): Vec2 => ({
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  })

  /**
   * Computes the gravitational pull direction/magnitude from source to target.
   * Returns a normalised delta scaled by strength.
   */
  const gravityPull = (sourcePos: Vec2, targetPos: Vec2, strength: number = 1): Vec2 => {
    const dx = targetPos.x - sourcePos.x
    const dy = targetPos.y - sourcePos.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 1
    return {
      x: (dx / dist) * strength,
      y: (dy / dist) * strength,
    }
  }

  /**
   * Returns a spring MotionValue that bounces elastically at min/max boundaries.
   */
  const elasticBounce = (
    initialValue: number,
    min: number,
    max: number
  ): MotionValue<number> => {
    const clamped = Math.min(Math.max(initialValue, min), max)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const raw = useMotionValue(clamped)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSpring(raw, { stiffness: 400, damping: 25, mass: 0.8 })
  }

  return { springTo, orbitalPosition, gravityPull, elasticBounce }
}
