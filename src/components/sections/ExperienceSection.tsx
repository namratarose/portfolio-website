'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Stage {
  env: string
  icon: string
  title: string
  subtitle: string
  period: string
  status: string
  color: string
  achievements: { text: string; metric?: string }[]
  tech: string[]
  isLive?: boolean
  isFuture?: boolean
}

// ─── Data (career as a CI/CD pipeline) ──────────────────────────────────────────

const STAGES: Stage[] = [
  {
    env: 'localhost:3000',
    icon: '🖥️',
    title: 'Dr. APJ Abdul Kalam Technical University',
    subtitle: 'B.Tech — Computer Science & Engineering',
    period: '2021 – 2025',
    status: 'BUILD: PASSING',
    color: '#61DAFB',
    achievements: [
      { text: 'Graduated with strong academic performance', metric: 'CGPA 8.54 / 10' },
      { text: 'Focused on distributed systems, algorithms, and software engineering fundamentals' },
    ],
    tech: ['C++', 'Java', 'Python', 'Data Structures', 'OS Concepts'],
  },
  {
    env: 'development.kgen.io',
    icon: '🔧',
    title: 'KGeN',
    subtitle: 'Backend Developer Intern',
    period: 'Jul 2024 – May 2025',
    status: 'TESTS: PASSING',
    color: '#7C5CFF',
    achievements: [
      { text: 'Built NestJS proxy auth middleware routing requests with JWT, admin strategy & DynamoDB device whitelisting', metric: '10+ microservices' },
      { text: 'Migrated LLM resume parser from GCP Cloud Functions to AWS Lambda with Secrets Manager + cold-start optimization' },
      { text: 'Optimized POG NFT service with Go routines + Redis caching, improving leaderboard performance', metric: '30–50% faster' },
      { text: 'Extended localization with translation interceptors across quest-list, campaign, and web-banner APIs' },
    ],
    tech: ['NestJS', 'TypeScript', 'Go', 'Python', 'AWS Lambda', 'DynamoDB', 'Redis'],
  },
  {
    env: 'production.kgen.io',
    icon: '🚀',
    title: 'KGeN',
    subtitle: 'Software Development Engineer — Backend',
    period: 'Jun 2025 – Present',
    status: 'LIVE',
    color: '#FF7AE5',
    isLive: true,
    achievements: [
      { text: 'Integrated Sarvam AI batch transcription pipeline, cutting annotation turnaround', metric: '40–60% reduction' },
      { text: 'Designed POG card system end-to-end in Go (6 REST APIs, S3, DynamoDB, OpenAI GPT-4o) — launched as a standalone HumynLabs product' },
      { text: 'Implemented Redis distributed locking across Google/Apple/Discord OAuth, eliminating race conditions', metric: '100k+ users' },
      { text: 'Built a project association service (Go, PostgreSQL) supporting 5+ Indian languages in parallel tracks' },
      { text: 'Designed AWS Glue ETL pipelines syncing records daily', metric: '1.5–2 lakh records / day' },
    ],
    tech: ['Go', 'NestJS', 'Python', 'AWS Glue', 'S3', 'DynamoDB', 'Redis', 'PostgreSQL', 'Sarvam AI', 'OpenAI GPT-4o'],
  },
  {
    env: 'future.kgen.io',
    icon: '⚡',
    title: 'Next Mission',
    subtitle: 'Senior / Staff Engineer',
    period: 'Next chapter',
    status: 'QUEUED',
    color: '#F9D423',
    isFuture: true,
    achievements: [
      { text: 'Architect distributed systems at scale serving millions of users' },
      { text: 'Lead engineering on high-impact product and infrastructure decisions' },
    ],
    tech: ['Distributed Systems', 'System Design', 'Technical Leadership'],
  },
]

// ─── Stage card ─────────────────────────────────────────────────────────────────

function StageRow({ stage, index, isLast }: { stage: Stage; index: number; isLast: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="relative flex gap-4 sm:gap-6"
    >
      {/* Left rail: marker + connector */}
      <div className="flex flex-col items-center">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-lg"
          style={{
            borderColor: `${stage.color}50`,
            background: `${stage.color}14`,
            boxShadow: `0 0 16px ${stage.color}22`,
          }}
        >
          {stage.icon}
        </div>
        {!isLast && (
          <div
            className="mt-1 w-px flex-1"
            style={{ background: `linear-gradient(to bottom, ${stage.color}55, transparent)` }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className="mb-8 flex-1 rounded-2xl border p-5 sm:p-6"
        style={{
          borderColor: stage.isFuture ? `${stage.color}25` : '#1E293B',
          background: 'rgba(13, 19, 33, 0.6)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* env + status */}
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="font-mono text-xs text-slate-500">{stage.env}</span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest"
            style={{ borderColor: `${stage.color}55`, background: `${stage.color}18`, color: stage.color }}
          >
            {stage.isLive && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: stage.color }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: stage.color }} />
              </span>
            )}
            {stage.status}
          </span>
        </div>

        {/* title */}
        <h3 className="font-display text-lg font-bold text-slate-100">{stage.title}</h3>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-sm text-slate-400">
          <span>{stage.subtitle}</span>
          <span className="text-slate-600">·</span>
          <span className="font-mono text-xs text-slate-500">{stage.period}</span>
        </div>

        {/* achievements */}
        <ul className="mt-4 space-y-2.5">
          {stage.achievements.map((a, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-400">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: stage.color }} />
              <span>
                {a.text}
                {a.metric && (
                  <span className="ml-2 rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold" style={{ background: `${stage.color}1a`, color: stage.color }}>
                    {a.metric}
                  </span>
                )}
              </span>
            </li>
          ))}
        </ul>

        {/* tech */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {stage.tech.map((t) => (
            <span key={t} className="rounded-md border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-slate-400">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Experience Section ─────────────────────────────────────────────────────────

export function ExperienceSection() {
  const headerRef = useRef<HTMLDivElement>(null)
  const inView = useInView(headerRef, { once: true, margin: '-15%' })

  return (
    <section id="experience" className="relative w-full py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF7AE5]/70">
            sys.experience
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-100 sm:text-4xl">
            Career as a{' '}
            <span className="bg-gradient-to-r from-[#7C5CFF] via-[#FF7AE5] to-[#61DAFB] bg-clip-text text-transparent">
              CI/CD Pipeline
            </span>
          </h2>
          <p className="mt-3 font-mono text-sm text-slate-500">
            {'// Each role = a deployment stage. Build → Test → Ship → Scale.'}
          </p>
        </motion.div>

        {/* Timeline */}
        <div>
          {STAGES.map((stage, i) => (
            <StageRow key={stage.env} stage={stage} index={i} isLast={i === STAGES.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
