'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useAddDiscoveredEgg, useTerminalStore } from '@/store/portfolioStore'

// ─── Types ────────────────────────────────────────────────────────────────────

type EggMode =
  | 'idle'
  | 'physics'
  | 'hyperspace'
  | 'matrix'
  | 'screensaver'
  | 'terminal'

// ─── ASCII art for "NAMRATA" easter egg ──────────────────────────────────────

const NAMRATA_ASCII = `
  _   _    _    __  __ ____    _  _____ _
 | \\ | |  / \\  |  \\/  |  _ \\  / \\|_   _/ \\
 |  \\| | / _ \\ | |\\/| | |_) |/ _ \\ | |/ _ \\
 | |\\  |/ ___ \\| |  | |  _ </ ___ \\| / ___ \\
 |_| \\_/_/   \\_\\_|  |_|_| \\_\\_/   \\_/_/   \\_\\
`

// ─── Matrix Rain Canvas ───────────────────────────────────────────────────────

function MatrixRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number | null>(null)

  useEffect(() => {
    if (!active) {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cols = Math.floor(canvas.width / 16)
    const drops: number[] = Array(cols).fill(1)

    const chars =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]|'

    function draw() {
      ctx!.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height)

      ctx!.fillStyle = '#00FF41'
      ctx!.font = '14px JetBrains Mono, monospace'

      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx!.fillText(char, i * 16, y * 16)

        if (y * 16 > canvas!.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      })

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [active])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[999]"
      style={{ opacity: 0.85, mixBlendMode: 'screen' }}
    />
  )
}

// ─── Screensaver — flying code snippets ──────────────────────────────────────

const CODE_SNIPPETS = [
  'const universe = new OrbitOS()',
  'await deployToMars()',
  'git push origin main',
  'docker run --rm namrata',
  'SELECT * FROM stars',
  'fn main() { orbit(); }',
  'npm run universe',
  'curl -X POST /api/life',
  'if (coffee > 0) code()',
  'return <HeroSection />',
  'type Engineer = "Namrata"',
  'sudo make me a sandwich',
  'ssh namrata@satellite.io',
  'kubectl apply -f orbit.yaml',
  '// TODO: conquer the world',
]

function Screensaver({ active }: { active: boolean }) {
  const [snippets, setSnippets] = useState<
    Array<{ id: number; text: string; x: number; y: number; speed: number; opacity: number }>
  >([])

  useEffect(() => {
    if (!active) {
      setSnippets([])
      return
    }

    const initial = CODE_SNIPPETS.map((text, i) => ({
      id: i,
      text,
      x: Math.random() * 90,
      y: Math.random() * 90,
      speed: 0.3 + Math.random() * 0.7,
      opacity: 0.4 + Math.random() * 0.6,
    }))
    setSnippets(initial)

    const interval = setInterval(() => {
      setSnippets(prev =>
        prev.map(s => ({
          ...s,
          y: s.y - s.speed,
          x: s.x + (Math.random() - 0.5) * 0.5,
          // wrap around
          ...(s.y < -5 ? { y: 105, x: Math.random() * 90 } : {}),
        }))
      )
    }, 50)

    return () => clearInterval(interval)
  }, [active])

  if (!active) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[998] overflow-hidden">
      {snippets.map(s => (
        <span
          key={s.id}
          className="absolute font-mono text-xs whitespace-nowrap"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            opacity: s.opacity,
            color: `hsl(${(s.id * 47) % 360}, 80%, 65%)`,
            transform: 'translateZ(0)',
          }}
        >
          {s.text}
        </span>
      ))}
    </div>
  )
}

// ─── Hyperspace overlay ───────────────────────────────────────────────────────

function Hyperspace({ active }: { active: boolean }) {
  if (!active) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] hyperspace-overlay">
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="hyperspace-star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${0.3 + Math.random() * 0.4}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─── Terminal Modal ───────────────────────────────────────────────────────────

function TerminalModal({ active, onClose }: { active: boolean; onClose: () => void }) {
  const [lines, setLines] = useState<string[]>([])
  const [input, setInput] = useState('')

  useEffect(() => {
    if (!active) return

    const boot = [
      '> OrbitOS Terminal v1.0.0',
      '> Initializing secure shell...',
      '',
      NAMRATA_ASCII,
      '',
      '> Welcome, fellow engineer!',
      '> You found the secret terminal. Type "help" for commands.',
      '',
    ]

    let i = 0
    const interval = setInterval(() => {
      if (i < boot.length) {
        setLines(prev => [...prev, boot[i]])
        i++
      } else {
        clearInterval(interval)
      }
    }, 80)

    return () => {
      clearInterval(interval)
      setLines([])
    }
  }, [active])

  const handleCommand = useCallback(
    (cmd: string) => {
      const trimmed = cmd.trim().toLowerCase()
      setLines(prev => [...prev, `$ ${cmd}`])

      switch (trimmed) {
        case 'help':
          setLines(prev => [
            ...prev,
            'Available commands:',
            '  whoami     — Find out who you are',
            '  skills     — List Namrata\'s skills',
            '  coffee     — Check coffee levels',
            '  sudo hire  — Initiate hiring sequence',
            '  clear      — Clear terminal',
            '  exit       — Close terminal',
          ])
          break
        case 'whoami':
          setLines(prev => [...prev, 'A curious engineer. Welcome to OrbitOS.'])
          break
        case 'skills':
          setLines(prev => [
            ...prev,
            'Go • NestJS • TypeScript • Python • AWS • DynamoDB',
            'Redis • Kafka • Docker • Kubernetes • Blockchain',
            'React • Next.js • PostgreSQL • Distributed Systems',
          ])
          break
        case 'coffee':
          setLines(prev => [
            ...prev,
            '☕ Coffee levels: CRITICAL',
            '> System running on willpower and espresso.',
          ])
          break
        case 'sudo hire namrata':
        case 'sudo hire':
          setLines(prev => [
            ...prev,
            '[sudo] password for recruiter:',
            'Access granted. Initiating offer letter generation...',
            '> mailto:namrata.kesarwani@kgen.io',
          ])
          break
        case 'clear':
          setLines([])
          break
        case 'exit':
        case 'quit':
          onClose()
          break
        default:
          setLines(prev => [
            ...prev,
            `bash: ${trimmed}: command not found`,
            'Type "help" for available commands.',
          ])
      }
      setInput('')
    },
    [onClose]
  )

  if (!active) return null

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="glass-heavy w-full max-w-2xl rounded-xl border border-[#7C5CFF]/30 overflow-hidden shadow-2xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0D1321] border-b border-[#1E293B]">
          <button
            onClick={onClose}
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 transition-colors"
          />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-xs text-slate-400 font-mono">namrata@orbitos ~ terminal</span>
        </div>

        {/* Output */}
        <div className="h-80 overflow-y-auto p-4 font-mono text-xs text-green-400 bg-[#070B14] space-y-0.5">
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre leading-relaxed">
              {line}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#070B14] border-t border-[#1E293B]">
          <span className="text-[#7C5CFF] font-mono text-xs">$</span>
          <input
            autoFocus
            className="flex-1 bg-transparent text-green-400 font-mono text-xs outline-none caret-green-400"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleCommand(input)
              if (e.key === 'Escape') onClose()
            }}
            placeholder="type a command..."
          />
        </div>
      </div>
    </div>
  )
}

// ─── Physics Mode notification ────────────────────────────────────────────────

function PhysicsNotification({ active }: { active: boolean }) {
  if (!active) return null

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[1001] animate-fade-in-up">
      <div className="glass-heavy px-6 py-3 rounded-full border border-[#7C5CFF]/50 flex items-center gap-3">
        <span className="text-lg">🚀</span>
        <span className="font-mono text-sm text-[#7C5CFF]">PHYSICS MODE ACTIVATED</span>
        <span className="text-lg">🌌</span>
      </div>
    </div>
  )
}

// ─── Nav Secret Sequence ─────────────────────────────────────────────────────

const NAV_SECRET_SEQUENCE = ['about', 'skills', 'contact'] // 3-click nav unlock

// ─── Main EasterEggs component ───────────────────────────────────────────────

export function EasterEggs() {
  const addDiscoveredEgg = useAddDiscoveredEgg()
  const toggleTerminal = useTerminalStore(s => s.toggleTerminal)

  const [mode, setMode] = useState<EggMode>('idle')
  const [terminalOpen, setTerminalOpen] = useState(false)
  const [hyperspaceActive, setHyperspaceActive] = useState(false)

  // Typing "NAMRATA" buffer
  const typingBufferRef = useRef<string>('')
  // Logo click counter
  const logoClicksRef = useRef<number>(0)
  const logoClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Idle timer
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Nav click sequence
  const navSequenceRef = useRef<string[]>([])

  // ── Reset idle timer on any activity ──
  const resetIdleTimer = useCallback(() => {
    if (mode === 'screensaver') setMode('idle')
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => {
      setMode('screensaver')
      addDiscoveredEgg('screensaver')
    }, 30_000)
  }, [mode, addDiscoveredEgg])

  // ── Konami code → Physics Mode ──
  useEffect(() => {
    const handleEgg = (e: Event) => {
      const { detail } = e as CustomEvent
      if (detail?.id === 'konami') {
        setMode('physics')
        addDiscoveredEgg('physics-mode')
        // Add physics class to body
        document.body.classList.add('physics-mode')
        setTimeout(() => {
          document.body.classList.remove('physics-mode')
          setMode('idle')
        }, 12_000)
      }
    }
    window.addEventListener('easter-egg', handleEgg)
    return () => window.removeEventListener('easter-egg', handleEgg)
  }, [addDiscoveredEgg])

  // ── Type "NAMRATA" anywhere → Terminal ──
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only plain character presses (no modifiers)
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const ch = e.key.toUpperCase()
      if (ch.length === 1) {
        typingBufferRef.current += ch
        if (typingBufferRef.current.length > 7) {
          typingBufferRef.current = typingBufferRef.current.slice(-7)
        }
        if (typingBufferRef.current === 'NAMRATA') {
          typingBufferRef.current = ''
          setTerminalOpen(true)
          addDiscoveredEgg('namrata-terminal')
        }
      }
    }
    window.addEventListener('keypress', handleKeyPress)
    return () => window.removeEventListener('keypress', handleKeyPress)
  }, [addDiscoveredEgg])

  // ── Logo 5-click → Hyperspace ──
  useEffect(() => {
    const handleLogoClick = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.closest('[data-easter-logo]')) {
        logoClicksRef.current++
        if (logoClickTimerRef.current) clearTimeout(logoClickTimerRef.current)
        logoClickTimerRef.current = setTimeout(() => {
          logoClicksRef.current = 0
        }, 3_000)

        if (logoClicksRef.current >= 5) {
          logoClicksRef.current = 0
          setHyperspaceActive(true)
          addDiscoveredEgg('hyperspace')
          document.documentElement.classList.add('hyperspace-mode')
          setTimeout(() => {
            setHyperspaceActive(false)
            document.documentElement.classList.remove('hyperspace-mode')
          }, 4_000)
        }
      }
    }
    document.addEventListener('click', handleLogoClick)
    return () => {
      document.removeEventListener('click', handleLogoClick)
      if (logoClickTimerRef.current) clearTimeout(logoClickTimerRef.current)
    }
  }, [addDiscoveredEgg])

  // ── Nav sequence (about → skills → contact) → Matrix Mode ──
  useEffect(() => {
    const handleNavClick = (e: Event) => {
      const target = e.target as HTMLElement
      const navItem = target.closest('[data-nav-id]')
      if (!navItem) return
      const id = navItem.getAttribute('data-nav-id') ?? ''
      navSequenceRef.current.push(id)
      if (navSequenceRef.current.length > 3) navSequenceRef.current.shift()

      if (
        navSequenceRef.current.length === 3 &&
        navSequenceRef.current.every((v, i) => v === NAV_SECRET_SEQUENCE[i])
      ) {
        navSequenceRef.current = []
        setMode('matrix')
        addDiscoveredEgg('matrix-mode')
        setTimeout(() => setMode('idle'), 15_000)
      }
    }
    document.addEventListener('click', handleNavClick)
    return () => document.removeEventListener('click', handleNavClick)
  }, [addDiscoveredEgg])

  // ── Idle screensaver ──
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'touchstart', 'scroll']
    events.forEach(ev => window.addEventListener(ev, resetIdleTimer, { passive: true }))
    resetIdleTimer()
    return () => {
      events.forEach(ev => window.removeEventListener(ev, resetIdleTimer))
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [resetIdleTimer])

  return (
    <>
      {/* Physics mode notification */}
      <PhysicsNotification active={mode === 'physics'} />

      {/* Terminal */}
      <TerminalModal
        active={terminalOpen}
        onClose={() => setTerminalOpen(false)}
      />

      {/* Hyperspace effect */}
      <Hyperspace active={hyperspaceActive} />

      {/* Matrix rain */}
      <MatrixRain active={mode === 'matrix'} />

      {/* Idle screensaver */}
      <Screensaver active={mode === 'screensaver'} />

      {/* Matrix mode close hint */}
      {mode === 'matrix' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1001]">
          <div className="glass-heavy px-5 py-2 rounded-full border border-green-500/30">
            <span className="font-mono text-xs text-green-400">MATRIX MODE — auto-exit in 15s</span>
          </div>
        </div>
      )}

      {/* Screensaver close hint */}
      {mode === 'screensaver' && (
        <div
          className="fixed inset-0 z-[997] cursor-pointer"
          onClick={() => setMode('idle')}
        >
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <p className="font-mono text-xs text-slate-500 animate-pulse">
              — Press any key or click to exit screensaver —
            </p>
          </div>
        </div>
      )}
    </>
  )
}
