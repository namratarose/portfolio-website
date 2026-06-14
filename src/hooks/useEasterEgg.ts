'use client'

import { useEffect, useCallback } from 'react'
import { useAddDiscoveredEgg } from '@/store/portfolioStore'

// ↑ ↑ ↓ ↓ ← → ← → B A
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA',
]

export interface EasterEggEvent {
  id: string
  label: string
}

const KEYBOARD_SHORTCUTS: Record<string, EasterEggEvent> = {
  // e.g. Ctrl+Shift+O  => "orbit"
  'ctrl+shift+KeyO': { id: 'orbit-mode', label: 'Orbit Mode Unlocked' },
  'ctrl+shift+KeyG': { id: 'gravity-hack', label: 'Gravity Hack Activated' },
}

/**
 * Detects the Konami code sequence and custom keyboard shortcuts.
 * Dispatches a custom "easter-egg" DOM event and updates the easterEggStore.
 */
export function useEasterEgg() {
  const addDiscoveredEgg = useAddDiscoveredEgg()
  const buffer = useCallback(() => {
    const keys: string[] = []
    return keys
  }, [])

  useEffect(() => {
    const keyBuffer: string[] = []
    const MAX_BUFFER = KONAMI_CODE.length

    const dispatchEgg = (egg: EasterEggEvent) => {
      addDiscoveredEgg(egg.id)
      window.dispatchEvent(new CustomEvent('easter-egg', { detail: egg }))
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // --- Konami code detection ---
      keyBuffer.push(e.code)
      if (keyBuffer.length > MAX_BUFFER) keyBuffer.shift()

      if (keyBuffer.join(',') === KONAMI_CODE.join(',')) {
        keyBuffer.length = 0
        dispatchEgg({ id: 'konami', label: 'Konami Code Entered!' })
        return
      }

      // --- Custom shortcut detection ---
      const parts: string[] = []
      if (e.ctrlKey || e.metaKey) parts.push('ctrl')
      if (e.altKey) parts.push('alt')
      if (e.shiftKey) parts.push('shift')
      parts.push(e.code)
      const combo = parts.join('+')

      if (KEYBOARD_SHORTCUTS[combo]) {
        e.preventDefault()
        dispatchEgg(KEYBOARD_SHORTCUTS[combo])
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // buffer is stable – only addDiscoveredEgg matters
  }, [addDiscoveredEgg, buffer])
}
