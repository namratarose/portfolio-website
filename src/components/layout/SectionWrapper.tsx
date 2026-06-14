'use client'

import { useRef, useEffect, type ReactNode, type CSSProperties } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useNavigationStore } from '@/store/portfolioStore'

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionVariant = 'default' | 'elevated' | 'accent' | 'transparent'

interface SectionWrapperProps {
  id: string
  children: ReactNode
  className?: string
  /** Controls background treatment */
  variant?: SectionVariant
  /** Delay before fade-in starts (ms, converted to seconds internally) */
  delay?: number
  /** Disable the entry animation entirely */
  disableAnimation?: boolean
  /** Additional inline styles */
  style?: CSSProperties
  /** aria-label for the section landmark */
  ariaLabel?: string
}

// ─── Variant backgrounds ──────────────────────────────────────────────────────

const variantStyles: Record<SectionVariant, string> = {
  default: 'bg-transparent',
  elevated: 'bg-[#0D1321]/60 backdrop-blur-sm border-y border-[#1E293B]/40',
  accent: 'bg-[#7C5CFF]/[0.03] border-y border-[#7C5CFF]/10',
  transparent: 'bg-transparent',
}

// ─── Animation variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      staggerChildren: 0.08,
    },
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SectionWrapper({
  id,
  children,
  className,
  variant = 'default',
  delay = 0,
  disableAnimation = false,
  style,
  ariaLabel,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null)
  const setActiveSection = useNavigationStore((s) => s.setActiveSection)

  // Framer-motion's useInView for entry animation trigger
  const isInView = useInView(ref, {
    once: true,
    margin: '-10% 0px -10% 0px',
  })

  // IntersectionObserver for active section tracking (independent of animation)
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
          setActiveSection(id)
        }
      },
      {
        rootMargin: '-30% 0px -30% 0px',
        threshold: [0, 0.3, 0.5, 0.8, 1],
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [id, setActiveSection])

  const delaySeconds = delay / 1000

  if (disableAnimation) {
    return (
      <section
        ref={ref}
        id={id}
        className={cn('relative w-full', variantStyles[variant], className)}
        style={style}
        aria-label={ariaLabel}
      >
        {children}
      </section>
    )
  }

  return (
    <section
      ref={ref}
      id={id}
      className={cn('relative w-full', variantStyles[variant], className)}
      style={style}
      aria-label={ariaLabel}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        style={
          delaySeconds > 0
            ? ({ '--delay': `${delaySeconds}s` } as CSSProperties)
            : undefined
        }
        transition={
          delaySeconds > 0
            ? { delay: delaySeconds, duration: 0.7, ease: [0.22, 1, 0.36, 1] }
            : undefined
        }
        className="w-full"
      >
        {children}
      </motion.div>
    </section>
  )
}
