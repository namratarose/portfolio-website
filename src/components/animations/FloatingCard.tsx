'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface FloatingCardProps {
  children: React.ReactNode
  className?: string
  glassStyle?: boolean
  floatAmplitude?: number
  tiltStrength?: number
  glowColor?: string
}

const SPRING = { damping: 25, stiffness: 300 }

export function FloatingCard({
  children,
  className,
  glassStyle = true,
  floatAmplitude = 5,
  tiltStrength = 15,
  glowColor = 'rgba(124, 92, 255, 0.5)',
}: FloatingCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [tiltStrength, -tiltStrength]), SPRING)
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-tiltStrength, tiltStrength]), SPRING)

  const glareX = useTransform(mouseX, [0, 1], ['0%', '100%'])
  const glareY = useTransform(mouseY, [0, 1], ['0%', '100%'])

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  function handleMouseLeave() {
    mouseX.set(0.5)
    mouseY.set(0.5)
    setIsHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn('relative cursor-default select-none', className)}
      style={{ perspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      // Floating animation
      animate={{ y: [0, -floatAmplitude, 0] }}
      transition={{
        y: { duration: 4, repeat: Infinity, ease: 'easeInOut', repeatType: 'loop' },
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="relative h-full w-full"
      >
        {/* Card surface */}
        <div
          className={cn(
            'relative h-full w-full overflow-hidden rounded-2xl transition-all duration-300',
            glassStyle && [
              'bg-white/5 backdrop-blur-md',
              'border border-white/10',
            ],
            isHovered && 'shadow-2xl'
          )}
          style={
            isHovered
              ? {
                  boxShadow: `0 25px 60px -15px ${glowColor}, 0 0 0 1px ${glowColor.replace('0.5', '0.3')}`,
                }
              : {}
          }
        >
          {/* Animated gradient border on hover */}
          {isHovered && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${glowColor}, transparent 60%)`,
                opacity: 0.15,
              }}
            />
          )}

          {/* Glare highlight that follows cursor */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: useTransform(
                [glareX, glareY],
                ([gx, gy]) =>
                  `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.12) 0%, transparent 55%)`
              ),
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          />

          {children}
        </div>
      </motion.div>
    </motion.div>
  )
}
