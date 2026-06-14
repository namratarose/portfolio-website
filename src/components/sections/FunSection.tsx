'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DevMode {
  id: number
  icon: string
  name: string
  shortName: string
  tagline: string
  color: string
  glow: string
  bgGradient: string
  borderColor: string
  powers: string[]
  stats: { speed: number; scalability: number; reliability: number; dx: number }
  realCase: string
}

// ─── Data ────────────────────────────────────────────────────────────────────

const DEV_MODES: DevMode[] = [
  {
    id: 0,
    icon: '⚡',
    name: 'NestJS Mode',
    shortName: 'NESTJS',
    tagline: 'The Microservice Architect',
    color: '#E0234E',
    glow: 'rgba(224,35,78,0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(224,35,78,0.15) 0%, rgba(224,35,78,0.03) 100%)',
    borderColor: 'rgba(224,35,78,0.4)',
    powers: [
      'Summons dependency injection containers from thin air',
      'Guards, interceptors, and pipes materialize on command',
      'Microservices multiply across the cluster autonomously',
    ],
    stats: { speed: 88, scalability: 95, reliability: 92, dx: 90 },
    realCase: 'Built KGeN\'s core gaming reward microservices handling 10k+ concurrent reward events with NestJS event-driven architecture.',
  },
  {
    id: 1,
    icon: '🔷',
    name: 'Go Mode',
    shortName: 'GOLANG',
    tagline: 'The Concurrent Goroutine',
    color: '#00ACD7',
    glow: 'rgba(0,172,215,0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(0,172,215,0.15) 0%, rgba(0,172,215,0.03) 100%)',
    borderColor: 'rgba(0,172,215,0.4)',
    powers: [
      'Spawns 10,000 goroutines with zero cold sweat',
      'Channels messages faster than the speed of mutex',
      'Memory leaks simply cease to exist in this form',
    ],
    stats: { speed: 99, scalability: 97, reliability: 95, dx: 82 },
    realCase: 'Wrote Go services for high-throughput blockchain event listeners processing 50k+ transactions per minute without breaking a sweat.',
  },
  {
    id: 2,
    icon: '☁️',
    name: 'AWS Mode',
    shortName: 'AWS',
    tagline: 'The Cloud Architect',
    color: '#FF9900',
    glow: 'rgba(255,153,0,0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(255,153,0,0.15) 0%, rgba(255,153,0,0.03) 100%)',
    borderColor: 'rgba(255,153,0,0.4)',
    powers: [
      'Deploys to any region simultaneously — latency is a mindset',
      'Auto-scaling groups form a protective shield around the app',
      'Lambda functions appear and disappear like quantum particles',
    ],
    stats: { speed: 85, scalability: 99, reliability: 97, dx: 80 },
    realCase: 'Architected multi-region AWS infrastructure for KGeN\'s gaming platform — SQS, Lambda, DynamoDB, and CloudWatch living in perfect harmony.',
  },
  {
    id: 3,
    icon: '🔴',
    name: 'Redis Mode',
    shortName: 'REDIS',
    tagline: 'The Speed Daemon',
    color: '#FF4438',
    glow: 'rgba(255,68,56,0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(255,68,56,0.15) 0%, rgba(255,68,56,0.03) 100%)',
    borderColor: 'rgba(255,68,56,0.4)',
    powers: [
      'Response time drops to single-digit microseconds on sight',
      'Cache invalidation strategy manifests flawlessly (rare ability)',
      'Pub/Sub channels transmit messages at the speed of RAM',
    ],
    stats: { speed: 100, scalability: 90, reliability: 88, dx: 85 },
    realCase: 'Eliminated race conditions in OAuth token refresh flow using Redis atomic operations — dropped duplicate token issuance by 100%.',
  },
  {
    id: 4,
    icon: '🔗',
    name: 'Blockchain Mode',
    shortName: 'CHAIN',
    tagline: 'The Chain Master',
    color: '#F7931A',
    glow: 'rgba(247,147,26,0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(247,147,26,0.15) 0%, rgba(247,147,26,0.03) 100%)',
    borderColor: 'rgba(247,147,26,0.4)',
    powers: [
      'Smart contracts deploy themselves with complete determinism',
      'Decentralized transactions flow through fingers like water',
      'Immutable logs materialize — nothing can be altered or denied',
    ],
    stats: { speed: 72, scalability: 93, reliability: 99, dx: 75 },
    realCase: 'Built Polygon-based NFT reward system for KGeN gamers — on-chain asset distribution at scale with gas-optimized batch transactions.',
  },
  {
    id: 5,
    icon: '🧠',
    name: 'AI Pipeline Mode',
    shortName: 'AI/ML',
    tagline: 'The Data Alchemist',
    color: '#9B59B6',
    glow: 'rgba(155,89,182,0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(155,89,182,0.15) 0%, rgba(155,89,182,0.03) 100%)',
    borderColor: 'rgba(155,89,182,0.4)',
    powers: [
      'Transforms raw audio chaos into labeled ML gold',
      'ETL pipelines materialize and execute without supervision',
      'Data quality issues are detected before they dare exist',
    ],
    stats: { speed: 80, scalability: 94, reliability: 91, dx: 88 },
    realCase: 'Built end-to-end audio labeling pipeline at Karya — automated transcription + review workflow processing 100k+ audio clips for ASR model training.',
  },
  {
    id: 6,
    icon: '🛡️',
    name: 'Security Mode',
    shortName: 'AUTH',
    tagline: 'The Auth Guardian',
    color: '#2ECC71',
    glow: 'rgba(46,204,113,0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(46,204,113,0.15) 0%, rgba(46,204,113,0.03) 100%)',
    borderColor: 'rgba(46,204,113,0.4)',
    powers: [
      'Race conditions dissolve upon being observed',
      'OAuth flows become unhackable on contact with this form',
      'JWT expiry edge cases are handled before they clock out',
    ],
    stats: { speed: 85, scalability: 88, reliability: 99, dx: 83 },
    realCase: 'Fixed critical OAuth race condition at KGeN — Redis atomic SETNX eliminated duplicate refresh tokens across 50k+ DAU gaming sessions.',
  },
  {
    id: 7,
    icon: '🗄️',
    name: 'DynamoDB Mode',
    shortName: 'DYNAMO',
    tagline: 'The NoSQL Wizard',
    color: '#4A90D9',
    glow: 'rgba(74,144,217,0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(74,144,217,0.15) 0%, rgba(74,144,217,0.03) 100%)',
    borderColor: 'rgba(74,144,217,0.4)',
    powers: [
      'Access patterns crystallize into perfect partition keys',
      'GSIs materialize exactly where the query needs them',
      'Infinite scale achieved — single-digit millisecond reads',
    ],
    stats: { speed: 95, scalability: 99, reliability: 96, dx: 79 },
    realCase: 'Designed DynamoDB schema for KGeN\'s player reward ledger — careful GSI planning enabled 5 distinct query patterns with zero table scans.',
  },
  {
    id: 8,
    icon: '🐍',
    name: 'Python Mode',
    shortName: 'PYTHON',
    tagline: 'The Automation Snake',
    color: '#3776AB',
    glow: 'rgba(55,118,171,0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(55,118,171,0.15) 0%, rgba(55,118,171,0.03) 100%)',
    borderColor: 'rgba(55,118,171,0.4)',
    powers: [
      'ETL pipelines script themselves into existence overnight',
      'CSV data wrangles itself without crying for help',
      'Automation scripts reproduce faster than the problems they fix',
    ],
    stats: { speed: 75, scalability: 85, reliability: 88, dx: 96 },
    realCase: 'Automated Karya\'s data labeling ETL — Python scripts reduced manual preprocessing from 8 hours per batch to 12 minutes.',
  },
  {
    id: 9,
    icon: '🎯',
    name: 'TypeScript Mode',
    shortName: 'TYPESCRIPT',
    tagline: 'The Type Safety Champion',
    color: '#3178C6',
    glow: 'rgba(49,120,198,0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(49,120,198,0.15) 0%, rgba(49,120,198,0.03) 100%)',
    borderColor: 'rgba(49,120,198,0.4)',
    powers: [
      'Runtime errors evaporate at compile time — permanently',
      'Generics bend to the will of any data shape imaginable',
      '\'any\' type usage is forbidden within a 10-meter radius',
    ],
    stats: { speed: 83, scalability: 90, reliability: 97, dx: 98 },
    realCase: 'Enforced strict TypeScript across KGeN\'s backend monorepo — eliminated entire class of runtime null-pointer bugs across 15+ service modules.',
  },
  {
    id: 10,
    icon: '🔧',
    name: 'System Design Mode',
    shortName: 'ARCHITECTURE',
    tagline: 'The Architecture Oracle',
    color: '#06D6A0',
    glow: 'rgba(6,214,160,0.5)',
    bgGradient: 'linear-gradient(135deg, rgba(6,214,160,0.15) 0%, rgba(6,214,160,0.03) 100%)',
    borderColor: 'rgba(6,214,160,0.4)',
    powers: [
      'Bottlenecks become visible before load testing even begins',
      'CAP theorem is weighed instantly for any given situation',
      'Diagrams draw themselves in Excalidraw-compatible clarity',
    ],
    stats: { speed: 82, scalability: 98, reliability: 95, dx: 92 },
    realCase: 'Designed distributed reward settlement system at KGeN — event-driven architecture with idempotency keys prevented duplicate payouts across retries.',
  },
  {
    id: 11,
    icon: '🚀',
    name: 'Full Stack Mode',
    shortName: 'OMNIPOTENT',
    tagline: 'The Omnipotent Engineer',
    color: '#7C5CFF',
    glow: 'rgba(124,92,255,0.6)',
    bgGradient: 'linear-gradient(135deg, rgba(124,92,255,0.2) 0%, rgba(97,218,251,0.08) 100%)',
    borderColor: 'rgba(124,92,255,0.5)',
    powers: [
      'All 11 forms simultaneously active — system remains stable',
      'Frontend, backend, infra, and prod incidents handled in parallel',
      'The codebase is both perfectly typed AND infinitely scalable',
    ],
    stats: { speed: 95, scalability: 99, reliability: 98, dx: 99 },
    realCase: 'Shipped KGeN\'s full gaming reward platform end-to-end: NestJS APIs + Go event listeners + DynamoDB + Redis + Polygon blockchain + AWS infra — solo.',
  },
]

// ─── Stat Bar ─────────────────────────────────────────────────────────────────

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">{label}</span>
        <span className="text-[10px] font-mono font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
        />
      </div>
    </div>
  )
}

// ─── DEVTRIX Dial ──────────────────────────────────────────────────────────────

interface DevtrixDialProps {
  modes: DevMode[]
  activeIndex: number
  onSelect: (index: number) => void
  isTransforming: boolean
}

function DevtrixDial({ modes, activeIndex, onSelect, isTransforming }: DevtrixDialProps) {
  const radius = 130
  const centerX = 160
  const centerY = 160

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: 320, height: 320 }}>
      {/* SVG rings */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={320}
        height={320}
        viewBox="0 0 320 320"
      >
        {/* Outer decorative ring */}
        <circle cx={160} cy={160} r={155} fill="none" stroke="rgba(124,92,255,0.15)" strokeWidth={1} strokeDasharray="4 8" />
        {/* Middle ring */}
        <circle cx={160} cy={160} r={138} fill="none" stroke="rgba(124,92,255,0.08)" strokeWidth={0.5} />
        {/* Inner glow ring */}
        <circle cx={160} cy={160} r={52} fill="none" stroke={modes[activeIndex].color} strokeWidth={1} strokeOpacity={0.4} />
        {/* Tick marks at each mode position */}
        {modes.map((_, i) => {
          const angle = (i / modes.length) * 2 * Math.PI - Math.PI / 2
          const x1 = centerX + 142 * Math.cos(angle)
          const y1 = centerY + 142 * Math.sin(angle)
          const x2 = centerX + 152 * Math.cos(angle)
          const y2 = centerY + 152 * Math.sin(angle)
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={i === activeIndex ? modes[activeIndex].color : 'rgba(255,255,255,0.15)'}
              strokeWidth={i === activeIndex ? 2 : 1}
            />
          )
        })}
      </svg>

      {/* Mode buttons positioned on the dial */}
      {modes.map((mode, i) => {
        const angle = (i / modes.length) * 2 * Math.PI - Math.PI / 2
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        const isActive = i === activeIndex

        return (
          <motion.button
            key={mode.id}
            className="absolute flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
            style={{
              width: 36,
              height: 36,
              left: x - 18,
              top: y - 18,
              background: isActive
                ? `radial-gradient(circle, ${mode.color}30, ${mode.color}10)`
                : 'rgba(255,255,255,0.04)',
              border: `1.5px solid ${isActive ? mode.color : 'rgba(255,255,255,0.12)'}`,
              boxShadow: isActive ? `0 0 12px ${mode.glow}, 0 0 24px ${mode.glow}` : 'none',
              fontSize: 16,
            }}
            onClick={() => onSelect(i)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            title={mode.name}
          >
            {mode.icon}
          </motion.button>
        )
      })}

      {/* Center core */}
      <motion.div
        className="absolute flex flex-col items-center justify-center rounded-full text-center z-10"
        style={{
          width: 100,
          height: 100,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${modes[activeIndex].color}18, rgba(7,11,20,0.95))`,
          border: `2px solid ${modes[activeIndex].borderColor}`,
          boxShadow: `0 0 20px ${modes[activeIndex].glow}, inset 0 0 20px rgba(0,0,0,0.5)`,
        }}
        animate={{
          boxShadow: isTransforming
            ? [
                `0 0 20px ${modes[activeIndex].glow}`,
                `0 0 60px ${modes[activeIndex].glow}, 0 0 100px ${modes[activeIndex].glow}`,
                `0 0 20px ${modes[activeIndex].glow}`,
              ]
            : `0 0 20px ${modes[activeIndex].glow}`,
        }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-xl leading-none">{modes[activeIndex].icon}</span>
        <span
          className="text-[8px] font-mono font-bold tracking-wider mt-1 leading-tight px-1"
          style={{ color: modes[activeIndex].color }}
        >
          {modes[activeIndex].shortName}
        </span>
      </motion.div>

      {/* DEVTRIX label */}
      <div className="absolute -bottom-7 left-0 right-0 flex justify-center">
        <span className="font-mono text-[10px] tracking-[0.4em] text-white/25 uppercase">DEVTRIX</span>
      </div>
    </div>
  )
}

// ─── Power Card ───────────────────────────────────────────────────────────────

function PowerCard({ mode, isVisible }: { mode: DevMode; isVisible: boolean }) {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key={mode.id}
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl overflow-hidden"
          style={{
            background: mode.bgGradient,
            border: `1px solid ${mode.borderColor}`,
            boxShadow: `0 0 30px ${mode.glow}22`,
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center gap-3"
            style={{
              borderBottom: `1px solid ${mode.borderColor}`,
              background: `linear-gradient(90deg, ${mode.color}15, transparent)`,
            }}
          >
            <span className="text-3xl">{mode.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base leading-tight">{mode.name}</h3>
                <span
                  className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                  style={{
                    background: `${mode.color}20`,
                    color: mode.color,
                    border: `1px solid ${mode.color}40`,
                  }}
                >
                  ACTIVE
                </span>
              </div>
              <p className="text-xs font-mono mt-0.5" style={{ color: `${mode.color}cc` }}>
                {mode.tagline}
              </p>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 gap-4">
            {/* Powers */}
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Power Abilities</p>
              <ul className="flex flex-col gap-1.5">
                {mode.powers.map((power, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                    <span style={{ color: mode.color }} className="mt-0.5 flex-shrink-0">▸</span>
                    {power}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3">Battle Stats</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                <StatBar label="Speed" value={mode.stats.speed} color={mode.color} />
                <StatBar label="Scalability" value={mode.stats.scalability} color={mode.color} />
                <StatBar label="Reliability" value={mode.stats.reliability} color={mode.color} />
                <StatBar label="Dev XP" value={mode.stats.dx} color={mode.color} />
              </div>
            </div>

            {/* Real case */}
            <div
              className="rounded-xl p-3"
              style={{ background: `${mode.color}08`, border: `1px solid ${mode.color}20` }}
            >
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Real Use Case</p>
              <p className="text-xs text-white/60 leading-relaxed">{mode.realCase}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Transformation Flash ──────────────────────────────────────────────────────

function TransformFlash({ color, visible }: { color: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.35, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, times: [0, 0.3, 1] }}
          style={{ background: color }}
        />
      )}
    </AnimatePresence>
  )
}

// ─── Fun Section ──────────────────────────────────────────────────────────────

export function FunSection() {
  const [activeIndex, setActiveIndex] = useState(11)
  const [isTransforming, setIsTransforming] = useState(false)
  const [showFlash, setShowFlash] = useState(false)
  const [cardVisible, setCardVisible] = useState(true)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSelect = useCallback(
    (index: number) => {
      if (index === activeIndex || isTransforming) return
      if (timeoutRef.current) clearTimeout(timeoutRef.current)

      setIsTransforming(true)
      setShowFlash(true)
      setCardVisible(false)

      timeoutRef.current = setTimeout(() => {
        setActiveIndex(index)
        setShowFlash(false)
        setCardVisible(true)
        setIsTransforming(false)
      }, 400)
    },
    [activeIndex, isTransforming]
  )

  const handleCycle = useCallback(() => {
    handleSelect((activeIndex + 1) % DEV_MODES.length)
  }, [activeIndex, handleSelect])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const mode = DEV_MODES[activeIndex]

  return (
    <section id="fun" className="relative w-full py-24 overflow-hidden">
      <TransformFlash color={mode.color} visible={showFlash} />

      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 50%, ${mode.color}06 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest border"
            style={{
              background: 'rgba(124,92,255,0.08)',
              borderColor: 'rgba(124,92,255,0.2)',
              color: '#7C5CFF',
            }}
          >
            <span className="animate-pulse">◈</span>
            Developer Transformation Device
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            DEVTRIX <span style={{ color: '#7C5CFF' }}>Simulator</span>
          </h2>
          <p className="text-sm text-white/40 font-mono max-w-md mx-auto">
            Select a mode on the dial. Witness the transformation. Deploy accordingly.
          </p>
        </motion.div>

        {/* Main layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-16 justify-center">
          {/* Left: dial */}
          <motion.div
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <DevtrixDial
              modes={DEV_MODES}
              activeIndex={activeIndex}
              onSelect={handleSelect}
              isTransforming={isTransforming}
            />

            {/* Cycle button */}
            <motion.button
              onClick={handleCycle}
              disabled={isTransforming}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(135deg, ${mode.color}20, ${mode.color}08)`,
                border: `1px solid ${mode.color}50`,
                color: mode.color,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <motion.span
                animate={{ rotate: isTransforming ? 360 : 0 }}
                transition={{ duration: 0.5 }}
              >
                ↻
              </motion.span>
              Next Mode
            </motion.button>

            {/* Mode counter */}
            <div className="flex gap-1.5 flex-wrap justify-center max-w-[180px]">
              {DEV_MODES.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full cursor-pointer"
                  style={{
                    background: i === activeIndex ? mode.color : 'rgba(255,255,255,0.12)',
                    boxShadow: i === activeIndex ? `0 0 6px ${mode.glow}` : 'none',
                  }}
                  onClick={() => handleSelect(i)}
                  whileHover={{ scale: 1.5 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Right: power card */}
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <PowerCard mode={mode} isVisible={cardVisible} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
