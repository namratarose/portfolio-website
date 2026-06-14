'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { skillCategories } from '@/config/personal'

// ─── Skills Section — clean grouped grid ────────────────────────────────────────

export function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-12%' })

  return (
    <section id="skills" className="relative w-full py-24 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#61DAFB]/70">
            sys.skills
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-slate-100 sm:text-4xl">
            Tech I work with
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">
            The tools and technologies I use to design, build, and ship backend systems.
          </p>
        </motion.div>

        {/* Category grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.05 * i }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
            >
              {/* Category header */}
              <div className="mb-4 flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: cat.color, boxShadow: `0 0 10px ${cat.color}` }}
                />
                <h3 className="font-display text-sm font-semibold tracking-wide text-slate-200">
                  {cat.label}
                </h3>
              </div>

              {/* Skill chips */}
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="rounded-lg border px-2.5 py-1 text-xs font-medium text-slate-300 transition-colors"
                    style={{
                      borderColor: `${cat.color}33`,
                      background: `${cat.color}12`,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
