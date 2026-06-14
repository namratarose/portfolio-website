'use client'

import { useEffect, useRef, useState } from 'react'

// ─── Boot messages sequence ───────────────────────────────────────────────────

const BOOT_MESSAGES = [
  'Initializing OrbitOS v1.0.0...',
  'Loading kernel modules...',
  'Mounting file systems...',
  'Starting distributed services...',
  'Calibrating orbital rings...',
  'Warming up GPU shaders...',
  'Establishing satellite uplink...',
  'Welcome to OrbitOS.',
]

// ─── Component ───────────────────────────────────────────────────────────────

export function LoadingScreen() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentMessage, setCurrentMessage] = useState(0)
  const [satelliteLaunched, setSatelliteLaunched] = useState(false)
  const [exiting, setExiting] = useState(false)
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const messageRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // Only show on first visit per session
    const hasVisited = sessionStorage.getItem('orbitos-loaded')
    if (hasVisited) return

    setVisible(true)

    // Progress bar
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          if (progressRef.current) clearInterval(progressRef.current)
          return 100
        }
        // Slow down near 100 for dramatic effect
        const increment = prev < 80 ? 4 : prev < 95 ? 1.5 : 0.5
        return Math.min(100, prev + increment)
      })
    }, 60)

    // Boot messages
    messageRef.current = setInterval(() => {
      setCurrentMessage(prev => Math.min(prev + 1, BOOT_MESSAGES.length - 1))
    }, 400)

    // Satellite launch at 60%
    const satTimer = setTimeout(() => setSatelliteLaunched(true), 2_400)

    // Exit when progress hits 100%
    const exitTimer = setTimeout(() => {
      setExiting(true)
      setTimeout(() => {
        setVisible(false)
        sessionStorage.setItem('orbitos-loaded', '1')
      }, 600)
    }, 4_200)

    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
      if (messageRef.current) clearInterval(messageRef.current)
      clearTimeout(satTimer)
      clearTimeout(exitTimer)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#070B14] transition-opacity duration-600 ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#7C5CFF 1px, transparent 1px), linear-gradient(90deg, #7C5CFF 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Orbital rings */}
      <div className="relative mb-12">
        {/* Outer ring */}
        <div
          className="absolute border border-[#7C5CFF]/20 rounded-full animate-spin"
          style={{
            width: '240px',
            height: '240px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '8s',
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute border border-[#61DAFB]/15 rounded-full animate-spin"
          style={{
            width: '180px',
            height: '180px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '5s',
            animationDirection: 'reverse',
          }}
        />
        {/* Inner ring */}
        <div
          className="absolute border border-[#FF7AE5]/15 rounded-full animate-spin"
          style={{
            width: '120px',
            height: '120px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDuration: '3s',
          }}
        />

        {/* Orbiting dot — outer */}
        <div
          className="absolute w-3 h-3 rounded-full bg-[#7C5CFF] shadow-[0_0_8px_#7C5CFF] animate-spin"
          style={{
            top: '50%',
            left: '50%',
            marginTop: '-110px',
            marginLeft: '-6px',
            transformOrigin: '6px 110px',
            animationDuration: '8s',
          }}
        />
        {/* Orbiting dot — middle */}
        <div
          className="absolute w-2 h-2 rounded-full bg-[#61DAFB] shadow-[0_0_6px_#61DAFB] animate-spin"
          style={{
            top: '50%',
            left: '50%',
            marginTop: '-80px',
            marginLeft: '-4px',
            transformOrigin: '4px 80px',
            animationDuration: '5s',
            animationDirection: 'reverse',
          }}
        />

        {/* Satellite launch animation */}
        <div
          className="absolute transition-all duration-1000 ease-in-out text-lg"
          style={{
            top: satelliteLaunched ? '-80px' : '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: satelliteLaunched ? 0 : 1,
          }}
        >
          🛰️
        </div>

        {/* Center logo */}
        <div className="flex items-center justify-center w-24 h-24">
          <span className="text-4xl select-none">⚙️</span>
        </div>
      </div>

      {/* OrbitOS label */}
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-xs text-[#7C5CFF]/60 tracking-[0.3em] uppercase">
          OrbitOS
        </span>
        <span className="font-mono text-xs text-slate-600">v1.0.0</span>
      </div>

      {/* Name */}
      <h1 className="text-2xl font-display font-semibold text-slate-200 mb-8 tracking-tight">
        Namrata Kesarwani
      </h1>

      {/* Boot messages */}
      <div className="h-6 mb-6 font-mono text-xs text-[#61DAFB]/70 text-center px-8">
        {BOOT_MESSAGES[currentMessage]}
        <span className="terminal-cursor ml-1" />
      </div>

      {/* Progress bar */}
      <div className="w-64 h-px bg-[#1E293B] relative overflow-hidden rounded-full">
        <div
          className="h-full bg-gradient-to-r from-[#7C5CFF] via-[#61DAFB] to-[#FF7AE5] transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
        {/* Shimmer on progress bar */}
        <div
          className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_1.5s_linear_infinite]"
          style={{ transform: `translateX(${(progress / 100) * 256 - 64}px)` }}
        />
      </div>

      {/* Percentage */}
      <p className="mt-3 font-mono text-xs text-slate-600">
        {Math.round(progress)}%
      </p>
    </div>
  )
}
