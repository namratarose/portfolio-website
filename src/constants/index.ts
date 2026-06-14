/**
 * OrbitOS Portfolio — Application Constants
 */

import type { SpringConfig, SkillCategoryId, AchievementType, TransformationType } from '../types';

// ─── Orbital Speeds ───────────────────────────────────────────────────────────

/** Angular-velocity multipliers for orbital animations (rad/s) */
export const ORBIT_SPEEDS: Record<'slow' | 'medium' | 'fast', number> = {
  slow: 0.0003,
  medium: 0.0007,
  fast: 0.0015,
};

// ─── Spring Configs ───────────────────────────────────────────────────────────

/** Framer Motion spring configurations */
export const SPRING_CONFIGS: Record<'bouncy' | 'smooth' | 'stiff' | 'gentle', SpringConfig> = {
  bouncy: {
    type: 'spring',
    stiffness: 400,
    damping: 15,
    mass: 1,
  },
  smooth: {
    type: 'spring',
    stiffness: 120,
    damping: 28,
    mass: 1,
  },
  stiff: {
    type: 'spring',
    stiffness: 600,
    damping: 40,
    mass: 0.8,
  },
  gentle: {
    type: 'spring',
    stiffness: 60,
    damping: 20,
    mass: 1.2,
  },
};

// ─── Skill Categories ─────────────────────────────────────────────────────────

/** Color mappings for each skill category */
export const SKILL_CATEGORIES: Record<
  SkillCategoryId,
  { label: string; color: string; ringColor: string; gradient: string }
> = {
  languages: {
    label: 'Languages',
    color: '#7C5CFF',
    ringColor: '#9B7DFF',
    gradient: 'linear-gradient(135deg, #7C5CFF, #9B7DFF)',
  },
  frameworks: {
    label: 'Frameworks & APIs',
    color: '#00D4FF',
    ringColor: '#33DEFF',
    gradient: 'linear-gradient(135deg, #00D4FF, #33DEFF)',
  },
  databases: {
    label: 'Databases & Caching',
    color: '#FF6B6B',
    ringColor: '#FF8E8E',
    gradient: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
  },
  cloud: {
    label: 'Cloud & DevOps',
    color: '#FFD166',
    ringColor: '#FFE08A',
    gradient: 'linear-gradient(135deg, #FFD166, #FFE08A)',
  },
  ai: {
    label: 'AI & Data',
    color: '#06D6A0',
    ringColor: '#33DFBA',
    gradient: 'linear-gradient(135deg, #06D6A0, #33DFBA)',
  },
  architecture: {
    label: 'Architecture',
    color: '#F77F00',
    ringColor: '#FFA040',
    gradient: 'linear-gradient(135deg, #F77F00, #FFA040)',
  },
};

// ─── Achievement Types ────────────────────────────────────────────────────────

/** Labels for achievement type badges */
export const ACHIEVEMENT_TYPES: Record<AchievementType, { label: string; color: string }> = {
  performance: { label: 'Performance', color: '#06D6A0' },
  feature: { label: 'Feature', color: '#7C5CFF' },
  infrastructure: { label: 'Infrastructure', color: '#FFD166' },
  migration: { label: 'Migration', color: '#00D4FF' },
  security: { label: 'Security', color: '#FF6B6B' },
  integration: { label: 'Integration', color: '#F77F00' },
  architecture: { label: 'Architecture', color: '#9B59B6' },
  tooling: { label: 'Tooling', color: '#3498DB' },
};

// ─── Section IDs ──────────────────────────────────────────────────────────────

/** DOM section identifiers used for in-page navigation */
export const SECTION_IDS = {
  HERO: 'hero',
  ABOUT: 'about',
  EXPERIENCE: 'experience',
  SKILLS: 'skills',
  PROJECTS: 'projects',
  SYSTEM_DESIGN: 'system-design',
  BLOG: 'blog',
  FUN: 'fun',
  GAME: 'game',
} as const;

export type SectionId = (typeof SECTION_IDS)[keyof typeof SECTION_IDS];

// ─── Konami Code ──────────────────────────────────────────────────────────────

/** Classic Konami Code key sequence */
export const KONAMI_CODE: string[] = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

// ─── Theme Colors ─────────────────────────────────────────────────────────────

/** Design-system color tokens */
export const THEME_COLORS = {
  // Primaries
  purple: '#7C5CFF',
  purpleLight: '#9B7DFF',
  purpleDark: '#5B3ECC',
  cyan: '#00D4FF',
  cyanLight: '#33DEFF',

  // Accents
  coral: '#FF6B6B',
  amber: '#FFD166',
  mint: '#06D6A0',
  orange: '#F77F00',

  // Neutrals
  dark: '#0A0A0F',
  darkSurface: '#12121A',
  darkElevated: '#1A1A26',
  border: '#2A2A3E',
  muted: '#6B6B8A',
  text: '#E8E8F0',
  textMuted: '#9999B0',

  // Feedback
  success: '#06D6A0',
  warning: '#FFD166',
  error: '#FF6B6B',
  info: '#00D4FF',
} as const;

// ─── Particle Config ──────────────────────────────────────────────────────────

/** Default configuration for the particle background */
export const PARTICLE_CONFIG = {
  count: 80,
  /** Minimum particle radius in px */
  minRadius: 1,
  /** Maximum particle radius in px */
  maxRadius: 3,
  /** Minimum alpha transparency */
  minAlpha: 0.1,
  /** Maximum alpha transparency */
  maxAlpha: 0.6,
  /** Maximum velocity in px/frame */
  maxVelocity: 0.4,
  /** Connection line draw distance in px */
  connectionDistance: 120,
  /** Connection line max alpha */
  connectionAlpha: 0.15,
  colors: ['#7C5CFF', '#00D4FF', '#06D6A0', '#FFD166'],
} as const;

// ─── Physics Constants ────────────────────────────────────────────────────────

/** Constants for the physics playground */
export const PHYSICS_CONSTANTS = {
  /** Gravitational constant (scaled for canvas units) */
  gravity: 0.5,
  /** Friction coefficient (0 = frictionless, 1 = full stop) */
  friction: 0.02,
  /** Coefficient of restitution for collisions */
  elasticity: 0.8,
  /** Air resistance damping */
  airResistance: 0.001,
  /** Simulation timestep in ms */
  timestep: 16,
} as const;

// ─── Breakpoints ──────────────────────────────────────────────────────────────

/** Responsive breakpoints in px (mirrors Tailwind defaults) */
export const BREAKPOINTS = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// ─── Animation Durations ──────────────────────────────────────────────────────

/** Named animation duration values in seconds */
export const ANIMATION_DURATIONS = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.6,
  xslow: 1.0,
  /** For full-page transitions */
  page: 0.5,
} as const;

// ─── Z-Indices ────────────────────────────────────────────────────────────────

/** Stacking order map */
export const Z_INDICES = {
  base: 0,
  canvas: 1,
  content: 10,
  card: 20,
  overlay: 50,
  modal: 100,
  tooltip: 200,
  nav: 300,
  toast: 400,
  cursor: 9999,
} as const;

// ─── Transformation Types ─────────────────────────────────────────────────────

/** Labels for each transformation in the Fun section */
export const TRANSFORMATION_LABELS: Record<TransformationType, string> = {
  ascii: 'ASCII Art',
  matrix: 'Matrix Rain',
  glitch: 'Glitch',
  pixelate: 'Pixelate',
  invert: 'Invert',
  'hue-rotate': 'Hue Rotate',
  blur: 'Blur',
  neon: 'Neon',
  retro: 'Retro',
  space: 'Space',
};
