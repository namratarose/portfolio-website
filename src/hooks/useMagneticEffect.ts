'use client'

import { RefObject, useEffect } from 'react'
import { useMotionValue, MotionValue } from 'framer-motion'

interface MagneticEffectOptions {
  strength?: number
  distance?: number
}

interface MagneticEffectResult {
  x: MotionValue<number>
  y: MotionValue<number>
}

/**
 * Makes an element magnetically attract the cursor when it comes within range.
 *
 * @param ref      - ref attached to the element
 * @param strength - pull strength 0–1 (default 0.3)
 * @param distance - attraction radius in px (default 100)
 */
export function useMagneticEffect(
  ref: RefObject<HTMLElement | null>,
  { strength = 0.3, distance = 100 }: MagneticEffectOptions = {}
): MagneticEffectResult {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const dist = Math.sqrt(deltaX ** 2 + deltaY ** 2)

      if (dist < distance) {
        const pull = (1 - dist / distance) * strength
        x.set(deltaX * pull)
        y.set(deltaY * pull)
      } else {
        x.set(0)
        y.set(0)
      }
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    window.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [ref, strength, distance, x, y])

  return { x, y }
}
