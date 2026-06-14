'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  categoryColor: string
  readTime: string
  date: string
  author: string
  tags: string[]
  comingSoon: boolean
}

// ─── Blog Data ────────────────────────────────────────────────────────────────

const POSTS: BlogPost[] = [
  {
    slug: 'redis-distributed-locking-oauth',
    title: 'Redis Distributed Locking: Eliminating OAuth Race Conditions',
    excerpt:
      'How a single SETNX command prevented thousands of duplicate tokens from flooding our OAuth 2.0 flow — and what we learned building distributed locks in production.',
    category: 'Backend',
    categoryColor: '#FF6B6B',
    readTime: '8 min read',
    date: 'Dec 2024',
    author: 'Namrata Kesarwani',
    tags: ['Redis', 'OAuth', 'Go', 'Concurrency'],
    comingSoon: false,
  },
  {
    slug: 'ai-data-pipelines-sarvam-go',
    title: 'Building AI Data Pipelines with Sarvam AI and Go',
    excerpt:
      'Architecting a high-throughput ingestion pipeline that processed 1M+ records daily, integrating Sarvam AI for real-time NLP classification across distributed workers.',
    category: 'AI/ML',
    categoryColor: '#F9D423',
    readTime: '12 min read',
    date: 'Jan 2025',
    author: 'Namrata Kesarwani',
    tags: ['Go', 'AI/ML', 'Sarvam AI', 'Pipelines'],
    comingSoon: true,
  },
  {
    slug: 'gcp-to-aws-lambda-cold-start',
    title: 'Migrating from GCP to AWS Lambda: A Cold-Start Story',
    excerpt:
      'A candid post-mortem on our cloud migration — the performance wins, unexpected cold-start penalties, and how provisioned concurrency saved our P99 latency from collapsing.',
    category: 'Cloud',
    categoryColor: '#61DAFB',
    readTime: '6 min read',
    date: 'Feb 2025',
    author: 'Namrata Kesarwani',
    tags: ['AWS', 'Lambda', 'GCP', 'Performance'],
    comingSoon: true,
  },
]

const ALL_CATEGORIES = ['All', ...Array.from(new Set(POSTS.map((p) => p.category)))]

// ─── Blog Card ────────────────────────────────────────────────────────────────

interface BlogCardProps {
  post: BlogPost
  index: number
}

function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      layout
      className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-800/60 bg-[#0D1321]/80 backdrop-blur-sm transition-all duration-300 hover:border-slate-700/80 hover:shadow-lg hover:shadow-black/30"
    >
      {/* Coming soon overlay */}
      {post.comingSoon && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-[#070B14]/70 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-2">
            <span
              className="rounded-full border px-4 py-1.5 text-xs font-mono font-semibold uppercase tracking-widest"
              style={{
                color: post.categoryColor,
                borderColor: `${post.categoryColor}40`,
                background: `${post.categoryColor}10`,
              }}
            >
              Coming Soon
            </span>
            <p className="text-xs text-slate-500 font-mono">Article in progress</p>
          </div>
        </div>
      )}

      {/* Top accent bar */}
      <div
        className="h-0.5 w-full transition-all duration-300 group-hover:h-px"
        style={{ background: `linear-gradient(90deg, ${post.categoryColor}60, transparent)` }}
      />

      <div className="flex flex-col gap-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <span
            className="shrink-0 rounded px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider"
            style={{
              color: post.categoryColor,
              background: `${post.categoryColor}18`,
              border: `1px solid ${post.categoryColor}30`,
            }}
          >
            {post.category}
          </span>
          <span className="text-[10px] font-mono text-slate-600 whitespace-nowrap">{post.readTime}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-slate-100 leading-snug font-display group-hover:text-white transition-colors duration-200">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{post.excerpt}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wide text-slate-500 bg-slate-800/60 border border-slate-700/40"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-slate-800/60 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#61DAFB] flex items-center justify-center text-[9px] font-bold text-white">
              NK
            </div>
            <span className="text-[10px] font-mono text-slate-500">{post.author}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-600">{post.date}</span>
        </div>
      </div>

      {/* Read link — only for non-coming-soon */}
      {!post.comingSoon && (
        <Link
          href={`/blog/${post.slug}`}
          className="absolute inset-0 z-20"
          aria-label={`Read ${post.title}`}
        />
      )}
    </motion.div>
  )
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

interface SearchBarProps {
  value: string
  onChange: (val: string) => void
}

function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        type="text"
        placeholder="Search articles..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-800/80 bg-[#0D1321]/80 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition-colors duration-200 focus:border-[#7C5CFF]/60 focus:ring-1 focus:ring-[#7C5CFF]/20 font-mono"
      />
      <AnimatePresence>
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
          >
            ✕
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Category Filter ──────────────────────────────────────────────────────────

interface CategoryTabsProps {
  categories: string[]
  active: string
  onChange: (cat: string) => void
}

function CategoryTabs({ categories, active, onChange }: CategoryTabsProps) {
  const colors: Record<string, string> = {
    All: '#7C5CFF',
    Backend: '#FF6B6B',
    'AI/ML': '#F9D423',
    Cloud: '#61DAFB',
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = active === cat
        const color = colors[cat] ?? '#7C5CFF'
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className="relative rounded-lg px-3.5 py-1.5 text-xs font-mono font-medium transition-all duration-200 outline-none"
            style={{
              color: isActive ? color : 'rgba(148,163,184,0.7)',
              background: isActive ? `${color}15` : 'transparent',
              border: `1px solid ${isActive ? `${color}40` : 'rgba(71,85,105,0.3)'}`,
            }}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function BlogSection() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = useMemo(() => {
    return POSTS.filter((post) => {
      const matchCat = activeCategory === 'All' || post.category === activeCategory
      const q = search.toLowerCase()
      const matchSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q))
      return matchCat && matchSearch
    })
  }, [search, activeCategory])

  const handleCategoryChange = useCallback((cat: string) => setActiveCategory(cat), [])
  const handleSearchChange = useCallback((val: string) => setSearch(val), [])

  return (
    <section id="blog" className="relative py-24 px-4 overflow-hidden">
      {/* Background decorations */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-[#F9D423]/[0.03] blur-3xl" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-[#7C5CFF]/[0.04] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col gap-4"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-[#F9D423]/60" />
            <span className="text-xs font-mono tracking-widest text-[#F9D423] uppercase">
              engineering notes
            </span>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-4xl font-bold text-slate-100 font-display tracking-tight md:text-5xl">
                Engineering Notes
              </h2>
              <p className="mt-2 max-w-xl text-base text-slate-400 leading-relaxed">
                Deep dives into distributed systems, performance engineering, and the technical decisions
                behind production systems.
              </p>
            </div>
            <Link
              href="/blog"
              className="shrink-0 flex items-center gap-1.5 text-sm font-mono text-[#7C5CFF] hover:text-[#9B7EFF] transition-colors duration-200 group"
            >
              View all posts
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <div className="sm:flex-1 sm:max-w-xs">
            <SearchBar value={search} onChange={handleSearchChange} />
          </div>
          <CategoryTabs
            categories={ALL_CATEGORIES}
            active={activeCategory}
            onChange={handleCategoryChange}
          />
        </motion.div>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key="grid"
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              <AnimatePresence>
                {filtered.map((post, i) => (
                  <BlogCard key={post.slug} post={post} index={i} />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-4 py-20"
            >
              <span className="text-3xl opacity-30">⊘</span>
              <p className="text-sm font-mono text-slate-500">No articles found for &quot;{search}&quot;</p>
              <button
                onClick={() => { setSearch(''); setActiveCategory('All') }}
                className="text-xs font-mono text-[#7C5CFF] hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subscribe CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 rounded-2xl border border-slate-800/60 bg-gradient-to-br from-[#0D1321]/90 to-[#0A0F1C]/90 p-8 text-center backdrop-blur-sm"
        >
          <p className="text-xs font-mono text-[#7C5CFF] uppercase tracking-widest mb-3">New posts incoming</p>
          <h3 className="text-xl font-bold text-slate-100 font-display mb-2">
            More engineering deep-dives soon
          </h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Articles on Go concurrency patterns, DynamoDB single-table design, and blockchain
            transaction reliability are in the works.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
