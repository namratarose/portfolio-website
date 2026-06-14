import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/layout/NavBar'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Notes on agentic AI, backend engineering, and the technical decisions behind production systems — by Namrata Kesarwani.',
  openGraph: {
    title: 'Blog | Namrata Kesarwani',
    description: 'Notes on agentic AI, backend engineering, and production systems.',
    type: 'website',
  },
}

interface Post {
  slug: string
  title: string
  excerpt: string
  category: string
  categoryColor: string
  readTime: string
  date: string
  tags: string[]
  comingSoon: boolean
}

// ─── Agentic AI series ──────────────────────────────────────────────────────────

const agenticPosts: Post[] = [
  {
    slug: 'what-makes-ai-agentic',
    title: "What Actually Makes an AI System “Agentic”?",
    excerpt:
      'Everyone ships “agents” now. But an LLM in a loop with tools is different from a chatbot — here’s the line, and why it changes how you design the system.',
    category: 'Agentic AI',
    categoryColor: '#7C5CFF',
    readTime: '7 min read',
    date: 'May 2026',
    tags: ['Agents', 'LLM', 'Tool Use', 'Architecture'],
    comingSoon: false,
  },
  {
    slug: 'tool-calling-loops-that-dont-spiral',
    title: "Designing Tool-Calling Loops That Don’t Spiral",
    excerpt:
      'Give a model tools and a while-loop and it will eventually do something expensive or wrong. The guardrails that keep an agent loop bounded, observable, and safe.',
    category: 'Agentic AI',
    categoryColor: '#7C5CFF',
    readTime: '9 min read',
    date: 'May 2026',
    tags: ['Agents', 'Tool Use', 'Reliability', 'Guardrails'],
    comingSoon: false,
  },
  {
    slug: 'rag-vs-long-context-agent-memory',
    title: 'RAG vs. Long Context: How Should an Agent Remember?',
    excerpt:
      'Bigger context windows didn’t kill retrieval. A practical decision guide for what an agent should keep in-context, what it should retrieve, and what it should forget.',
    category: 'Agentic AI',
    categoryColor: '#7C5CFF',
    readTime: '8 min read',
    date: 'Jun 2026',
    tags: ['RAG', 'Memory', 'Context', 'Agents'],
    comingSoon: false,
  },
  {
    slug: 'evaluating-agents-llm-judges',
    title: 'Evaluating Agents with LLM Judges (Without Fooling Yourself)',
    excerpt:
      'How do you know your agent got better? On building evaluation harnesses with LLM judges, and the failure modes that make them lie to you.',
    category: 'Agentic AI',
    categoryColor: '#7C5CFF',
    readTime: '6 min read',
    date: 'Jun 2026',
    tags: ['Evals', 'LLM Judge', 'Agents'],
    comingSoon: true,
  },
]

// ─── Engineering notes ────────────────────────────────────────────────────────

const engineeringPosts: Post[] = [
  {
    slug: 'redis-distributed-locking-oauth',
    title: 'Redis Distributed Locking: Eliminating OAuth Race Conditions',
    excerpt:
      'How a single SETNX command prevented thousands of duplicate tokens from flooding our OAuth 2.0 flow — and what we learned building distributed locks in production.',
    category: 'Backend',
    categoryColor: '#FF6B6B',
    readTime: '8 min read',
    date: 'Dec 2024',
    tags: ['Redis', 'OAuth', 'Go', 'Concurrency'],
    comingSoon: false,
  },
  {
    slug: 'ai-data-pipelines-sarvam-go',
    title: 'Building AI Data Pipelines with Sarvam AI and Go',
    excerpt:
      'Architecting a high-throughput ingestion pipeline integrating Sarvam AI for transcription across distributed Go workers.',
    category: 'AI/ML',
    categoryColor: '#F9D423',
    readTime: '12 min read',
    date: 'Jan 2025',
    tags: ['Go', 'AI/ML', 'Sarvam AI', 'Pipelines'],
    comingSoon: true,
  },
  {
    slug: 'gcp-to-aws-lambda-cold-start',
    title: 'Migrating from GCP to AWS Lambda: A Cold-Start Story',
    excerpt:
      'A candid post-mortem on our cloud migration — the performance wins, unexpected cold-start penalties, and how provisioned concurrency saved our P99 latency.',
    category: 'Cloud',
    categoryColor: '#61DAFB',
    readTime: '6 min read',
    date: 'Feb 2025',
    tags: ['AWS', 'Lambda', 'GCP', 'Performance'],
    comingSoon: true,
  },
]

function PostCard({ post }: { post: Post }) {
  return (
    <article className="relative rounded-xl border border-slate-800/60 bg-[#0D1321]/80 p-6 transition-all duration-300 hover:border-slate-700/80 group">
      {post.comingSoon && (
        <span
          className="absolute right-5 top-5 rounded-full px-3 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-widest"
          style={{ color: post.categoryColor, background: `${post.categoryColor}10`, border: `1px solid ${post.categoryColor}30` }}
        >
          Coming Soon
        </span>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span
            className="rounded px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider"
            style={{ color: post.categoryColor, background: `${post.categoryColor}18`, border: `1px solid ${post.categoryColor}30` }}
          >
            {post.category}
          </span>
          <span className="text-[10px] font-mono text-slate-600">{post.readTime}</span>
          <span className="text-[10px] font-mono text-slate-600">{post.date}</span>
        </div>

        {post.comingSoon ? (
          <h3 className="text-lg font-semibold text-slate-100 font-display leading-snug">{post.title}</h3>
        ) : (
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-lg font-semibold text-slate-100 font-display leading-snug group-hover:text-white transition-colors duration-200">
              {post.title}
            </h3>
          </Link>
        )}

        <p className="text-sm text-slate-400 leading-relaxed">{post.excerpt}</p>

        <div className="mt-1 flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wide text-slate-500 bg-slate-800/60 border border-slate-700/40">
              {tag}
            </span>
          ))}
        </div>

        {!post.comingSoon && (
          <Link
            href={`/blog/${post.slug}`}
            className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono text-[#7C5CFF] hover:text-[#9B7EFF] transition-colors duration-200 group/link"
          >
            Read article
            <span className="transition-transform duration-200 group-hover/link:translate-x-1">→</span>
          </Link>
        )}
      </div>
    </article>
  )
}

export default function BlogPage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#070B14] px-4 pt-28 pb-24">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-14">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#7C5CFF]/60" />
              <span className="text-xs font-mono tracking-widest text-[#7C5CFF] uppercase">writing</span>
            </div>
            <h1 className="mb-3 font-display text-4xl font-bold tracking-tight text-slate-100 md:text-5xl">
              Blog
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-400">
              Notes on agentic AI, backend engineering, and the technical decisions behind
              production systems.
            </p>
          </div>

          {/* Agentic AI */}
          <section className="mb-16">
            <div className="mb-6 flex items-baseline gap-3">
              <h2 className="font-display text-xl font-bold text-slate-100">Agentic AI</h2>
              <span className="text-xs font-mono text-slate-600">a series on building with LLM agents</span>
            </div>
            <div className="flex flex-col gap-6">
              {agenticPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>

          {/* Engineering Notes */}
          <section>
            <div className="mb-6 flex items-baseline gap-3">
              <h2 className="font-display text-xl font-bold text-slate-100">Engineering Notes</h2>
              <span className="text-xs font-mono text-slate-600">distributed systems & backend</span>
            </div>
            <div className="flex flex-col gap-6">
              {engineeringPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  )
}
