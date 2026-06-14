'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, useScroll, useSpring } from 'framer-motion'
import { NavBar } from '@/components/layout/NavBar'

// ─── Types ────────────────────────────────────────────────────────────────────

interface PostMeta {
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

interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

interface Article {
  toc: TocItem[]
  html: string
}

const POST_META: PostMeta[] = [
  {
    slug: 'what-makes-ai-agentic',
    title: 'What Actually Makes an AI System “Agentic”?',
    excerpt:
      'An LLM in a loop with tools is a different kind of system than a chatbot — here is the line, and why it changes how you design everything around it.',
    category: 'Agentic AI',
    categoryColor: '#7C5CFF',
    readTime: '7 min read',
    date: 'May 2026',
    author: 'Namrata Kesarwani',
    tags: ['Agents', 'LLM', 'Tool Use', 'Architecture'],
    comingSoon: false,
  },
  {
    slug: 'tool-calling-loops-that-dont-spiral',
    title: 'Designing Tool-Calling Loops That Don’t Spiral',
    excerpt:
      'Give a model tools and a while-loop and it will eventually do something expensive or wrong. The guardrails that keep an agent loop bounded, observable, and safe.',
    category: 'Agentic AI',
    categoryColor: '#7C5CFF',
    readTime: '9 min read',
    date: 'May 2026',
    author: 'Namrata Kesarwani',
    tags: ['Agents', 'Tool Use', 'Reliability', 'Guardrails'],
    comingSoon: false,
  },
  {
    slug: 'rag-vs-long-context-agent-memory',
    title: 'RAG vs. Long Context: How Should an Agent Remember?',
    excerpt:
      'Bigger context windows did not kill retrieval. A practical guide for what an agent keeps in-context, what it retrieves, and what it forgets.',
    category: 'Agentic AI',
    categoryColor: '#7C5CFF',
    readTime: '8 min read',
    date: 'Jun 2026',
    author: 'Namrata Kesarwani',
    tags: ['RAG', 'Memory', 'Context', 'Agents'],
    comingSoon: false,
  },
  {
    slug: 'redis-distributed-locking-oauth',
    title: 'Redis Distributed Locking: Eliminating OAuth Race Conditions',
    excerpt:
      'How a single SETNX command prevented thousands of duplicate tokens from flooding our OAuth 2.0 flow.',
    category: 'Backend',
    categoryColor: '#FF6B6B',
    readTime: '8 min read',
    date: 'December 2024',
    author: 'Namrata Kesarwani',
    tags: ['Redis', 'OAuth', 'Go', 'Concurrency'],
    comingSoon: false,
  },
]

// ─── Articles (keyed by slug) ───────────────────────────────────────────────────

const ARTICLES: Record<string, Article> = {
  'what-makes-ai-agentic': {
    toc: [
      { id: 'chatbot-vs-agent', text: 'Chatbot vs. agent', level: 2 },
      { id: 'the-loop-is-the-product', text: 'The loop is the product', level: 2 },
      { id: 'what-changes', text: 'What changes in your architecture', level: 2 },
    ],
    html: `
<p>
  “Agent” has quietly become the most overloaded word in software. A vendor calls a single
  prompt an agent; someone else means a full autonomous system. It is worth being precise,
  because the design tradeoffs are completely different depending on which one you are building.
</p>

<h2 id="chatbot-vs-agent">Chatbot vs. agent</h2>
<p>
  A chatbot maps one input to one output. You send a message, the model responds, done. It can
  be remarkably capable, but the control flow is fixed: the <em>application</em> decides what
  happens next.
</p>
<p>
  An agent inverts that. You hand the model a goal and a set of tools, and the <em>model</em>
  decides what to do next — call a tool, read the result, decide again — until it judges the
  task complete. The defining property is not intelligence; it is that the model controls the
  loop.
</p>

<h2 id="the-loop-is-the-product">The loop is the product</h2>
<p>
  Once the model drives control flow, the loop itself becomes the thing you are engineering. A
  minimal agent loop is small:
</p>
<pre><code class="language-python">while not done:
    response = llm(messages, tools=TOOLS)
    if response.tool_calls:
        results = [run_tool(c) for c in response.tool_calls]
        messages += results          # feed observations back in
    else:
        done = True                  # model produced a final answer</code></pre>
<p>
  Everything interesting in agent engineering lives in the gaps of that loop: how you describe
  tools, how you feed observations back, when you decide the model is stuck, and how you stop.
</p>

<h2 id="what-changes">What changes in your architecture</h2>
<p>
  Treating the loop as the product has concrete consequences:
</p>
<ul>
  <li><strong>Tools are your API surface.</strong> The model can only do what your tools let it. Tool design <em>is</em> product design.</li>
  <li><strong>Non-determinism is the default.</strong> The same input can take different paths. Tests become distributions, not assertions.</li>
  <li><strong>Cost and latency are variable.</strong> A task might take two tool calls or twenty. You budget for the loop, not the call.</li>
  <li><strong>Observability is mandatory.</strong> When something goes wrong, “the model decided to” is not a stack trace. You need the full trace of decisions.</li>
</ul>
<p>
  So the litmus test is simple: <strong>does the model control the loop?</strong> If yes, you are
  building an agent, and the rest of this series is about making that loop reliable.
</p>
`,
  },

  'tool-calling-loops-that-dont-spiral': {
    toc: [
      { id: 'why-loops-spiral', text: 'Why loops spiral', level: 2 },
      { id: 'bounding-the-loop', text: 'Bounding the loop', level: 2 },
      { id: 'make-it-observable', text: 'Make it observable', level: 2 },
    ],
    html: `
<p>
  The first time you wire a model up to real tools in a loop, it feels like magic. The second
  time, it calls the same failing tool eleven times in a row, burns your token budget, and
  confidently reports success. Autonomy without guardrails is just an expensive way to fail.
</p>

<h2 id="why-loops-spiral">Why loops spiral</h2>
<p>
  Agent loops degrade in a few predictable ways:
</p>
<ul>
  <li><strong>Retry storms:</strong> a tool errors, the model retries with a near-identical call, and nothing changes.</li>
  <li><strong>Thrashing:</strong> the model oscillates between two approaches without converging.</li>
  <li><strong>Context rot:</strong> as observations pile up, earlier instructions get crowded out and behaviour drifts.</li>
  <li><strong>False completion:</strong> the model declares victory because saying “done” is easier than doing the work.</li>
</ul>

<h2 id="bounding-the-loop">Bounding the loop</h2>
<p>
  Reliability comes from putting the loop on rails the model cannot leave:
</p>
<pre><code class="language-python">MAX_STEPS = 12
for step in range(MAX_STEPS):
    resp = llm(messages, tools=TOOLS)
    if not resp.tool_calls:
        break
    for call in resp.tool_calls:
        if seen_recently(call):           # dedupe identical calls
            messages += refuse(call, "repeat call blocked")
            continue
        result = run_tool(call, timeout=10)
        messages += result
else:
    raise StepBudgetExceeded(step)        # fail loud, never silently</code></pre>
<p>
  Three rules carry most of the weight: a hard step budget, deduplication of repeated calls, and
  a per-tool timeout. The loop should always terminate — on success, on budget, or on an
  explicit error — never by wandering off.
</p>

<h2 id="make-it-observable">Make it observable</h2>
<p>
  You cannot debug what you cannot see. Every loop should emit a structured trace: each step, the
  tool called, arguments, the observation, and the model’s stated reason. When an agent
  misbehaves in production, that trace is the difference between a five-minute fix and a shrug.
</p>
<p>
  The mindset shift: you are not prompting a model, you are operating a small autonomous system.
  Bound it, instrument it, and let it fail loudly — and most of the “magic gone wrong” disappears.
</p>
`,
  },

  'rag-vs-long-context-agent-memory': {
    toc: [
      { id: 'the-false-binary', text: 'The false binary', level: 2 },
      { id: 'a-decision-guide', text: 'A decision guide', level: 2 },
      { id: 'hybrid-in-practice', text: 'Hybrid in practice', level: 2 },
    ],
    html: `
<p>
  Every time context windows get bigger, someone announces that retrieval is dead. Then they try
  to stuff a knowledge base into a prompt, watch quality drop and costs climb, and quietly add a
  retriever back. The real question is not RAG <em>or</em> long context — it is what an agent
  should hold in mind versus look up.
</p>

<h2 id="the-false-binary">The false binary</h2>
<p>
  Long context and retrieval solve different problems. A big window lets a model reason over a lot
  of information <em>at once</em>; retrieval lets it reach information it was not carrying. Putting
  everything in-context has real costs: more tokens, higher latency, and the “lost in the middle”
  effect where models attend poorly to the center of a long prompt.
</p>

<h2 id="a-decision-guide">A decision guide</h2>
<p>
  For each piece of information an agent might need, ask three questions:
</p>
<ul>
  <li><strong>Is it needed every step?</strong> If yes — task instructions, the current goal — keep it in-context.</li>
  <li><strong>Is it large and only sometimes relevant?</strong> Docs, past tickets, a codebase — retrieve it on demand.</li>
  <li><strong>Is it stale-able?</strong> If it changes often, retrieving fresh beats caching a snapshot in the prompt.</li>
</ul>
<p>
  A useful mental model: context is RAM, retrieval is disk. You would not load the whole disk into
  RAM just because RAM got cheaper.
</p>

<h2 id="hybrid-in-practice">Hybrid in practice</h2>
<p>
  Most production agents end up hybrid. A compact, always-present core — goal, recent steps, key
  facts — plus retrieval for the long tail, plus a summarisation step that compresses old turns
  before they rot the window:
</p>
<pre><code class="language-python">context = system_prompt + goal + recent_steps(messages, k=6)
if needs_knowledge(step):
    context += retrieve(query, top_k=5)
if len(messages) > THRESHOLD:
    messages = summarize_old_turns(messages)   # keep the window lean</code></pre>
<p>
  Bigger windows did not end retrieval; they changed the budget. The job is still the same:
  decide what an agent remembers, what it looks up, and what it lets go.
</p>
`,
  },

  'redis-distributed-locking-oauth': {
    toc: [
      { id: 'the-problem', text: 'The Problem', level: 2 },
      { id: 'redis-set-nx', text: 'Redis SET NX to the Rescue', level: 2 },
      { id: 'results', text: 'Results', level: 2 },
    ],
    html: `
<h2 id="the-problem">The Problem</h2>
<p>
  Our OAuth 2.0 flow at KGeN was minting duplicate access tokens under high concurrency. Two
  requests arriving within 50ms of each other would both pass the “does this user have a token?”
  check, both generate fresh JWTs, and both write to DynamoDB — leaving the second write to
  silently overwrite the first.
</p>
<p>
  Under moderate load this was invisible. At 500+ concurrent requests during a marketing push,
  duplicate tokens caused downstream API calls to fail with 401s roughly 4% of the time.
</p>

<h2 id="redis-set-nx">Redis SET NX to the Rescue</h2>
<p>
  Redis's <code>SET key value NX PX milliseconds</code> command is atomic. It sets a key only if
  it does not already exist, in a single round-trip — the foundation of a Redlock-style lock.
</p>
<pre><code class="language-go">lockKey := fmt.Sprintf("oauth:lock:%s", userID)
ok, err := redisClient.SetNX(ctx, lockKey, "1", 5*time.Second).Result()
if !ok {
    return retryGetToken(ctx, userID) // another instance is minting
}
defer redisClient.Del(ctx, lockKey)</code></pre>
<p>
  The 5-second TTL is the safety net: if the holder crashes before releasing, the lock expires
  automatically, preventing a permanent deadlock.
</p>

<h2 id="results">Results</h2>
<p>
  After shipping distributed locking, duplicate token issuance dropped from ~4% under load to
  <strong>zero measured occurrences</strong> over a 30-day window. P99 auth latency rose by 8ms
  (acceptable) and invalid-token support tickets stopped entirely.
</p>
`,
  },
}

// ─── Reading Progress Bar ─────────────────────────────────────────────────────

function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      className="fixed left-0 right-0 top-0 z-[400] h-0.5 origin-left bg-gradient-to-r from-[#7C5CFF] via-[#FF7AE5] to-[#61DAFB]"
      style={{ scaleX }}
    />
  )
}

// ─── Table of Contents ────────────────────────────────────────────────────────

function TableOfContents({ items, activeId }: { items: TocItem[]; activeId: string }) {
  return (
    <nav className="sticky top-24">
      <p className="mb-4 text-[10px] font-mono uppercase tracking-widest text-slate-500">On This Page</p>
      <ul className="flex flex-col gap-1">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block py-0.5 text-xs font-mono transition-colors duration-150 ${item.level === 3 ? 'pl-3' : ''} ${
                activeId === item.id ? 'text-[#7C5CFF]' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPostPage() {
  const params = useParams()
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : ''

  const post = POST_META.find((p) => p.slug === slug)
  const article = ARTICLES[slug]
  const [activeHeading, setActiveHeading] = useState<string>('')
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!contentRef.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) setActiveHeading(visible[0].target.id)
      },
      { rootMargin: '-20% 0% -60% 0%', threshold: 0 }
    )
    const headings = contentRef.current.querySelectorAll('h2, h3')
    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [article])

  if (!post || !article) {
    return (
      <>
        <NavBar />
        <main className="flex min-h-screen items-center justify-center bg-[#070B14] px-4">
          <div className="text-center">
            <p className="mb-4 font-mono text-6xl font-bold text-slate-800">404</p>
            <p className="mb-6 text-slate-400">This article doesn&apos;t exist yet.</p>
            <Link href="/blog" className="text-sm font-mono text-[#7C5CFF] hover:underline">
              ← Back to all posts
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <NavBar />
      <ReadingProgress />

      <main className="min-h-screen bg-[#070B14] pt-16">
        {/* Hero */}
        <div className="border-b border-slate-800/60 px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-sm font-mono text-slate-500 transition-colors duration-200 hover:text-slate-300"
            >
              <span>←</span>
              <span>All posts</span>
            </Link>

            <div className="mb-5 flex items-center gap-3">
              <span
                className="rounded px-2.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider"
                style={{ color: post.categoryColor, background: `${post.categoryColor}18`, border: `1px solid ${post.categoryColor}30` }}
              >
                {post.category}
              </span>
              <span className="text-xs font-mono text-slate-600">{post.readTime}</span>
              <span className="text-xs font-mono text-slate-600">{post.date}</span>
            </div>

            <h1 className="mb-5 font-display text-3xl font-bold leading-tight tracking-tight text-slate-100 md:text-4xl">
              {post.title}
            </h1>
            <p className="mb-7 max-w-2xl text-base leading-relaxed text-slate-400">{post.excerpt}</p>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#61DAFB] text-xs font-bold text-white">
                NK
              </div>
              <div>
                <p className="font-display text-sm font-medium text-slate-300">{post.author}</p>
                <p className="text-[10px] font-mono text-slate-500">Backend Software Engineer at KGeN</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content + TOC */}
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="flex gap-16">
            <article className="min-w-0 flex-1">
              <div ref={contentRef} className="prose-blog" dangerouslySetInnerHTML={{ __html: article.html }} />
              <div className="mt-16 border-t border-slate-800/60 pt-8">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-mono text-[#7C5CFF] transition-colors duration-200 hover:text-[#9B7EFF]"
                >
                  <span>←</span>
                  <span>All posts</span>
                </Link>
              </div>
            </article>

            <aside className="hidden w-52 shrink-0 xl:block">
              <TableOfContents items={article.toc} activeId={activeHeading} />
            </aside>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .prose-blog h2 { font-size: 1.375rem; font-weight: 700; color: #f1f5f9; margin-top: 2.5rem; margin-bottom: 1rem; font-family: var(--font-space-grotesk, sans-serif); letter-spacing: -0.01em; scroll-margin-top: 6rem; }
        .prose-blog h3 { font-size: 1.1rem; font-weight: 600; color: #cbd5e1; margin-top: 2rem; margin-bottom: 0.75rem; font-family: var(--font-space-grotesk, sans-serif); scroll-margin-top: 6rem; }
        .prose-blog p { font-size: 0.9375rem; line-height: 1.8; color: #94a3b8; margin-bottom: 1.25rem; }
        .prose-blog strong { color: #e2e8f0; font-weight: 600; }
        .prose-blog em { color: #cbd5e1; font-style: italic; }
        .prose-blog code { font-family: var(--font-jetbrains-mono, monospace); font-size: 0.82rem; background: rgba(124, 92, 255, 0.12); color: #c4b5fd; padding: 0.1em 0.4em; border-radius: 4px; border: 1px solid rgba(124, 92, 255, 0.2); }
        .prose-blog pre { background: #0d1321; border: 1px solid rgba(30, 41, 59, 0.8); border-radius: 10px; padding: 1.25rem 1.5rem; overflow-x: auto; margin: 1.5rem 0; }
        .prose-blog pre code { background: none; border: none; padding: 0; color: #94a3b8; font-size: 0.8rem; line-height: 1.7; }
        .prose-blog ul { list-style: none; margin: 1.25rem 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .prose-blog ul li { font-size: 0.9375rem; color: #94a3b8; line-height: 1.7; padding-left: 1.2rem; position: relative; }
        .prose-blog ul li::before { content: '›'; position: absolute; left: 0; color: #7c5cff; }
      `}</style>
    </>
  )
}
