'use client'

import { useEffect, useRef, useState } from 'react'
import { useSetActiveSection } from '@/store/portfolioStore'

export type ScrollDirection = 'up' | 'down' | 'idle'

interface ScrollProgressState {
  progress: number
  currentSection: string
  direction: ScrollDirection
}

/**
 * Tracks overall scroll progress (0–1), the currently visible section,
 * and scroll direction. Uses IntersectionObserver for section detection.
 */
export function useScrollProgress(sectionIds: string[] = []): ScrollProgressState {
  const [progress, setProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState(sectionIds[0] ?? '')
  const [direction, setDirection] = useState<ScrollDirection>('idle')
  const lastScrollY = useRef(0)
  const setActiveSection = useSetActiveSection()

  // Track scroll progress and direction
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight

      setProgress(docHeight > 0 ? scrollY / docHeight : 0)

      const diff = scrollY - lastScrollY.current
      if (Math.abs(diff) > 2) {
        setDirection(diff > 0 ? 'down' : 'up')
      }
      lastScrollY.current = scrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track active section via IntersectionObserver
  useEffect(() => {
    if (sectionIds.length === 0) return

    const visibilityMap = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target.id, entry.intersectionRatio)
        })

        // Pick the section with the highest intersection ratio
        let maxRatio = 0
        let mostVisible = currentSection

        visibilityMap.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio
            mostVisible = id
          }
        })

        if (mostVisible && mostVisible !== currentSection) {
          setCurrentSection(mostVisible)
          setActiveSection(mostVisible)
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: '-10% 0px -10% 0px',
      }
    )

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        visibilityMap.set(id, 0)
        observer.observe(el)
      }
    })

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join(','), setActiveSection])

  return { progress, currentSection, direction }
}
