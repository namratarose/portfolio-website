'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { siteConfig } from '@/config/site'
import { education } from '@/config/personal'

// ─── Highlight stats ──────────────────────────────────────────────────────────

const STATS = [
  { value: '1+', label: 'Years building backend systems' },
  { value: '100k+', label: 'Users protected by OAuth locking' },
  { value: '1.5L+', label: 'Records processed daily (ETL)' },
  { value: '10+', label: 'Microservices secured' },
] as const

const QUICK_FACTS = [
  { label: 'Role', value: 'SDE-1, Backend · KGeN' },
  { label: 'Education', value: `${education.degree.split(',')[0]}${education.cgpa ? ` · CGPA ${education.cgpa.split(' ')[0]}` : ''}` },
  { label: 'Location', value: siteConfig.author.location },
  { label: 'Focus', value: 'Distributed systems · AI pipelines' },
] as const

// ─── About Section ──────────────────────────────────────────────────────────────

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })

  return (
    <section id="about" className="relative w-full py-24 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#7C5CFF]/70">
            sys.about
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-100 sm:text-4xl">
            About me
          </h2>
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl space-y-4 text-base leading-relaxed text-slate-400"
        >
          <p>
            I&apos;m a <span className="text-slate-200">backend software engineer</span> at KGeN,
            where I build distributed microservices, AI-powered data pipelines, and secure
            authentication systems that run in production for real users.
          </p>
          <p>
            I like turning fuzzy, complex problems into clean systems — whether that&apos;s
            eliminating race conditions with distributed locking, cutting annotation turnaround
            with AI, or moving services to serverless without breaking latency budgets. I work
            mostly in <span className="text-slate-200">Go</span>,{' '}
            <span className="text-slate-200">NestJS</span>, and{' '}
            <span className="text-slate-200">AWS</span>.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
            >
              <div className="font-display text-2xl font-bold text-[#7C5CFF]">{stat.value}</div>
              <div className="mt-1 text-xs leading-snug text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Quick facts */}
        <motion.dl
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 border-t border-white/[0.06] pt-8 sm:grid-cols-2"
        >
          {QUICK_FACTS.map((fact) => (
            <div key={fact.label} className="flex items-baseline gap-3">
              <dt className="w-20 shrink-0 font-mono text-xs uppercase tracking-wider text-slate-600">
                {fact.label}
              </dt>
              <dd className="text-sm text-slate-300">{fact.value}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  )
}
