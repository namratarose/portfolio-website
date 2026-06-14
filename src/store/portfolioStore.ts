import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavigationItem {
  id: string
  label: string
  href: string
}

interface NavigationState {
  activeSection: string
  isNavOpen: boolean
  navigationItems: NavigationItem[]
  setActiveSection: (section: string) => void
  setNavOpen: (open: boolean) => void
}

export const useNavigationStore = create<NavigationState>()(
  devtools(
    (set) => ({
      activeSection: 'hero',
      isNavOpen: false,
      navigationItems: [
        { id: 'hero', label: 'Home', href: '#hero' },
        { id: 'about', label: 'About', href: '#about' },
        { id: 'projects', label: 'Projects', href: '#projects' },
        { id: 'skills', label: 'Skills', href: '#skills' },
        { id: 'experience', label: 'Experience', href: '#experience' },
        { id: 'contact', label: 'Contact', href: '#contact' },
      ],
      setActiveSection: (section) => set({ activeSection: section }, false, 'setActiveSection'),
      setNavOpen: (open) => set({ isNavOpen: open }, false, 'setNavOpen'),
    }),
    { name: 'NavigationStore' }
  )
)

// ─── Cursor ───────────────────────────────────────────────────────────────────

export type CursorVariant = 'default' | 'hover' | 'click' | 'text' | 'hidden'

interface CursorState {
  cursorVariant: CursorVariant
  cursorPosition: { x: number; y: number }
  setCursorVariant: (variant: CursorVariant) => void
  setCursorPosition: (position: { x: number; y: number }) => void
}

export const useCursorStore = create<CursorState>()(
  devtools(
    (set) => ({
      cursorVariant: 'default',
      cursorPosition: { x: 0, y: 0 },
      setCursorVariant: (variant) => set({ cursorVariant: variant }, false, 'setCursorVariant'),
      setCursorPosition: (position) => set({ cursorPosition: position }, false, 'setCursorPosition'),
    }),
    { name: 'CursorStore' }
  )
)

// ─── Theme ────────────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set, get) => ({
        theme: 'dark',
        toggleTheme: () =>
          set({ theme: get().theme === 'dark' ? 'light' : 'dark' }, false, 'toggleTheme'),
      }),
      { name: 'theme-storage' }
    ),
    { name: 'ThemeStore' }
  )
)

// ─── Physics ──────────────────────────────────────────────────────────────────

interface PhysicsState {
  gravityEnabled: boolean
  particlesEnabled: boolean
  reducedMotion: boolean
  togglePhysics: () => void
  toggleParticles: () => void
  setReducedMotion: (value: boolean) => void
}

export const usePhysicsStore = create<PhysicsState>()(
  devtools(
    persist(
      (set, get) => ({
        gravityEnabled: true,
        particlesEnabled: true,
        reducedMotion: false,
        togglePhysics: () =>
          set({ gravityEnabled: !get().gravityEnabled }, false, 'togglePhysics'),
        toggleParticles: () =>
          set({ particlesEnabled: !get().particlesEnabled }, false, 'toggleParticles'),
        setReducedMotion: (value) => set({ reducedMotion: value }, false, 'setReducedMotion'),
      }),
      { name: 'physics-storage' }
    ),
    { name: 'PhysicsStore' }
  )
)

// ─── Game ─────────────────────────────────────────────────────────────────────

interface GameState {
  gameScore: number
  gameLevel: number
  isGameActive: boolean
  highScore: number
  setGameScore: (score: number) => void
  startGame: () => void
  endGame: () => void
  incrementLevel: () => void
}

export const useGameStore = create<GameState>()(
  devtools(
    persist(
      (set, get) => ({
        gameScore: 0,
        gameLevel: 1,
        isGameActive: false,
        highScore: 0,
        setGameScore: (score) => {
          const { highScore } = get()
          set(
            { gameScore: score, highScore: Math.max(score, highScore) },
            false,
            'setGameScore'
          )
        },
        startGame: () =>
          set({ isGameActive: true, gameScore: 0, gameLevel: 1 }, false, 'startGame'),
        endGame: () => {
          const { gameScore, highScore } = get()
          set(
            {
              isGameActive: false,
              highScore: Math.max(gameScore, highScore),
            },
            false,
            'endGame'
          )
        },
        incrementLevel: () =>
          set({ gameLevel: get().gameLevel + 1 }, false, 'incrementLevel'),
      }),
      { name: 'game-storage' }
    ),
    { name: 'GameStore' }
  )
)

// ─── Easter Eggs ──────────────────────────────────────────────────────────────

interface EasterEggState {
  discoveredEggs: string[]
  totalEggs: number
  addDiscoveredEgg: (egg: string) => void
  resetEggs: () => void
}

export const useEasterEggStore = create<EasterEggState>()(
  devtools(
    persist(
      (set, get) => ({
        discoveredEggs: [],
        totalEggs: 7,
        addDiscoveredEgg: (egg) => {
          const { discoveredEggs } = get()
          if (!discoveredEggs.includes(egg)) {
            set({ discoveredEggs: [...discoveredEggs, egg] }, false, 'addDiscoveredEgg')
          }
        },
        resetEggs: () => set({ discoveredEggs: [] }, false, 'resetEggs'),
      }),
      { name: 'easter-egg-storage' }
    ),
    { name: 'EasterEggStore' }
  )
)

// ─── Terminal ─────────────────────────────────────────────────────────────────

interface TerminalState {
  isTerminalOpen: boolean
  terminalHistory: string[]
  addToHistory: (entry: string) => void
  toggleTerminal: () => void
  clearHistory: () => void
}

export const useTerminalStore = create<TerminalState>()(
  devtools(
    (set, get) => ({
      isTerminalOpen: false,
      terminalHistory: ['OrbitOS Terminal v1.0.0', 'Type "help" for available commands.'],
      addToHistory: (entry) =>
        set(
          { terminalHistory: [...get().terminalHistory, entry] },
          false,
          'addToHistory'
        ),
      toggleTerminal: () =>
        set({ isTerminalOpen: !get().isTerminalOpen }, false, 'toggleTerminal'),
      clearHistory: () =>
        set({ terminalHistory: [] }, false, 'clearHistory'),
    }),
    { name: 'TerminalStore' }
  )
)

// ─── Selector hooks ───────────────────────────────────────────────────────────

// Navigation selectors
export const useActiveSection = () => useNavigationStore((s) => s.activeSection)
export const useNavigationItems = () => useNavigationStore((s) => s.navigationItems)
export const useIsNavOpen = () => useNavigationStore((s) => s.isNavOpen)
export const useSetActiveSection = () => useNavigationStore((s) => s.setActiveSection)
export const useSetNavOpen = () => useNavigationStore((s) => s.setNavOpen)

// Cursor selectors
export const useCursorVariant = () => useCursorStore((s) => s.cursorVariant)
export const useCursorPosition = () => useCursorStore((s) => s.cursorPosition)
export const useSetCursorVariant = () => useCursorStore((s) => s.setCursorVariant)
export const useSetCursorPosition = () => useCursorStore((s) => s.setCursorPosition)

// Theme selectors
export const useCurrentTheme = () => useThemeStore((s) => s.theme)
export const useToggleTheme = () => useThemeStore((s) => s.toggleTheme)

// Physics selectors
export const useGravityEnabled = () => usePhysicsStore((s) => s.gravityEnabled)
export const useParticlesEnabled = () => usePhysicsStore((s) => s.particlesEnabled)
export const useReducedMotionPref = () => usePhysicsStore((s) => s.reducedMotion)
export const useTogglePhysics = () => usePhysicsStore((s) => s.togglePhysics)
export const useToggleParticles = () => usePhysicsStore((s) => s.toggleParticles)

// Game selectors
export const useGameScore = () => useGameStore((s) => s.gameScore)
export const useGameLevel = () => useGameStore((s) => s.gameLevel)
export const useIsGameActive = () => useGameStore((s) => s.isGameActive)
export const useHighScore = () => useGameStore((s) => s.highScore)
export const useSetGameScore = () => useGameStore((s) => s.setGameScore)
export const useStartGame = () => useGameStore((s) => s.startGame)
export const useEndGame = () => useGameStore((s) => s.endGame)

// Easter egg selectors
export const useDiscoveredEggs = () => useEasterEggStore((s) => s.discoveredEggs)
export const useTotalEggs = () => useEasterEggStore((s) => s.totalEggs)
export const useAddDiscoveredEgg = () => useEasterEggStore((s) => s.addDiscoveredEgg)

// Terminal selectors
export const useIsTerminalOpen = () => useTerminalStore((s) => s.isTerminalOpen)
export const useTerminalHistory = () => useTerminalStore((s) => s.terminalHistory)
export const useAddToHistory = () => useTerminalStore((s) => s.addToHistory)
export const useToggleTerminal = () => useTerminalStore((s) => s.toggleTerminal)
