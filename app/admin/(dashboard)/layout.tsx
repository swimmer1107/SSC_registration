'use client'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { canAccessRoute } from '@/lib/auth/permissions'

const navLinks = [
  { label: 'Dashboard',        href: '/admin/dashboard',        icon: '📊' },
  { label: 'Events',           href: '/admin/events',           icon: '🎯' },
  { label: 'Sports',           href: '/admin/sports',           icon: '🏅' },
  { label: 'Registrations',    href: '/admin/registrations',    icon: '📋' },
  { label: 'Fixtures',         href: '/admin/fixtures',         icon: '🏆' },
  { label: 'Live Scores',      href: '/admin/live-scores',      icon: '⚡' },
  { label: 'Results',          href: '/admin/results',          icon: '🥇' },
  { label: 'Certificates',     href: '/admin/certificates',     icon: '📜' },
  { label: 'Gallery',          href: '/admin/gallery',          icon: '🖼️' },
  { label: 'Team',             href: '/admin/team',             icon: '👥' },
  { label: 'Notices',          href: '/admin/notices',          icon: '📢' },
  { label: 'Contact Messages', href: '/admin/contact-messages', icon: '💬' },
  { label: 'Admin Users',      href: '/admin/users',            icon: '🔐' },
]

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    fetch('/api/admin/me')
      .then(r => r.json())
      .then(d => { if (d.admin) setRole(d.admin.role); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Close mobile menu on navigation
  useEffect(() => { setMobileOpen(false) }, [pathname])

  const filteredLinks = navLinks.filter(link => {
    if (loading) return true
    if (!role) return false
    return canAccessRoute(role, link.href)
  })

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(76,175,80,0.1)' }}>
        <a href="/admin/dashboard" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '24px', color: '#4CAF50', letterSpacing: '0.15em', lineHeight: 1 }}>
            SSC ADMIN
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'rgba(165,214,167,0.4)', letterSpacing: '0.2em', marginTop: '2px' }}>
            {role ? role.replace('_', ' ') : 'CONTROL PANEL'}
          </div>
        </a>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {filteredLinks.map(link => {
          const isActive = pathname === link.href
          return (
            <a key={link.href} href={link.href}
              className={`sidebar-link${isActive ? ' active' : ''}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 20px',
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px',
                color: isActive ? '#4CAF50' : 'rgba(165,214,167,0.55)',
                textDecoration: 'none',
                background: isActive ? 'rgba(76,175,80,0.15)' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                borderLeft: isActive ? '3px solid #4CAF50' : '3px solid transparent',
              }}
            >
              <span style={{ fontSize: '15px', width: '20px', textAlign: 'center' }}>{link.icon}</span>
              {link.label}
            </a>
          )
        })}
      </nav>

      {/* Role badge */}
      {role && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(76,175,80,0.1)' }}>
          <div style={{ fontSize: '10px', color: 'rgba(165,214,167,0.4)', marginBottom: '4px', letterSpacing: '1px' }}>LOGGED IN AS</div>
          <div style={{ fontSize: '12px', color: '#4CAF50', fontWeight: 'bold' }}>{role.replace('_', ' ')}</div>
        </div>
      )}

      {/* Logout */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(76,175,80,0.1)' }}>
        <a href="/api/admin/logout" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', color: 'rgba(239,68,68,0.7)', textDecoration: 'none' }}>
          <span>🚪</span> Logout
        </a>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        .sidebar-link { transition: background 0.2s, color 0.2s; }
        .sidebar-link:hover { background: rgba(76,175,80,0.1) !important; color: #A5D6A7 !important; }
        .sidebar-link.active { background: rgba(76,175,80,0.15) !important; color: #4CAF50 !important; }
        aside::-webkit-scrollbar { width: 3px; }
        aside::-webkit-scrollbar-thumb { background: rgba(76,175,80,0.15); border-radius: 10px; }

        /* Desktop: side-by-side layout */
        .admin-shell { display: flex; height: 100vh; overflow: hidden; background: #0a0d14; }
        .admin-sidebar { display: flex; flex-direction: column; width: 250px; flex-shrink: 0; background: #030509; border-right: 1px solid rgba(76,175,80,0.2); height: 100vh; overflow-y: auto; }
        .admin-mobile-header { display: none; }
        .admin-mobile-drawer { display: none; }
        .admin-main { flex: 1; padding: 32px; overflow-y: auto; color: white; min-width: 0; min-height: 0; }

        /* Mobile: stacked layout */
        @media (max-width: 1023px) {
          .admin-shell { flex-direction: column; }
          .admin-sidebar { display: none; }
          .admin-mobile-header {
            display: flex; align-items: center; justify-content: space-between;
            padding: 14px 20px; background: #030509;
            border-bottom: 1px solid rgba(76,175,80,0.2);
            position: sticky; top: 0; z-index: 200;
          }
          .admin-mobile-drawer {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(3,5,9,0.98); backdrop-filter: blur(20px);
            z-index: 300; display: flex; flex-direction: column;
            overflow-y: auto;
          }
          .admin-main { padding: 20px 16px; }
        }
      `}</style>

      <div className="admin-shell">

        {/* Desktop Sidebar */}
        <aside className="admin-sidebar">
          <SidebarContent />
        </aside>

        {/* Mobile Header */}
        <header className="admin-mobile-header">
          <div>
            <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '20px', color: '#4CAF50', letterSpacing: '0.15em' }}>SSC ADMIN</div>
            {role && <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: 'rgba(165,214,167,0.4)', letterSpacing: '0.15em' }}>{role.replace('_', ' ')}</div>}
          </div>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: '#4CAF50', fontSize: '24px', cursor: 'pointer', padding: '8px', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </header>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="admin-mobile-drawer">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid rgba(76,175,80,0.15)' }}>
              <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '20px', color: '#4CAF50', letterSpacing: '0.15em' }}>SSC ADMIN</div>
              <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', color: '#4CAF50', fontSize: '24px', cursor: 'pointer', padding: '8px' }}>✕</button>
            </div>
            <nav style={{ flex: 1, padding: '12px 0' }}>
              {filteredLinks.map(link => {
                const isActive = pathname === link.href
                return (
                  <a key={link.href} href={link.href}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '15px 24px', fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '15px', fontWeight: '600',
                      color: isActive ? '#4CAF50' : 'rgba(165,214,167,0.75)',
                      textDecoration: 'none',
                      background: isActive ? 'rgba(76,175,80,0.15)' : 'transparent',
                      borderLeft: isActive ? '3px solid #4CAF50' : '3px solid transparent',
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{link.icon}</span>
                    {link.label}
                  </a>
                )
              })}
            </nav>
            {role && (
              <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(76,175,80,0.1)' }}>
                <div style={{ fontSize: '10px', color: 'rgba(165,214,167,0.4)', marginBottom: '4px', letterSpacing: '1px' }}>LOGGED IN AS</div>
                <div style={{ fontSize: '13px', color: '#4CAF50', fontWeight: 'bold' }}>{role.replace('_', ' ')}</div>
              </div>
            )}
            <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(76,175,80,0.1)' }}>
              <a href="/api/admin/logout" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0', fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', color: 'rgba(239,68,68,0.8)', textDecoration: 'none' }}>
                <span>🚪</span> Logout
              </a>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="admin-main">
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
