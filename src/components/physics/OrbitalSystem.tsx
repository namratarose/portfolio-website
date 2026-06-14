'use client'

import { useState } from 'react'
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface OrbitConfig {
  id: string
  radius: number
  speed: number            // radians per second
  startAngle?: number      // degrees
  inclination?: number     // degrees, for visual 3D tilt
  color?: string
  dashed?: boolean
}

export interface OrbitObject {
  orbitId: string
  content: React.ReactNode
  size?: number
}

interface OrbitalSystemProps {
  centerContent: React.ReactNode
  centerSize?: number
  orbits: OrbitConfig[]
  objects: OrbitObject[]
  onOrbitClick?: (orbitId: string) => void
  className?: string
}

interface LiveOrbitObjectProps {
  orbit: OrbitConfig
  obj: OrbitObject
  isHovered: boolean
  onClick?: () => void
  /** Even angular distribution offset (radians) so objects sharing an orbit don't stack. */
  angleOffset?: number
}

function LiveOrbitObject({ orbit, obj, isHovered, onClick, angleOffset = 0 }: LiveOrbitObjectProps) {
  const angle = useMotionValue((orbit.startAngle ?? 0) * (Math.PI / 180) + angleOffset)
  const xMv = useMotionValue(0)
  const yMv = useMotionValue(0)

  const incRad = (orbit.inclination ?? 20) * (Math.PI / 180)
  const speed = isHovered ? orbit.speed * 0.3 : orbit.speed

  useAnimationFrame((_, delta) => {
    const next = angle.get() + (speed * delta) / 1000
    angle.set(next)

    const x = orbit.radius * Math.cos(next)
    const y = orbit.radius * Math.sin(next) * Math.cos(incRad)
    xMv.set(x)
    yMv.set(y)
  })

  return (
    <motion.div
      className="absolute"
      style={{
        x: xMv,
        y: yMv,
        left: '50%',
        top: '50%',
        translateX: '-50%',
        translateY: '-50%',
      }}
      whileHover={{ scale: 1.2 }}
      onClick={onClick}
    >
      <motion.div
        animate={isHovered ? { filter: ['brightness(1)', 'brightness(1.6)', 'brightness(1)'] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ width: obj.size ?? 40, height: obj.size ?? 40 }}
        className="cursor-pointer"
      >
        {obj.content}
      </motion.div>
    </motion.div>
  )
}

function OrbitPath({ orbit }: { orbit: OrbitConfig }) {
  const incRad = (orbit.inclination ?? 20) * (Math.PI / 180)
  const rx = orbit.radius
  const ry = orbit.radius * Math.cos(incRad)
  const w = rx * 2 + 20
  const h = ry * 2 + 20
  const cx = w / 2
  const cy = h / 2
  const filterId = `ring-glow-${orbit.id}`
  const color = orbit.color ?? '#7C5CFF'

  return (
    <svg
      className="pointer-events-none absolute"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'visible',
      }}
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
    >
      <defs>
        <filter id={filterId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.35}
        strokeDasharray={orbit.dashed ? '5 4' : undefined}
        filter={`url(#${filterId})`}
      />
    </svg>
  )
}

export function OrbitalSystem({
  centerContent,
  centerSize = 120,
  orbits,
  objects,
  onOrbitClick,
  className,
}: OrbitalSystemProps) {
  const [hoveredOrbit, setHoveredOrbit] = useState<string | null>(null)

  return (
    <div className={cn('relative', className)}>
      {/* Orbit paths */}
      {orbits.map((orbit) => (
        <OrbitPath key={orbit.id} orbit={orbit} />
      ))}

      {/* Orbiting objects */}
      {objects.map((obj, i) => {
        const orbit = orbits.find((o) => o.id === obj.orbitId)
        if (!orbit) return null
        // Distribute objects sharing an orbit evenly around its circumference.
        const groupMembers = objects.filter((o) => o.orbitId === obj.orbitId)
        const indexInGroup = groupMembers.indexOf(obj)
        const angleOffset = (2 * Math.PI * indexInGroup) / groupMembers.length
        return (
          <LiveOrbitObject
            key={`${obj.orbitId}-obj-${i}`}
            orbit={orbit}
            obj={obj}
            angleOffset={angleOffset}
            isHovered={hoveredOrbit === orbit.id}
            onClick={() => onOrbitClick?.(orbit.id)}
          />
        )
      })}

      {/* Center node */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full border border-[#7C5CFF]/30 bg-[#0a0a1a]"
        style={{ width: centerSize, height: centerSize }}
        animate={{
          boxShadow: [
            '0 0 30px rgba(124,92,255,0.4), 0 0 60px rgba(124,92,255,0.2)',
            '0 0 50px rgba(124,92,255,0.7), 0 0 100px rgba(124,92,255,0.35)',
            '0 0 30px rgba(124,92,255,0.4), 0 0 60px rgba(124,92,255,0.2)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {centerContent}
      </motion.div>
    </div>
  )
}
