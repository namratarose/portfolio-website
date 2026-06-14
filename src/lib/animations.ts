import type { Variants } from 'framer-motion'

// ─── Fade variants ────────────────────────────────────────────────────────────

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, y: 24, transition: { duration: 0.3 } },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, y: -24, transition: { duration: 0.3 } },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, x: -24, transition: { duration: 0.3 } },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: { opacity: 0, x: 24, transition: { duration: 0.3 } },
}

// ─── Stagger helpers ──────────────────────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

// ─── Scale & rotation ─────────────────────────────────────────────────────────

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: [0.34, 1.56, 0.64, 1] },
  },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.3 } },
}

export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -12, scale: 0.9 },
  visible: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] },
  },
  exit: { opacity: 0, rotate: 12, scale: 0.9, transition: { duration: 0.3 } },
}

// ─── Page transition ──────────────────────────────────────────────────────────

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
}

// ─── Orbital motion ───────────────────────────────────────────────────────────

/** Use with custom `animate` prop; supply x/y from orbitalPosition() helper. */
export const orbitVariants: Variants = {
  idle: { scale: 1, opacity: 0.8 },
  orbit: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
  active: { scale: 1.15, opacity: 1 },
}

// ─── Glow pulse ───────────────────────────────────────────────────────────────

export const glowPulse: Variants = {
  idle: { filter: 'drop-shadow(0 0 0px transparent)' },
  pulse: {
    filter: [
      'drop-shadow(0 0 4px rgba(99,102,241,0.6))',
      'drop-shadow(0 0 12px rgba(99,102,241,0.9))',
      'drop-shadow(0 0 4px rgba(99,102,241,0.6))',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}
