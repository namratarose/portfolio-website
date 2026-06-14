'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

interface NodeDef {
  id: string
  label: string
  sublabel: string
  icon: string
  x: number
  y: number
  color: string
  glow: string
  description: string
  tech: string
  layer: 'client' | 'gateway' | 'service' | 'cache' | 'queue' | 'data'
}

interface EdgeDef {
  id: string
  from: string
  to: string
  label?: string
  bidirectional?: boolean
}

interface Particle {
  id: number
  pathIndex: number
  progress: number
  speed: number
  color: string
  size: number
}

interface Metrics {
  rps: number
  cacheHitRate: number
  latency: number
  activeNodes: number
  queueDepth: number
  lambdaInstances: number
}

// ─── Node Definitions ─────────────────────────────────────────────────────────

const NODES: NodeDef[] = [
  {
    id: 'client',
    label: 'Client',
    sublabel: 'Browser / Mobile',
    icon: '⊡',
    x: 50,
    y: 40,
    color: '#61DAFB',
    glow: 'rgba(97,218,251,0.4)',
    description: 'Web and mobile clients initiating API requests. Handles authentication tokens, request retries, and response caching.',
    tech: 'React / React Native',
    layer: 'client',
  },
  {
    id: 'api-gateway',
    label: 'API Gateway',
    sublabel: 'Rate limiting & routing',
    icon: '◈',
    x: 300,
    y: 40,
    color: '#7C5CFF',
    glow: 'rgba(124,92,255,0.4)',
    description: 'AWS API Gateway handling authentication, rate limiting (10k req/s), request routing, and SSL termination.',
    tech: 'AWS API Gateway',
    layer: 'gateway',
  },
  {
    id: 'auth',
    label: 'Auth Service',
    sublabel: 'OAuth 2.0 + JWT',
    icon: '⬡',
    x: 550,
    y: 40,
    color: '#FF7AE5',
    glow: 'rgba(255,122,229,0.4)',
    description: 'OAuth 2.0 provider with distributed locking via Redis to prevent race conditions. Issues JWT tokens with 1h expiry.',
    tech: 'NestJS + Redis Lock',
    layer: 'service',
  },
  {
    id: 'user-service',
    label: 'User Service',
    sublabel: 'Profile management',
    icon: '◉',
    x: 150,
    y: 200,
    color: '#06D6A0',
    glow: 'rgba(6,214,160,0.4)',
    description: 'Manages user profiles, preferences, and account data. Writes to DynamoDB with single-digit ms latency.',
    tech: 'Go + DynamoDB',
    layer: 'service',
  },
  {
    id: 'blockchain',
    label: 'Blockchain Service',
    sublabel: 'Transaction routing',
    icon: '⬟',
    x: 380,
    y: 200,
    color: '#F77F00',
    glow: 'rgba(247,127,0,0.4)',
    description: 'Multi-strategy blockchain transaction routing with automatic failover. Processes 500+ tx/day with 99.8% success rate.',
    tech: 'Go + Ethereum SDK',
    layer: 'service',
  },
  {
    id: 'ai-pipeline',
    label: 'AI Pipeline',
    sublabel: 'Sarvam AI integration',
    icon: '◇',
    x: 610,
    y: 200,
    color: '#F9D423',
    glow: 'rgba(249,212,35,0.4)',
    description: 'AI-powered data processing pipeline integrating Sarvam AI for NLP tasks. Processes 1M+ records via distributed workers.',
    tech: 'Go + Sarvam AI',
    layer: 'service',
  },
  {
    id: 'redis',
    label: 'Redis Cache',
    sublabel: 'L2 cache + locks',
    icon: '⬤',
    x: 100,
    y: 360,
    color: '#FF6B6B',
    glow: 'rgba(255,107,107,0.4)',
    description: 'In-memory cache for session data and distributed locking. 95%+ cache hit rate reduces DynamoDB reads significantly.',
    tech: 'AWS ElastiCache Redis',
    layer: 'cache',
  },
  {
    id: 'sqs',
    label: 'SQS Queue',
    sublabel: 'Async event bus',
    icon: '⬜',
    x: 360,
    y: 360,
    color: '#7C5CFF',
    glow: 'rgba(124,92,255,0.4)',
    description: 'Amazon SQS for decoupled async processing. Handles notification dispatch, audit logs, and background jobs.',
    tech: 'AWS SQS + SNS',
    layer: 'queue',
  },
  {
    id: 'lambda',
    label: 'Lambda Functions',
    sublabel: 'Serverless workers',
    icon: '△',
    x: 610,
    y: 360,
    color: '#61DAFB',
    glow: 'rgba(97,218,251,0.4)',
    description: 'Auto-scaling Lambda functions for event processing. Cold-start optimized with provisioned concurrency for hot paths.',
    tech: 'AWS Lambda + Go',
    layer: 'queue',
  },
  {
    id: 'dynamodb',
    label: 'DynamoDB',
    sublabel: 'Primary data store',
    icon: '▣',
    x: 100,
    y: 510,
    color: '#06D6A0',
    glow: 'rgba(6,214,160,0.4)',
    description: 'NoSQL primary data store with on-demand capacity. Designed with GSIs for efficient query patterns.',
    tech: 'AWS DynamoDB',
    layer: 'data',
  },
  {
    id: 'postgres',
    label: 'PostgreSQL',
    sublabel: 'Relational analytics',
    icon: '▦',
    x: 360,
    y: 510,
    color: '#FF7AE5',
    glow: 'rgba(255,122,229,0.4)',
    description: 'PostgreSQL for complex relational queries, reporting, and analytics workloads requiring ACID compliance.',
    tech: 'AWS RDS PostgreSQL',
    layer: 'data',
  },
  {
    id: 's3',
    label: 'S3 Storage',
    sublabel: 'Assets & backups',
    icon: '▲',
    x: 610,
    y: 510,
    color: '#F9D423',
    glow: 'rgba(249,212,35,0.4)',
    description: 'Object storage for media assets, audit logs, Lambda deployment packages, and DynamoDB backups.',
    tech: 'AWS S3 + CloudFront',
    layer: 'data',
  },
]

const EDGES: EdgeDef[] = [
  { id: 'e1', from: 'client', to: 'api-gateway' },
  { id: 'e2', from: 'api-gateway', to: 'auth' },
  { id: 'e3', from: 'api-gateway', to: 'user-service' },
  { id: 'e4', from: 'api-gateway', to: 'blockchain' },
  { id: 'e5', from: 'api-gateway', to: 'ai-pipeline' },
  { id: 'e6', from: 'auth', to: 'redis', label: 'lock' },
  { id: 'e7', from: 'user-service', to: 'redis', label: 'cache' },
  { id: 'e8', from: 'user-service', to: 'dynamodb' },
  { id: 'e9', from: 'blockchain', to: 'sqs', label: 'events' },
  { id: 'e10', from: 'ai-pipeline', to: 'sqs', label: 'jobs' },
  { id: 'e11', from: 'sqs', to: 'lambda' },
  { id: 'e12', from: 'lambda', to: 's3' },
  { id: 'e13', from: 'lambda', to: 'postgres' },
  { id: 'e14', from: 'redis', to: 'dynamodb', label: 'miss' },
  { id: 'e15', from: 'blockchain', to: 'dynamodb' },
  { id: 'e16', from: 'ai-pipeline', to: 's3' },
]

// ─── SVG Diagram Constants ────────────────────────────────────────────────────

const SVG_WIDTH = 760
const SVG_HEIGHT = 600
const NODE_W = 110
const NODE_H = 52

function getNodeCenter(node: NodeDef) {
  return { x: node.x + NODE_W / 2, y: node.y + NODE_H / 2 }
}

function buildEdgePath(from: NodeDef, to: NodeDef): string {
  const f = getNodeCenter(from)
  const t = getNodeCenter(to)
  const dx = t.x - f.x
  const dy = t.y - f.y
  const cx1 = f.x + dx * 0.4
  const cy1 = f.y
  const cx2 = t.x - dx * 0.4
  const cy2 = t.y
  return `M ${f.x} ${f.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${t.x} ${t.y}`
}

// ─── Individual Node Component ────────────────────────────────────────────────

interface NodeProps {
  node: NodeDef
  isActive: boolean
  isSelected: boolean
  simulationRunning: boolean
  onClick: (id: string) => void
}

function ArchNode({ node, isActive, isSelected, simulationRunning, onClick }: NodeProps) {
  return (
    <g
      style={{ cursor: 'pointer' }}
      onClick={() => onClick(node.id)}
    >
      {/* Glow ring when active */}
      {simulationRunning && (
        <motion.rect
          x={node.x - 3}
          y={node.y - 3}
          width={NODE_W + 6}
          height={NODE_H + 6}
          rx={10}
          fill="none"
          stroke={node.color}
          strokeWidth={1.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? [0.3, 0.8, 0.3] : 0.15 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Node body */}
      <motion.rect
        x={node.x}
        y={node.y}
        width={NODE_W}
        height={NODE_H}
        rx={8}
        fill={isSelected ? `${node.color}22` : 'rgba(13,19,33,0.95)'}
        stroke={isSelected ? node.color : `${node.color}55`}
        strokeWidth={isSelected ? 1.5 : 1}
        animate={{
          stroke: isActive ? node.color : `${node.color}55`,
          strokeWidth: isActive ? 1.5 : 1,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon */}
      <text
        x={node.x + 14}
        y={node.y + 21}
        fontSize={14}
        fill={node.color}
        opacity={0.9}
        style={{ userSelect: 'none' }}
      >
        {node.icon}
      </text>

      {/* Status dot */}
      <motion.circle
        cx={node.x + NODE_W - 10}
        cy={node.y + 10}
        r={3.5}
        fill={simulationRunning && isActive ? '#06D6A0' : simulationRunning ? '#F9D423' : '#475569'}
        animate={simulationRunning && isActive ? { opacity: [1, 0.4, 1] } : {}}
        transition={{ duration: 0.8, repeat: Infinity }}
      />

      {/* Label */}
      <text
        x={node.x + 28}
        y={node.y + 21}
        fontSize={10}
        fontWeight={600}
        fill={node.color}
        style={{ userSelect: 'none', fontFamily: 'var(--font-space-grotesk, sans-serif)' }}
      >
        {node.label}
      </text>

      {/* Sublabel */}
      <text
        x={node.x + 8}
        y={node.y + 38}
        fontSize={8}
        fill="rgba(148,163,184,0.7)"
        style={{ userSelect: 'none', fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
      >
        {node.sublabel}
      </text>
    </g>
  )
}

// ─── Edge Component ───────────────────────────────────────────────────────────

interface EdgeProps {
  edge: EdgeDef
  nodes: NodeDef[]
  isActive: boolean
}

function ArchEdge({ edge, nodes, isActive }: EdgeProps) {
  const fromNode = nodes.find((n) => n.id === edge.from)!
  const toNode = nodes.find((n) => n.id === edge.to)!
  const path = buildEdgePath(fromNode, toNode)
  const mid = getNodeCenter(fromNode)
  const t = getNodeCenter(toNode)

  return (
    <g>
      {/* Base line */}
      <motion.path
        d={path}
        fill="none"
        stroke={isActive ? fromNode.color : 'rgba(71,85,105,0.4)'}
        strokeWidth={isActive ? 1.5 : 1}
        animate={{
          stroke: isActive ? fromNode.color : 'rgba(71,85,105,0.4)',
          opacity: isActive ? 0.8 : 0.35,
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Animated dash when active */}
      {isActive && (
        <motion.path
          d={path}
          fill="none"
          stroke={fromNode.color}
          strokeWidth={1.5}
          strokeDasharray="6 10"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -100 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          opacity={0.6}
        />
      )}

      {/* Arrow head */}
      <motion.circle
        cx={t.x - (t.x - mid.x) * 0.08}
        cy={t.y - (t.y - mid.y) * 0.08}
        r={2.5}
        fill={isActive ? fromNode.color : 'rgba(71,85,105,0.5)'}
        animate={{ fill: isActive ? fromNode.color : 'rgba(71,85,105,0.5)' }}
        transition={{ duration: 0.3 }}
      />

      {/* Edge label */}
      {edge.label && (
        <text
          x={(mid.x + t.x) / 2}
          y={(mid.y + t.y) / 2 - 5}
          fontSize={7}
          fill={isActive ? fromNode.color : 'rgba(100,116,139,0.6)'}
          textAnchor="middle"
          style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)' }}
        >
          {edge.label}
        </text>
      )}
    </g>
  )
}

// ─── Metrics Panel ────────────────────────────────────────────────────────────

interface MetricsPanelProps {
  metrics: Metrics
  running: boolean
}

function MetricsPanel({ metrics, running }: MetricsPanelProps) {
  const items = [
    { label: 'Requests/sec', value: metrics.rps.toLocaleString(), unit: 'rps', color: '#7C5CFF' },
    { label: 'Cache Hit Rate', value: `${metrics.cacheHitRate}`, unit: '%', color: '#06D6A0' },
    { label: 'P99 Latency', value: `${metrics.latency}`, unit: 'ms', color: '#F9D423' },
    { label: 'Active Nodes', value: `${metrics.activeNodes}`, unit: '/12', color: '#61DAFB' },
    { label: 'Queue Depth', value: `${metrics.queueDepth}`, unit: 'msgs', color: '#FF7AE5' },
    { label: 'Lambda Instances', value: `${metrics.lambdaInstances}`, unit: 'x', color: '#F77F00' },
  ]

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: running ? '#06D6A0' : '#475569' }}
        />
        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
          {running ? 'Simulation Active' : 'System Idle'}
        </span>
      </div>

      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{item.label}</span>
            <span className="text-xs font-mono" style={{ color: item.color }}>
              {item.value}
              <span className="text-slate-600 ml-0.5">{item.unit}</span>
            </span>
          </div>
          <div className="h-px w-full bg-slate-800">
            <motion.div
              className="h-px"
              style={{ background: item.color }}
              animate={{
                width: running ? `${Math.min(100, (parseInt(item.value.replace(/,/g, '')) / (item.label === 'Requests/sec' ? 10000 : 100)) * 100)}%` : '10%',
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Design Pattern Card ─────────────────────────────────────────────────────

interface PatternCardProps {
  index: number
  title: string
  badge: string
  badgeColor: string
  description: string
  points: string[]
  delay: number
}

function PatternCard({ index, title, badge, badgeColor, description, points, delay }: PatternCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative flex flex-col gap-4 rounded-xl border border-slate-800/60 bg-[#0D1321]/80 p-6 backdrop-blur-sm group hover:border-slate-700/80 transition-colors duration-300"
    >
      {/* Index */}
      <span
        className="absolute top-5 right-5 text-3xl font-bold opacity-[0.06] font-mono select-none"
        style={{ color: badgeColor }}
      >
        0{index + 1}
      </span>

      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider"
          style={{ background: `${badgeColor}18`, color: badgeColor, border: `1px solid ${badgeColor}33` }}
        >
          {badge}
        </span>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-100 mb-1.5 font-display">{title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>

      <ul className="flex flex-col gap-1.5">
        {points.map((point) => (
          <li key={point} className="flex items-start gap-2 text-xs text-slate-500">
            <span style={{ color: badgeColor }} className="mt-0.5 shrink-0">›</span>
            {point}
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

// ─── Node Detail Panel ────────────────────────────────────────────────────────

interface NodeDetailProps {
  node: NodeDef | null
  onClose: () => void
}

function NodeDetail({ node, onClose }: NodeDetailProps) {
  return (
    <AnimatePresence>
      {node && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 6 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-4 left-4 z-20 w-64 rounded-xl border border-slate-700/60 bg-[#0D1321]/95 p-4 backdrop-blur-md shadow-2xl"
          style={{ borderColor: `${node.color}40` }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 text-xs"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg" style={{ color: node.color }}>{node.icon}</span>
            <div>
              <p className="text-sm font-semibold text-slate-100 font-display">{node.label}</p>
              <p className="text-[10px] font-mono" style={{ color: node.color }}>{node.tech}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{node.description}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

const PATTERNS: PatternCardProps[] = [
  {
    index: 0,
    title: 'Distributed Locking via Redis',
    badge: 'Concurrency',
    badgeColor: '#FF6B6B',
    description: 'Prevents race conditions in OAuth token issuance by acquiring a distributed lock in Redis before processing. Ensures exactly-once semantics across multiple service instances.',
    points: [
      'SET NX PX pattern for atomic lock acquisition',
      'Auto-expiring locks prevent deadlocks',
      'Retry backoff with jitter for contention handling',
    ],
    delay: 0.1,
  },
  {
    index: 1,
    title: 'Event-Driven Architecture',
    badge: 'Async',
    badgeColor: '#7C5CFF',
    description: 'Services communicate via SQS/SNS message queues for decoupled, reliable async processing. Blockchain events trigger Lambda workers without blocking the request path.',
    points: [
      'Dead-letter queues for failed message handling',
      'Fan-out via SNS topics to multiple consumers',
      'Visibility timeout for at-least-once delivery',
    ],
    delay: 0.2,
  },
  {
    index: 2,
    title: 'Multi-Strategy Transaction Routing',
    badge: 'Resilience',
    badgeColor: '#F77F00',
    description: 'Blockchain transactions are routed through multiple provider strategies with automatic failover. Achieves 99.8% success rate by retrying failed transactions via alternate RPC providers.',
    points: [
      'Primary / fallback provider chain',
      'Gas estimation across multiple endpoints',
      'Circuit breaker pattern per provider',
    ],
    delay: 0.3,
  },
]

export function SystemDesignSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [simulationRunning, setSimulationRunning] = useState(false)
  const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set())
  const [activeNodes, setActiveNodesSet] = useState<Set<string>>(new Set())
  const [metrics, setMetrics] = useState<Metrics>({
    rps: 0,
    cacheHitRate: 0,
    latency: 180,
    activeNodes: 0,
    queueDepth: 0,
    lambdaInstances: 1,
  })
  const [simProgress, setSimProgress] = useState(0)

  const selectedNodeDef = useMemo(
    () => NODES.find((n) => n.id === selectedNode) ?? null,
    [selectedNode],
  )

  const handleNodeClick = useCallback((id: string) => {
    setSelectedNode((prev) => (prev === id ? null : id))
  }, [])

  // ─── Simulation Logic ──────────────────────────────────────────────────────

  const runSimulation = useCallback(() => {
    if (simulationRunning) return
    setSimulationRunning(true)
    setSimProgress(0)

    const phases = [
      // Phase 0: Initial traffic hits gateway
      () => {
        setActiveNodesSet(new Set(['client', 'api-gateway']))
        setActiveEdges(new Set(['e1']))
        setMetrics((m) => ({ ...m, rps: 1200, activeNodes: 2, latency: 120 }))
      },
      // Phase 1: Auth + routing
      () => {
        setActiveNodesSet(new Set(['client', 'api-gateway', 'auth', 'user-service']))
        setActiveEdges(new Set(['e1', 'e2', 'e3']))
        setMetrics((m) => ({ ...m, rps: 3400, activeNodes: 4, latency: 95 }))
      },
      // Phase 2: Cache warming
      () => {
        setActiveNodesSet(new Set(['client', 'api-gateway', 'auth', 'user-service', 'redis']))
        setActiveEdges(new Set(['e1', 'e2', 'e3', 'e6', 'e7']))
        setMetrics((m) => ({ ...m, rps: 5800, cacheHitRate: 42, latency: 68, activeNodes: 5 }))
      },
      // Phase 3: Blockchain + AI load
      () => {
        setActiveNodesSet(new Set(['client', 'api-gateway', 'auth', 'user-service', 'redis', 'blockchain', 'ai-pipeline']))
        setActiveEdges(new Set(['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e9', 'e10']))
        setMetrics((m) => ({ ...m, rps: 7200, cacheHitRate: 71, latency: 52, activeNodes: 7, queueDepth: 340, lambdaInstances: 3 }))
      },
      // Phase 4: Full system — SQS, Lambda scaling
      () => {
        setActiveNodesSet(new Set(NODES.map((n) => n.id)))
        setActiveEdges(new Set(EDGES.map((e) => e.id)))
        setMetrics((m) => ({ ...m, rps: 9600, cacheHitRate: 93, latency: 38, activeNodes: 12, queueDepth: 820, lambdaInstances: 8 }))
      },
      // Phase 5: Peak traffic + autoscale
      () => {
        setMetrics((m) => ({ ...m, rps: 10000, cacheHitRate: 97, latency: 28, activeNodes: 12, queueDepth: 1200, lambdaInstances: 12 }))
      },
      // Phase 6: Queue draining
      () => {
        setMetrics((m) => ({ ...m, rps: 8200, cacheHitRate: 97, queueDepth: 640, lambdaInstances: 10 }))
      },
      // Phase 7: Cooldown
      () => {
        setMetrics((m) => ({ ...m, rps: 4100, queueDepth: 120, lambdaInstances: 4 }))
        setActiveNodesSet(new Set(['client', 'api-gateway', 'redis', 'user-service']))
        setActiveEdges(new Set(['e1', 'e3', 'e7']))
      },
      // Phase 8: Idle
      () => {
        setSimulationRunning(false)
        setActiveNodesSet(new Set())
        setActiveEdges(new Set())
        setSimProgress(100)
      },
    ]

    phases.forEach((phase, i) => {
      const timeout = setTimeout(() => {
        phase()
        setSimProgress(Math.round((i / (phases.length - 1)) * 100))
      }, i * 900)
      return timeout
    })
  }, [simulationRunning])

  const resetSimulation = useCallback(() => {
    setSimulationRunning(false)
    setActiveNodesSet(new Set())
    setActiveEdges(new Set())
    setSimProgress(0)
    setMetrics({ rps: 0, cacheHitRate: 0, latency: 180, activeNodes: 0, queueDepth: 0, lambdaInstances: 1 })
  }, [])

  return (
    <section
      id="system-design"
      ref={sectionRef}
      className="relative py-24 px-4 overflow-hidden"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-[#7C5CFF]/[0.04] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-[#61DAFB]/[0.03] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 flex flex-col gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#7C5CFF]/60" />
            <span className="text-xs font-mono tracking-widest text-[#7C5CFF] uppercase">
              engineering laboratory
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-bold text-slate-100 font-display tracking-tight md:text-5xl">
              System Architecture
            </h2>
            <p className="max-w-2xl text-base text-slate-400 leading-relaxed">
              An interactive visualization of the distributed microservices architecture powering{' '}
              <span className="text-[#7C5CFF]">KGeN</span>. Click nodes to explore, then simulate
              10,000 requests to watch the system respond.
            </p>
          </div>
        </motion.div>

        {/* Main diagram + metrics */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-12 flex flex-col gap-6 xl:flex-row"
        >
          {/* SVG Diagram */}
          <div className="relative flex-1 rounded-2xl border border-slate-800/60 bg-[#080E1A]/90 backdrop-blur-sm overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-800/60 px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#FF5F57]" />
                  <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
                  <div className="h-3 w-3 rounded-full bg-[#28CA41]" />
                </div>
                <span className="ml-2 text-xs font-mono text-slate-500">architecture.svg</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-600 hidden sm:block">
                  click nodes to inspect
                </span>
                {simulationRunning && (
                  <motion.div
                    className="flex items-center gap-1.5"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-[#06D6A0]" />
                    <span className="text-[10px] font-mono text-[#06D6A0]">simulating</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* SVG */}
            <div className="relative overflow-auto">
              <svg
                viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
                width="100%"
                style={{ minWidth: 480, maxHeight: 560 }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                    <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(71,85,105,0.12)" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Layer labels */}
                {[
                  { label: 'Client Layer', y: 18, color: '#61DAFB' },
                  { label: 'Service Layer', y: 178, color: '#06D6A0' },
                  { label: 'Infrastructure Layer', y: 338, color: '#7C5CFF' },
                  { label: 'Data Layer', y: 488, color: '#F9D423' },
                ].map((lyr) => (
                  <text
                    key={lyr.label}
                    x={SVG_WIDTH - 12}
                    y={lyr.y}
                    fontSize={8}
                    fill={lyr.color}
                    opacity={0.4}
                    textAnchor="end"
                    style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)', userSelect: 'none' }}
                  >
                    {lyr.label}
                  </text>
                ))}

                {/* Horizontal separators */}
                {[160, 320, 478].map((y) => (
                  <line
                    key={y}
                    x1={0}
                    y1={y}
                    x2={SVG_WIDTH}
                    y2={y}
                    stroke="rgba(71,85,105,0.15)"
                    strokeWidth={1}
                    strokeDasharray="4 8"
                  />
                ))}

                {/* Edges */}
                {EDGES.map((edge) => (
                  <ArchEdge
                    key={edge.id}
                    edge={edge}
                    nodes={NODES}
                    isActive={activeEdges.has(edge.id)}
                  />
                ))}

                {/* Nodes */}
                {NODES.map((node) => (
                  <ArchNode
                    key={node.id}
                    node={node}
                    isActive={activeNodes.has(node.id)}
                    isSelected={selectedNode === node.id}
                    simulationRunning={simulationRunning}
                    onClick={handleNodeClick}
                  />
                ))}
              </svg>

              {/* Node detail popover */}
              <NodeDetail node={selectedNodeDef} onClose={() => setSelectedNode(null)} />
            </div>

            {/* Progress bar */}
            <AnimatePresence>
              {simulationRunning && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-800"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#7C5CFF] to-[#61DAFB]"
                    animate={{ width: `${simProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Metrics + Control */}
          <div className="flex flex-col gap-4 xl:w-56">
            {/* Control panel */}
            <div className="rounded-xl border border-slate-800/60 bg-[#0D1321]/80 p-4 backdrop-blur-sm">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                Control Panel
              </p>
              <button
                onClick={simulationRunning ? resetSimulation : runSimulation}
                disabled={false}
                className={`w-full rounded-lg px-4 py-2.5 text-xs font-semibold font-mono transition-all duration-200 ${
                  simulationRunning
                    ? 'bg-red-900/30 text-red-400 border border-red-800/60 hover:bg-red-900/50'
                    : 'bg-[#7C5CFF]/20 text-[#7C5CFF] border border-[#7C5CFF]/40 hover:bg-[#7C5CFF]/30'
                }`}
              >
                {simulationRunning ? 'Stop Simulation' : 'Simulate 10,000 Requests'}
              </button>

              {simProgress > 0 && !simulationRunning && (
                <p className="mt-2 text-center text-[10px] font-mono text-[#06D6A0]">
                  Simulation complete
                </p>
              )}
            </div>

            {/* Metrics */}
            <div className="rounded-xl border border-slate-800/60 bg-[#0D1321]/80 p-4 backdrop-blur-sm flex-1">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-4">
                Live Metrics
              </p>
              <MetricsPanel metrics={metrics} running={simulationRunning} />
            </div>

            {/* Legend */}
            <div className="rounded-xl border border-slate-800/60 bg-[#0D1321]/80 p-4 backdrop-blur-sm">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                Legend
              </p>
              {[
                { color: '#06D6A0', label: 'Active / healthy' },
                { color: '#F9D423', label: 'Processing' },
                { color: '#FF6B6B', label: 'High load' },
                { color: '#475569', label: 'Idle' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 mb-1.5">
                  <div className="h-2 w-2 rounded-full" style={{ background: item.color }} />
                  <span className="text-[10px] font-mono text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Design Pattern Cards */}
        <div className="mt-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-6"
          >
            Design Patterns Applied
          </motion.p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PATTERNS.map((p) => (
              <PatternCard key={p.title} {...p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
