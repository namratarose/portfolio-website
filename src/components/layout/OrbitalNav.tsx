'use client'

import { useEffect, useState, useCallback, useRef, memo } from 'react'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import { cn } from '@/lib/utils'
import {
  useNavigationStore,
  useCursorStore,
  type NavigationItem,
} from '@/store/portfolioStore'
import { useActiveSection } from '@/hooks/useActiveSection'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SatelliteConfig extends NavigationItem {
  orbitRadius: number
  orbitSpeed: number
  angle: number
  size: number
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavigationItem[] = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'system-design', label: 'System Design', href: '#system-design' },
  { id: 'blog', label: 'Blog', href: '#blog' },
  { id: 'fun', label: 'Fun', href: '#fun' },
]

const RADII = [52, 68, 84, 52, 68, 84, 52, 68]
const SPEEDS = [12, 16, 20, 14, 18, 22, 15, 19]

function buildSatellites(): SatelliteConfig[] {
  const count = NAV_ITEMS.length
  return NAV_ITEMS.map((item, i) => ({
    ...item,
    orbitRadius: RADII[i],
    orbitSpeed: SPEEDS[i],
    angle: (i / count) * 360,
    size: 6,
  }))
}

const SATELLITES = buildSatellites()

// ─── Single Satellite ─────────────────────────────────────────────────────────

interface SatelliteProps {
  config: SatelliteConfig
  isActive: boolean
  isHovered: boolean
  elapsed: number
  onNavigate: (id: string, href: string) => void
  onHover: (id: string | null) => void
}

const Satellite = memo(function Satellite({
  config,
  isActive,
  isHovered,
  elapsed,
  onNavigate,
  onHover,
}: SatelliteProps) {
  const { setCursorVariant } = useCursorStore()
  const speedMultiplier = isHovered ? 3 : 1
  const currentAngle =
    (config.angle + (elapsed / config.orbitSpeed) * speedMultiplier * 360) % 360
  const rad = (currentAngle * Math.PI) / 180
  const x = Math.cos(rad) * config.orbitRadius
  const y = Math.sin(rad) * config.orbitRadius

  return (
    <motion.button
      className="absolute focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-full"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      onClick={() => onNavigate(config.id, config.href)}
      onMouseEnter={() => {
        onHover(config.id)
        setCursorVariant('hover')
      }}
      onMouseLeave={() => {
        onHover(null)
        setCursorVariant('default')
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onNavigate(config.id, config.href)
        }
      }}
      aria-label={`Navigate to ${config.label}`}
      aria-current={isActive ? 'page' : undefined}
      whileTap={{ scale: 0.85 }}
    >
      <motion.div
        className="relative flex items-center justify-center rounded-full"
        animate={{
          width: isActive || isHovered ? 10 : 6,
          height: isActive || isHovered ? 10 : 6,
          backgroundColor: isActive
            ? '#7C5CFF'
            : isHovered
              ? 'rgba(124, 92, 255, 0.8)'
              : 'rgba(148, 163, 184, 0.6)',
          boxShadow: isActive
            ? '0 0 12px rgba(124, 92, 255, 0.9), 0 0 24px rgba(124, 92, 255, 0.4)'
            : isHovered
              ? '0 0 8px rgba(124, 92, 255, 0.6)'
              : 'none',
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Tooltip label */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="absolute left-4 whitespace-nowrap text-xs font-mono text-slate-200 bg-[#0D1321]/90 backdrop-blur-sm border border-[#1E293B] rounded-md px-2 py-1 pointer-events-none"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -4 }}
            transition={{ duration: 0.15 }}
            style={{ top: '50%', translateY: '-50%' }}
          >
            {config.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
})

// ─── Orbit Ring ───────────────────────────────────────────────────────────────

function OrbitRing({ radius, isActive }: { radius: number; isActive: boolean }) {
  return (
    <div
      className="absolute rounded-full border pointer-events-none"
      style={{
        width: radius * 2,
        height: radius * 2,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        borderColor: isActive
          ? 'rgba(124, 92, 255, 0.3)'
          : 'rgba(148, 163, 184, 0.06)',
        boxShadow: isActive
          ? `0 0 12px rgba(124, 92, 255, 0.15) inset`
          : 'none',
        transition: 'border-color 0.4s, box-shadow 0.4s',
      }}
    />
  )
}

// ─── Mobile Nav ───────────────────────────────────────────────────────────────

function MobileNav({
  isOpen,
  activeSection,
  onNavigate,
  onClose,
}: {
  isOpen: boolean
  activeSection: string
  onNavigate: (id: string, href: string) => void
  onClose: () => void
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-[#070B14]/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Nav panel */}
          <motion.nav
            className="fixed top-0 right-0 z-50 h-full w-72 bg-[#0D1321]/95 backdrop-blur-xl border-l border-[#1E293B] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            aria-label="Mobile navigation"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#1E293B]">
              <span className="font-display font-semibold text-slate-200 tracking-wide">
                Navigation
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-[#1E293B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFF]"
                aria-label="Close navigation"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Nav items */}
            <ul className="flex-1 overflow-y-auto py-4 px-3 space-y-1" role="list">
              {NAV_ITEMS.map((item, i) => {
                const isActive = activeSection === item.id
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <button
                      onClick={() => {
                        onNavigate(item.id, item.href)
                        onClose()
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFF]',
                        isActive
                          ? 'bg-[#7C5CFF]/15 text-[#7C5CFF] border border-[#7C5CFF]/20'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#1E293B]'
                      )}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <span
                        className={cn(
                          'w-1.5 h-1.5 rounded-full flex-shrink-0',
                          isActive ? 'bg-[#7C5CFF]' : 'bg-slate-600'
                        )}
                      />
                      {item.label}
                    </button>
                  </motion.li>
                )
              })}
            </ul>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#1E293B]">
              <p className="text-xs font-mono text-slate-600">OrbitOS v1.0</p>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}

// ─── Main OrbitalNav ──────────────────────────────────────────────────────────

export const OrbitalNav = memo(function OrbitalNav() {
  const { activeSection, setActiveSection, isNavOpen, setNavOpen } = useNavigationStore()
  const { setCursorVariant } = useCursorStore()
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startTimeRef = useRef(Date.now())
  const rafRef = useRef<number | null>(null)
  const centerControls = useAnimationControls()

  // Track mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Animation loop for orbital positions
  useEffect(() => {
    if (isMobile) return
    const tick = () => {
      setElapsed((Date.now() - startTimeRef.current) / 1000)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [isMobile])

  // Register active section tracking
  useActiveSection(NAV_ITEMS.map((n) => n.id))

  const handleNavigate = useCallback(
    (id: string, href: string) => {
      setActiveSection(id)
      const el = document.querySelector(href)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    [setActiveSection]
  )

  // Pulse center node when active section changes
  useEffect(() => {
    centerControls.start({
      scale: [1, 1.4, 1],
      boxShadow: [
        '0 0 6px rgba(124, 92, 255, 0.4)',
        '0 0 20px rgba(124, 92, 255, 0.9)',
        '0 0 6px rgba(124, 92, 255, 0.4)',
      ],
      transition: { duration: 0.6 },
    })
  }, [activeSection, centerControls])

  // Keyboard: close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNavOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [setNavOpen])

  const uniqueRadii = [...new Set(SATELLITES.map((s) => s.orbitRadius))]

  // ── Mobile render ──────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Hamburger trigger */}
        <button
          className="fixed top-5 right-5 z-50 w-10 h-10 rounded-xl bg-[#0D1321]/90 backdrop-blur-sm border border-[#1E293B] flex flex-col items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFF]"
          onClick={() => setNavOpen(!isNavOpen)}
          aria-label={isNavOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isNavOpen}
          aria-controls="mobile-nav"
        >
          <motion.span
            className="block h-px w-5 bg-slate-300 origin-center"
            animate={isNavOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
          />
          <motion.span
            className="block h-px w-5 bg-slate-300"
            animate={isNavOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
          />
          <motion.span
            className="block h-px w-5 bg-slate-300 origin-center"
            animate={isNavOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
          />
        </button>

        <MobileNav
          isOpen={isNavOpen}
          activeSection={activeSection}
          onNavigate={handleNavigate}
          onClose={() => setNavOpen(false)}
        />
      </>
    )
  }

  // ── Desktop orbital render ─────────────────────────────────────────────────
  return (
    <nav
      className="fixed top-6 right-6 z-50"
      aria-label="Orbital navigation"
      role="navigation"
    >
      {/* Orbital system container */}
      <div
        className="relative flex items-center justify-center"
        style={{ width: 200, height: 200 }}
      >
        {/* Orbit path rings */}
        {uniqueRadii.map((r) => {
          const hasActiveSatellite = SATELLITES.some(
            (s) => s.orbitRadius === r && s.id === activeSection
          )
          return <OrbitRing key={r} radius={r} isActive={hasActiveSatellite} />
        })}

        {/* Center node */}
        <button
          className="absolute z-10 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFF] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
          style={{ width: 28, height: 28 }}
          onClick={() => handleNavigate('hero', '#hero')}
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
          aria-label="Navigate to top"
        >
          <motion.div
            animate={centerControls}
            className="w-7 h-7 rounded-full bg-[#7C5CFF]/20 border border-[#7C5CFF]/50 flex items-center justify-center"
            style={{ boxShadow: '0 0 6px rgba(124, 92, 255, 0.4)' }}
          >
            <span className="font-display text-[9px] font-bold text-[#7C5CFF] select-none leading-none">
              N
            </span>
          </motion.div>

          {/* Pulsing halo */}
          <motion.div
            className="absolute inset-0 rounded-full border border-[#7C5CFF]/30"
            animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
          />
        </button>

        {/* Satellite nav items */}
        <div className="absolute inset-0 flex items-center justify-center">
          {SATELLITES.map((sat) => (
            <Satellite
              key={sat.id}
              config={sat}
              isActive={activeSection === sat.id}
              isHovered={hoveredId === sat.id}
              elapsed={elapsed}
              onNavigate={handleNavigate}
              onHover={setHoveredId}
            />
          ))}
        </div>
      </div>

      {/* Active section label */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.2 }}
        >
          <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
            {NAV_ITEMS.find((n) => n.id === activeSection)?.label ?? ''}
          </span>
        </motion.div>
      </AnimatePresence>
    </nav>
  )
})
