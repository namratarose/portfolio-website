'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface OrbitalObject {
  id: string
  startAngle?: number
  content: React.ReactNode
  size?: number
}

interface OrbitalRingProps {
  radiusX?: number
  radiusY?: number
  speed?: number
  color?: string
  inclination?: number
  dashed?: boolean
  glowIntensity?: number
  objects?: OrbitalObject[]
  className?: string
}

interface OrbitalDotProps {
  radiusX: number
  radiusY: number
  speed: number
  startAngle: number
  color: string
  size: number
  content: React.ReactNode
  inclination: number
}

function OrbitalDot({ radiusX, radiusY, speed, startAngle, color, size, content, inclination }: OrbitalDotProps) {
  const angle = useMotionValue(startAngle)

  useAnimationFrame((_, delta) => {
    angle.set(angle.get() + (speed * delta) / 1000)
  })

  const rad = inclination * (Math.PI / 180)

  return (
    <motion.div
      className="pointer-events-auto absolute"
      style={{
        x: useMotionValue(0),
        y: useMotionValue(0),
        left: '50%',
        top: '50%',
      }}
    >
      <motion.div
        style={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0, repeat: 0 }}
      >
        <OrbitalDotInner
          angle={angle}
          radiusX={radiusX}
          radiusY={radiusY}
          color={color}
          size={size}
          content={content}
          rad={rad}
        />
      </motion.div>
    </motion.div>
  )
}

function OrbitalDotInner({
  angle,
  radiusX,
  radiusY,
  color,
  size,
  content,
  rad,
}: {
  angle: ReturnType<typeof useMotionValue<number>>
  radiusX: number
  radiusY: number
  color: string
  size: number
  content: React.ReactNode
  rad: number
}) {
  const dotRef = useRef<HTMLDivElement>(null)

  useAnimationFrame(() => {
    if (!dotRef.current) return
    const a = angle.get()
    const cosA = Math.cos(a)
    const sinA = Math.sin(a)

    // Elliptical orbit with inclination tilt
    const ox = radiusX * cosA
    const oy = radiusY * sinA

    // Apply inclination rotation around X-axis (simulate 3D tilt via Y compression)
    const px = ox
    const py = oy * Math.cos(rad)

    dotRef.current.style.transform = `translate(calc(${px}px - 50%), calc(${py}px - 50%))`
  })

  return (
    <div
      ref={dotRef}
      className="absolute left-0 top-0"
      style={{ willChange: 'transform' }}
    >
      {content ? (
        <div style={{ width: size, height: size }}>{content}</div>
      ) : (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}40`,
          }}
        />
      )}
    </div>
  )
}

export function OrbitalRing({
  radiusX = 120,
  radiusY = 50,
  speed = 1,
  color = '#7C5CFF',
  inclination = 0,
  dashed = false,
  glowIntensity = 4,
  objects = [],
  className,
}: OrbitalRingProps) {
  const rad = inclination * (Math.PI / 180)

  // Compute the SVG ellipse dimensions accounting for inclination tilt
  const svgW = radiusX * 2 + 40
  const svgH = radiusY * 2 * Math.cos(rad) + 40
  const cx = svgW / 2
  const cy = svgH / 2
  const rx = radiusX
  const ry = radiusY * Math.cos(rad)

  const filterId = `glow-${color.replace('#', '')}`

  return (
    <div
      className={cn('pointer-events-none relative', className)}
      style={{ width: svgW, height: svgH }}
    >
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        className="absolute inset-0"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={glowIntensity} result="blur" />
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
          strokeWidth={1.5}
          strokeOpacity={0.4}
          strokeDasharray={dashed ? '6 4' : undefined}
          filter={`url(#${filterId})`}
        />
      </svg>

      {/* Orbital objects */}
      <div className="pointer-events-none absolute inset-0" style={{ left: cx, top: cy }}>
        {objects.map((obj) => (
          <OrbitalDot
            key={obj.id}
            radiusX={radiusX}
            radiusY={radiusY}
            speed={speed}
            startAngle={(obj.startAngle ?? 0) * (Math.PI / 180)}
            color={color}
            size={obj.size ?? 8}
            content={obj.content}
            inclination={inclination}
          />
        ))}

        {/* Default single dot if no objects provided */}
        {objects.length === 0 && (
          <OrbitalDot
            radiusX={radiusX}
            radiusY={radiusY}
            speed={speed}
            startAngle={0}
            color={color}
            size={8}
            content={null}
            inclination={inclination}
          />
        )}
      </div>
    </div>
  )
}
