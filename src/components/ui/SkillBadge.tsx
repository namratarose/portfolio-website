'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

type SkillCategory = 'language' | 'framework' | 'tool' | 'database' | 'cloud' | 'design' | 'other'

const CATEGORY_COLORS: Record<SkillCategory, { border: string; glow: string; bg: string; text: string }> = {
  language:  { border: '#7C5CFF', glow: '#7C5CFF40', bg: '#7C5CFF18', text: '#A78BFF' },
  framework: { border: '#61DAFB', glow: '#61DAFB40', bg: '#61DAFB18', text: '#A5EEFF' },
  tool:      { border: '#FF7AE5', glow: '#FF7AE540', bg: '#FF7AE518', text: '#FFB3F5' },
  database:  { border: '#FFD700', glow: '#FFD70040', bg: '#FFD70018', text: '#FFF176' },
  cloud:     { border: '#34D399', glow: '#34D39940', bg: '#34D39918', text: '#6EE7B7' },
  design:    { border: '#F87171', glow: '#F8717140', bg: '#F8717118', text: '#FCA5A5' },
  other:     { border: '#9CA3AF', glow: '#9CA3AF40', bg: '#9CA3AF18', text: '#D1D5DB' },
}

interface SkillBadgeProps {
  name: string
  icon?: React.ReactNode
  category?: SkillCategory
  tooltip?: string
  level?: number   // 1–5, shown as dots
  className?: string
}

export function SkillBadge({
  name,
  icon,
  category = 'other',
  tooltip,
  level,
  className,
}: SkillBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const badgeRef = useRef<HTMLButtonElement>(null)
  const colors = CATEGORY_COLORS[category]

  return (
    <div className="relative inline-block">
      <motion.button
        ref={badgeRef}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs font-medium',
          'cursor-pointer transition-colors duration-200',
          className
        )}
        style={{
          borderColor: colors.border,
          background: colors.bg,
          color: colors.text,
        }}
        whileHover={{
          scale: 1.08,
          boxShadow: `0 0 16px ${colors.glow}, 0 0 30px ${colors.glow}`,
        }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setShowTooltip(true)}
        onHoverEnd={() => setShowTooltip(false)}
        onClick={() => setShowTooltip((v) => !v)}
        aria-label={`${name} skill badge`}
      >
        {icon && (
          <span className="flex-shrink-0 text-base leading-none" aria-hidden>
            {icon}
          </span>
        )}
        <span>{name}</span>

        {/* Level dots */}
        {level !== undefined && (
          <span className="flex items-center gap-0.5 pl-1" aria-label={`Level ${level} out of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="h-1 w-1 rounded-full transition-colors"
                style={{ background: i < level ? colors.border : `${colors.border}30` }}
              />
            ))}
          </span>
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2"
          >
            <div
              className="whitespace-nowrap rounded-lg border px-3 py-1.5 font-mono text-xs leading-snug"
              style={{
                borderColor: `${colors.border}60`,
                background: '#0d0d1a',
                color: colors.text,
                boxShadow: `0 4px 20px ${colors.glow}`,
              }}
            >
              {tooltip}
            </div>
            {/* Arrow */}
            <div
              className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent"
              style={{ borderTopColor: `${colors.border}60` }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
