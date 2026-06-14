/**
 * OrbitOS Portfolio — Comprehensive TypeScript Type Definitions
 */

// ─── Site & Personal ──────────────────────────────────────────────────────────

/** Top-level site metadata used in <head> and Open Graph tags */
export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  author: PersonalInfo;
  social: Record<string, string>;
  keywords: string[];
  themeColor: string;
}

/** Author / personal information */
export interface PersonalInfo {
  name: string;
  role: string;
  email: string;
  location: string;
  phone?: string;
  bio: string;
  taglines: string[];
  education: EducationEntry;
}

/** Education entry */
export interface EducationEntry {
  degree: string;
  institution: string;
  period: string;
  cgpa?: string;
}

/** A link to a social platform or external profile */
export interface SocialLink {
  /** Display label */
  label: string;
  /** Full URL */
  href: string;
  /** Icon identifier (e.g. "github", "linkedin") */
  icon: string;
  /** Whether to open in a new tab */
  external?: boolean;
}

// ─── Skills ───────────────────────────────────────────────────────────────────

/** Skill proficiency on a 1-5 scale */
export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;

/** A single technical skill */
export interface Skill {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Category this skill belongs to */
  category: SkillCategoryId;
  /** Proficiency level 1–5 */
  proficiency: ProficiencyLevel;
  /** Optional icon name or URL */
  icon?: string;
  /** Optional short description */
  description?: string;
}

/** Identifier for a skill category */
export type SkillCategoryId =
  | 'languages'
  | 'frameworks'
  | 'databases'
  | 'cloud'
  | 'ai'
  | 'architecture';

/** A grouping of skills with visual metadata */
export interface SkillCategory {
  id: SkillCategoryId;
  label: string;
  color: string;
  /** Hex accent color used in the orbital ring */
  ringColor: string;
  skills: Skill[];
}

/** A "planet" in the skills orbital visualization */
export interface SkillPlanet {
  id: string;
  categoryId: SkillCategoryId;
  /** Orbital radius in px */
  radius: number;
  /** Orbital speed multiplier */
  speed: number;
  /** Current angle in radians */
  angle: number;
  /** Visual size of the planet */
  size: number;
  color: string;
  skills: Skill[];
}

// ─── Experience ───────────────────────────────────────────────────────────────

/** A single work experience entry */
export interface Experience {
  id: string;
  company: string;
  role: string;
  /** ISO date string or "Present" */
  startDate: string;
  endDate: string | 'Present';
  location: string;
  description: string;
  achievements: Achievement[];
  techStack: string[];
  /** Optional URL to company website */
  companyUrl?: string;
  /** Optional company logo path */
  companyLogo?: string;
}

/** An individual measurable achievement within an experience */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  /** Optional quantitative metric, e.g. "40-60% reduction" */
  metric?: string;
  type: AchievementType;
  /** Related skills/technologies */
  tags?: string[];
}

/** Classification of an achievement */
export type AchievementType =
  | 'performance'
  | 'feature'
  | 'infrastructure'
  | 'migration'
  | 'security'
  | 'integration'
  | 'architecture'
  | 'tooling';

// ─── Projects ─────────────────────────────────────────────────────────────────

/** A portfolio project */
export interface Project {
  id: string;
  title: string;
  description: string;
  /** Extended markdown description for the detail view */
  longDescription?: string;
  techStack: TechStack;
  links: ProjectLink[];
  /** Key metrics or outcomes, e.g. "Serves 50k+ users" */
  metrics?: string[];
  /** Whether this is a featured/highlighted project */
  featured?: boolean;
  /** Optional cover image path */
  image?: string;
  /** Optional category label */
  category?: string;
  status?: 'production' | 'archived' | 'wip';
}

/** External links associated with a project */
export interface ProjectLink {
  type: 'github' | 'demo' | 'article' | 'docs' | 'other';
  label: string;
  href: string;
}

/** Technology stack breakdown for a project */
export interface TechStack {
  primary: string[];
  secondary?: string[];
  /** Infrastructure / DevOps tools */
  infra?: string[];
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

/** A blog or article post */
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Full MDX/Markdown content */
  content?: string;
  /** ISO date string */
  publishedAt: string;
  updatedAt?: string;
  category: BlogCategory;
  tags: string[];
  readingTime?: number;
  /** Path or URL to cover image */
  coverImage?: string;
  /** Whether the post is published */
  published: boolean;
  /** External URL if cross-posted */
  externalUrl?: string;
}

/** Blog post category */
export type BlogCategory =
  | 'distributed-systems'
  | 'blockchain'
  | 'ai-ml'
  | 'backend'
  | 'cloud'
  | 'career'
  | 'misc';

// ─── System Design ────────────────────────────────────────────────────────────

/** A node in an interactive system-design diagram */
export interface SystemDesignNode {
  id: string;
  type: 'service' | 'database' | 'queue' | 'gateway' | 'client' | 'external' | 'cache';
  label: string;
  /** Short description shown on hover */
  description?: string;
  /** Icon identifier */
  icon?: string;
  /** Position in the canvas */
  position: { x: number; y: number };
  /** Visual style overrides */
  style?: Record<string, string | number>;
  /** Whether this node is highlighted */
  highlighted?: boolean;
  /** Additional metadata */
  meta?: Record<string, unknown>;
}

/** A directed edge connecting two system-design nodes */
export interface SystemDesignEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  /** Arrow type */
  type?: 'default' | 'straight' | 'step' | 'smoothstep';
  /** Data flow description */
  dataFlow?: string;
  /** Whether this edge is animated */
  animated?: boolean;
  style?: Record<string, string | number>;
}

// ─── Orbital System ───────────────────────────────────────────────────────────

/** An item that orbits a central body */
export interface OrbitalItem {
  id: string;
  label: string;
  /** Orbital radius in px */
  radius: number;
  /** Angular velocity in rad/s */
  angularVelocity: number;
  /** Current angle in radians */
  angle: number;
  /** Size of the orbital body */
  size: number;
  color: string;
  /** Optional payload */
  data?: unknown;
}

/** A complete orbital system with a sun/center and orbiting bodies */
export interface OrbitalSystem {
  id: string;
  /** Central body label */
  centerLabel: string;
  centerSize: number;
  centerColor: string;
  items: OrbitalItem[];
  /** Whether the system is paused */
  paused?: boolean;
}

// ─── Physics ──────────────────────────────────────────────────────────────────

/** A rigid body for the physics simulation */
export interface PhysicsBody {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  /** Whether the body is pinned in place */
  pinned?: boolean;
  label?: string;
  color?: string;
}

/** Framer Motion spring configuration */
export interface SpringConfig {
  type: 'spring';
  stiffness: number;
  damping: number;
  mass?: number;
  /** Velocity to start with */
  velocity?: number;
  restDelta?: number;
  restSpeed?: number;
}

// ─── Game ─────────────────────────────────────────────────────────────────────

/** Global game state */
export interface GameState {
  score: number;
  lives: number;
  level: number;
  status: 'idle' | 'playing' | 'paused' | 'gameover' | 'victory';
  highScore: number;
  unlockedAchievements: string[];
}

/** Configuration for a single game level */
export interface GameLevel {
  id: number;
  title: string;
  description?: string;
  /** Number of enemies / obstacles */
  difficulty: number;
  /** Background theme identifier */
  theme: string;
  /** Unlockable reward on completion */
  reward?: string;
}

// ─── Easter Eggs ──────────────────────────────────────────────────────────────

/** A hidden easter egg */
export interface EasterEgg {
  id: string;
  /** Trigger type */
  trigger: 'konami' | 'click' | 'hover' | 'sequence' | 'idle' | 'scroll';
  /** Human-readable description */
  description: string;
  /** Whether it has been discovered */
  discovered?: boolean;
  /** Callback identifier to execute on discovery */
  effectId: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

/** A single navigation item */
export interface NavigationItem {
  id: string;
  label: string;
  /** Hash or path */
  href: string;
  icon?: string;
  /** Whether to highlight as active */
  active?: boolean;
  /** Sub-items for dropdown navigation */
  children?: NavigationItem[];
}

// ─── Animation ────────────────────────────────────────────────────────────────

/** Framer Motion variant map */
export type AnimationVariants = Record<
  string,
  {
    opacity?: number;
    x?: number | string;
    y?: number | string;
    scale?: number;
    rotate?: number;
    transition?: Record<string, unknown>;
    [key: string]: unknown;
  }
>;

// ─── Fun / Transformation ─────────────────────────────────────────────────────

/** A transformation type available in the Fun section */
export type TransformationType =
  | 'ascii'
  | 'matrix'
  | 'glitch'
  | 'pixelate'
  | 'invert'
  | 'hue-rotate'
  | 'blur'
  | 'neon'
  | 'retro'
  | 'space';

/** Configuration for a single transformation */
export interface TransformationConfig {
  id: TransformationType;
  label: string;
  description: string;
  /** CSS filter string or custom effect identifier */
  effect: string;
  /** Whether this transformation is interactive */
  interactive?: boolean;
}
