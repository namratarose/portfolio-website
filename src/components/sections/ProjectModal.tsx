'use client'

import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MissionProject {
  id: string
  missionCode: string
  title: string
  description: string
  fullDescription: string
  type: string
  status: 'DEPLOYED' | 'IN_PROGRESS' | 'PLANNED'
  tech: string[]
  impact: string
  impactMetrics: { label: string; value: string }[]
  architectureNodes: { id: string; label: string; sublabel?: string; color: string }[]
  architectureEdges: { from: string; to: string; label?: string }[]
  challenges: string[]
  github?: string
  live?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<MissionProject['status'], { bg: string; text: string; dot: string }> = {
  DEPLOYED:    { bg: '#34D39918', text: '#6EE7B7', dot: '#34D399' },
  IN_PROGRESS: { bg: '#FFD70018', text: '#FFF176', dot: '#FFD700' },
  PLANNED:     { bg: '#61DAFB18', text: '#A5EEFF', dot: '#61DAFB' },
}

const TYPE_COLORS: Record<string, string> = {
  'Product Feature':       '#7C5CFF',
  'Security Infrastructure': '#FF7AE5',
  'Blockchain/DeFi':       '#FFD700',
  'AI Pipeline':           '#34D399',
  'Data Engineering':      '#61DAFB',
  'Cloud Migration':       '#F87171',
  'Platform Engineering':  '#A78BFF',
  'Infrastructure':        '#9CA3AF',
}

// ─── Counting animation hook ──────────────────────────────────────────────────

function useCountUp(target: string, active: boolean) {
  const [display, setDisplay] = useState('0')
  const num = parseFloat(target.replace(/[^0-9.]/g, ''))
  const suffix = target.replace(/[0-9.]/g, '').trim()

  useEffect(() => {
    if (!active || isNaN(num)) {
      setDisplay(target)
      return
    }
    let start = 0
    const duration = 1200
    const step = 16
    const steps = duration / step
    const increment = num / steps
    const id = setInterval(() => {
      start += increment
      if (start >= num) {
        setDisplay(target)
        clearInterval(id)
      } else {
        const val = Number.isInteger(num) ? Math.floor(start) : start.toFixed(1)
        setDisplay(`${val}${suffix}`)
      }
    }, step)
    return () => clearInterval(id)
  }, [active, target, num, suffix])

  return display
}

// ─── Architecture Flow Diagram ────────────────────────────────────────────────

interface FlowNode {
  id: string
  label: string
  sublabel?: string
  color: string
}

interface FlowEdge {
  from: string
  to: string
  label?: string
}

function ArchitectureDiagram({
  nodes,
  edges,
  active,
}: {
  nodes: FlowNode[]
  edges: FlowEdge[]
  active: boolean
}) {
  const [animatedEdge, setAnimatedEdge] = useState(-1)

  useEffect(() => {
    if (!active) return
    let i = 0
    const id = setInterval(() => {
      setAnimatedEdge(i % edges.length)
      i++
    }, 800)
    return () => clearInterval(id)
  }, [active, edges.length])

  // Lay nodes out in a horizontal chain
  const nodeWidth = 110
  const nodeHeight = 52
  const hGap = 60
  const totalW = nodes.length * nodeWidth + (nodes.length - 1) * hGap
  const svgW = Math.max(totalW + 40, 400)
  const svgH = nodeHeight + 60

  const nodeX = (i: number) => 20 + i * (nodeWidth + hGap)
  const nodeCX = (i: number) => nodeX(i) + nodeWidth / 2
  const nodeCY = nodeHeight / 2 + 20

  const nodeIndex = (id: string) => nodes.findIndex((n) => n.id === id)

  return (
    <svg
      viewBox={`0 0 ${svgW} ${svgH}`}
      className="w-full overflow-visible"
      style={{ maxHeight: 120 }}
      aria-label="Architecture flow diagram"
    >
      {/* Edges */}
      {edges.map((edge, i) => {
        const fromIdx = nodeIndex(edge.from)
        const toIdx = nodeIndex(edge.to)
        if (fromIdx === -1 || toIdx === -1) return null
        const x1 = nodeCX(fromIdx) + nodeWidth / 2
        const x2 = nodeCX(toIdx) - nodeWidth / 2
        const y = nodeCY
        const isActive = animatedEdge === i
        const fromColor = nodes[fromIdx].color
        return (
          <g key={i}>
            <line
              x1={x1} y1={y} x2={x2} y2={y}
              stroke={`${fromColor}40`}
              strokeWidth={2}
            />
            {isActive && (
              <motion.circle
                r={5}
                fill={fromColor}
                initial={{ cx: x1 }}
                animate={{ cx: x2 }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                cy={y}
                style={{ filter: `drop-shadow(0 0 6px ${fromColor})` }}
              />
            )}
            {/* Arrow head */}
            <polygon
              points={`${x2},${y - 5} ${x2 + 8},${y} ${x2},${y + 5}`}
              fill={`${fromColor}80`}
            />
            {edge.label && (
              <text
                x={(x1 + x2) / 2}
                y={y - 10}
                textAnchor="middle"
                fontSize={9}
                fill={`${fromColor}90`}
                fontFamily="monospace"
              >
                {edge.label}
              </text>
            )}
          </g>
        )
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <g key={node.id}>
          <motion.rect
            x={nodeX(i)}
            y={10}
            width={nodeWidth}
            height={nodeHeight}
            rx={6}
            fill={`${node.color}12`}
            stroke={node.color}
            strokeWidth={1.5}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={active ? { opacity: 1, scaleY: 1 } : { opacity: 0, scaleY: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            style={{ transformOrigin: `${nodeCX(i)}px ${nodeCY}px` }}
          />
          <text
            x={nodeCX(i)}
            y={nodeCY - 5}
            textAnchor="middle"
            fontSize={11}
            fontWeight="600"
            fill={node.color}
            fontFamily="monospace"
          >
            {node.label}
          </text>
          {node.sublabel && (
            <text
              x={nodeCX(i)}
              y={nodeCY + 10}
              textAnchor="middle"
              fontSize={9}
              fill={`${node.color}80`}
              fontFamily="monospace"
            >
              {node.sublabel}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

// ─── Metric Card ──────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  active,
  color,
}: {
  label: string
  value: string
  active: boolean
  color: string
}) {
  const display = useCountUp(value, active)
  return (
    <motion.div
      className="rounded-lg border p-3 text-center"
      style={{ borderColor: `${color}40`, background: `${color}08` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
    >
      <div className="font-mono text-xl font-bold" style={{ color }}>
        {display}
      </div>
      <div className="mt-1 font-mono text-xs" style={{ color: `${color}80` }}>
        {label}
      </div>
    </motion.div>
  )
}

// ─── Tech Chip ────────────────────────────────────────────────────────────────

function TechChip({ name, index, color }: { name: string; index: number; color: string }) {
  return (
    <motion.span
      className="inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-medium"
      style={{ borderColor: `${color}60`, background: `${color}10`, color }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
    >
      {name}
    </motion.span>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ProjectModalProps {
  project: MissionProject | null
  open: boolean
  onClose: () => void
}

export function ProjectModal({ project, open, onClose }: ProjectModalProps) {
  const [diagramActive, setDiagramActive] = useState(false)
  // Reveal/count-up the metrics off the modal `open` state. useInView is
  // unreliable for an element inside a freshly-mounted portal/fixed modal,
  // which left the metric cards stuck at opacity 0 (empty section).
  const [metricsActive, setMetricsActive] = useState(false)

  useEffect(() => {
    if (open) {
      const m = setTimeout(() => setMetricsActive(true), 180)
      const d = setTimeout(() => setDiagramActive(true), 500)
      return () => {
        clearTimeout(m)
        clearTimeout(d)
      }
    }
    setDiagramActive(false)
    setMetricsActive(false)
  }, [open])

  if (!project) return null

  const statusColors = STATUS_COLORS[project.status]
  const typeColor = TYPE_COLORS[project.type] ?? '#9CA3AF'

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
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

              {/* Content — Framer owns the full transform (centering + entrance)
                  so there's no conflict with Tailwind translate utilities. */}
              <Dialog.Content asChild forceMount>
                <motion.div
                  className={cn(
                    'fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto',
                    'rounded-2xl border bg-[#080810] shadow-2xl',
                  )}
                  style={{
                    borderColor: `${typeColor}40`,
                    boxShadow: `0 0 60px ${typeColor}20, 0 0 120px ${typeColor}10`,
                  }}
                  initial={{ opacity: 0, scale: 0.88, x: '-50%', y: '-44%' }}
                  animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
                  exit={{ opacity: 0, scale: 0.92, x: '-50%', y: '-46%' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                >
                  {/* Header */}
                  <div
                    className="relative p-6 pb-4"
                    style={{
                      background: `linear-gradient(135deg, ${typeColor}10 0%, transparent 60%)`,
                      borderBottom: `1px solid ${typeColor}20`,
                    }}
                  >
                    {/* Scanline decoration */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-px"
                      style={{ background: `linear-gradient(90deg, transparent, ${typeColor}, transparent)` }}
                    />

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="font-mono text-xs" style={{ color: `${typeColor}80` }}>
                            {project.missionCode}
                          </span>
                          <span
                            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-xs"
                            style={{ borderColor: `${statusColors.dot}40`, background: statusColors.bg, color: statusColors.text }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: statusColors.dot, boxShadow: `0 0 4px ${statusColors.dot}` }}
                            />
                            {project.status}
                          </span>
                          <span
                            className="rounded-full px-2.5 py-0.5 font-mono text-xs border"
                            style={{ borderColor: `${typeColor}40`, color: typeColor, background: `${typeColor}10` }}
                          >
                            {project.type}
                          </span>
                        </div>
                        <Dialog.Title
                          className="font-mono text-xl font-bold text-white leading-tight"
                        >
                          {project.title}
                        </Dialog.Title>
                        <Dialog.Description
                          className="mt-2 font-mono text-sm leading-relaxed"
                          style={{ color: 'rgba(255,255,255,0.6)' }}
                        >
                          {project.fullDescription}
                        </Dialog.Description>
                      </div>

                      {/* Close */}
                      <Dialog.Close asChild>
                        <button
                          className="flex-shrink-0 h-8 w-8 rounded-lg border font-mono text-sm flex items-center justify-center transition-colors hover:bg-white/10"
                          style={{ borderColor: `${typeColor}40`, color: `${typeColor}80` }}
                          aria-label="Close mission detail"
                        >
                          ✕
                        </button>
                      </Dialog.Close>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-6 p-6">
                    {/* Architecture */}
                    <section>
                      <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest" style={{ color: typeColor }}>
                        {`// Architecture Flow`}
                      </h3>
                      <div
                        className="rounded-xl border p-4"
                        style={{ borderColor: `${typeColor}20`, background: `${typeColor}05` }}
                      >
                        <ArchitectureDiagram
                          nodes={project.architectureNodes}
                          edges={project.architectureEdges}
                          active={diagramActive}
                        />
                      </div>
                    </section>

                    {/* Impact Metrics */}
                    <section>
                      <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest" style={{ color: typeColor }}>
                        {`// Impact Metrics`}
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {project.impactMetrics.map((m, i) => (
                          <MetricCard
                            key={i}
                            label={m.label}
                            value={m.value}
                            active={metricsActive}
                            color={typeColor}
                          />
                        ))}
                      </div>
                    </section>

                    {/* Tech Stack */}
                    <section>
                      <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest" style={{ color: typeColor }}>
                        {`// Tech Stack`}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t, i) => (
                          <TechChip key={t} name={t} index={i} color={typeColor} />
                        ))}
                      </div>
                    </section>

                    {/* Challenges */}
                    <section>
                      <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-widest" style={{ color: typeColor }}>
                        {`// Challenges Solved`}
                      </h3>
                      <ul className="space-y-2">
                        {project.challenges.map((c, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start gap-2 font-mono text-sm"
                            style={{ color: 'rgba(255,255,255,0.65)' }}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.3 }}
                          >
                            <span style={{ color: typeColor }} className="mt-0.5 flex-shrink-0">▸</span>
                            {c}
                          </motion.li>
                        ))}
                      </ul>
                    </section>

                    {/* Links */}
                    {(project.github || project.live) && (
                      <section className="flex gap-3 flex-wrap">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-sm transition-colors hover:bg-white/5"
                            style={{ borderColor: `${typeColor}40`, color: typeColor }}
                          >
                            <span aria-hidden>⌥</span> GitHub
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-sm transition-colors hover:bg-white/5"
                            style={{ borderColor: `${typeColor}40`, color: typeColor }}
                          >
                            <span aria-hidden>↗</span> Live
                          </a>
                        )}
                      </section>
                    )}
                  </div>

                  {/* Footer scanline */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${typeColor}60, transparent)` }}
                  />
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
