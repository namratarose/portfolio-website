'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { GlowCard } from '@/components/ui/GlowCard'
import { CyberButton } from '@/components/ui/CyberButton'
import { ProjectModal, type MissionProject } from './ProjectModal'

// ─── Project Data ─────────────────────────────────────────────────────────────

const PROJECTS: MissionProject[] = [
  {
    id: 'poe-card-system',
    missionCode: 'MISSION-001',
    title: 'POE Card System',
    description: 'AI-powered professional credential cards built on Go microservices with OpenAI GPT-4o integration.',
    fullDescription:
      'Designed and built a full-stack AI-powered professional credential card system from scratch. The system exposes 6 production REST APIs backed by Go, DynamoDB, and AWS S3 for asset storage. OpenAI GPT-4o drives dynamic card content generation. Launched as a standalone HumynLabs product.',
    type: 'Product Feature',
    status: 'DEPLOYED',
    tech: ['Go', 'DynamoDB', 'AWS S3', 'OpenAI GPT-4o', 'REST API'],
    impact: '6 REST APIs, launched as standalone HumynLabs product',
    impactMetrics: [
      { label: 'REST APIs', value: '6' },
      { label: 'Avg Latency (ms)', value: '120ms' },
      { label: 'Products Launched', value: '1' },
    ],
    architectureNodes: [
      { id: 'client', label: 'Client', sublabel: 'HTTP', color: '#7C5CFF' },
      { id: 'api', label: 'Go API', sublabel: 'REST', color: '#A78BFF' },
      { id: 'openai', label: 'GPT-4o', sublabel: 'OpenAI', color: '#34D399' },
      { id: 'dynamo', label: 'DynamoDB', sublabel: 'AWS', color: '#FFD700' },
      { id: 's3', label: 'S3', sublabel: 'Assets', color: '#61DAFB' },
    ],
    architectureEdges: [
      { from: 'client', to: 'api', label: 'REST' },
      { from: 'api', to: 'openai', label: 'AI Gen' },
      { from: 'api', to: 'dynamo', label: 'Store' },
      { from: 'api', to: 's3', label: 'Assets' },
    ],
    challenges: [
      'Designed GPT-4o prompt templates that produce structured credential data reliably',
      'Implemented S3 pre-signed URL flow for zero-server-cost asset delivery',
      'Optimised DynamoDB access patterns to avoid full table scans at scale',
    ],
  },
  {
    id: 'redis-oauth-security',
    missionCode: 'MISSION-002',
    title: 'Redis OAuth Security',
    description: 'Distributed locking layer that eliminates race conditions in social authentication flows for 100k+ concurrent users.',
    fullDescription:
      'Architected a Redis-backed distributed locking system on top of the existing NestJS + AWS Cognito OAuth flow. Race conditions during concurrent token exchanges were causing duplicate user records and broken sessions. The solution uses atomic SETNX locks with TTL expiry to guarantee single-writer semantics across all social login providers.',
    type: 'Security Infrastructure',
    status: 'DEPLOYED',
    tech: ['Redis', 'NestJS', 'AWS Cognito', 'DynamoDB', 'OAuth'],
    impact: 'Zero race conditions for 100k+ concurrent users',
    impactMetrics: [
      { label: 'Race Conditions', value: '0' },
      { label: 'Concurrent Users', value: '100k+' },
      { label: 'Lock TTL (ms)', value: '500ms' },
    ],
    architectureNodes: [
      { id: 'client', label: 'Client', sublabel: 'OAuth', color: '#FF7AE5' },
      { id: 'nestjs', label: 'NestJS', sublabel: 'Auth', color: '#FF7AE5' },
      { id: 'redis', label: 'Redis', sublabel: 'Lock', color: '#F87171' },
      { id: 'cognito', label: 'Cognito', sublabel: 'AWS', color: '#FFD700' },
      { id: 'dynamo', label: 'DynamoDB', sublabel: 'Users', color: '#61DAFB' },
    ],
    architectureEdges: [
      { from: 'client', to: 'nestjs', label: 'Token' },
      { from: 'nestjs', to: 'redis', label: 'SETNX' },
      { from: 'nestjs', to: 'cognito', label: 'Verify' },
      { from: 'nestjs', to: 'dynamo', label: 'Upsert' },
    ],
    challenges: [
      'Identified root cause of duplicate user creation under high concurrency load tests',
      'Chose Redis SETNX over DB-level locks to avoid cross-service coupling',
      'Handled lock expiry edge cases for long-running Cognito verification calls',
    ],
  },
  {
    id: 'sarvam-ai-pipeline',
    missionCode: 'MISSION-003',
    title: 'Sarvam AI Pipeline',
    description: 'Automated audio annotation pipeline using Sarvam AI transcription, cutting turnaround by 40–60%.',
    fullDescription:
      'Designed and shipped a Go-based pipeline that automates audio annotation by integrating with Sarvam AI\'s speech-to-text API. Raw audio files stored in S3 are queued via Redis, transcribed in parallel worker pools, and results are persisted back to S3 alongside structured metadata. Eliminated the need for manual first-pass transcription work.',
    type: 'AI Pipeline',
    status: 'DEPLOYED',
    tech: ['Go', 'Sarvam AI', 'AWS S3', 'Redis'],
    impact: '40–60% annotation turnaround reduction',
    impactMetrics: [
      { label: 'Turnaround Reduction', value: '50%' },
      { label: 'Worker Concurrency', value: '20' },
      { label: 'Avg Processing (s)', value: '3s' },
    ],
    architectureNodes: [
      { id: 's3in', label: 'S3', sublabel: 'Audio In', color: '#34D399' },
      { id: 'redis', label: 'Redis', sublabel: 'Queue', color: '#F87171' },
      { id: 'workers', label: 'Go Workers', sublabel: 'Pool', color: '#34D399' },
      { id: 'sarvam', label: 'Sarvam AI', sublabel: 'STT', color: '#A78BFF' },
      { id: 's3out', label: 'S3', sublabel: 'Results', color: '#61DAFB' },
    ],
    architectureEdges: [
      { from: 's3in', to: 'redis', label: 'Enqueue' },
      { from: 'redis', to: 'workers', label: 'Pop' },
      { from: 'workers', to: 'sarvam', label: 'STT' },
      { from: 'workers', to: 's3out', label: 'Store' },
    ],
    challenges: [
      'Tuned worker pool size to balance Sarvam API rate limits against throughput targets',
      'Designed Redis queue schema to support priority lanes for urgent annotation batches',
      'Handled partial transcription failures with dead-letter queuing and manual review flags',
    ],
  },
  {
    id: 'audio-qc-pipeline',
    missionCode: 'MISSION-004',
    title: 'Audio QC Pipeline',
    description: '5-stage automated quality control system that processed 100+ datasets and reduced manual effort by 60–80%.',
    fullDescription:
      'Built a Python-based asynchronous audio quality control pipeline using Celery as the task broker. The pipeline executes 5 sequential QC stages: format validation, SNR analysis, silence detection, clipping detection, and spectral analysis — powered by librosa. Results are stored in DynamoDB and surfaced through a FastAPI dashboard.',
    type: 'Data Engineering',
    status: 'DEPLOYED',
    tech: ['Python', 'Celery', 'FastAPI', 'librosa', 'DynamoDB', 'AWS'],
    impact: '100+ datasets, 60–80% manual work reduction',
    impactMetrics: [
      { label: 'Datasets Processed', value: '100+' },
      { label: 'Manual Work Saved', value: '70%' },
      { label: 'QC Stages', value: '5' },
    ],
    architectureNodes: [
      { id: 'api', label: 'FastAPI', sublabel: 'Dashboard', color: '#61DAFB' },
      { id: 'celery', label: 'Celery', sublabel: 'Workers', color: '#F87171' },
      { id: 'librosa', label: 'librosa', sublabel: 'Analysis', color: '#34D399' },
      { id: 'dynamo', label: 'DynamoDB', sublabel: 'Results', color: '#FFD700' },
    ],
    architectureEdges: [
      { from: 'api', to: 'celery', label: 'Dispatch' },
      { from: 'celery', to: 'librosa', label: 'Analyse' },
      { from: 'celery', to: 'dynamo', label: 'Store' },
      { from: 'dynamo', to: 'api', label: 'Read' },
    ],
    challenges: [
      'Composed 5 independent analysis algorithms into a single deterministic pipeline',
      'Calibrated SNR and silence thresholds across diverse languages and recording conditions',
      'Made Celery task fan-out idempotent so reprocessing stale datasets is safe',
    ],
  },
  {
    id: 'llm-resume-parser',
    missionCode: 'MISSION-005',
    title: 'LLM Resume Parser',
    description: 'Cold-start-optimised serverless resume parsing service migrated from GCP to AWS Lambda with GPT-4o.',
    fullDescription:
      'Migrated a legacy GCP Cloud Run resume parsing service to AWS Lambda, preserving the OpenAI GPT-4o extraction logic while adding cold-start optimisations via layer caching and lazy model loading. Secrets are managed via AWS Secrets Manager. The Lambda function parses structured candidate data from unstructured PDF resumes with sub-3-second p99 latency.',
    type: 'Cloud Migration',
    status: 'DEPLOYED',
    tech: ['Python', 'AWS Lambda', 'OpenAI GPT-4o', 'Secrets Manager'],
    impact: 'GCP to AWS migration, cold-start optimised',
    impactMetrics: [
      { label: 'p99 Latency (s)', value: '3s' },
      { label: 'Cold Start (ms)', value: '800ms' },
      { label: 'Cloud Providers', value: '1' },
    ],
    architectureNodes: [
      { id: 'trigger', label: 'API GW', sublabel: 'Trigger', color: '#F87171' },
      { id: 'lambda', label: 'Lambda', sublabel: 'Python', color: '#F87171' },
      { id: 'secrets', label: 'Secrets', sublabel: 'Manager', color: '#FFD700' },
      { id: 'openai', label: 'GPT-4o', sublabel: 'Parse', color: '#34D399' },
    ],
    architectureEdges: [
      { from: 'trigger', to: 'lambda', label: 'Invoke' },
      { from: 'lambda', to: 'secrets', label: 'Fetch Key' },
      { from: 'lambda', to: 'openai', label: 'Extract' },
    ],
    challenges: [
      'Reduced Lambda cold start from ~3s to ~800ms through dependency layer optimisation',
      'Preserved GPT-4o structured output schemas across the cloud migration',
      'Replaced GCP Secret Manager calls with AWS Secrets Manager with zero API changes',
    ],
  },
  {
    id: 'hl-annotation-orchestrator',
    missionCode: 'MISSION-006',
    title: 'HL Annotation Orchestrator',
    description: 'Multi-language annotation project management platform supporting 5+ Indian languages via gRPC microservices.',
    fullDescription:
      'Built a Go-based orchestration service that manages parallel annotation tracks across 5+ Indian languages. Project managers create annotation campaigns through a gRPC API; the service distributes tasks to language-specific worker pools, tracks progress in PostgreSQL, and surfaces SLA dashboards. Supports Hindi, Tamil, Telugu, Kannada, and Bengali annotation pipelines concurrently.',
    type: 'Platform Engineering',
    status: 'DEPLOYED',
    tech: ['Go', 'PostgreSQL', 'gRPC', 'Microservices'],
    impact: '5+ Indian languages parallel annotation tracks',
    impactMetrics: [
      { label: 'Languages', value: '5+' },
      { label: 'Parallel Tracks', value: '5' },
      { label: 'gRPC Services', value: '3' },
    ],
    architectureNodes: [
      { id: 'client', label: 'Client', sublabel: 'gRPC', color: '#A78BFF' },
      { id: 'orch', label: 'Orchestrator', sublabel: 'Go', color: '#A78BFF' },
      { id: 'workers', label: 'Lang Workers', sublabel: 'x5', color: '#34D399' },
      { id: 'pg', label: 'PostgreSQL', sublabel: 'State', color: '#61DAFB' },
    ],
    architectureEdges: [
      { from: 'client', to: 'orch', label: 'gRPC' },
      { from: 'orch', to: 'workers', label: 'Dispatch' },
      { from: 'orch', to: 'pg', label: 'State' },
      { from: 'workers', to: 'pg', label: 'Progress' },
    ],
    challenges: [
      'Designed a generic task schema flexible enough to cover diverse annotation task types',
      'Implemented backpressure in gRPC streaming to prevent worker pool exhaustion',
      'Built SLA tracker that accounts for different throughput capacities per language',
    ],
  },
  {
    id: 'proxy-auth-middleware',
    missionCode: 'MISSION-007',
    title: 'Proxy Auth Middleware',
    description: 'Centralised JWT authentication gateway unifying 10+ microservices with zero-downtime migration.',
    fullDescription:
      'Designed and deployed a NestJS reverse-proxy authentication middleware that acts as the single auth gateway for 10+ microservices. JWT tokens are validated against public keys cached in Redis to eliminate per-request DynamoDB reads. The migration from per-service auth was executed with zero downtime using a shadow-mode dual-validation period.',
    type: 'Infrastructure',
    status: 'DEPLOYED',
    tech: ['NestJS', 'JWT', 'DynamoDB', 'Redis', 'Security'],
    impact: '10+ microservices unified, zero-downtime migration',
    impactMetrics: [
      { label: 'Microservices', value: '10+' },
      { label: 'Auth Latency (ms)', value: '8ms' },
      { label: 'Downtime (min)', value: '0' },
    ],
    architectureNodes: [
      { id: 'client', label: 'Client', sublabel: 'Request', color: '#9CA3AF' },
      { id: 'gateway', label: 'Auth Gateway', sublabel: 'NestJS', color: '#9CA3AF' },
      { id: 'redis', label: 'Redis', sublabel: 'Key Cache', color: '#F87171' },
      { id: 'services', label: 'Services', sublabel: 'x10+', color: '#61DAFB' },
    ],
    architectureEdges: [
      { from: 'client', to: 'gateway', label: 'JWT' },
      { from: 'gateway', to: 'redis', label: 'Verify' },
      { from: 'gateway', to: 'services', label: 'Forward' },
    ],
    challenges: [
      'Designed shadow-mode dual validation to allow gradual service cutover without rollback risk',
      'Cached JWT public keys in Redis with auto-rotation to handle key updates transparently',
      'Standardised auth error responses across 10+ services that previously had divergent formats',
    ],
  },
]

// ─── Status/Type colour maps (same as modal) ─────────────────────────────────

const STATUS_COLORS = {
  DEPLOYED:    { bg: '#34D39918', text: '#6EE7B7', dot: '#34D399' },
  IN_PROGRESS: { bg: '#FFD70018', text: '#FFF176', dot: '#FFD700' },
  PLANNED:     { bg: '#61DAFB18', text: '#A5EEFF', dot: '#61DAFB' },
} as const

const TYPE_COLORS: Record<string, string> = {
  'Product Feature':         '#7C5CFF',
  'Security Infrastructure': '#FF7AE5',
  'Blockchain/DeFi':         '#FFD700',
  'AI Pipeline':             '#34D399',
  'Data Engineering':        '#61DAFB',
  'Cloud Migration':         '#F87171',
  'Platform Engineering':    '#A78BFF',
  'Infrastructure':          '#9CA3AF',
}

// ─── Mini request-flow animation on card hover ────────────────────────────────

function MiniFlow({ color, active }: { color: string; active: boolean }) {
  return (
    <svg
      width="100%"
      height="28"
      viewBox="0 0 220 28"
      aria-hidden
      className="overflow-visible"
    >
      {/* Track */}
      <line x1="10" y1="14" x2="210" y2="14" stroke={`${color}30`} strokeWidth={1.5} strokeDasharray="4 3" />

      {/* Static nodes */}
      {[10, 73, 136, 210].map((cx, i) => (
        <circle
          key={i}
          cx={cx}
          cy={14}
          r={5}
          fill={`${color}20`}
          stroke={color}
          strokeWidth={1}
        />
      ))}

      {/* Animated packet */}
      {active && (
        <motion.circle
          r={4}
          cy={14}
          fill={color}
          initial={{ cx: 10 }}
          animate={{ cx: [10, 73, 136, 210] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            repeatDelay: 0.4,
            ease: 'easeInOut',
            times: [0, 0.33, 0.66, 1],
          }}
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
        />
      )}

      {/* Labels */}
      {['API', 'SVC', 'DB', 'RES'].map((label, i) => {
        const cx = [10, 73, 136, 210][i]
        return (
          <text
            key={label}
            x={cx}
            y={26}
            textAnchor="middle"
            fontSize={7}
            fill={`${color}70`}
            fontFamily="monospace"
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}

// ─── Mission Card ─────────────────────────────────────────────────────────────

function MissionCard({
  project,
  index,
  onOpen,
}: {
  project: MissionProject
  index: number
  onOpen: (p: MissionProject) => void
}) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const color = TYPE_COLORS[project.type] ?? '#9CA3AF'
  const statusColors = STATUS_COLORS[project.status]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.5, ease: 'easeOut' }}
    >
      <GlowCard
        variant="primary"
        hoverScale
        className="h-full cursor-pointer"
      >
        <motion.div
          className="flex h-full flex-col p-5 gap-4"
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          onClick={() => onOpen(project)}
        >
          {/* Top row: mission code + status */}
          <div className="flex items-center justify-between">
            <span
              className="font-mono text-xs font-semibold tracking-widest"
              style={{ color: `${color}80` }}
            >
              {project.missionCode}
            </span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs"
              style={{
                borderColor: `${statusColors.dot}40`,
                background: statusColors.bg,
                color: statusColors.text,
              }}
            >
              <motion.span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: statusColors.dot }}
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              />
              {project.status}
            </span>
          </div>

          {/* Type tag */}
          <div>
            <span
              className="rounded-full border px-2.5 py-0.5 font-mono text-xs"
              style={{ borderColor: `${color}40`, color, background: `${color}10` }}
            >
              {project.type}
            </span>
          </div>

          {/* Title & description */}
          <div className="flex-1 space-y-2">
            <h3 className="font-mono text-base font-bold text-white leading-snug">
              {project.title}
            </h3>
            <p className="font-mono text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {project.description}
            </p>
          </div>

          {/* Mini flow animation */}
          <div className="py-1">
            <MiniFlow color={color} active={hovered} />
          </div>

          {/* Tech chips */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border px-2 py-0.5 font-mono text-xs"
                style={{ borderColor: `${color}30`, color: `${color}90`, background: `${color}08` }}
              >
                {t}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span
                className="rounded-full border px-2 py-0.5 font-mono text-xs"
                style={{ borderColor: `${color}30`, color: `${color}60`, background: `${color}08` }}
              >
                +{project.tech.length - 4}
              </span>
            )}
          </div>

          {/* Impact */}
          <div
            className="rounded-lg border p-3"
            style={{ borderColor: `${color}20`, background: `${color}06` }}
          >
            <div className="font-mono text-xs font-semibold mb-0.5" style={{ color: `${color}80` }}>
              IMPACT
            </div>
            <div className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
              {project.impact}
            </div>
          </div>

          {/* CTA */}
          <CyberButton
            variant="secondary"
            className="w-full justify-center text-xs py-2"
            onClick={(e) => {
              e.stopPropagation()
              onOpen(project)
            }}
          >
            VIEW MISSION
          </CyberButton>
        </motion.div>
      </GlowCard>
    </motion.div>
  )
}

// ─── Blinking status light ────────────────────────────────────────────────────

function StatusLight() {
  return (
    <span className="relative inline-flex h-3 w-3 flex-shrink-0">
      <motion.span
        className="absolute inline-flex h-full w-full rounded-full"
        style={{ background: '#34D399' }}
        animate={{ scale: [1, 2], opacity: [0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
      />
      <span className="relative inline-flex h-3 w-3 rounded-full" style={{ background: '#34D399' }} />
    </span>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export function ProjectsSection() {
  const [selected, setSelected] = useState<MissionProject | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const headerInView = useInView(headerRef, { once: true })

  function openMission(project: MissionProject) {
    setSelected(project)
    setModalOpen(true)
  }

  function closeMission() {
    setModalOpen(false)
  }

  return (
    <section
      id="projects"
      className="relative min-h-screen px-4 py-24 sm:px-8"
      style={{ background: 'linear-gradient(180deg, #080810 0%, #0a0a14 100%)' }}
    >
      {/* Background grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(97,218,251,1) 1px, transparent 1px), linear-gradient(90deg, rgba(97,218,251,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Corner accents */}
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
        <div
          key={corner}
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            ...(corner === 'tl' && { top: 32, left: 32 }),
            ...(corner === 'tr' && { top: 32, right: 32 }),
            ...(corner === 'bl' && { bottom: 32, left: 32 }),
            ...(corner === 'br' && { bottom: 32, right: 32 }),
            width: 24,
            height: 24,
            borderTop: corner.startsWith('t') ? '2px solid rgba(97,218,251,0.3)' : undefined,
            borderBottom: corner.startsWith('b') ? '2px solid rgba(97,218,251,0.3)' : undefined,
            borderLeft: corner.endsWith('l') ? '2px solid rgba(97,218,251,0.3)' : undefined,
            borderRight: corner.endsWith('r') ? '2px solid rgba(97,218,251,0.3)' : undefined,
          }}
        />
      ))}

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div ref={headerRef} className="mb-16 space-y-4">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={headerInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <StatusLight />
            <span className="font-mono text-xs uppercase tracking-widest" style={{ color: '#34D399' }}>
              All systems operational
            </span>
          </motion.div>

          <motion.h2
            className="font-mono text-4xl font-black tracking-tight text-white sm:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            MISSION{' '}
            <span
              className="relative"
              style={{
                color: '#61DAFB',
                textShadow: '0 0 40px rgba(97,218,251,0.5), 0 0 80px rgba(97,218,251,0.2)',
              }}
            >
              CONTROL
              {/* Underline accent */}
              <motion.span
                aria-hidden
                className="absolute bottom-0 left-0 block h-0.5 w-full"
                style={{ background: 'linear-gradient(90deg, #61DAFB, transparent)' }}
                initial={{ scaleX: 0 }}
                animate={headerInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              />
            </span>
          </motion.h2>

          <motion.p
            className="max-w-xl font-mono text-sm leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
          >
            {PROJECTS.length} missions completed. Scroll to review deployment logs,
            architecture flows, and impact metrics.
          </motion.p>

          {/* Stats strip */}
          <motion.div
            className="flex flex-wrap gap-6 pt-2"
            initial={{ opacity: 0 }}
            animate={headerInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            {[
              { label: 'Deployed', value: String(PROJECTS.filter((p) => p.status === 'DEPLOYED').length) },
              { label: 'Languages', value: '4+' },
              { label: 'Cloud Providers', value: '2' },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span
                  className="font-mono text-lg font-bold"
                  style={{ color: '#61DAFB' }}
                >
                  {value}
                </span>
                <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {PROJECTS.map((project, i) => (
            <MissionCard
              key={project.id}
              project={project}
              index={i}
              onOpen={openMission}
            />
          ))}
        </div>
      </div>

      {/* Mission Detail Modal */}
      <ProjectModal
        project={selected}
        open={modalOpen}
        onClose={closeMission}
      />
    </section>
  )
}
