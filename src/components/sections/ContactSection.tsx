'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { socialLinks } from '@/config/personal'
import { siteConfig } from '@/config/site'

// ─── Constants ────────────────────────────────────────────────────────────────

const EMAIL = 'namrata.kesar10@gmail.com'

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function CopyIcon({ done }: { done: boolean }) {
  return done ? (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ) : (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  )
}

function ResumeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  )
}

// ─── Copy Email Button ────────────────────────────────────────────────────────

function CopyEmailButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      // Fallback
      const el = document.createElement('textarea')
      el.value = EMAIL
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    }
  }, [])

  return (
    <div className="flex items-center gap-3 group">
      <a
        href={`mailto:${EMAIL}`}
        className="text-base md:text-lg font-mono font-semibold transition-colors"
        style={{ color: '#61DAFB' }}
      >
        {EMAIL}
      </a>
      <motion.button
        onClick={handleCopy}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
        style={{
          color: copied ? '#06D6A0' : 'rgba(255,255,255,0.45)',
          background: copied ? 'rgba(6,214,160,0.12)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${copied ? 'rgba(6,214,160,0.4)' : 'rgba(255,255,255,0.1)'}`,
        }}
        aria-label={copied ? 'Copied!' : 'Copy email to clipboard'}
      >
        <CopyIcon done={copied} />
        <AnimatePresence mode="wait">
          <motion.span
            key={copied ? 'copied' : 'copy'}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

// ─── Social Link Button ───────────────────────────────────────────────────────

function SocialButton({ href, icon, label }: { href: string; icon: string; label: string }) {
  const iconEl = icon === 'github' ? <GitHubIcon /> : icon === 'linkedin' ? <LinkedInIcon /> : <MailIcon />

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2.5 px-5 py-3 rounded-xl font-mono text-sm font-medium transition-all"
      style={{
        color: 'rgba(255,255,255,0.65)',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 0 0 0 rgba(124,92,255,0)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.color = '#ffffff'
        el.style.border = '1px solid rgba(124,92,255,0.45)'
        el.style.boxShadow = '0 0 18px rgba(124,92,255,0.2)'
        el.style.background = 'rgba(124,92,255,0.1)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.color = 'rgba(255,255,255,0.65)'
        el.style.border = '1px solid rgba(255,255,255,0.1)'
        el.style.boxShadow = '0 0 0 0 rgba(124,92,255,0)'
        el.style.background = 'rgba(255,255,255,0.04)'
      }}
    >
      {iconEl}
      {label}
    </motion.a>
  )
}

// ─── Contact Section ──────────────────────────────────────────────────────────

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-8%' })

  const githubLink = socialLinks.find((l) => l.icon === 'github')
  const linkedinLink = socialLinks.find((l) => l.icon === 'linkedin')

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full py-28 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #090D18 0%, #070B14 100%)' }}
    >
      {/* Decorative glow orbs */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-3xl opacity-25"
        style={{ background: 'radial-gradient(ellipse at center, #7C5CFF 0%, transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-10"
        style={{ background: 'radial-gradient(circle, #FF7AE5 0%, transparent 70%)' }}
      />

      {/* Scan-line overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 4px)',
          backgroundSize: '100% 4px',
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center gap-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-xs font-mono tracking-[0.3em] uppercase text-[#7C5CFF]/60">
            sys.contact
          </span>
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #c4b5fd 60%, #7C5CFF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Let&apos;s Build Something Great
          </h2>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#7C5CFF] to-transparent" />
        </motion.div>

        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-semibold"
            style={{
              color: '#06D6A0',
              background: 'rgba(6,214,160,0.1)',
              border: '1px solid rgba(6,214,160,0.35)',
              boxShadow: '0 0 16px rgba(6,214,160,0.12)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#06D6A0] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#06D6A0]" />
            </span>
            Open to opportunities
          </div>
        </motion.div>

        {/* Email block */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.55 }}
          className="w-full"
        >
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 md:p-5 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(97,218,251,0.06) 0%, rgba(7,11,20,0.8) 100%)',
              border: '1px solid rgba(97,218,251,0.2)',
              boxShadow: '0 0 24px rgba(97,218,251,0.06)',
            }}
          >
            <MailIcon />
            <CopyEmailButton />
          </div>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.55 }}
        >
          {githubLink && (
            <SocialButton href={githubLink.href} icon="github" label="GitHub" />
          )}
          {linkedinLink && (
            <SocialButton href={linkedinLink.href} icon="linkedin" label="LinkedIn" />
          )}
        </motion.div>

        {/* Location */}
        <motion.div
          className="flex items-center gap-1.5 text-sm text-white/35 font-mono"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55, duration: 0.5 }}
        >
          <LocationIcon />
          <span>{siteConfig.author.location}</span>
        </motion.div>

        {/* View résumé in browser */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.5 }}
        >
          <Link
            href="/resume"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-mono text-sm font-semibold transition-all hover:scale-[1.04] active:scale-[0.97]"
            style={{
              color: '#ffffff',
              background: 'linear-gradient(135deg, #7C5CFF 0%, #9B7DFF 100%)',
              boxShadow: '0 0 28px rgba(124,92,255,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
              border: '1px solid rgba(124,92,255,0.5)',
            }}
          >
            <ResumeIcon />
            View Résumé
          </Link>
        </motion.div>

        {/* Footer note */}
        <motion.p
          className="text-xs text-white/20 font-mono"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          Built with Next.js, Framer Motion &amp; TypeScript
        </motion.p>
      </div>
    </section>
  )
}
