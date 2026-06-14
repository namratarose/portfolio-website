'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface TypingAnimationProps {
  strings: string | string[]
  speed?: number        // ms per character (default 60)
  deleteSpeed?: number  // ms per backspace (default 30)
  pauseTime?: number    // ms to pause at end of string (default 1500)
  startDelay?: number   // ms before starting (default 0)
  cursor?: boolean
  cursorChar?: string
  className?: string
  cursorClassName?: string
  loop?: boolean
}

type Phase = 'typing' | 'pause' | 'deleting' | 'wait'

export function TypingAnimation({
  strings,
  speed = 60,
  deleteSpeed = 30,
  pauseTime = 1500,
  startDelay = 0,
  cursor = true,
  cursorChar = '|',
  className,
  cursorClassName,
  loop = true,
}: TypingAnimationProps) {
  const allStrings = Array.isArray(strings) ? strings : [strings]
  const isCycling = allStrings.length > 1

  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<Phase>('wait')
  const [stringIndex, setStringIndex] = useState(0)
  const [cursorBlink, setCursorBlink] = useState(true)

  const phaseRef = useRef(phase)
  const displayedRef = useRef(displayed)
  const stringIndexRef = useRef(stringIndex)
  phaseRef.current = phase
  displayedRef.current = displayed
  stringIndexRef.current = stringIndex

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorBlink((v) => !v)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>

    function tick() {
      const current = allStrings[stringIndexRef.current]
      const p = phaseRef.current
      const d = displayedRef.current

      if (p === 'wait') {
        timeout = setTimeout(() => {
          setPhase('typing')
        }, startDelay)
        return
      }

      if (p === 'typing') {
        if (d.length < current.length) {
          const next = current.slice(0, d.length + 1)
          setDisplayed(next)
          displayedRef.current = next
          timeout = setTimeout(tick, speed + Math.random() * 20)
        } else {
          if (!isCycling && !loop) return
          setPhase('pause')
          phaseRef.current = 'pause'
          timeout = setTimeout(tick, pauseTime)
        }
        return
      }

      if (p === 'pause') {
        if (!isCycling) {
          // Single string, loop: clear and retype
          setPhase('deleting')
          phaseRef.current = 'deleting'
          timeout = setTimeout(tick, deleteSpeed)
        } else {
          setPhase('deleting')
          phaseRef.current = 'deleting'
          timeout = setTimeout(tick, deleteSpeed)
        }
        return
      }

      if (p === 'deleting') {
        if (d.length > 0) {
          const next = d.slice(0, -1)
          setDisplayed(next)
          displayedRef.current = next
          timeout = setTimeout(tick, deleteSpeed)
        } else {
          // Move to next string
          const nextIdx = (stringIndexRef.current + 1) % allStrings.length
          if (nextIdx === 0 && !loop) return
          setStringIndex(nextIdx)
          stringIndexRef.current = nextIdx
          setPhase('typing')
          phaseRef.current = 'typing'
          timeout = setTimeout(tick, speed * 3)
        }
        return
      }
    }

    timeout = setTimeout(tick, startDelay)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <span className={cn('inline', className)}>
      {displayed}
      {cursor && (
        <span
          aria-hidden
          className={cn(
            'inline-block w-[2px] translate-y-[1px] transition-opacity duration-100',
            cursorBlink ? 'opacity-100' : 'opacity-0',
            cursorClassName
          )}
        >
          {cursorChar}
        </span>
      )}
    </span>
  )
}
