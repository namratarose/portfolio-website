import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const title = searchParams.get('title') ?? 'Namrata Kesarwani'
  const role = searchParams.get('role') ?? 'Backend Software Engineer · KGeN'
  const subtitle =
    searchParams.get('subtitle') ?? 'Backend · Microservices · AI Pipelines'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: '#070B14',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* ── Background orbital rings (SVG decorations) ── */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          viewBox="0 0 1200 630"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Large outer ring */}
          <ellipse
            cx="900"
            cy="315"
            rx="340"
            ry="300"
            fill="none"
            stroke="rgba(124,92,255,0.12)"
            strokeWidth="1"
          />
          {/* Medium ring */}
          <ellipse
            cx="900"
            cy="315"
            rx="230"
            ry="200"
            fill="none"
            stroke="rgba(97,218,251,0.10)"
            strokeWidth="1"
            strokeDasharray="8 6"
          />
          {/* Inner ring */}
          <ellipse
            cx="900"
            cy="315"
            rx="130"
            ry="115"
            fill="none"
            stroke="rgba(255,122,229,0.10)"
            strokeWidth="1"
          />

          {/* Orbital dots */}
          <circle cx="1185" cy="315" r="6" fill="#7C5CFF" opacity="0.9" />
          <circle cx="900" cy="115" r="5" fill="#61DAFB" opacity="0.8" />
          <circle cx="615" cy="315" r="4" fill="#FF7AE5" opacity="0.7" />

          {/* Aurora glow blobs */}
          <radialGradient id="g1" cx="80%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7C5CFF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#7C5CFF" stopOpacity="0" />
          </radialGradient>
          <rect x="0" y="0" width="1200" height="630" fill="url(#g1)" />

          <radialGradient id="g2" cx="20%" cy="80%" r="40%">
            <stop offset="0%" stopColor="#61DAFB" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#61DAFB" stopOpacity="0" />
          </radialGradient>
          <rect x="0" y="0" width="1200" height="630" fill="url(#g2)" />

          {/* Top scan line accent */}
          <line
            x1="80"
            y1="60"
            x2="580"
            y2="60"
            stroke="rgba(124,92,255,0.4)"
            strokeWidth="1"
          />
          {/* Bottom accent line */}
          <line
            x1="80"
            y1="570"
            x2="400"
            y2="570"
            stroke="rgba(97,218,251,0.3)"
            strokeWidth="1"
          />
        </svg>

        {/* ── Main content ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px 80px',
            width: '700px',
            position: 'relative',
            zIndex: 10,
          }}
        >
          {/* OS label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#7C5CFF',
                boxShadow: '0 0 8px rgba(124,92,255,0.8)',
              }}
            />
            <span
              style={{
                color: 'rgba(124,92,255,0.9)',
                fontSize: '13px',
                letterSpacing: '0.15em',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
              }}
            >
              OrbitOS Portfolio
            </span>
          </div>

          {/* Name */}
          <div
            style={{
              color: '#F1F5F9',
              fontSize: '64px',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
            }}
          >
            {title}
          </div>

          {/* Role */}
          <div
            style={{
              color: '#7C5CFF',
              fontSize: '22px',
              fontWeight: 500,
              marginBottom: '12px',
              letterSpacing: '-0.01em',
            }}
          >
            {role}
          </div>

          {/* Subtitle */}
          <div
            style={{
              color: '#64748B',
              fontSize: '16px',
              letterSpacing: '0.02em',
            }}
          >
            {subtitle}
          </div>

          {/* URL */}
          <div
            style={{
              marginTop: '48px',
              color: 'rgba(97,218,251,0.6)',
              fontSize: '14px',
              fontFamily: 'monospace',
            }}
          >
            namrata.dev
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
