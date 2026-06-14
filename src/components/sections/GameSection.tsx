'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DebugIncident } from '@/components/games/DebugIncident'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ScoreEntry {
  score: number
  level: number
  mistakes: number
  date: string
}

// ─── Scoreboard ───────────────────────────────────────────────────────────────

function Scoreboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem('debug-incident-scores')
      if (raw) {
        const parsed = JSON.parse(raw) as ScoreEntry[]
        setScores(parsed.slice(0, 5))
      }
    } catch {
      // ignore
    }
  }, [])

  if (!mounted || scores.length === 0) {
    return (
      <div
        className="rounded-2xl p-5 text-center"
        style={{
          background: 'rgba(13,19,33,0.8)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="text-2xl mb-2">🏆</div>
        <p className="text-white/30 text-xs font-mono">No scores yet.</p>
        <p className="text-white/20 text-[10px] font-mono mt-1">Play a round to get on the board.</p>
      </div>
    )
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(13,19,33,0.8)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(124,92,255,0.08)' }}
      >
        <span className="text-base">🏆</span>
        <span className="text-xs font-mono font-bold text-white/60 uppercase tracking-widest">Top Scores</span>
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        {scores.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center justify-between px-3 py-2 rounded-lg"
            style={{
              background: i === 0 ? 'rgba(249,212,35,0.08)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${i === 0 ? 'rgba(249,212,35,0.2)' : 'rgba(255,255,255,0.04)'}`,
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-sm w-5 text-center">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
              </span>
              <div>
                <div className="text-xs font-bold text-white/70">
                  {entry.score} pts
                </div>
                <div className="text-[10px] font-mono text-white/25">
                  Lvl {entry.level} · {entry.mistakes} mistake{entry.mistakes !== 1 ? 's' : ''} · {entry.date}
                </div>
              </div>
            </div>
            {i === 0 && (
              <span
                className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase"
                style={{ background: 'rgba(249,212,35,0.15)', color: '#F9D423', border: '1px solid rgba(249,212,35,0.3)' }}
              >
                Best
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ─── Instructions ─────────────────────────────────────────────────────────────

function Instructions({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
  const steps = [
    { icon: '🚨', label: 'Read the alarm', desc: 'Scan the error logs to understand what blew up.' },
    { icon: '🔍', label: 'Diagnose the service', desc: 'Click the failing service in the dependency graph.' },
    { icon: '🔧', label: 'Apply the correct fix', desc: 'Pick the right fix — wrong answers cost lives and score.' },
    { icon: '🚀', label: 'Deploy', desc: 'Watch the fix deploy in real time and survive.' },
  ]

  const achievements = [
    { icon: '🏆', name: 'Zero Downtime Ninja', condition: 'Complete a level with zero wrong answers' },
    { icon: '⚡', name: 'Speed Debugger', condition: 'Resolve an incident in under 30 seconds' },
  ]

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(13,19,33,0.8)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full px-5 py-3 flex items-center justify-between text-left"
        style={{ borderBottom: expanded ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-base">📋</span>
          <span className="text-xs font-mono font-bold text-white/60 uppercase tracking-widest">How to Play</span>
        </div>
        <motion.span
          className="text-white/30 text-xs font-mono"
          animate={{ rotate: expanded ? 90 : 0 }}
        >
          ▶
        </motion.span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="p-4 flex flex-col gap-4">
              {/* Steps */}
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2.5">Game Flow</p>
                <div className="flex flex-col gap-2">
                  {steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                        style={{ background: 'rgba(124,92,255,0.12)', border: '1px solid rgba(124,92,255,0.2)' }}
                      >
                        {step.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white/60">{step.label}</div>
                        <div className="text-[11px] text-white/30 leading-snug">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scoring */}
              <div
                className="rounded-xl p-3"
                style={{ background: 'rgba(124,92,255,0.06)', border: '1px solid rgba(124,92,255,0.12)' }}
              >
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Scoring</p>
                <div className="flex flex-col gap-1 font-mono text-[11px] text-white/40">
                  <div className="flex justify-between"><span>Base score</span><span className="text-[#7C5CFF]">1000 pts</span></div>
                  <div className="flex justify-between"><span>Wrong answer</span><span className="text-[#FF6B6B]">-100 pts</span></div>
                  <div className="flex justify-between"><span>Hint used</span><span className="text-[#F9D423]">-50 pts</span></div>
                  <div className="flex justify-between"><span>Speed bonus (&lt;30s)</span><span className="text-[#06D6A0]">+200 pts</span></div>
                  <div className="flex justify-between"><span>Speed bonus (&lt;45s)</span><span className="text-[#06D6A0]">+100 pts</span></div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-2">Achievements</p>
                <div className="flex flex-col gap-1.5">
                  {achievements.map((ach, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                      style={{ background: 'rgba(249,212,35,0.04)', border: '1px solid rgba(249,212,35,0.1)' }}
                    >
                      <span className="text-base">{ach.icon}</span>
                      <div>
                        <div className="text-[11px] font-bold text-[#F9D423]/80">{ach.name}</div>
                        <div className="text-[10px] text-white/25">{ach.condition}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Difficulty Selector ──────────────────────────────────────────────────────

interface LevelSelectorProps {
  selected: number
  onSelect: (level: number) => void
}

function LevelSelector({ selected, onSelect }: LevelSelectorProps) {
  const levels = [
    { id: 1, label: 'Redis Resurrection', difficulty: 'EASY', color: '#06D6A0' },
    { id: 2, label: 'Connection Leak', difficulty: 'MEDIUM', color: '#F9D423' },
    { id: 3, label: 'Distributed Deadlock', difficulty: 'HARD', color: '#FF6B6B' },
  ]

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(13,19,33,0.8)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="px-5 py-3 flex items-center gap-2"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <span className="text-base">🎮</span>
        <span className="text-xs font-mono font-bold text-white/60 uppercase tracking-widest">Levels</span>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {levels.map(level => (
          <motion.button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-left"
            style={{
              background: selected === level.id
                ? `${level.color}10`
                : 'rgba(255,255,255,0.02)',
              border: `1px solid ${selected === level.id ? `${level.color}30` : 'rgba(255,255,255,0.05)'}`,
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div>
              <div className="text-xs font-bold text-white/60">Level {level.id}</div>
              <div className="text-[10px] text-white/30 font-mono">{level.label}</div>
            </div>
            <span
              className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase"
              style={{
                background: `${level.color}15`,
                color: level.color,
                border: `1px solid ${level.color}30`,
              }}
            >
              {level.difficulty}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// ─── Game Section ──────────────────────────────────────────────────────────────

export function GameSection() {
  const [instructionsOpen, setInstructionsOpen] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState(1)
  const [gameKey, setGameKey] = useState(0)

  const handleLevelSelect = useCallback((level: number) => {
    setSelectedLevel(level)
    setGameKey(k => k + 1)
  }, [])

  return (
    <section id="game" className="relative w-full py-24 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,107,107,0.04) 0%, transparent 70%)',
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
          <div
            className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest border"
            style={{
              background: 'rgba(255,107,107,0.08)',
              borderColor: 'rgba(255,107,107,0.2)',
              color: '#FF6B6B',
            }}
          >
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ◉
            </motion.span>
            Live Incident Simulator
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Debug The <span style={{ color: '#FF6B6B' }}>Production Incident</span>
          </h2>
          <p className="text-sm text-white/40 font-mono max-w-md mx-auto">
            Diagnose failures. Apply the right fix. Ship the deploy. Don&apos;t lose all your lives.
          </p>
        </motion.div>

        {/* Layout */}
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          {/* Left sidebar */}
          <motion.div
            className="w-full xl:w-72 flex-shrink-0 flex flex-col gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <LevelSelector selected={selectedLevel} onSelect={handleLevelSelect} />
            <Scoreboard />
            <Instructions expanded={instructionsOpen} onToggle={() => setInstructionsOpen(o => !o)} />
          </motion.div>

          {/* Game */}
          <motion.div
            className="w-full flex-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <DebugIncident key={`${selectedLevel}-${gameKey}`} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
