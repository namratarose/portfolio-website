import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { Providers } from '@/providers'
import './globals.css'

// ─── Fonts ─────────────────────────────────────────────────────────────────────

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

// ─── Metadata ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL('https://namrata-kesarwani-portfolio.vercel.app'),
  title: {
    default: 'Namrata Kesarwani — OrbitOS Portfolio',
    template: '%s | Namrata Kesarwani',
  },
  description:
    'Full-stack engineer and system thinker. Building high-performance web experiences, distributed systems, and elegant interfaces that live at the intersection of engineering and design.',
  keywords: [
    'Namrata Kesarwani',
    'Full Stack Engineer',
    'Software Engineer',
    'React',
    'Next.js',
    'TypeScript',
    'System Design',
    'Portfolio',
    'OrbitOS',
  ],
  authors: [{ name: 'Namrata Kesarwani', url: 'https://namrata-kesarwani-portfolio.vercel.app' }],
  creator: 'Namrata Kesarwani',
  publisher: 'Namrata Kesarwani',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://namrata-kesarwani-portfolio.vercel.app',
    siteName: 'Namrata Kesarwani — OrbitOS Portfolio',
    title: 'Namrata Kesarwani — OrbitOS Portfolio',
    description:
      'Full-stack engineer building high-performance web experiences, distributed systems, and elegant interfaces.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Namrata Kesarwani — OrbitOS Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Namrata Kesarwani — OrbitOS Portfolio',
    description:
      'Full-stack engineer building high-performance web experiences, distributed systems, and elegant interfaces.',
    images: ['/og-image.png'],
    creator: '@namratakesarwani',
  },
  // Icons are auto-detected from app/icon.svg, app/favicon.ico, app/apple-icon.png
  alternates: {
    canonical: 'https://namrata-kesarwani-portfolio.vercel.app',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#070B14' },
    { media: '(prefers-color-scheme: light)', color: '#070B14' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark',
}

// ─── Structured Data ───────────────────────────────────────────────────────────

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Namrata Kesarwani',
  url: 'https://namrata-kesarwani-portfolio.vercel.app',
  image: 'https://namrata-kesarwani-portfolio.vercel.app/avatar.jpg',
  sameAs: [
    'https://github.com/namratakesarwani',
    'https://linkedin.com/in/namratakesarwani',
    'https://twitter.com/namratakesarwani',
  ],
  jobTitle: 'Full Stack Software Engineer',
  description:
    'Full-stack engineer specializing in high-performance web experiences, distributed systems, and elegant interfaces.',
  knowsAbout: [
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'System Design',
    'Distributed Systems',
    'UI/UX Engineering',
  ],
}

// ─── Root Layout ───────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className="dark"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body
        className={`
          ${inter.variable}
          ${jetbrainsMono.variable}
          ${spaceGrotesk.variable}
          font-sans
          antialiased
          bg-[#070B14]
          text-slate-100
          overflow-x-hidden
          selection:bg-[#7C5CFF]/30
          selection:text-white
        `}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
