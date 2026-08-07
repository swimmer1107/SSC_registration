// components/admin/AdminSidebar.tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { label: 'Events',    href: '/admin/events',    icon: '🏆' },
  { label: 'Registrations', href: '/admin/registrations', icon: '📝' },
  { label: 'Sports',    href: '/admin/sports',    icon: '⚽' },
  { label: 'Users',     href: '/admin/users',     icon: '👥' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside style={{
      width: '260px',
      background: '#0D1117',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem',
    }}>
      <div style={{ marginBottom: '3rem', padding: '0 1rem' }}>
        <h2 style={{
          fontFamily: 'var(--font-bebas, sans-serif)',
          fontSize: '1.5rem', color: '#4CAF50',
          letterSpacing: '3px', margin: 0,
        }}>
          SSC ADMIN
        </h2>
        <p style={{
          fontSize: '10px', color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase', letterSpacing: '2px',
          margin: '4px 0 0',
        }}>
          Control Panel
        </p>
      </div>

      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {navItems.map(item => (
            <li key={item.href} style={{ marginBottom: '8px' }}>
              <Link href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 1rem',
                borderRadius: '10px',
                color: pathname === item.href ? 'white' : 'rgba(255,255,255,0.5)',
                background: pathname === item.href ? 'rgba(76,175,80,0.1)' : 'transparent',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <Link href="/" style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: '12px', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          <span>←</span> Back to Site
        </Link>
      </div>
    </aside>
  )
}
