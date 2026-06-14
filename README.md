# OrbitOS — Namrata Kesarwani's Portfolio

An interactive developer portfolio built as a small "operating system in space." Instead of a
traditional scrolling résumé, the core sections orbit around a central node, and the experimental
/ playful pieces live on their own page so the main page stays focused on the portfolio.

**Live sections**

- **Home (`/`)** — the portfolio: a hero "developer core" with orbiting tech tags, About, an
  Experience timeline framed as a CI/CD pipeline, Projects ("Mission Control" cards with
  architecture diagrams and an animated detail modal), a Skills grid, and Contact.
- **Playground (`/playground`)** — the fun, experimental stuff: an interactive **System
  Architecture** lab (click nodes, simulate 10,000 requests), the **DEVTRIX** developer
  transformation device, and **Debug The Production Incident**, a small game.
- **Blog (`/blog`, `/blog/[slug]`)** — writing, with an *Agentic AI* series and *Engineering
  Notes*. Article content is co-located in the route.
- **Résumé (`/resume`)** — the résumé PDF rendered inline in the browser.
- **Extras** — dynamic OpenGraph image (`/api/og`), `sitemap.xml`, `robots.txt`, and a branded
  "NK" favicon generated from `src/app/icon.svg`.

## Tech stack

- [Next.js 15](https://nextjs.org) (App Router) + React 19
- TypeScript
- [Tailwind CSS v4](https://tailwindcss.com) (configured via `@import 'tailwindcss'` + `@config`)
- [Framer Motion](https://www.framer.com/motion/) for animation
- [Radix UI](https://www.radix-ui.com/) primitives (dialog, etc.)
- MDX support (`@next/mdx`), `sharp` for icon generation
- Zustand + React Query (state / data layer scaffolding)

## Project structure

```
src/
├── app/                  # routes: /, /playground, /blog, /blog/[slug], /resume, /api/og
│   ├── icon.svg          # favicon source (NK monogram) → favicon.ico + apple-icon.png
│   ├── globals.css       # Tailwind v4 entry + design tokens
│   ├── layout.tsx        # root layout, metadata, fonts
│   └── page.tsx          # home page composition
├── components/
│   ├── layout/           # NavBar, AuroraBackground, LoadingScreen, EasterEggs
│   ├── sections/         # Hero, About, Experience, Projects, Skills, Contact, SystemDesign, Fun
│   ├── games/            # DebugIncident
│   ├── animations/ ui/ physics/
├── config/               # site.ts, personal.ts — content lives here, not in components
├── hooks/  lib/  store/  providers/  types/  constants/  styles/
└── public/               # static assets (resume.pdf, etc.)
```

Most editable content (bio, experience, projects, skills, contact) is centralized in
`src/config/` and the section components — update copy there rather than deep in the JSX.

## Getting started

> **Node 20 or newer is required** (Next.js 15 needs Node `^18.18 || ^20 || >=21`). If you use
> `nvm`, run `nvm use` to pick up the version in `.nvmrc`.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server (port 3000)     |
| `npm run build` | Production build                     |
| `npm run start` | Serve the production build           |
| `npm run lint`  | Run ESLint                           |

## Deploy on Vercel

This is a standard Next.js App Router app and deploys to Vercel with zero extra config.

### Option A — Vercel dashboard (recommended)

1. Push this repository to GitHub (or GitLab/Bitbucket).
2. Go to [vercel.com/new](https://vercel.com/new) and **Import** the repository.
3. Vercel auto-detects Next.js. Leave the defaults:
   - **Framework Preset:** Next.js
   - **Build Command:** `next build`
   - **Output Directory:** `.next` (managed automatically)
   - **Install Command:** `npm install`
4. **Set the Node.js version to 20.x or 22.x** under **Settings → General → Node.js Version**
   (or rely on the `engines.node` field / `.nvmrc` in this repo).
5. Add any environment variables if you introduce them later (none are required today).
6. Click **Deploy**. Every push to the default branch then deploys to production, and other
   branches/PRs get preview URLs automatically.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel          # first run: link/create the project, follow the prompts
vercel --prod   # deploy to production
```

### After deploying

- Update the canonical URL and OpenGraph `metadataBase` in `src/app/layout.tsx` and
  `src/config/site.ts` to your real domain.
- Add a custom domain under **Settings → Domains** if you have one.

## License

Personal portfolio — content © Namrata Kesarwani. Code is free to reference.
