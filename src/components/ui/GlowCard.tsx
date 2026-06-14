'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type ColorVariant = 'primary' | 'secondary' | 'accent' | 'highlight'

const VARIANT_COLORS: Record<ColorVariant, { border: string; glow: string; gradient: string }> = {
  primary:   { border: '#7C5CFF', glow: 'rgba(124, 92, 255, 0.4)',  gradient: 'from-[#7C5CFF] via-[#A78BFF] to-[#7C5CFF]' },
  secondary: { border: '#61DAFB', glow: 'rgba(97, 218, 251, 0.4)',  gradient: 'from-[#61DAFB] via-[#A5EEFF] to-[#61DAFB]' },
  accent:    { border: '#FF7AE5', glow: 'rgba(255, 122, 229, 0.4)', gradient: 'from-[#FF7AE5] via-[#FFB3F5] to-[#FF7AE5]' },
  highlight: { border: '#FFD700', glow: 'rgba(255, 215, 0, 0.4)',   gradient: 'from-[#FFD700] via-[#FFF176] to-[#FFD700]' },
}

interface GlowCardProps {
  children: React.ReactNode
  className?: string
  variant?: ColorVariant
  hoverScale?: boolean
}

export function GlowCard({
  children,
  className,
  variant = 'primary',
  hoverScale = false,
}: GlowCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const colors = VARIANT_COLORS[variant]

  return (
    <motion.div
      className={cn('relative rounded-2xl p-px', className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={hoverScale ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
    >
      {/* Animated gradient border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${colors.border}, ${colors.border}88, ${colors.border})`,
          opacity: isHovered ? 1 : 0.2,
        }}
      />

      {/* Glow shadow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl transition-all duration-300"
        style={{
          boxShadow: isHovered
            ? `0 0 30px ${colors.glow}, 0 0 60px ${colors.glow.replace('0.4', '0.2')}, inset 0 0 20px ${colors.glow.replace('0.4', '0.05')}`
            : `0 0 0px transparent`,
        }}
      />

      {/* Card content */}
      <div
        className={cn(
          'relative rounded-[calc(1rem-1px)] bg-[#0d0d1a]/80 backdrop-blur-sm',
          'transition-colors duration-300',
        )}
      >
        {children}
      </div>
    </motion.div>
  )
}
