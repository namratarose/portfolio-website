import type { Metadata } from 'next'
import { NavBar } from '@/components/layout/NavBar'

export const metadata: Metadata = {
  title: 'Résumé',
  description: 'Résumé of Namrata Kesarwani — Backend Software Engineer.',
}

export default function ResumePage() {
  return (
    <>
      <NavBar />
      <main className="min-h-screen bg-[#070B14] px-4 pt-24 pb-12">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-100">Résumé</h1>
              <p className="mt-1 text-sm text-slate-500">Namrata Kesarwani — Backend Software Engineer</p>
            </div>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start rounded-lg border border-[#7C5CFF]/50 bg-[#7C5CFF]/10 px-4 py-2 text-sm font-semibold text-[#c4b5fd] transition-colors hover:bg-[#7C5CFF]/20 hover:text-white"
            >
              Open in new tab ↗
            </a>
          </div>

          {/* PDF viewer */}
          <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0D1321]">
            <object
              data="/resume.pdf#view=FitH"
              type="application/pdf"
              className="h-[80vh] w-full"
              aria-label="Résumé PDF"
            >
              <div className="flex h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="text-sm text-slate-400">
                  Your browser can&apos;t display the PDF inline.
                </p>
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-[#7C5CFF]/50 bg-[#7C5CFF]/10 px-4 py-2 text-sm font-semibold text-[#c4b5fd]"
                >
                  Open résumé ↗
                </a>
              </div>
            </object>
          </div>
        </div>
      </main>
    </>
  )
}
