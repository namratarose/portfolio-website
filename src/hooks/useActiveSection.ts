'use client'

import { useEffect } from 'react'
import { useSetActiveSection } from '@/store/portfolioStore'

interface UseActiveSectionOptions {
  /** Root margin passed to IntersectionObserver (default: '-30% 0px -30% 0px') */
  rootMargin?: string
  /** Intersection threshold(s) (default: [0, 0.5]) */
  threshold?: number | number[]
}

/**
 * Observes the listed section elements and updates navigationStore.activeSection
 * whenever a section enters the viewport.
 */
export function useActiveSection(
  sectionIds: string[],
  options: UseActiveSectionOptions = {}
): void {
  const setActiveSection = useSetActiveSection()

  const { rootMargin = '-30% 0px -30% 0px', threshold = [0, 0.5] } = options

  useEffect(() => {
    if (sectionIds.length === 0) return

    const visibilityMap = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visibilityMap.set(entry.target.id, entry.intersectionRatio)
        })

        let maxRatio = 0
        let mostVisible = ''

        visibilityMap.forEach((ratio, id) => {
          if (ratio > maxRatio) {
            maxRatio = ratio
            mostVisible = id
          }
        })

        if (mostVisible) {
          setActiveSection(mostVisible)
        }
      },
      { rootMargin, threshold }
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
  }, [sectionIds.join(','), rootMargin, setActiveSection])
}
