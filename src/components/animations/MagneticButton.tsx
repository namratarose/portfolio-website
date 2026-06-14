'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  onClick?: () => void
}

const SPRING_CONFIG = { damping: 20, stiffness: 200, mass: 0.8 }

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const x = useSpring(rawX, SPRING_CONFIG)
  const y = useSpring(rawY, SPRING_CONFIG)

  // Trail values — slightly delayed, softer spring
  const trailX = useSpring(rawX, { damping: 30, stiffness: 120, mass: 1.2 })
  const trailY = useSpring(rawY, { damping: 30, stiffness: 120, mass: 1.2 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * strength
    const dy = (e.clientY - cy) * strength
    rawX.set(dx)
    rawY.set(dy)
  }

  function handleMouseLeave() {
    rawX.set(0)
    rawY.set(0)
    setIsHovered(false)
  }

  function handleMouseEnter() {
    setIsHovered(true)
  }

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex items-center justify-center', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Magnetic trail shadow */}
      <motion.div
        aria-hidden
        style={{ x: trailX, y: trailY }}
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-30"
      >
        <div
          className={cn(
            'h-full w-full rounded-[inherit] transition-opacity duration-300',
            isHovered
              ? 'bg-[radial-gradient(ellipse_at_center,rgba(124,92,255,0.4),transparent_70%)] opacity-100'
              : 'opacity-0'
          )}
        />
      </motion.div>

      {/* Main element */}
      <motion.div
        style={{ x, y }}
        className="relative"
        onClick={onClick}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
