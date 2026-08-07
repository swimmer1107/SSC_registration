'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

const NAV_LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/about', label: 'ABOUT US' },
  { href: '/team', label: 'TEAM' },
]

const DRAWER_LINKS = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/about', label: 'About Us', icon: '🏛️' },
  { href: '/team', label: 'Team', icon: '👥' },
  { href: '/live-scores', label: 'Live Scores', icon: '⚡' },
  { href: '/gallery', label: 'Gallery', icon: '🖼️' },
  { href: '/notices', label: 'Notices', icon: '📢' },
  { href: '/register', label: 'Register', icon: '📝' },
]

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setDrawerOpen(false) }, [pathname])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return () => unsub()
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  async function handleSignOut() {
    await signOut(auth)
    await fetch('/api/auth/firebase-session', { method: 'DELETE' })
    setDrawerOpen(false)
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: '72px', padding: '0 32px', display: 'flex', alignItems: 'center',
        background: scrolled ? 'rgba(3,10,3,0.95)' : 'rgba(3,10,3,0.5)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderBottom: scrolled ? '1px solid rgba(76,175,80,0.2)' : '1px solid rgba(76,175,80,0.08)',
        transition: 'all 0.4s ease',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '26px', letterSpacing: '0.15em', lineHeight: 1 }}>
              <span style={{ color: 'white' }}>AAGAAZ 2026</span>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(76,175,80,0.75)', marginTop: '1px' }}>
                GLA UNIVERSITY
              </div>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {NAV_LINKS.map(link => {
              const active = pathname === link.href
              return (
                <Link key={link.href} href={link.href} className="nav-link" style={{
                  padding: '9px 18px', fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '13px', fontWeight: '600', letterSpacing: '0.06em',
                  color: active ? '#4CAF50' : 'rgba(255,255,255,0.8)', textDecoration: 'none',
                  borderRadius: '8px', transition: 'all 0.25s ease',
                  background: active ? 'rgba(76,175,80,0.12)' : 'transparent',
                  border: active ? '1px solid rgba(76,175,80,0.3)' : '1px solid transparent',
                }}>
                  {link.label}
                </Link>
              )
            })}

            <Link href="/register" className="nav-register" style={{
              padding: '9px 22px', marginLeft: '8px',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px',
              fontWeight: '700', letterSpacing: '0.08em',
              color: 'black', textDecoration: 'none', borderRadius: '8px',
              background: 'linear-gradient(135deg,#4CAF50,#66BB6A)',
              boxShadow: '0 4px 14px rgba(76,175,80,0.35)', transition: 'all 0.25s ease',
            }}>
              REGISTER
            </Link>

            {/* ☰ — shows user avatar dot if signed in */}
            <button onClick={() => setDrawerOpen(!drawerOpen)} aria-label="Open menu" style={{
              marginLeft: '12px', width: '40px', height: '40px', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: drawerOpen ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.08)',
              border: '1px solid rgba(76,175,80,0.3)', borderRadius: '10px',
              cursor: 'pointer', color: '#4CAF50', fontSize: '18px',
              transition: 'all 0.25s ease', flexShrink: 0,
            }}>
              {drawerOpen ? '✕' : '☰'}
              {/* Green dot indicator when signed in */}
              {user && !drawerOpen && (
                <span style={{
                  position: 'absolute', top: '7px', right: '7px',
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: '#4CAF50', boxShadow: '0 0 6px #4CAF50',
                  border: '1.5px solid rgba(3,10,3,0.8)',
                }} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {drawerOpen && (
        <div onClick={() => setDrawerOpen(false)} style={{
          position: 'fixed', inset: 0, zIndex: 1001,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        }} />
      )}

      {/* Side Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '300px', zIndex: 1002,
        background: 'linear-gradient(180deg, #060e06 0%, #030A03 100%)',
        borderLeft: '1px solid rgba(76,175,80,0.2)',
        boxShadow: '-8px 0 48px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column',
        transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(76,175,80,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '20px', color: '#4CAF50', letterSpacing: '0.15em' }}>
              AAGAAZ 2026
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: 'rgba(165,214,167,0.45)', letterSpacing: '0.15em', marginTop: '2px' }}>
              GLA UNIVERSITY
            </div>
          </div>
          <button onClick={() => setDrawerOpen(false)} style={{
            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(76,175,80,0.2)',
            borderRadius: '8px', width: '34px', height: '34px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(165,214,167,0.7)', fontSize: '15px', cursor: 'pointer',
          }}>✕</button>
        </div>

        {/* User profile section — only when signed in */}
        {user && (
          <div style={{
            padding: '14px 16px',
            borderBottom: '1px solid rgba(76,175,80,0.1)',
            background: 'rgba(76,175,80,0.05)',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            {user.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt="" width={38} height={38}
                style={{ borderRadius: '50%', border: '2px solid rgba(76,175,80,0.45)', flexShrink: 0 }} />
            ) : (
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                background: 'rgba(76,175,80,0.2)', border: '2px solid rgba(76,175,80,0.45)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Bebas Neue',sans-serif", fontSize: '16px', color: '#4CAF50',
              }}>
                {(user.displayName || user.email || '?')[0].toUpperCase()}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: 'white', fontWeight: '600', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.displayName || 'User'}
              </p>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: 'rgba(165,214,167,0.45)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.email}
              </p>
            </div>
            <button onClick={handleSignOut} style={{
              padding: '5px 10px', background: 'transparent', flexShrink: 0,
              border: '1px solid rgba(239,68,68,0.25)', borderRadius: '7px',
              color: 'rgba(239,68,68,0.65)', fontFamily: 'Inter,sans-serif',
              fontSize: '11px', fontWeight: '500', cursor: 'pointer',
            }}>
              Sign out
            </button>
          </div>
        )}

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
          {DRAWER_LINKS.map(link => {
            const active = pathname === link.href
            return (
              <Link key={link.href} href={link.href} onClick={() => setDrawerOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: '12px 14px', marginBottom: '2px',
                borderRadius: '10px', textDecoration: 'none',
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px',
                fontWeight: active ? '700' : '500',
                color: active ? '#4CAF50' : 'rgba(165,214,167,0.75)',
                background: active ? 'rgba(76,175,80,0.12)' : 'transparent',
                borderLeft: active ? '3px solid #4CAF50' : '3px solid transparent',
                transition: 'all 0.2s ease',
              }}>
                <span style={{ fontSize: '17px', width: '22px', textAlign: 'center', flexShrink: 0 }}>{link.icon}</span>
                <span style={{ letterSpacing: '0.04em' }}>{link.label}</span>
                {active && <span style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF50' }} />}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(76,175,80,0.12)' }}>
          {!user && (
            <Link href="/register" onClick={() => setDrawerOpen(false)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '13px', borderRadius: '10px', textDecoration: 'none',
              fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', fontWeight: '700',
              letterSpacing: '0.1em', color: 'black',
              background: 'linear-gradient(135deg,#4CAF50,#66BB6A)',
              boxShadow: '0 4px 20px rgba(76,175,80,0.4)',
              marginBottom: '14px',
            }}>
              🚀 REGISTER NOW
            </Link>
          )}
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(165,214,167,0.25)', textAlign: 'center', margin: 0, letterSpacing: '0.05em' }}>
            © 2026 SSC · GLA University
          </p>
        </div>
      </div>

      <style>{`
        .nav-link:hover { color: #4CAF50 !important; background: rgba(76,175,80,0.08) !important; }
        .nav-register:hover { box-shadow: 0 6px 20px rgba(76,175,80,0.5) !important; transform: translateY(-1px); }
        @media (max-width: 767px) {
          .nav-link { display: none !important; }
          .nav-register { display: none !important; }
        }
      `}</style>
    </>
  )
}
