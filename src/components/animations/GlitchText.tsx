'use client'

import { useEffect, useRef, useState } from 'react'
import type { ElementType } from 'react'
import { cn } from '@/lib/utils'

interface GlitchTextProps {
  text: string
  className?: string
  intensity?: number      // 1–10, default 5
  frequency?: number      // glitch interval in ms, default 3000
  noiseOverlay?: boolean
  as?: ElementType
}

export function GlitchText({
  text,
  className,
  intensity = 5,
  frequency = 3000,
  noiseOverlay = false,
  as: Tag = 'span',
}: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const glitchRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const offsetScale = intensity * 1.2

  useEffect(() => {
    function runGlitch() {
      setGlitching(true)

      // Glitch lasts 300–600ms based on intensity
      const duration = 200 + intensity * 40
      glitchRef.current = setTimeout(() => {
        setGlitching(false)
        // Schedule next glitch
        timerRef.current = setTimeout(runGlitch, frequency + Math.random() * frequency * 0.5)
      }, duration)
    }

    // Initial delay
    timerRef.current = setTimeout(runGlitch, frequency * 0.5)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (glitchRef.current) clearTimeout(glitchRef.current)
    }
  }, [frequency, intensity])

  return (
    <Tag
      className={cn(
        'relative inline-block',
        glitching && 'glitch-active',
        className
      )}
      data-text={text}
      style={
        {
          '--glitch-offset': `${offsetScale}px`,
          '--glitch-intensity': intensity,
        } as React.CSSProperties
      }
    >
      {/* R channel */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          color: '#ff0055',
          clipPath: glitching
            ? `inset(${Math.random() * 30}% 0 ${Math.random() * 30}% 0)`
            : 'none',
          transform: glitching
            ? `translate(${(Math.random() - 0.5) * offsetScale * 2}px, ${(Math.random() - 0.5) * 3}px)`
            : 'none',
          opacity: glitching ? 0.8 : 0,
          mixBlendMode: 'screen',
          transition: 'none',
        }}
      >
        {text}
      </span>

      {/* B channel */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          color: '#00ffff',
          clipPath: glitching
            ? `inset(${Math.random() * 40}% 0 ${Math.random() * 20}% 0)`
            : 'none',
          transform: glitching
            ? `translate(${(Math.random() - 0.5) * offsetScale * -2}px, ${(Math.random() - 0.5) * 3}px)`
            : 'none',
          opacity: glitching ? 0.8 : 0,
          mixBlendMode: 'screen',
          transition: 'none',
        }}
      >
        {text}
      </span>

      {/* G channel / main text */}
      <span
        style={{
          display: 'inline-block',
          transform: glitching
            ? `translate(${(Math.random() - 0.5) * offsetScale * 0.5}px, 0)`
            : 'none',
          transition: glitching ? 'none' : 'transform 0.1s',
        }}
      >
        {text}
      </span>

      {/* Digital noise overlay */}
      {noiseOverlay && glitching && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,255,255,0.03) 2px,
              rgba(0,255,255,0.03) 4px
            )`,
            opacity: 0.6,
          }}
        />
      )}
    </Tag>
  )
}
