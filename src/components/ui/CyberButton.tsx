'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary:   'border-[#7C5CFF] text-[#7C5CFF] hover:bg-[#7C5CFF]/10',
  secondary: 'border-[#61DAFB] text-[#61DAFB] hover:bg-[#61DAFB]/10',
  ghost:     'border-white/20 text-white/70 hover:border-white/40 hover:text-white',
  danger:    'border-red-500 text-red-400 hover:bg-red-500/10',
}

const VARIANT_ACCENT: Record<ButtonVariant, string> = {
  primary:   '#7C5CFF',
  secondary: '#61DAFB',
  ghost:     'rgba(255,255,255,0.5)',
  danger:    '#ef4444',
}

interface Ripple {
  id: number
  x: number
  y: number
}

interface CyberButtonProps {
  children: React.ReactNode
  className?: string
  variant?: ButtonVariant
  loading?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export function CyberButton({
  children,
  className,
  variant = 'primary',
  loading = false,
  onClick,
  disabled = false,
  type = 'button',
}: CyberButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const btnRef = useRef<HTMLButtonElement>(null)
  const rippleCounter = useRef(0)

  const accent = VARIANT_ACCENT[variant]

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = ++rippleCounter.current
    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 700)
    onClick?.(e)
  }

  return (
    <motion.button
      ref={btnRef}
      type={type}
      disabled={disabled || loading}
      onClick={handleClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'group relative overflow-hidden border bg-transparent px-6 py-2.5 font-mono text-sm font-medium',
        'transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        VARIANT_STYLES[variant],
        className
      )}
    >
      {/* Scan line */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            aria-hidden
            initial={{ top: '-10%', opacity: 0.6 }}
            animate={{ top: '110%', opacity: 0 }}
            exit={{}}
            transition={{ duration: 0.5, ease: 'linear' }}
            className="pointer-events-none absolute left-0 h-[2px] w-full"
            style={{ background: accent }}
          />
        )}
      </AnimatePresence>

      {/* Glitch overlay on hover */}
      {isHovered && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${accent}18 50%, transparent 100%)`,
          }}
        />
      )}

      {/* Corner brackets */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
        <motion.span
          key={corner}
          aria-hidden
          animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0.4, scale: 0.85 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none absolute"
          style={{
            ...(corner === 'tl' && { top: 2, left: 2, borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}`, width: 8, height: 8 }),
            ...(corner === 'tr' && { top: 2, right: 2, borderTop: `2px solid ${accent}`, borderRight: `2px solid ${accent}`, width: 8, height: 8 }),
            ...(corner === 'bl' && { bottom: 2, left: 2, borderBottom: `2px solid ${accent}`, borderLeft: `2px solid ${accent}`, width: 8, height: 8 }),
            ...(corner === 'br' && { bottom: 2, right: 2, borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}`, width: 8, height: 8 }),
          }}
        />
      ))}

      {/* Ripples */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          aria-hidden
          initial={{ width: 0, height: 0, opacity: 0.5, x: r.x, y: r.y, translateX: '-50%', translateY: '-50%' }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="pointer-events-none absolute rounded-full"
          style={{ background: accent, position: 'absolute', borderRadius: '50%', top: 0, left: 0 }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <motion.span
              aria-hidden
              className="inline-block h-3.5 w-3.5 rounded-full border-2"
              style={{ borderColor: `${accent} transparent transparent transparent` }}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            <span>Loading…</span>
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  )
}
