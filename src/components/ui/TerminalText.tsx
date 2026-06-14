'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface TerminalLine {
  text: string
  prompt?: boolean   // show prompt prefix on this line
  delay?: number     // extra delay before this line appears (ms)
  color?: string     // override line color
}

interface TerminalTextProps {
  lines: string | TerminalLine | (string | TerminalLine)[]
  className?: string
  prompt?: string           // default prompt prefix
  typingSpeed?: number      // ms per character
  lineDelay?: number        // ms between lines
  startDelay?: number       // ms before first line
  cursor?: boolean
  showPrompt?: boolean      // show prompt on all lines
  theme?: 'green' | 'cyan' | 'amber'
}

const THEME_COLORS: Record<'green' | 'cyan' | 'amber', { text: string; prompt: string; cursor: string }> = {
  green: { text: '#4ade80', prompt: '#22c55e', cursor: '#4ade80' },
  cyan:  { text: '#67e8f9', prompt: '#22d3ee', cursor: '#67e8f9' },
  amber: { text: '#fbbf24', prompt: '#f59e0b', cursor: '#fbbf24' },
}

function normalise(raw: string | TerminalLine): TerminalLine {
  if (typeof raw === 'string') return { text: raw, prompt: true }
  return raw
}

export function TerminalText({
  lines,
  className,
  prompt = '> ',
  typingSpeed = 45,
  lineDelay = 200,
  startDelay = 0,
  cursor = true,
  showPrompt = true,
  theme = 'green',
}: TerminalTextProps) {
  const allLines = (Array.isArray(lines) ? lines : [lines]).map(normalise)
  const colors = THEME_COLORS[theme]

  const [completedLines, setCompletedLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentChar, setCurrentChar] = useState(0)
  const [done, setDone] = useState(false)
  const [cursorBlink, setCursorBlink] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Blink cursor
  useEffect(() => {
    const id = setInterval(() => setCursorBlink((v) => !v), 530)
    return () => clearInterval(id)
  }, [])

  // Typing engine
  useEffect(() => {
    if (currentLine >= allLines.length) {
      setDone(true)
      return
    }

    const line = allLines[currentLine]
    const totalChars = line.text.length

    if (currentChar === 0 && currentLine === 0) {
      // First character of first line — respect startDelay
      const id = setTimeout(typeNextChar, startDelay)
      return () => clearTimeout(id)
    }

    function typeNextChar() {
      setCurrentChar((prev) => {
        const next = prev + 1
        if (next >= totalChars) {
          // Line finished
          setTimeout(() => {
            setCompletedLines((prev) => [...prev, allLines[currentLine].text])
            setCurrentLine((l) => l + 1)
            setCurrentChar(0)
          }, lineDelay + (allLines[currentLine + 1]?.delay ?? 0))
        }
        return next
      })
    }

    const id = setTimeout(typeNextChar, typingSpeed + Math.random() * 15)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLine, currentChar])

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [completedLines, currentChar])

  const activeText = currentLine < allLines.length
    ? allLines[currentLine].text.slice(0, currentChar)
    : ''

  const showLinePrompt = (line: TerminalLine) =>
    showPrompt && (line.prompt !== false)

  return (
    <div
      ref={containerRef}
      className={cn(
        'overflow-auto rounded-lg bg-[#0a0a0f] p-4 font-mono text-sm leading-6',
        'border border-white/10',
        className
      )}
      style={{ color: colors.text }}
    >
      {/* Completed lines */}
      {completedLines.map((text, i) => {
        const line = allLines[i]
        return (
          <div key={i} style={{ color: line.color ?? colors.text }}>
            {showLinePrompt(line) && (
              <span style={{ color: colors.prompt }}>{prompt}</span>
            )}
            {text}
          </div>
        )
      })}

      {/* Currently typing line */}
      {!done && currentLine < allLines.length && (
        <div>
          {showLinePrompt(allLines[currentLine]) && (
            <span style={{ color: colors.prompt }}>{prompt}</span>
          )}
          {activeText}
          {cursor && (
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: '0.55ch',
                background: colors.cursor,
                opacity: cursorBlink ? 1 : 0,
                verticalAlign: 'text-bottom',
                height: '1.1em',
                marginLeft: '1px',
                transition: 'opacity 0.1s',
              }}
            />
          )}
        </div>
      )}

      {/* Final blinking cursor when done */}
      {done && cursor && (
        <span
          aria-hidden
          style={{
            display: 'inline-block',
            width: '0.55ch',
            background: colors.cursor,
            opacity: cursorBlink ? 1 : 0,
            verticalAlign: 'text-bottom',
            height: '1.1em',
            marginLeft: '1px',
          }}
        />
      )}
    </div>
  )
}
