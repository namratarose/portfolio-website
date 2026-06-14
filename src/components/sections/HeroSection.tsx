'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { OrbitalSystem, type OrbitConfig, type OrbitObject } from '@/components/physics/OrbitalSystem'
import { TypingAnimation } from '@/components/animations/TypingAnimation'
import { ParticleField } from '@/components/animations/ParticleField'
import { siteConfig } from '@/config/site'
import { useSetActiveSection } from '@/store/portfolioStore'

// ─── Orbital Tech Tags ────────────────────────────────────────────────────────

interface TechTag {
  id: string
  label: string
  color: string
  bg: string
  border: string
  targetSection: string
  orbitIndex: number
}

const TECH_TAGS: TechTag[] = [
  { id: 'go',            label: 'Go',            color: '#61DAFB', bg: 'rgba(97,218,251,0.12)',  border: 'rgba(97,218,251,0.4)',  targetSection: 'skills',     orbitIndex: 0 },
  { id: 'nestjs',        label: 'NestJS',         color: '#FF7AE5', bg: 'rgba(255,122,229,0.12)', border: 'rgba(255,122,229,0.4)', targetSection: 'skills',     orbitIndex: 1 },
  { id: 'aws',           label: 'AWS',            color: '#F9D423', bg: 'rgba(249,212,35,0.12)',  border: 'rgba(249,212,35,0.4)',  targetSection: 'experience', orbitIndex: 0 },
  { id: 'dynamodb',      label: 'DynamoDB',       color: '#7C5CFF', bg: 'rgba(124,92,255,0.12)', border: 'rgba(124,92,255,0.4)',  targetSection: 'skills',     orbitIndex: 1 },
  { id: 'redis',         label: 'Redis',          color: '#FF6B6B', bg: 'rgba(255,107,107,0.12)', border: 'rgba(255,107,107,0.4)', targetSection: 'skills',     orbitIndex: 0 },
  { id: 'typescript',    label: 'TypeScript',     color: '#61DAFB', bg: 'rgba(97,218,251,0.12)',  border: 'rgba(97,218,251,0.4)',  targetSection: 'skills',     orbitIndex: 1 },
  { id: 'systemdesign',  label: 'System Design',  color: '#06D6A0', bg: 'rgba(6,214,160,0.12)',   border: 'rgba(6,214,160,0.4)',   targetSection: 'projects',   orbitIndex: 0 },
  { id: 'python',        label: 'Python',         color: '#F77F00', bg: 'rgba(247,127,0,0.12)',   border: 'rgba(247,127,0,0.4)',   targetSection: 'skills',     orbitIndex: 1 },
]

const ORBITS: OrbitConfig[] = [
  { id: 'inner',  radius: 155, speed: 0.45, startAngle: 0,   inclination: 18, color: '#7C5CFF', dashed: false },
  { id: 'outer',  radius: 240, speed: -0.28, startAngle: 45, inclination: 22, color: '#61DAFB', dashed: true  },
]

// ─── Scroll Indicator ─────────────────────────────────────────────────────────

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer select-none"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.6, duration: 0.6 }}
      onClick={() => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
      }}
    >
      <span className="text-[10px] tracking-[0.25em] uppercase text-white/30 font-mono">scroll</span>
      <motion.div
        className="w-px h-10 bg-gradient-to-b from-[#7C5CFF]/60 to-transparent"
        animate={{ scaleY: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.svg
        width="14" height="8" viewBox="0 0 14 8" fill="none"
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M1 1l6 6 6-6" stroke="#7C5CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </motion.svg>
    </motion.div>
  )
}

// ─── Center Node ──────────────────────────────────────────────────────────────

function CenterNode() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-1"
      >
        {/* Status dot */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06D6A0] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06D6A0]" />
          </span>
          <span className="text-[10px] text-[#06D6A0]/80 font-mono tracking-widest uppercase">SDE-1 @ KGeN</span>
        </div>

        <h1
          className="font-bold leading-none tracking-tight"
          style={{
            fontSize: 'clamp(1.15rem, 3.5vw, 1.65rem)',
            background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 60%, #7C5CFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Namrata<br />Kesarwani
        </h1>

        <div className="mt-1 h-[1.4em] overflow-hidden">
          <TypingAnimation
            strings={siteConfig.author.taglines}
            speed={55}
            deleteSpeed={28}
            pauseTime={1800}
            startDelay={900}
            cursor
            className="text-xs font-mono text-[#61DAFB]/70 tracking-widest uppercase"
            cursorClassName="text-[#7C5CFF]"
          />
        </div>
      </motion.div>
    </div>
  )
}

// ─── Tag Badge ────────────────────────────────────────────────────────────────

function TagBadge({ tag, onClick }: { tag: TechTag; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono font-semibold whitespace-nowrap cursor-pointer select-none"
      style={{
        color: tag.color,
        background: tag.bg,
        border: `1px solid ${tag.border}`,
        boxShadow: `0 0 12px ${tag.color}22, inset 0 0 8px ${tag.color}08`,
      }}
      aria-label={`Navigate to ${tag.label} section`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full flex-shrink-0"
        style={{ background: tag.color, boxShadow: `0 0 6px ${tag.color}` }}
      />
      {tag.label}
    </motion.button>
  )
}

// ─── Mobile Orbital Grid ──────────────────────────────────────────────────────

function MobileOrbGrid({ tags, onTagClick }: { tags: TechTag[]; onTagClick: (tag: TechTag) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-2 max-w-xs mx-auto mt-6">
      {tags.map((tag, i) => (
        <motion.div
          key={tag.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 + i * 0.08, duration: 0.4 }}
        >
          <TagBadge tag={tag} onClick={() => onTagClick(tag)} />
        </motion.div>
      ))}
    </div>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

export function HeroSection() {
  const setActiveSection = useSetActiveSection()
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Parallax motion values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 20 })
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 20 })

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      mouseX.set((e.clientX - cx) * 0.04)
      mouseY.set((e.clientY - cy) * 0.04)
    },
    [mouseX, mouseY]
  )

  const handleTagClick = useCallback((tag: TechTag) => {
    const el = document.getElementById(tag.targetSection)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(tag.targetSection)
    }
  }, [setActiveSection])

  // Build orbital objects
  const orbitalObjects: OrbitObject[] = TECH_TAGS.map((tag) => ({
    orbitId: tag.orbitIndex === 0 ? 'inner' : 'outer',
    size: 90,
    content: <TagBadge tag={tag} onClick={() => handleTagClick(tag)} />,
  }))

  if (!mounted) return null

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full overflow-hidden flex flex-col items-center justify-center"
      style={{ minHeight: '100dvh' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mouseX.set(0); mouseY.set(0) }}
    >
      {/* Particle field layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ParticleField count={80} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full">
        {isMobile ? (
          /* ── Mobile Layout ── */
          <motion.div
            className="flex flex-col items-center px-6 pt-20 pb-24 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Glowing center circle — mobile */}
            <motion.div
              className="relative flex items-center justify-center rounded-full mb-2"
              style={{ width: 220, height: 220 }}
              animate={{
                boxShadow: [
                  '0 0 40px rgba(124,92,255,0.45), 0 0 80px rgba(124,92,255,0.2)',
                  '0 0 65px rgba(124,92,255,0.7), 0 0 130px rgba(124,92,255,0.3)',
                  '0 0 40px rgba(124,92,255,0.45), 0 0 80px rgba(124,92,255,0.2)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Ring decoration */}
              <div
                className="absolute inset-0 rounded-full"
                style={{ border: '1px solid rgba(124,92,255,0.3)' }}
              />
              <div
                className="absolute rounded-full"
                style={{ inset: 12, border: '1px dashed rgba(97,218,251,0.2)' }}
              />
              <CenterNode />
            </motion.div>

            <MobileOrbGrid tags={TECH_TAGS} onTagClick={handleTagClick} />

            {/* Tagline */}
            <motion.p
              className="mt-6 text-center text-sm text-white/40 font-mono max-w-[260px] leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
            >
              Building distributed systems &amp; AI pipelines that scale.
            </motion.p>
          </motion.div>
        ) : (
          /* ── Desktop Orbital Layout ── */
          <motion.div
            style={{ x: smoothX, y: smoothY }}
            className="relative"
          >
            {/* Intro entrance sequence */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <OrbitalSystem
                centerContent={<CenterNode />}
                centerSize={190}
                orbits={ORBITS}
                objects={orbitalObjects}
                className="w-[560px] h-[560px]"
              />
            </motion.div>

            {/* Outer decorative ring */}
            <svg
              className="pointer-events-none absolute"
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              width={600} height={600}
              viewBox="0 0 600 600"
            >
              <defs>
                <filter id="ring-outer-glow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <ellipse
                cx={300} cy={300} rx={290} ry={265}
                fill="none"
                stroke="rgba(124,92,255,0.12)"
                strokeWidth={1}
                strokeDasharray="2 6"
                filter="url(#ring-outer-glow)"
              />
            </svg>
          </motion.div>
        )}

        {/* Bio tagline — desktop only, below orbit */}
        {!isMobile && (
          <motion.div
            className="mt-10 text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.2, duration: 0.7 }}
          >
            <p className="text-sm text-white/35 font-mono tracking-wide max-w-sm mx-auto">
              Backend engineer at KGeN — microservices, AI data pipelines, and a lot still to learn.
            </p>
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />

      {/* Bottom gradient fade */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to top, #070B14 0%, transparent 100%)' }}
      />
    </section>
  )
}
