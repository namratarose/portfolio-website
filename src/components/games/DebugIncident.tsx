'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

type GamePhase = 'alarm' | 'diagnosis' | 'fix' | 'deploy' | 'success' | 'fail'
type ServiceId = 'api' | 'auth' | 'blockchain' | 'cache' | 'db' | 'queue'

interface Service {
  id: ServiceId
  name: string
  icon: string
  status: 'ok' | 'degraded' | 'down'
  errorSym?: string
}

interface FixOption {
  id: string
  text: string
  correct: boolean
  consequence?: string
}

interface Level {
  id: number
  title: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  description: string
  logs: string[]
  services: Service[]
  failingServiceIds: ServiceId[]
  fixPhases: FixPhase[]
  timerSeconds: number | null
  achievement?: string
}

interface FixPhase {
  serviceId: ServiceId
  prompt: string
  options: FixOption[]
  deployMessage: string
}

// ─── Level Data ───────────────────────────────────────────────────────────────

const LEVELS: Level[] = [
  {
    id: 1,
    title: 'The Redis Resurrection',
    difficulty: 'EASY',
    description: 'Users cannot log in. Auth tokens are being issued twice. The on-call phone is ringing.',
    timerSeconds: null,
    logs: [
      '[10:42:01] ERROR  auth-service       | Redis connection timeout after 5000ms',
      '[10:42:01] ERROR  auth-service       | Failed to acquire lock: token_refresh:user_8812',
      '[10:42:02] WARN   auth-service       | Duplicate token issued for user_8812 — race condition suspected',
      '[10:42:03] ERROR  auth-service       | Redis SETNX returned nil — lock unavailable',
      '[10:42:03] ERROR  auth-service       | Cache miss on session:user_8812 — falling back to DB',
      '[10:42:04] CRIT   auth-service       | 847 duplicate token events in last 60 seconds',
      '[10:42:05] ERROR  api-gateway        | 502 Bad Gateway on POST /auth/refresh (latency: 8430ms)',
      '[10:42:06] WARN   monitoring         | P0 threshold crossed — paging on-call engineer',
    ],
    services: [
      { id: 'api', name: 'API Gateway', icon: '🌐', status: 'degraded' },
      { id: 'auth', name: 'Auth Service', icon: '🔐', status: 'degraded' },
      { id: 'cache', name: 'Redis Cache', icon: '🔴', status: 'down' },
      { id: 'db', name: 'Database', icon: '🗄️', status: 'ok' },
      { id: 'blockchain', name: 'Payments Service', icon: '💳', status: 'ok' },
      { id: 'queue', name: 'Message Queue', icon: '📨', status: 'ok' },
    ],
    failingServiceIds: ['cache'],
    fixPhases: [
      {
        serviceId: 'cache',
        prompt: 'Redis is failing to acquire locks. What do you do?',
        options: [
          { id: 'a', text: 'Restart the Redis connection pool with backoff retry', correct: true },
          { id: 'b', text: 'Reboot the entire production database', correct: false, consequence: 'You reboot the DB. Now nothing works. The Slack channel is on fire.' },
          { id: 'c', text: 'Roll back yesterday\'s deploy and blame it', correct: false, consequence: 'Yesterday\'s code is fine. You just wasted 15 minutes. The CEO is now pinging you.' },
          { id: 'd', text: 'Increase all timeouts to 30 seconds', correct: false, consequence: 'Users now wait 30 seconds for every request. Engagement drops 87%. LGTM.' },
        ],
        deployMessage: 'Restarting Redis connection pool... clearing stale locks... SETNX now returning correctly... duplicate token rate: 0... auth latency normalizing...',
      },
    ],
  },
  {
    id: 2,
    title: 'The Connection Leak Catastrophe',
    difficulty: 'MEDIUM',
    description: 'Database connections are being exhausted. New requests are queuing indefinitely. You have 60 seconds.',
    timerSeconds: 60,
    logs: [
      '[14:15:33] ERROR  user-service        | FATAL: remaining connection slots are reserved for non-replication superuser',
      '[14:15:33] ERROR  user-service        | Error: Connection pool exhausted — max: 100, active: 100, idle: 0',
      '[14:15:34] ERROR  reward-service      | Timeout waiting for DB connection (30000ms elapsed)',
      '[14:15:34] ERROR  reward-service      | Uncaught ReferenceError: db connection not released in finally block',
      '[14:15:35] WARN   api-gateway         | Queue depth: 2847 pending requests',
      '[14:15:35] ERROR  auth-service        | Cannot authenticate — user-service unavailable',
      '[14:15:36] CRIT   reward-service      | 0 rewards processed in last 2 minutes',
      '[14:15:37] ERROR  db-proxy            | Max connections reached — rejecting new requests',
      '[14:15:38] WARN   monitoring          | SLA breach in 45 seconds at current error rate',
    ],
    services: [
      { id: 'api', name: 'API Gateway', icon: '🌐', status: 'degraded' },
      { id: 'auth', name: 'Auth Service', icon: '🔐', status: 'degraded' },
      { id: 'cache', name: 'Redis Cache', icon: '🔴', status: 'ok' },
      { id: 'db', name: 'Database', icon: '🗄️', status: 'down', errorSym: 'CONN_EXHAUSTED' },
      { id: 'blockchain', name: 'Payments Service', icon: '💳', status: 'ok' },
      { id: 'queue', name: 'Message Queue', icon: '📨', status: 'ok' },
    ],
    failingServiceIds: ['db'],
    fixPhases: [
      {
        serviceId: 'db',
        prompt: 'The DB connection pool is maxed out. What\'s the correct fix?',
        options: [
          { id: 'a', text: 'Kill idle connections and fix the missing finally{} release bug', correct: true },
          { id: 'b', text: 'Increase max_connections to 10,000 in postgres.conf', correct: false, consequence: 'PostgreSQL OOMs and crashes. You\'ve traded a leak for a full flood. Elegant.' },
          { id: 'c', text: 'Scale up to 50 service replicas immediately', correct: false, consequence: 'Now 50 services are leaking connections simultaneously. You\'ve multiplied the problem.' },
          { id: 'd', text: 'Disable connection pooling entirely', correct: false, consequence: 'Every request now opens a raw DB connection. The database cries and shuts down.' },
        ],
        deployMessage: 'Terminating idle connections... patching connection release in finally block... pool draining gracefully... active connections: 87... 61... 34... 12... Healthy.',
      },
    ],
  },
  {
    id: 3,
    title: 'The Distributed Deadlock',
    difficulty: 'HARD',
    description: 'Two services are deadlocked waiting for each other\'s locks. Payment processing halted. You have 60 seconds and must fix TWO services in the correct order.',
    timerSeconds: 60,
    logs: [
      '[22:07:11] ERROR  payments-worker | Deadlock detected: waiting for lock held by reward-service',
      '[22:07:11] ERROR  reward-service  | Deadlock detected: waiting for lock held by payments-worker',
      '[22:07:12] ERROR  payments-worker | Settlement batch #8841 stalled — 0 confirmations in 90s',
      '[22:07:12] ERROR  reward-service  | Reward settlement frozen — cannot acquire ledger lock',
      '[22:07:13] CRIT   payments-worker | 1,247 pending payouts unprocessed',
      '[22:07:13] CRIT   reward-service  | $84,200 in rewards pending settlement — SLA: 5 minutes',
      '[22:07:14] ERROR  db              | Lock wait timeout exceeded — transactions rolled back',
      '[22:07:15] WARN   monitoring      | Cascading failure risk: auth-service queuing behind reward-service',
      '[22:07:16] ALERT  oncall          | P0 — payments + rewards down. Engineers paged x3',
    ],
    services: [
      { id: 'api', name: 'API Gateway', icon: '🌐', status: 'ok' },
      { id: 'auth', name: 'Auth Service', icon: '🔐', status: 'degraded' },
      { id: 'cache', name: 'Redis Cache', icon: '🔴', status: 'ok' },
      { id: 'db', name: 'Database', icon: '🗄️', status: 'degraded', errorSym: 'LOCK_WAIT' },
      { id: 'blockchain', name: 'Payments Service', icon: '💳', status: 'down', errorSym: 'DEADLOCK' },
      { id: 'queue', name: 'Message Queue', icon: '📨', status: 'ok' },
    ],
    failingServiceIds: ['blockchain', 'db'],
    fixPhases: [
      {
        serviceId: 'blockchain',
        prompt: 'Step 1/2: Payments worker is deadlocked. Break the cycle first.',
        options: [
          { id: 'a', text: 'Force-release payments-worker\'s locks and restart with lock ordering enforced', correct: true },
          { id: 'b', text: 'Kill the reward-service first to break the deadlock', correct: false, consequence: 'Reward service dies. Payments worker keeps waiting for its own ghost. Deadlock persists. Nice try.' },
          { id: 'c', text: 'Restart both services simultaneously', correct: false, consequence: 'Both restart and immediately deadlock each other again in 3 seconds. A new personal record.' },
          { id: 'd', text: 'Disable distributed locking entirely', correct: false, consequence: 'Both services now process the same payouts. Double payouts. Legal is calling.' },
        ],
        deployMessage: 'Force-releasing payments-worker locks... enforcing lock acquisition order: ledger → payments... deadlock cycle broken... worker resuming batch #8841...',
      },
      {
        serviceId: 'db',
        prompt: 'Step 2/2: Reward service is still holding stale DB locks. Finish it.',
        options: [
          { id: 'a', text: 'Retry reward-service with idempotency keys and correct lock ordering', correct: true },
          { id: 'b', text: 'Manually delete all pending reward records to clear the queue', correct: false, consequence: 'You\'ve deleted $84,200 in legitimate user rewards. The support tickets are coming.' },
          { id: 'c', text: 'Scale reward-service to 20 replicas', correct: false, consequence: '20 replicas all hold locks on the same rows. The database has left the chat.' },
          { id: 'd', text: 'Set lock timeout to 1ms so they always fail fast', correct: false, consequence: 'Every transaction now times out in 1ms and retries forever. Congratulations on your infinite loop.' },
        ],
        deployMessage: 'Applying idempotency keys to pending rewards... re-acquiring locks in correct order: ledger → payments... processing 1,247 queued payouts... settlement complete... $84,200 distributed.',
      },
    ],
  },
]

// ─── Log Line ─────────────────────────────────────────────────────────────────

function LogLine({ line, index }: { line: string; index: number }) {
  const isError = line.includes('ERROR') || line.includes('CRIT') || line.includes('FATAL') || line.includes('ALERT')
  const isWarn = line.includes('WARN')
  const color = isError ? '#FF6B6B' : isWarn ? '#F9D423' : '#06D6A0'

  return (
    <motion.div
      key={line}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.12, duration: 0.25 }}
      className="font-mono text-[11px] leading-5 whitespace-pre-wrap break-all"
      style={{ color }}
    >
      {line}
    </motion.div>
  )
}

// ─── Service Node ─────────────────────────────────────────────────────────────

interface ServiceNodeProps {
  service: Service
  isClickable: boolean
  isFailingTarget: boolean
  onClick: () => void
  wrongFlash: boolean
}

function ServiceNode({ service, isClickable, isFailingTarget, onClick, wrongFlash }: ServiceNodeProps) {
  const statusColor =
    service.status === 'down' ? '#FF6B6B' :
    service.status === 'degraded' ? '#F9D423' :
    '#06D6A0'

  return (
    <motion.div
      className="relative flex flex-col items-center gap-1.5 cursor-pointer"
      onClick={isClickable ? onClick : undefined}
      whileHover={isClickable ? { scale: 1.08 } : {}}
      whileTap={isClickable ? { scale: 0.95 } : {}}
      animate={wrongFlash ? { x: [-4, 4, -4, 4, 0] } : {}}
      transition={{ duration: 0.3 }}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
    >
      {/* Node */}
      <motion.div
        className="relative flex items-center justify-center rounded-xl text-2xl"
        style={{
          width: 60,
          height: 60,
          background: wrongFlash ? 'rgba(255,107,107,0.25)' :
            service.status === 'down' ? 'rgba(255,107,107,0.15)' :
            service.status === 'degraded' ? 'rgba(249,212,35,0.1)' :
            'rgba(6,214,160,0.08)',
          border: `2px solid ${wrongFlash ? '#FF6B6B' : statusColor}`,
          boxShadow: isFailingTarget && isClickable
            ? `0 0 15px ${statusColor}60, 0 0 30px ${statusColor}30`
            : `0 0 8px ${statusColor}30`,
        }}
        animate={
          (service.status === 'down' || service.status === 'degraded') && isClickable
            ? { boxShadow: [
                `0 0 10px ${statusColor}40`,
                `0 0 20px ${statusColor}80`,
                `0 0 10px ${statusColor}40`,
              ]}
            : {}
        }
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        {service.icon}
        {/* Status dot */}
        <div
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-[#070B14]"
          style={{ background: statusColor }}
        />
        {service.errorSym && (
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[7px] font-mono font-bold px-1 rounded"
            style={{ background: '#FF6B6B20', color: '#FF6B6B', border: '1px solid #FF6B6B40' }}
          >
            {service.errorSym}
          </div>
        )}
      </motion.div>
      <span className="text-[10px] font-mono text-white/50 text-center leading-tight max-w-[70px]">
        {service.name}
      </span>
    </motion.div>
  )
}

// ─── Deploy Animation ─────────────────────────────────────────────────────────

function DeployAnimation({ message, onComplete }: { message: string; onComplete: () => void }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)
  const indexRef = useRef(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < message.length) {
        setDisplayed(message.slice(0, indexRef.current + 1))
        indexRef.current++
        setProgress(Math.round((indexRef.current / message.length) * 100))
      } else {
        clearInterval(interval)
        setDone(true)
        setTimeout(onComplete, 800)
      }
    }, 22)
    return () => clearInterval(interval)
  }, [message, onComplete])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <motion.div
          className="w-2 h-2 rounded-full bg-[#06D6A0]"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        <span className="text-xs font-mono text-[#06D6A0] uppercase tracking-widest">Deploying fix...</span>
      </div>
      <div
        className="rounded-lg p-4 font-mono text-xs text-[#06D6A0]/80 leading-relaxed min-h-[80px]"
        style={{ background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.2)' }}
      >
        {displayed}
        {!done && <span className="animate-pulse">█</span>}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between">
          <span className="text-[10px] font-mono text-white/30">Progress</span>
          <span className="text-[10px] font-mono text-[#06D6A0]">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#06D6A0] to-[#7C5CFF]"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Timer ────────────────────────────────────────────────────────────────────

function Timer({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (remaining <= 0) {
      onExpire()
      return
    }
    const t = setTimeout(() => setRemaining(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [remaining, onExpire])

  const pct = (remaining / seconds) * 100
  const color = remaining > 20 ? '#06D6A0' : remaining > 10 ? '#F9D423' : '#FF6B6B'

  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={remaining <= 10 ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="font-mono font-bold text-xl tabular-nums"
        style={{ color }}
      >
        {String(Math.floor(remaining / 60)).padStart(2, '0')}:{String(remaining % 60).padStart(2, '0')}
      </motion.div>
      <div className="h-1.5 w-24 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}

// ─── Lives ────────────────────────────────────────────────────────────────────

function Lives({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">Lives</span>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="text-base"
            animate={i >= count ? { opacity: 0.2, scale: 0.8 } : { opacity: 1, scale: 1 }}
          >
            ❤️
          </motion.span>
        ))}
      </div>
    </div>
  )
}

// ─── Main Game ────────────────────────────────────────────────────────────────

interface GameState {
  phase: GamePhase
  levelIndex: number
  fixPhaseIndex: number
  lives: number
  score: number
  wrongClicks: number
  hintsUsed: number
  startTime: number | null
  wrongFlashService: ServiceId | null
  wrongFlashFix: string | null
  wrongMessage: string | null
  timerExpired: boolean
}

const INITIAL_STATE: GameState = {
  phase: 'alarm',
  levelIndex: 0,
  fixPhaseIndex: 0,
  lives: 3,
  score: 1000,
  wrongClicks: 0,
  hintsUsed: 0,
  startTime: null,
  wrongFlashService: null,
  wrongFlashFix: null,
  wrongMessage: null,
  timerExpired: false,
}

export function DebugIncident() {
  const [gs, setGs] = useState<GameState>(INITIAL_STATE)
  const wrongFlashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const level = LEVELS[gs.levelIndex]
  const fixPhase = level.fixPhases[gs.fixPhaseIndex]

  const clearWrong = useCallback(() => {
    if (wrongFlashTimeout.current) clearTimeout(wrongFlashTimeout.current)
    wrongFlashTimeout.current = setTimeout(() => {
      setGs(prev => ({ ...prev, wrongFlashService: null, wrongFlashFix: null, wrongMessage: null }))
    }, 1200)
  }, [])

  // Alarm → Diagnosis
  const handleStartDiagnosis = useCallback(() => {
    setGs(prev => ({ ...prev, phase: 'diagnosis', startTime: Date.now() }))
  }, [])

  // Diagnosis: click service
  const handleServiceClick = useCallback((serviceId: ServiceId) => {
    if (gs.phase !== 'diagnosis') return
    const isCorrect = level.failingServiceIds.includes(serviceId)
    if (isCorrect) {
      // First failing service always opens fix
      setGs(prev => ({ ...prev, phase: 'fix' }))
    } else {
      const newLives = gs.lives - 1
      const newScore = Math.max(0, gs.score - 100)
      setGs(prev => ({
        ...prev,
        lives: newLives,
        score: newScore,
        wrongClicks: prev.wrongClicks + 1,
        wrongFlashService: serviceId,
        wrongMessage: `Wrong service. -100 pts.`,
      }))
      clearWrong()
      if (newLives <= 0) {
        setTimeout(() => setGs(prev => ({ ...prev, phase: 'fail' })), 800)
      }
    }
  }, [gs, level, clearWrong])

  // Fix phase: select option
  const handleFixSelect = useCallback((option: FixOption) => {
    if (gs.phase !== 'fix') return
    if (option.correct) {
      setGs(prev => ({ ...prev, phase: 'deploy' }))
    } else {
      const newLives = gs.lives - 1
      const newScore = Math.max(0, gs.score - 100)
      setGs(prev => ({
        ...prev,
        lives: newLives,
        score: newScore,
        wrongClicks: prev.wrongClicks + 1,
        wrongFlashFix: option.id,
        wrongMessage: option.consequence ?? 'Wrong fix. -100 pts.',
      }))
      clearWrong()
      if (newLives <= 0) {
        setTimeout(() => setGs(prev => ({ ...prev, phase: 'fail' })), 800)
      }
    }
  }, [gs, clearWrong])

  // Deploy complete
  const handleDeployComplete = useCallback(() => {
    const nextFixIndex = gs.fixPhaseIndex + 1
    if (nextFixIndex < level.fixPhases.length) {
      // More fix phases (Level 3)
      setGs(prev => ({ ...prev, fixPhaseIndex: nextFixIndex, phase: 'diagnosis' }))
    } else {
      // All fixed — success
      const elapsed = gs.startTime ? Math.floor((Date.now() - gs.startTime) / 1000) : 999
      const speedBonus = elapsed < 30 ? 200 : elapsed < 45 ? 100 : 0
      setGs(prev => ({ ...prev, score: prev.score + speedBonus, phase: 'success' }))
    }
  }, [gs, level])

  // Timer expire
  const handleTimerExpire = useCallback(() => {
    setGs(prev => ({ ...prev, phase: 'fail', timerExpired: true }))
  }, [])

  // Next level
  const handleNextLevel = useCallback(() => {
    const nextIndex = gs.levelIndex + 1
    if (nextIndex < LEVELS.length) {
      setGs({ ...INITIAL_STATE, levelIndex: nextIndex, score: gs.score })
    }
  }, [gs])

  // Restart
  const handleRestart = useCallback(() => {
    setGs(INITIAL_STATE)
  }, [])

  // Hint
  const handleHint = useCallback(() => {
    const newScore = Math.max(0, gs.score - 50)
    setGs(prev => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
      score: newScore,
      wrongMessage: `HINT: Look for the service with the blinking error indicator. -50 pts.`,
    }))
    clearWrong()
  }, [gs, clearWrong])

  const elapsed = gs.startTime ? Math.floor((Date.now() - gs.startTime) / 1000) : 0

  return (
    <div
      className="rounded-2xl overflow-hidden font-mono"
      style={{
        background: '#070B14',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 0 40px rgba(0,0,0,0.6)',
        minHeight: 520,
      }}
    >
      {/* Terminal header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ background: '#0D1321', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <div className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          <span className="text-white/30 text-[11px] ml-2 tracking-widest">
            incident-response — {level.title}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Lives count={gs.lives} />
          {level.timerSeconds && (gs.phase === 'diagnosis' || gs.phase === 'fix') && (
            <Timer seconds={level.timerSeconds} onExpire={handleTimerExpire} />
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/30">SCORE</span>
            <span className="text-sm font-bold text-[#7C5CFF]">{gs.score}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Level badge */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest"
            style={{
              background: level.difficulty === 'HARD' ? 'rgba(255,107,107,0.15)' :
                level.difficulty === 'MEDIUM' ? 'rgba(249,212,35,0.15)' :
                'rgba(6,214,160,0.15)',
              color: level.difficulty === 'HARD' ? '#FF6B6B' :
                level.difficulty === 'MEDIUM' ? '#F9D423' :
                '#06D6A0',
              border: `1px solid ${level.difficulty === 'HARD' ? 'rgba(255,107,107,0.3)' :
                level.difficulty === 'MEDIUM' ? 'rgba(249,212,35,0.3)' :
                'rgba(6,214,160,0.3)'}`,
            }}
          >
            Level {level.id} · {level.difficulty}
          </div>
          <span className="text-white/40 text-xs">{level.description}</span>
        </div>

        {/* Wrong message */}
        <AnimatePresence>
          {gs.wrongMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 rounded-lg px-4 py-2.5 text-xs"
              style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', color: '#FF6B6B' }}
            >
              ⚠ {gs.wrongMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ALARM PHASE */}
        <AnimatePresence mode="wait">
          {gs.phase === 'alarm' && (
            <motion.div
              key="alarm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <motion.div
                className="flex items-center gap-3 rounded-xl px-5 py-4"
                style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.3)' }}
                animate={{ boxShadow: ['0 0 10px rgba(255,107,107,0.1)', '0 0 25px rgba(255,107,107,0.3)', '0 0 10px rgba(255,107,107,0.1)'] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <motion.span
                  className="text-3xl"
                  animate={{ rotate: [-10, 10, -10] }}
                  transition={{ duration: 0.4, repeat: Infinity }}
                >
                  🚨
                </motion.span>
                <div>
                  <div className="text-[#FF6B6B] font-bold text-sm uppercase tracking-widest">P0 Production Incident</div>
                  <div className="text-white/40 text-xs mt-0.5">Logs incoming — assess the damage</div>
                </div>
              </motion.div>

              {/* Scrolling logs */}
              <div
                className="rounded-xl p-4 overflow-y-auto flex flex-col gap-0.5"
                style={{
                  background: '#030508',
                  border: '1px solid rgba(255,255,255,0.05)',
                  maxHeight: 200,
                }}
              >
                {level.logs.map((line, i) => (
                  <LogLine key={i} line={line} index={i} />
                ))}
              </div>

              <motion.button
                onClick={handleStartDiagnosis}
                className="w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,107,107,0.2), rgba(255,107,107,0.08))',
                  border: '1px solid rgba(255,107,107,0.4)',
                  color: '#FF6B6B',
                }}
                whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(255,107,107,0.2)' }}
                whileTap={{ scale: 0.99 }}
              >
                Begin Diagnosis
              </motion.button>
            </motion.div>
          )}

          {/* DIAGNOSIS PHASE */}
          {gs.phase === 'diagnosis' && (
            <motion.div
              key={`diagnosis-${gs.fixPhaseIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#F9D423] uppercase tracking-widest mb-1">
                    {gs.fixPhaseIndex > 0 ? `Fix Phase ${gs.fixPhaseIndex + 1}: Locate Next Failing Service` : 'Diagnosis Phase'}
                  </div>
                  <div className="text-white/40 text-xs">Click the failing service to begin repair.</div>
                </div>
                <button
                  onClick={handleHint}
                  className="text-[10px] font-mono px-3 py-1.5 rounded-lg text-white/30 hover:text-white/60 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Hint (-50)
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 py-2">
                {level.services.map(svc => {
                  const isTarget = level.failingServiceIds[gs.fixPhaseIndex] === svc.id ||
                    (gs.fixPhaseIndex > 0 && level.failingServiceIds[gs.fixPhaseIndex] === svc.id)
                  return (
                    <ServiceNode
                      key={svc.id}
                      service={svc}
                      isClickable={svc.status !== 'ok'}
                      isFailingTarget={isTarget}
                      onClick={() => handleServiceClick(svc.id)}
                      wrongFlash={gs.wrongFlashService === svc.id}
                    />
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* FIX PHASE */}
          {gs.phase === 'fix' && (
            <motion.div
              key={`fix-${gs.fixPhaseIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-4"
            >
              <div>
                <div className="text-xs font-bold text-[#61DAFB] uppercase tracking-widest mb-1">Fix Phase</div>
                <div className="text-white/60 text-sm">{fixPhase.prompt}</div>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {fixPhase.options.map(option => (
                  <motion.button
                    key={option.id}
                    onClick={() => handleFixSelect(option)}
                    className="text-left px-4 py-3 rounded-xl text-xs leading-relaxed"
                    style={{
                      background: gs.wrongFlashFix === option.id
                        ? 'rgba(255,107,107,0.15)'
                        : 'rgba(255,255,255,0.03)',
                      border: gs.wrongFlashFix === option.id
                        ? '1px solid rgba(255,107,107,0.5)'
                        : '1px solid rgba(255,255,255,0.07)',
                      color: gs.wrongFlashFix === option.id ? '#FF6B6B' : 'rgba(255,255,255,0.65)',
                    }}
                    whileHover={{ scale: 1.01, background: 'rgba(97,218,251,0.06)', borderColor: 'rgba(97,218,251,0.2)' }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span
                      className="font-bold mr-2 text-[10px] uppercase"
                      style={{ color: 'rgba(97,218,251,0.6)' }}
                    >
                      [{option.id.toUpperCase()}]
                    </span>
                    {option.text}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* DEPLOY PHASE */}
          {gs.phase === 'deploy' && (
            <motion.div
              key={`deploy-${gs.fixPhaseIndex}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4"
            >
              <div className="text-xs font-bold text-[#06D6A0] uppercase tracking-widest">Deploying Fix</div>
              <DeployAnimation
                message={fixPhase.deployMessage}
                onComplete={handleDeployComplete}
              />
            </motion.div>
          )}

          {/* SUCCESS PHASE */}
          {gs.phase === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-5 py-4 text-center"
            >
              <motion.div
                className="text-5xl"
                animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8 }}
              >
                ✅
              </motion.div>
              <div>
                <div className="text-lg font-bold text-[#06D6A0] mb-1">Incident Resolved</div>
                <div className="text-white/40 text-xs">Services restored. Users happy. SLA maintained.</div>
              </div>

              <div
                className="w-full rounded-xl p-4 grid grid-cols-3 gap-4"
                style={{ background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.2)' }}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xl font-bold text-[#06D6A0]">{gs.score}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider">Score</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xl font-bold text-white">{3 - gs.lives === 0 ? '0' : 3 - gs.lives}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider">Mistakes</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xl font-bold text-white">{elapsed}s</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider">Time</div>
                </div>
              </div>

              {gs.wrongClicks === 0 && (
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
                  style={{
                    background: 'rgba(249,212,35,0.1)',
                    border: '1px solid rgba(249,212,35,0.3)',
                    color: '#F9D423',
                  }}
                >
                  🏆 Zero Downtime Ninja — First try, no mistakes!
                </div>
              )}

              {elapsed < 30 && (
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold"
                  style={{
                    background: 'rgba(97,218,251,0.1)',
                    border: '1px solid rgba(97,218,251,0.3)',
                    color: '#61DAFB',
                  }}
                >
                  ⚡ Speed Debugger — Fixed in under 30 seconds!
                </div>
              )}

              <div className="flex gap-3">
                {gs.levelIndex < LEVELS.length - 1 && (
                  <motion.button
                    onClick={handleNextLevel}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest"
                    style={{
                      background: 'linear-gradient(135deg, rgba(124,92,255,0.3), rgba(124,92,255,0.1))',
                      border: '1px solid rgba(124,92,255,0.5)',
                      color: '#7C5CFF',
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Next Level →
                  </motion.button>
                )}
                <motion.button
                  onClick={handleRestart}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Restart
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* FAIL PHASE */}
          {gs.phase === 'fail' && (
            <motion.div
              key="fail"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-5 py-4 text-center"
            >
              <motion.div
                className="text-5xl"
                animate={{ scale: [1, 0.9, 1.1, 1] }}
                transition={{ duration: 0.5 }}
              >
                💀
              </motion.div>
              <div>
                <div className="text-lg font-bold text-[#FF6B6B] mb-1">
                  {gs.timerExpired ? 'Timer Expired' : 'Out of Lives'}
                </div>
                <div className="text-white/40 text-xs">
                  {gs.timerExpired
                    ? 'The SLA clock ran out. The status page is red. The on-call calendar is full.'
                    : 'Too many wrong decisions. Production is having a moment. This is fine.'}
                </div>
              </div>

              <div
                className="w-full rounded-xl p-4 grid grid-cols-2 gap-4"
                style={{ background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.2)' }}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xl font-bold text-[#FF6B6B]">{gs.score}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider">Final Score</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xl font-bold text-white">{gs.wrongClicks}</div>
                  <div className="text-[10px] text-white/30 uppercase tracking-wider">Wrong Moves</div>
                </div>
              </div>

              <motion.button
                onClick={handleRestart}
                className="px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,107,107,0.2), rgba(255,107,107,0.08))',
                  border: '1px solid rgba(255,107,107,0.4)',
                  color: '#FF6B6B',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Deploy Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
