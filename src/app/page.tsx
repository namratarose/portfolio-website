'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { HeroSection } from '@/components/sections/HeroSection'
import { NavBar } from '@/components/layout/NavBar'
import { AuroraBackground } from '@/components/layout/AuroraBackground'
import { LoadingScreen } from '@/components/layout/LoadingScreen'
import { EasterEggs } from '@/components/layout/EasterEggs'
import { useEasterEgg } from '@/hooks/useEasterEgg'

// ─── Lazy-loaded sections ─────────────────────────────────────────────────────

const AboutSection = dynamic(
  () => import('@/components/sections/AboutSection').then((m) => m.AboutSection),
  { ssr: false }
)

const ExperienceSection = dynamic(
  () => import('@/components/sections/ExperienceSection').then((m) => m.ExperienceSection),
  { ssr: false }
)

const ProjectsSection = dynamic(
  () => import('@/components/sections/ProjectsSection').then((m) => m.ProjectsSection),
  { ssr: false }
)

const SkillsSection = dynamic(
  () => import('@/components/sections/SkillsSection').then((m) => m.SkillsSection),
  { ssr: false }
)

const ContactSection = dynamic(
  () => import('@/components/sections/ContactSection').then((m) => m.ContactSection),
  { ssr: false }
)

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  useEasterEgg()

  useEffect(() => {
    console.log(
      '%c Namrata Kesarwani — Backend Engineer ',
      'background: #7C5CFF; color: #fff; font-size: 13px; font-weight: bold; padding: 4px 8px; border-radius: 4px;'
    )
    console.log('%c👋 Curious dev? The /playground page has the fun stuff.', 'color: #61DAFB; font-size: 12px;')
  }, [])

  return (
    <>
      <LoadingScreen />
      <EasterEggs />
      <AuroraBackground />
      <NavBar />

      {/* Portfolio — each section component owns its own <section id> */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
    </>
  )
}
