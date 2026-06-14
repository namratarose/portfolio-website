// Always-fresh résumé proxy.
// Streams the live PDF export of the Google Doc so the latest version is served
// every time, with no caching. Update the Doc → the site reflects it immediately.

// Never cache this route at the framework/CDN layer.
export const dynamic = 'force-dynamic'
export const revalidate = 0

const DOC_ID = '1YvGviNqzxuR_6uKIabTIJfkMOCMvOF9ccUdtbszXZ5w'
const EXPORT_URL = `https://docs.google.com/document/d/${DOC_ID}/export?format=pdf`

export async function GET(request: Request) {
  try {
    const upstream = await fetch(EXPORT_URL, { cache: 'no-store', redirect: 'follow' })
    const contentType = upstream.headers.get('content-type') ?? ''

    // If the Doc isn't publicly shared, Google returns an HTML sign-in page
    // instead of a PDF — fall back to the bundled snapshot.
    if (!upstream.ok || !contentType.includes('pdf')) {
      return Response.redirect(new URL('/resume.pdf', request.url), 302)
    }

    const pdf = await upstream.arrayBuffer()
    return new Response(pdf, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Namrata_Kesarwani_Resume.pdf"',
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    })
  } catch {
    // Network/Google hiccup → serve the bundled snapshot so the page never breaks.
    return Response.redirect(new URL('/resume.pdf', request.url), 302)
  }
}
