'use client'

import { Toaster } from 'sonner'
import type { ReactNode } from 'react'
import { QueryProvider } from './QueryProvider'
import { ThemeProvider } from './ThemeProvider'

interface ProvidersProps {
  children: ReactNode
}

function ToasterProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'hsl(var(--background))',
          color: 'hsl(var(--foreground))',
          border: '1px solid hsl(var(--border))',
        },
      }}
      richColors
      closeButton
    />
  )
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <ThemeProvider>
        {children}
        <ToasterProvider />
      </ThemeProvider>
    </QueryProvider>
  )
}

export { QueryProvider } from './QueryProvider'
export { ThemeProvider } from './ThemeProvider'
