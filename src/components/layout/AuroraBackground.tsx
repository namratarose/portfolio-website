'use client'

import { useEffect, useRef, useState, memo } from 'react'
import { motion, useAnimationControls } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Particle {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

interface OrbConfig {
  id: string
  color: string
  size: number
  initialX: number
  initialY: number
  duration: number
}

interface ShootingStar {
  id: number
  startX: number
  startY: number
  angle: number
  delay: number
  duration: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PARTICLE_COUNT = 50

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 0.5,
    opacity: Math.random() * 0.6 + 0.1,
    duration: Math.random() * 6 + 4,
    delay: Math.random() * 8,
  }))
}

function generateShootingStars(): ShootingStar[] {
  return Array.from({ length: 6 }, (_, i) => ({
    id: i,
    startX: Math.random() * 80 + 10,
    startY: Math.random() * 30,
    angle: Math.random() * 20 + 30,
    delay: Math.random() * 12 + i * 4,
    duration: Math.random() * 0.8 + 0.6,
  }))
}

const ORB_CONFIGS: OrbConfig[] = [
  {
    id: 'primary',
    color: 'rgba(124, 92, 255, 0.18)',
    size: 700,
    initialX: 20,
    initialY: 20,
    duration: 18,
  },
  {
    id: 'secondary',
    color: 'rgba(97, 218, 251, 0.12)',
    size: 600,
    initialX: 70,
    initialY: 60,
    duration: 22,
  },
  {
    id: 'accent',
    color: 'rgba(255, 122, 229, 0.10)',
    size: 500,
    initialX: 50,
    initialY: 80,
    duration: 26,
  },
  {
    id: 'deep',
    color: 'rgba(124, 92, 255, 0.08)',
    size: 800,
    initialX: 85,
    initialY: 15,
    duration: 32,
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

const AnimatedOrb = memo(({ config }: { config: OrbConfig }) => {
  const controls = useAnimationControls()

  useEffect(() => {
    const drift = () => {
      controls.start({
        x: [
          `${config.initialX}vw`,
          `${config.initialX + (Math.random() * 30 - 15)}vw`,
          `${config.initialX + (Math.random() * 30 - 15)}vw`,
          `${config.initialX}vw`,
        ],
        y: [
          `${config.initialY}vh`,
          `${config.initialY + (Math.random() * 30 - 15)}vh`,
          `${config.initialY + (Math.random() * 30 - 15)}vh`,
          `${config.initialY}vh`,
        ],
        transition: {
          duration: config.duration,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop' as const,
        },
      })
    }
    drift()
  }, [controls, config])

  return (
    <motion.div
      animate={controls}
      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
      style={{
        width: config.size,
        height: config.size,
        background: `radial-gradient(circle at center, ${config.color} 0%, transparent 70%)`,
        left: `${config.initialX}vw`,
        top: `${config.initialY}vh`,
      }}
      aria-hidden="true"
    />
  )
})

AnimatedOrb.displayName = 'AnimatedOrb'

// ─── Main Component ───────────────────────────────────────────────────────────

export const AuroraBackground = memo(function AuroraBackground({
  className,
}: {
  className?: string
}) {
  const particles = useRef<Particle[]>(generateParticles())
  const shootingStars = useRef<ShootingStar[]>(generateShootingStars())
  // Random-positioned particles must only render after client mount to avoid
  // server/client hydration mismatches (Math.random differs each render).
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div
      className={cn(
        'fixed inset-0 z-0 pointer-events-none overflow-hidden',
        className
      )}
      aria-hidden="true"
    >
      {/* Deep space base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% 0%, #0D1321 0%, #070B14 60%, #050810 100%)',
        }}
      />

      {/* Aurora sweep — top */}
      <div
        className="absolute inset-x-0 top-0 h-[60vh]"
        style={{
          background:
            'conic-gradient(from 180deg at 50% -20%, rgba(124,92,255,0.15) 0deg, rgba(97,218,251,0.08) 60deg, transparent 120deg, transparent 240deg, rgba(255,122,229,0.10) 300deg, rgba(124,92,255,0.15) 360deg)',
          maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
        }}
      />

      {/* Animated radial orbs */}
      {ORB_CONFIGS.map((orb) => (
        <AnimatedOrb key={orb.id} config={orb} />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(148, 163, 184, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148, 163, 184, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '64px 64px',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
        }}
      />

      {/* Static stars (CSS particles) — client-only to avoid hydration drift */}
      {mounted && particles.current.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {mounted && shootingStars.current.map((star) => (
        <motion.div
          key={star.id}
          className="absolute h-px origin-left"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            rotate: star.angle,
            width: 0,
            background:
              'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 100%)',
          }}
          animate={{
            width: ['0px', '120px', '0px'],
            x: ['0px', '200px'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatDelay: Math.random() * 15 + 10,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Bottom vignette */}
      <div
        className="absolute inset-x-0 bottom-0 h-64 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, #070B14 0%, transparent 100%)',
        }}
      />
    </div>
  )
})
