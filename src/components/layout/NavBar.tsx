'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── Nav model ──────────────────────────────────────────────────────────────

/** In-page section anchors (live on the home page). */
const SECTION_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
] as const

/** Standalone pages. */
const PAGE_LINKS = [
  { href: '/playground', label: 'Playground' },
  { href: '/blog', label: 'Blog' },
] as const

// ─── Active-section tracking (home page only) ─────────────────────────────────

function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    if (!enabled) return
    const ids = SECTION_LINKS.map((s) => s.id)
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry nearest the top that is intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [enabled])

  return active
}

// ─── NavBar ───────────────────────────────────────────────────────────────────

export function NavBar() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection(isHome)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const sectionHref = (id: string) => (isHome ? `#${id}` : `/#${id}`)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[300] transition-all duration-300',
        scrolled || !isHome
          ? 'border-b border-white/[0.06] bg-[#070B14]/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Primary"
      >
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C5CFF] rounded-lg"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#7C5CFF]/40 bg-[#7C5CFF]/10 font-display text-sm font-bold text-[#7C5CFF] transition-colors group-hover:bg-[#7C5CFF]/20">
            NK
          </span>
          <span className="hidden font-display text-sm font-semibold tracking-tight text-slate-200 sm:block">
            Namrata Kesarwani
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.id}
              href={sectionHref(link.id)}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isHome && active === link.id
                  ? 'text-[#7C5CFF]'
                  : 'text-slate-400 hover:text-slate-100'
              )}
              aria-current={isHome && active === link.id ? 'true' : undefined}
            >
              {link.label}
            </a>
          ))}

          <span className="mx-1 h-4 w-px bg-white/10" />

          {PAGE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                pathname.startsWith(link.href)
                  ? 'text-[#61DAFB]'
                  : 'text-slate-400 hover:text-slate-100'
              )}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/resume"
            className="ml-2 rounded-lg border border-[#7C5CFF]/50 bg-[#7C5CFF]/10 px-4 py-2 text-sm font-semibold text-[#c4b5fd] transition-all hover:bg-[#7C5CFF]/20 hover:text-white"
          >
            Resume
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-300 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <div className="flex flex-col items-center justify-center gap-1.5">
            <motion.span className="block h-px w-5 bg-current" animate={menuOpen ? { rotate: 45, y: 3 } : { rotate: 0, y: 0 }} />
            <motion.span className="block h-px w-5 bg-current" animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} />
            <motion.span className="block h-px w-5 bg-current" animate={menuOpen ? { rotate: -45, y: -3 } : { rotate: 0, y: 0 }} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="border-t border-white/[0.06] bg-[#070B14]/95 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {SECTION_LINKS.map((link) => (
                <a
                  key={link.id}
                  href={sectionHref(link.id)}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <span className="my-1 h-px w-full bg-white/10" />
              {PAGE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/resume"
                onClick={() => setMenuOpen(false)}
                className="mt-1 rounded-lg border border-[#7C5CFF]/50 bg-[#7C5CFF]/10 px-3 py-2.5 text-center text-sm font-semibold text-[#c4b5fd]"
              >
                Resume
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
