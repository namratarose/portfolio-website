'use client'

import { useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Star, StarHalf, Clock, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { projects } from '@/config/personal'
import type { Skill } from '@/types'

// ─── Skill metadata (descriptions, years, related, resources) ────────────────

interface SkillMeta {
  description: string
  years: number
  relatedIds: string[]
  resources?: { label: string; href: string }[]
}

const SKILL_META: Record<string, SkillMeta> = {
  go: {
    description:
      'Primary production language at KGeN. Used for high-throughput microservices, concurrency patterns (goroutines/channels), and CLI tooling. Core language for backend infrastructure.',
    years: 2,
    relatedIds: ['microservices', 'rest-apis', 'distributed-systems'],
    resources: [{ label: 'Go Tour', href: 'https://go.dev/tour/' }],
  },
  typescript: {
    description:
      'Strongly-typed superset of JavaScript used throughout NestJS services. Enables safer refactoring, IDE tooling, and expressive domain models.',
    years: 2,
    relatedIds: ['nestjs', 'nodejs', 'expressjs'],
  },
  python: {
    description:
      'Used for ML tooling, serverless functions (AWS Lambda), and data-processing scripts. Libraries include librosa, numpy, and Pydantic.',
    years: 3,
    relatedIds: ['celery', 'fastapi', 'etl-pipelines'],
  },
  javascript: {
    description:
      'Foundational language for web and Node.js runtime. Used in scripting, testing, and lightweight Lambda handlers.',
    years: 3,
    relatedIds: ['nodejs', 'expressjs', 'typescript'],
  },
  java: {
    description:
      'Academic and competitive-programming background. Spring Boot / OOP fundamentals.',
    years: 2,
    relatedIds: [],
  },
  cpp: {
    description:
      'Data structures, algorithms, and competitive programming. Strong foundation in memory management and performance-critical code.',
    years: 3,
    relatedIds: [],
  },
  nestjs: {
    description:
      'Primary Node.js framework for production microservices. Used for authentication gateways, interceptors, localization, and OAuth integrations securing 100k+ users.',
    years: 2,
    relatedIds: ['typescript', 'microservices', 'rest-apis'],
  },
  nodejs: {
    description:
      'JavaScript runtime powering server-side applications. Used for event-driven services and Lambda handlers.',
    years: 3,
    relatedIds: ['typescript', 'expressjs', 'nestjs'],
  },
  expressjs: {
    description:
      'Minimalist Node.js web framework. Used for rapid API prototyping and lightweight services.',
    years: 3,
    relatedIds: ['nodejs', 'rest-apis'],
  },
  'rest-apis': {
    description:
      'Designed and shipped production REST APIs across Go and NestJS services. Follows RESTful conventions with proper status codes, pagination, and versioning.',
    years: 2,
    relatedIds: ['nestjs', 'go', 'microservices'],
  },
  microservices: {
    description:
      'Architected distributed microservices communicating over REST and message queues. Enforced service isolation, inter-service auth, and circuit breaker patterns.',
    years: 2,
    relatedIds: ['nestjs', 'go', 'distributed-systems', 'aws-sqs-sns'],
  },
  celery: {
    description:
      'Distributed task queue used for async audio QC jobs, connecting Python workers to Redis brokers.',
    years: 1,
    relatedIds: ['python', 'redis'],
  },
  fastapi: {
    description:
      'Modern async Python web framework used for ML inference APIs with automatic OpenAPI docs.',
    years: 1,
    relatedIds: ['python'],
  },
  dynamodb: {
    description:
      'Primary NoSQL database at KGeN. Used for user profiles, device whitelisting, annotation records, and card metadata. Expert in key design, GSIs, and DynamoDB Streams.',
    years: 2,
    relatedIds: ['aws-lambda', 'nestjs'],
  },
  redis: {
    description:
      'Used for distributed locking (OAuth race conditions), caching (NFT data), and as a Celery message broker. Key pattern expertise in SETNX, Lua scripts, and TTLs.',
    years: 2,
    relatedIds: ['nestjs', 'go', 'celery'],
  },
  postgresql: {
    description:
      'Relational database for structured annotation data with complex joins and ACID guarantees. Used in the multilingual annotation orchestrator.',
    years: 2,
    relatedIds: ['go'],
  },
  mongodb: {
    description:
      'Document store for flexible schema data. Used in academic projects and exploration of aggregation pipelines.',
    years: 2,
    relatedIds: [],
  },
  mysql: {
    description:
      'Traditional relational database. Used in university coursework and early projects.',
    years: 2,
    relatedIds: [],
  },
  'aws-lambda': {
    description:
      'Serverless compute for event-driven handlers and ML inference. Migrated a GCP resume-parsing service to Lambda for improved scalability and cold-start performance.',
    years: 2,
    relatedIds: ['aws-s3', 'python', 'dynamodb'],
  },
  'aws-s3': {
    description:
      'Object storage for audio datasets, engagement card assets, and ML model artifacts. Built an automated ingestion pipeline processing 100+ datasets.',
    years: 2,
    relatedIds: ['go', 'aws-lambda'],
  },
  'aws-eks': {
    description:
      'Managed Kubernetes cluster for production microservices. Handles container orchestration, rolling deployments, and horizontal scaling.',
    years: 1,
    relatedIds: ['docker', 'argocd'],
  },
  'aws-cognito': {
    description:
      'AWS managed identity service for user pools, OAuth 2.0 flows, and JWT token issuance.',
    years: 1,
    relatedIds: ['nestjs', 'redis'],
  },
  'aws-glue': {
    description:
      'Serverless ETL for daily batch annotation processing — 1.5–2 lakh records/day flowing into analytics and model training pipelines.',
    years: 1,
    relatedIds: ['etl-pipelines', 'dynamodb'],
  },
  'aws-sqs-sns': {
    description:
      'Message queuing (SQS) and pub/sub (SNS) for decoupled async communication between microservices and blockchain webhooks.',
    years: 1,
    relatedIds: ['microservices', 'nestjs'],
  },
  docker: {
    description:
      'Container packaging for microservices and CI/CD pipelines. Used for local development parity and production image builds.',
    years: 2,
    relatedIds: ['aws-eks', 'jenkins'],
  },
  jenkins: {
    description:
      'CI/CD automation for build, test, and deploy pipelines in the KGeN monorepo.',
    years: 1,
    relatedIds: ['docker', 'argocd'],
  },
  argocd: {
    description:
      'GitOps deployment tool for Kubernetes. Manages declarative application state and automated rollouts on EKS.',
    years: 1,
    relatedIds: ['aws-eks', 'docker'],
  },
  'openai-gpt4o': {
    description:
      'Integrated OpenAI GPT-4o for card content generation (POE system) and resume parsing. Designed prompt templates, structured output parsing, and error-handling retries.',
    years: 1,
    relatedIds: ['go', 'python'],
  },
  'sarvam-ai': {
    description:
      'Indian-language AI platform integrated into audio annotation pipelines. Handles transcription and labelling across 5+ languages, reducing manual effort by 40-60%.',
    years: 1,
    relatedIds: ['go', 'etl-pipelines'],
  },
  'speaker-diarization': {
    description:
      'Automated speaker segmentation and identification in multi-speaker audio datasets for annotation pipelines.',
    years: 1,
    relatedIds: ['python', 'sarvam-ai'],
  },
  'etl-pipelines': {
    description:
      'End-to-end ETL design: S3 ingestion → transformation → DynamoDB/analytics sinks. AWS Glue batch jobs handling millions of annotation records.',
    years: 1,
    relatedIds: ['aws-glue', 'dynamodb', 'aws-s3'],
  },
  'system-design': {
    description:
      'Designs scalable distributed systems: rate limiters, sharded databases, event-driven architectures, and API gateways. Core competency for senior engineering interviews and production architecture.',
    years: 2,
    relatedIds: ['distributed-systems', 'microservices'],
  },
  'distributed-systems': {
    description:
      'Deep expertise in consensus, consistency models, distributed locking, and fault tolerance. Applied in OAuth race-condition fixes, blockchain infrastructure, and annotation orchestration.',
    years: 2,
    relatedIds: ['system-design', 'redis', 'microservices'],
  },
  'blockchain-web3': {
    description:
      'Built full blockchain transaction infrastructure on Solana and Aptos: KGEN/USDT/K-Cash transfers, EOA swaps, and payment webhook integrations serving 50k+ users.',
    years: 1,
    relatedIds: ['nestjs', 'distributed-systems'],
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSkillProjects(skill: Skill) {
  const nameNorm = skill.name.toLowerCase()
  const idNorm = skill.id.toLowerCase()
  return projects.filter((p) => {
    const allTech = [
      ...p.techStack.primary,
      ...(p.techStack.secondary ?? []),
      ...(p.techStack.infra ?? []),
    ].map((t) => t.toLowerCase())
    return allTech.some(
      (t) =>
        t.includes(nameNorm) ||
        nameNorm.includes(t) ||
        t.includes(idNorm) ||
        idNorm.includes(t)
    )
  })
}

function ProficiencyStars({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Proficiency ${level} of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(level)
        const half = !filled && i < level
        return (
          <span key={i}>
            {filled ? (
              <Star className="h-4 w-4 fill-[#FFD166] text-[#FFD166]" />
            ) : half ? (
              <StarHalf className="h-4 w-4 fill-[#FFD166] text-[#FFD166]" />
            ) : (
              <Star className="h-4 w-4 text-white/20" />
            )}
          </span>
        )
      })}
    </div>
  )
}

const PROFICIENCY_LABELS: Record<number, string> = {
  1: 'Beginner',
  2: 'Familiar',
  3: 'Proficient',
  4: 'Advanced',
  5: 'Expert',
}

const CATEGORY_COLORS: Record<string, string> = {
  languages: '#7C5CFF',
  frameworks: '#00D4FF',
  databases: '#FF6B6B',
  cloud: '#FFD166',
  ai: '#06D6A0',
  architecture: '#F77F00',
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export interface SkillModalProps {
  skill: Skill | null
  allSkills: Skill[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SkillModal({ skill, allSkills, open, onOpenChange }: SkillModalProps) {
  // Close on Escape is handled by Radix natively
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onOpenChange])

  if (!skill) return null

  const meta = SKILL_META[skill.id]
  const skillProjects = getSkillProjects(skill)
  const categoryColor = CATEGORY_COLORS[skill.category] ?? '#7C5CFF'
  const relatedSkills = (meta?.relatedIds ?? [])
    .map((id) => allSkills.find((s) => s.id === id))
    .filter(Boolean) as Skill[]

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              {/* Overlay */}
              <Dialog.Overlay asChild forceMount>
                <motion.div
                  className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Dialog.Overlay>

              {/* Content */}
              <Dialog.Content asChild forceMount>
                <motion.div
                  className={cn(
                    'fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2',
                    'max-h-[90vh] overflow-y-auto rounded-2xl',
                    'border border-white/10 bg-[#0d0d1a]/95 backdrop-blur-xl',
                    'shadow-2xl outline-none',
                  )}
                  style={{
                    boxShadow: `0 0 60px ${categoryColor}30, 0 0 120px ${categoryColor}15`,
                    borderColor: `${categoryColor}40`,
                  }}
                  initial={{ opacity: 0, scale: 0.92, y: '-48%' }}
                  animate={{ opacity: 1, scale: 1, y: '-50%' }}
                  exit={{ opacity: 0, scale: 0.92, y: '-48%' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                >
                  {/* Header */}
                  <div
                    className="relative px-6 pb-4 pt-6"
                    style={{
                      background: `linear-gradient(135deg, ${categoryColor}18 0%, transparent 60%)`,
                      borderBottom: `1px solid ${categoryColor}25`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {/* Planet dot */}
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl"
                          style={{
                            background: `radial-gradient(circle at 35% 35%, ${categoryColor}cc, ${categoryColor}44)`,
                            boxShadow: `0 0 20px ${categoryColor}60`,
                          }}
                        >
                          <span>{SKILL_EMOJI[skill.id] ?? '●'}</span>
                        </div>

                        <div>
                          <Dialog.Title className="text-xl font-bold text-white">
                            {skill.name}
                          </Dialog.Title>
                          <div className="mt-1 flex items-center gap-2">
                            <ProficiencyStars level={skill.proficiency} />
                            <span className="text-sm" style={{ color: categoryColor }}>
                              {PROFICIENCY_LABELS[skill.proficiency] ?? 'Proficient'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Dialog.Close asChild>
                        <button
                          className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                          aria-label="Close"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </Dialog.Close>
                    </div>

                    {/* Category + Years */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className="rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
                        style={{
                          background: `${categoryColor}22`,
                          color: categoryColor,
                          border: `1px solid ${categoryColor}44`,
                        }}
                      >
                        {skill.category}
                      </span>
                      {meta?.years && (
                        <span className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white/60">
                          <Clock className="h-3 w-3" />
                          {meta.years}+ {meta.years === 1 ? 'year' : 'years'} experience
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-5 px-6 py-5">
                    {/* Proficiency bar */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-white/40">
                          Proficiency
                        </span>
                        <span className="text-xs font-semibold text-white/70">
                          {skill.proficiency * 20}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/8">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${categoryColor}, ${categoryColor}aa)`,
                            boxShadow: `0 0 8px ${categoryColor}80`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.proficiency * 20}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                        />
                      </div>
                    </div>

                    {/* Description */}
                    {meta?.description && (
                      <div>
                        <p className="text-sm leading-relaxed text-white/70">{meta.description}</p>
                      </div>
                    )}

                    {/* Projects */}
                    {skillProjects.length > 0 && (
                      <div>
                        <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-white/40">
                          <Layers className="h-3.5 w-3.5" />
                          Used in Projects
                        </h3>
                        <ul className="space-y-2">
                          {skillProjects.map((p) => (
                            <li
                              key={p.id}
                              className="rounded-xl border border-white/8 bg-white/4 px-3 py-2.5"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="text-sm font-medium text-white/90">{p.title}</span>
                                {p.status && (
                                  <span
                                    className={cn(
                                      'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase',
                                      p.status === 'production'
                                        ? 'bg-[#06D6A0]/15 text-[#06D6A0]'
                                        : p.status === 'wip'
                                          ? 'bg-[#FFD166]/15 text-[#FFD166]'
                                          : 'bg-white/10 text-white/40',
                                    )}
                                  >
                                    {p.status}
                                  </span>
                                )}
                              </div>
                              {p.metrics && p.metrics.length > 0 && (
                                <p className="mt-1 text-xs text-white/40">{p.metrics[0]}</p>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Related skills */}
                    {relatedSkills.length > 0 && (
                      <div>
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                          Related Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {relatedSkills.map((s) => (
                            <span
                              key={s.id}
                              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 transition-colors hover:border-white/20 hover:text-white/90"
                            >
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Learning resources */}
                    {meta?.resources && meta.resources.length > 0 && (
                      <div>
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                          Resources
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {meta.resources.map((r) => (
                            <a
                              key={r.href}
                              href={r.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-lg border border-[#7C5CFF]/30 bg-[#7C5CFF]/10 px-3 py-1 text-xs text-[#A78BFF] transition-colors hover:border-[#7C5CFF]/60 hover:text-[#C4B5FF]"
                            >
                              {r.label} →
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

// ─── Skill emoji map ──────────────────────────────────────────────────────────

const SKILL_EMOJI: Record<string, string> = {
  go: '🔵',
  typescript: '🟡',
  python: '🐍',
  javascript: '🟠',
  java: '☕',
  cpp: '⚙️',
  nestjs: '🪺',
  nodejs: '🟢',
  expressjs: '🚂',
  'rest-apis': '🔌',
  microservices: '🧩',
  celery: '🌿',
  fastapi: '⚡',
  dynamodb: '🗄️',
  redis: '🔴',
  postgresql: '🐘',
  mongodb: '🍃',
  mysql: '🐬',
  'aws-lambda': '⚡',
  'aws-s3': '🪣',
  'aws-eks': '☸️',
  'aws-cognito': '🔐',
  'aws-glue': '🔧',
  'aws-sqs-sns': '📨',
  docker: '🐋',
  jenkins: '🔧',
  argocd: '🚀',
  'openai-gpt4o': '🤖',
  'sarvam-ai': '🗣️',
  'speaker-diarization': '🎙️',
  'etl-pipelines': '🔄',
  'system-design': '🏗️',
  'distributed-systems': '🌐',
  'blockchain-web3': '⛓️',
}
