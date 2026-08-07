// components/layout/Footer.tsx
import Link from 'next/link'

const quickLinks = [
  { label: 'Home',        href: '/' },
  { label: 'About SSC',  href: '/about' },
  { label: 'Gallery',    href: '/gallery' },
  { label: 'Team',       href: '/team' },
  { label: 'Live Scores',href: '/live-scores' },
  { label: 'Register',   href: '/register' },
]

export function Footer() {
  return (
    <footer style={{
      background: '#030A03',
      borderTop: '1px solid rgba(76,175,80,0.12)',
      padding: '4rem 1.5rem 0',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          paddingBottom: '3rem',
        }}>

          {/* Col 1 — Brand */}
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{
                fontFamily: 'var(--font-bebas, sans-serif)',
                fontSize: '1.5rem', color: 'white',
                letterSpacing: '3px', margin: 0,
              }}>
                AAGAAZ 2026
              </p>
              <p style={{ color: '#4CAF50', fontSize: '10px',
                letterSpacing: '3px', textTransform: 'uppercase',
                fontFamily: 'var(--font-space, sansa-serif)', margin: '2px 0 0' }}>
                GLA University
              </p>
            </div>
            <p style={{ color: 'rgba(165,214,167,0.5)', fontSize: '13px',
              lineHeight: 1.75, maxWidth: '280px',
              fontFamily: 'var(--font-inter, sans-serif)' }}>
              The annual sports festival of GLA University. Bringing together athletes
              from across India to compete, excel, and celebrate sportsmanship.
            </p>
            {/* Social icons — inline SVG */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              {[
                { label: 'Instagram', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { label: 'YouTube', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                { label: 'LinkedIn', path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
              ].map(icon => (
                <a key={icon.label} href="#" style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(76,175,80,0.1)',
                  border: '1px solid rgba(76,175,80,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(165,214,167,0.6)">
                    <path d={icon.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-bebas, sans-serif)',
              fontSize: '1.1rem', color: 'white', letterSpacing: '3px',
              marginBottom: '1.25rem' }}>
              QUICK LINKS
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {quickLinks.map(l => (
                <li key={l.href} style={{ marginBottom: '10px' }}>
                  <Link href={l.href} style={{
                    color: 'rgba(165,214,167,0.5)',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontFamily: 'var(--font-inter, sans-serif)',
                    transition: 'color 0.2s',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <span style={{ color: '#4CAF50', fontSize: '10px' }}>›</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Contact */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-bebas, sans-serif)',
              fontSize: '1.1rem', color: 'white', letterSpacing: '3px',
              marginBottom: '1.25rem' }}>
              CONTACT
            </h4>
            {[
              { emoji: '✉️', text: 'ssc@gla.ac.in' },
              { emoji: '📞', text: '+91 98765 43210' },
              { emoji: '📍', text: 'NH-2, Mathura-Delhi Road, Mathura, UP - 281406' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', gap: '10px',
                marginBottom: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', flexShrink: 0 }}>{item.emoji}</span>
                <p style={{ color: 'rgba(165,214,167,0.5)', fontSize: '13px',
                  margin: 0, lineHeight: 1.5,
                  fontFamily: 'var(--font-inter, sans-serif)' }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(76,175,80,0.1)',
          padding: '1.5rem 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <p style={{ color: 'rgba(165,214,167,0.35)', fontSize: '12px',
            fontFamily: 'var(--font-inter, sans-serif)', margin: 0 }}>
            © 2026 Students Sports Council, GLA University. All rights reserved.
          </p>
          <p style={{ color: 'rgba(165,214,167,0.35)', fontSize: '12px',
            fontFamily: 'var(--font-inter, sans-serif)', margin: 0 }}>
            Designed with 💚 for athletes.
          </p>
        </div>  
      </div>
    </footer>
  )
}
