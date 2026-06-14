'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { NavBar } from '@/components/layout/NavBar'
import { AuroraBackground } from '@/components/layout/AuroraBackground'

// Heavy interactive sections — client only.
const SystemDesignSection = dynamic(
  () => import('@/components/sections/SystemDesignSection').then((m) => m.SystemDesignSection),
  { ssr: false }
)
const FunSection = dynamic(
  () => import('@/components/sections/FunSection').then((m) => m.FunSection),
  { ssr: false }
)
const GameSection = dynamic(
  () => import('@/components/sections/GameSection').then((m) => m.GameSection),
  { ssr: false }
)

export default function PlaygroundPage() {
  return (
    <>
      <AuroraBackground />
      <NavBar />

      <main className="relative z-10">
        {/* Intro */}
        <section className="px-4 pt-32 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-mono text-xs uppercase tracking-[0.3em] text-[#61DAFB]/70"
            >
              getting bored?
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-3 font-display text-4xl font-bold text-slate-100 sm:text-5xl"
            >
              The{' '}
              <span className="bg-gradient-to-r from-[#7C5CFF] via-[#FF7AE5] to-[#61DAFB] bg-clip-text text-transparent">
                Playground
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400"
            >
              The fun, experimental stuff that doesn&apos;t belong on a résumé — an interactive
              system-architecture lab, a developer transformation device, and a game where you
              debug a live production incident. Poke around.
            </motion.p>
          </div>
        </section>

        {/* Interactive sections */}
        <SystemDesignSection />
        <FunSection />
        <GameSection />
      </main>
    </>
  )
}
