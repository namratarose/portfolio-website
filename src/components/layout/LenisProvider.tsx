'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from '@studio-freight/lenis'

interface LenisProviderProps {
  children: ReactNode
}

/**
 * Initializes Lenis smooth scroll for the entire page.
 * Runs its RAF loop via requestAnimationFrame.
 * Exposes the instance on window.__lenis for external access (e.g., GSAP ScrollTrigger).
 */
export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis
    // Expose on window for GSAP ScrollTrigger integration
    ;(window as unknown as Record<string, unknown>).__lenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
      }
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return <>{children}</>
}
