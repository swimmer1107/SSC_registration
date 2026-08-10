import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth/protectRoute'
import { rolePermissions } from '@/lib/rbac/permissions'

export const dynamic = 'force-dynamic'

// Quick actions per role
const roleQuickActions: Record<string, { label: string; href: string; icon: string }[]> = {
  SUPER_ADMIN: [
    { label: 'View Registrations', href: '/admin/registrations', icon: '📋' },
    { label: 'Generate Fixtures',  href: '/admin/fixtures',      icon: '🏆' },
    { label: 'Update Live Scores', href: '/admin/live-scores',   icon: '⚡' },
    { label: 'Manage Events',      href: '/admin/events',        icon: '🎯' },
    { label: 'Manage Sports',      href: '/admin/sports',        icon: '🏅' },
    { label: 'Admin Users',        href: '/admin/users',         icon: '🔐' },
  ],
  EVENT_MANAGER: [
    { label: 'View Registrations', href: '/admin/registrations', icon: '📋' },
    { label: 'Manage Events',      href: '/admin/events',        icon: '🎯' },
    { label: 'Manage Sports',      href: '/admin/sports',        icon: '🏅' },
    { label: 'Send Notices',       href: '/admin/notices',       icon: '📢' },
  ],
  SCORE_KEEPER: [
    { label: 'Update Live Scores', href: '/admin/live-scores',   icon: '⚡' },
    { label: 'View Results',       href: '/admin/results',       icon: '🥇' },
  ],
  MODERATOR: [
    { label: 'Manage Gallery',     href: '/admin/gallery',       icon: '🖼️' },
    { label: 'Manage Team',        href: '/admin/team',          icon: '👥' },
    { label: 'Send Notices',       href: '/admin/notices',       icon: '📢' },
    { label: 'Contact Messages',   href: '/admin/contact-messages', icon: '💬' },
  ],
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN:   '#ef4444',
  EVENT_MANAGER: '#2196F3',
  SCORE_KEEPER:  '#FF9800',
  MODERATOR:     '#4CAF50',
}

export default async function AdminDashboardPage() {
  const admin = await requireAuth()
  const perms = rolePermissions[admin.role]

  // Fetch only stats the role can see
  const [
    totalRegistrations,
    activeEvents,
    totalSports,
    pendingApprovals,
    recentRegs,
    liveMatches,
  ] = await Promise.all([
    perms.canManageRegistrations ? prisma.registration.count() : Promise.resolve(null),
    perms.canManageEvents        ? prisma.event.count({ where: { status: 'upcoming' } }) : Promise.resolve(null),
    perms.canManageSports        ? prisma.sport.count() : Promise.resolve(null),
    perms.canManageRegistrations ? prisma.registration.count({ where: { status: 'pending' } }) : Promise.resolve(null),
    perms.canManageRegistrations
      ? prisma.registration.findMany({
          take: 5,
          orderBy: { registeredAt: 'desc' },
          include: { student: true, sport: true },
        })
      : Promise.resolve([]),
    perms.canManageLiveScores
      ? prisma.liveScore.count({ where: { status: 'live' } })
      : Promise.resolve(null),
  ])

  const stats = [
    perms.canManageRegistrations && { icon: '📋', value: totalRegistrations, label: 'Total Registrations', color: '#4CAF50' },
    perms.canManageEvents        && { icon: '🎯', value: activeEvents,       label: 'Active Events',        color: '#2196F3' },
    perms.canManageSports        && { icon: '🏅', value: totalSports,        label: 'Sports',               color: '#FF9800' },
    perms.canManageRegistrations && { icon: '⏳', value: pendingApprovals,   label: 'Pending Approvals',    color: (pendingApprovals ?? 0) > 0 ? '#F44336' : '#4CAF50' },
    perms.canManageLiveScores    && { icon: '⚡', value: liveMatches,        label: 'Live Matches',         color: '#ef4444' },
  ].filter(Boolean) as { icon: string; value: number | null; label: string; color: string }[]

  const quickActions = roleQuickActions[admin.role] || []
  const roleColor = roleColors[admin.role] || '#4CAF50'

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: '42px', color: 'white',
            letterSpacing: '0.1em', margin: 0,
          }}>
            DASHBOARD
          </h1>
          <span style={{
            padding: '5px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: '700',
            fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em',
            background: `${roleColor}20`, color: roleColor,
            border: `1px solid ${roleColor}50`,
          }}>
            {admin.role.replace('_', ' ')}
          </span>
        </div>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(165,214,167,0.6)', margin: 0 }}>
          Welcome back, <strong style={{ color: 'rgba(165,214,167,0.9)' }}>{admin.fullName}</strong> · AAGAAZ 2026
        </p>
      </div>

      {/* Stats Grid */}
      {stats.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
          gap: '20px', marginBottom: '40px',
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{
              padding: '24px', borderRadius: '14px',
              border: '1px solid rgba(76,175,80,0.18)',
              background: 'rgba(27,94,32,0.05)',
            }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>{stat.icon}</div>
              <p style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: '38px', color: stat.color, lineHeight: '1', marginBottom: '6px',
              }}>
                {stat.value ?? '—'}
              </p>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px',
                color: 'rgba(165,214,167,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions — role-specific */}
      {quickActions.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: '22px', color: '#4CAF50',
            letterSpacing: '0.1em', marginBottom: '16px',
          }}>
            QUICK ACTIONS
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
          }}>
            {quickActions.map((action) => (
              <a key={action.href} href={action.href} style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '14px 18px', borderRadius: '10px',
                border: '1px solid rgba(76,175,80,0.25)',
                background: 'rgba(27,94,32,0.06)',
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px',
                color: 'rgba(165,214,167,0.8)', textDecoration: 'none',
              }}>
                <span style={{ fontSize: '18px' }}>{action.icon}</span>
                {action.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Recent Registrations — only for roles with access */}
      {perms.canManageRegistrations && (
        <div>
          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: '22px', color: '#4CAF50',
            letterSpacing: '0.1em', marginBottom: '16px',
          }}>
            RECENT REGISTRATIONS
          </h2>
          <div style={{
            borderRadius: '12px', border: '1px solid rgba(76,175,80,0.18)',
            background: 'rgba(27,94,32,0.03)', overflow: 'hidden',
          }}>
            {(recentRegs as any[]).length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(165,214,167,0.4)' }}>
                No registrations yet
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(76,175,80,0.18)', background: 'rgba(27,94,32,0.08)' }}>
                    {['Student', 'Sport', 'Status', 'Date'].map(h => (
                      <th key={h} style={{
                        padding: '14px 20px', textAlign: 'left',
                        fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px',
                        color: 'rgba(165,214,167,0.6)', letterSpacing: '0.06em', textTransform: 'uppercase',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(recentRegs as any[]).map((reg) => (
                    <tr key={reg.id} style={{ borderBottom: '1px solid rgba(76,175,80,0.08)' }}>
                      <td style={{ padding: '14px 20px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'white' }}>{reg.student.fullName}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(165,214,167,0.7)' }}>{reg.sport.name}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                          fontFamily: "'Space Grotesk', sans-serif", textTransform: 'uppercase',
                          background: reg.status === 'approved' ? 'rgba(76,175,80,0.15)' : 'rgba(255,152,0,0.15)',
                          color: reg.status === 'approved' ? '#4CAF50' : '#FF9800',
                        }}>
                          {reg.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(165,214,167,0.5)' }}>
                        {new Date(reg.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Score Keeper specific — live matches info */}
      {perms.canManageLiveScores && !perms.canManageRegistrations && (
        <div style={{ padding: '32px', borderRadius: '14px', border: '1px solid rgba(255,152,0,0.2)', background: 'rgba(255,152,0,0.05)', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', color: 'rgba(165,214,167,0.7)', margin: 0 }}>
            ⚡ Head to <a href="/admin/live-scores" style={{ color: '#FF9800', textDecoration: 'none', fontWeight: '600' }}>Live Scores</a> to update match scores, or <a href="/admin/fixtures" style={{ color: '#FF9800', textDecoration: 'none', fontWeight: '600' }}>Fixtures</a> to view the schedule.
          </p>
        </div>
      )}

      {/* Moderator specific */}
      {perms.canManageGallery && !perms.canManageRegistrations && !perms.canManageLiveScores && (
        <div style={{ padding: '32px', borderRadius: '14px', border: '1px solid rgba(76,175,80,0.2)', background: 'rgba(76,175,80,0.04)', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', color: 'rgba(165,214,167,0.7)', margin: 0 }}>
            📸 Use the quick actions above to manage gallery, team members, notices and contact messages.
          </p>
        </div>
      )}
    </div>
  )
}
