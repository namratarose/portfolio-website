'use client'

import { useEffect, useState, useRef, memo } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  type MotionValue,
} from 'framer-motion'
import { useCursorStore, type CursorVariant } from '@/store/portfolioStore'

// ─── Trail dot ────────────────────────────────────────────────────────────────

interface TrailDot {
  id: number
  x: number
  y: number
  opacity: number
  scale: number
}

// ─── Variant styles ───────────────────────────────────────────────────────────

const ringVariants: Record<
  CursorVariant,
  {
    width: number
    height: number
    borderColor: string
    backgroundColor: string
    opacity: number
    scale: number
    borderWidth: number
    boxShadow: string
  }
> = {
  default: {
    width: 32,
    height: 32,
    borderColor: '#7C5CFF',
    backgroundColor: 'transparent',
    opacity: 1,
    scale: 1,
    borderWidth: 1.5,
    boxShadow: '0 0 8px rgba(124, 92, 255, 0.3)',
  },
  hover: {
    width: 48,
    height: 48,
    borderColor: '#7C5CFF',
    backgroundColor: 'rgba(124, 92, 255, 0.08)',
    opacity: 1,
    scale: 1,
    borderWidth: 1,
    boxShadow: '0 0 20px rgba(124, 92, 255, 0.5), 0 0 40px rgba(124, 92, 255, 0.2)',
  },
  click: {
    width: 32,
    height: 32,
    borderColor: '#7C5CFF',
    backgroundColor: 'rgba(124, 92, 255, 0.4)',
    opacity: 1,
    scale: 0.8,
    borderWidth: 2,
    boxShadow: '0 0 24px rgba(124, 92, 255, 0.8)',
  },
  text: {
    width: 2,
    height: 28,
    borderColor: '#7C5CFF',
    backgroundColor: '#7C5CFF',
    opacity: 0.9,
    scale: 1,
    borderWidth: 0,
    boxShadow: '0 0 6px rgba(124, 92, 255, 0.6)',
  },
  hidden: {
    width: 32,
    height: 32,
    borderColor: '#7C5CFF',
    backgroundColor: 'transparent',
    opacity: 0,
    scale: 1,
    borderWidth: 1.5,
    boxShadow: 'none',
  },
}

const dotVariants: Record<CursorVariant, { opacity: number; scale: number; backgroundColor: string }> = {
  default: { opacity: 1, scale: 1, backgroundColor: '#ffffff' },
  hover: { opacity: 0.7, scale: 1.2, backgroundColor: '#7C5CFF' },
  click: { opacity: 1, scale: 1.5, backgroundColor: '#7C5CFF' },
  text: { opacity: 0, scale: 0, backgroundColor: '#ffffff' },
  hidden: { opacity: 0, scale: 0, backgroundColor: '#ffffff' },
}

// ─── Trail ────────────────────────────────────────────────────────────────────

const TRAIL_COUNT = 4

function useTrail(
  rawX: MotionValue<number>,
  rawY: MotionValue<number>,
  active: boolean
) {
  const [trail, setTrail] = useState<TrailDot[]>([])
  const posRef = useRef({ x: 0, y: 0 })
  // Monotonic counter for unique keys — Date.now() collides when dots are
  // created within the same millisecond.
  const idRef = useRef(0)

  useEffect(() => {
    if (!active) return

    const interval = setInterval(() => {
      const { x, y } = posRef.current
      setTrail((prev) => {
        const next = [
          { id: idRef.current++, x, y, opacity: 0.35, scale: 0.5 },
          ...prev.slice(0, TRAIL_COUNT - 1).map((dot, i) => ({
            ...dot,
            opacity: dot.opacity * 0.55,
            scale: dot.scale * 0.75,
          })),
        ]
        return next
      })
    }, 40)

    const unsubX = rawX.on('change', (v) => { posRef.current.x = v })
    const unsubY = rawY.on('change', (v) => { posRef.current.y = v })

    return () => {
      clearInterval(interval)
      unsubX()
      unsubY()
    }
  }, [rawX, rawY, active])

  return trail
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const CustomCursor = memo(function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { cursorVariant, setCursorVariant, setCursorPosition } = useCursorStore()

  const rawX = useMotionValue(-100)
  const rawY = useMotionValue(-100)

  // Inner dot follows mouse directly
  const dotX = useSpring(rawX, { damping: 50, stiffness: 600, mass: 0.1 })
  const dotY = useSpring(rawY, { damping: 50, stiffness: 600, mass: 0.1 })

  // Outer ring follows with spring physics
  const ringX = useSpring(rawX, { damping: 20, stiffness: 200, mass: 0.5 })
  const ringY = useSpring(rawY, { damping: 20, stiffness: 200, mass: 0.5 })

  const trail = useTrail(rawX, rawY, mounted && cursorVariant !== 'hidden')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Hide default cursor
    document.body.style.cursor = 'none'

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
      setCursorPosition({ x: e.clientX, y: e.clientY })
      setIsVisible(true)
    }

    const onLeave = () => setIsVisible(false)
    const onEnter = () => setIsVisible(true)

    const onMouseDown = () => {
      if (cursorVariant !== 'hidden') setCursorVariant('click')
    }
    const onMouseUp = () => {
      if (cursorVariant === 'click') setCursorVariant('default')
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)

    return () => {
      document.body.style.cursor = ''
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [mounted, cursorVariant, rawX, rawY, setCursorPosition, setCursorVariant])

  if (!mounted) return null

  const ring = ringVariants[cursorVariant]
  const dot = dotVariants[cursorVariant]

  return (
    <>
      {/* Trail dots */}
      <AnimatePresence>
        {trail.map((t) => (
          <motion.div
            key={t.id}
            className="pointer-events-none fixed top-0 left-0 z-[9998] rounded-full bg-[#7C5CFF]"
            style={{
              x: t.x - 3,
              y: t.y - 3,
              width: 6,
              height: 6,
            }}
            initial={{ opacity: t.opacity, scale: t.scale }}
            animate={{ opacity: 0, scale: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Outer ring */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full border"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: ring.width,
          height: ring.height,
          borderColor: ring.borderColor,
          backgroundColor: ring.backgroundColor,
          opacity: isVisible ? ring.opacity : 0,
          scale: ring.scale,
          borderWidth: ring.borderWidth,
          boxShadow: ring.boxShadow,
          borderRadius: cursorVariant === 'text' ? '2px' : '50%',
        }}
        transition={{
          width: { type: 'spring', damping: 20, stiffness: 300 },
          height: { type: 'spring', damping: 20, stiffness: 300 },
          borderRadius: { duration: 0.15 },
          opacity: { duration: 0.2 },
          scale: { type: 'spring', damping: 15, stiffness: 400 },
          backgroundColor: { duration: 0.2 },
          boxShadow: { duration: 0.3 },
        }}
      />

      {/* Inner dot */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: 4,
          height: 4,
        }}
        animate={{
          opacity: isVisible ? dot.opacity : 0,
          scale: dot.scale,
          backgroundColor: dot.backgroundColor,
        }}
        transition={{
          opacity: { duration: 0.15 },
          scale: { type: 'spring', damping: 20, stiffness: 500 },
          backgroundColor: { duration: 0.15 },
        }}
      />
    </>
  )
})
