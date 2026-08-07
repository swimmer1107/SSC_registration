'use client'
import { useState } from 'react'

type Notice = {
  id: string
  title: string
  message: string
  category: string
  priority: string
  createdAt: Date
}

const priorityConfig = {
  urgent: { icon: '🚨', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
  normal: { icon: '📢', color: '#FF9800', bg: 'rgba(255,152,0,0.1)', border: 'rgba(255,152,0,0.3)' },
  info: { icon: 'ℹ️', color: '#2196F3', bg: 'rgba(33,150,243,0.1)', border: 'rgba(33,150,243,0.3)' },
}

function NoticeCard({ notice }: { notice: Notice }) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)
  const config = priorityConfig[notice.priority as keyof typeof priorityConfig] || priorityConfig.info

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '14px',
        border: `2px solid ${hovered ? config.color + '80' : config.border}`,
        background: `linear-gradient(135deg, ${config.bg}, rgba(0,0,0,0.2))`,
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: hovered ? `0 12px 40px ${config.bg}` : `0 2px 12px rgba(0,0,0,0.3)`,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >

      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'start',
          gap: '18px',
          cursor: 'pointer',
          userSelect: 'none',
          background: expanded ? 'rgba(0,0,0,0.15)' : 'transparent',
        }}
      >
        <span style={{ fontSize: '24px', flexShrink: 0, marginTop: '2px' }}>{config.icon}</span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
            <span style={{
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: `${config.color}20`,
              color: config.color,
              border: `1.5px solid ${config.color}50`,
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {notice.priority}
            </span>
            <span style={{
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '600',
              background: 'rgba(76,175,80,0.12)',
              color: '#4CAF50',
              border: '1.5px solid rgba(76,175,80,0.3)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {notice.category}
            </span>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '11px',
              color: 'rgba(165,214,167,0.5)',
              fontWeight: '500',
            }}>
              {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>
          <h3 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '18px',
            color: 'white',
            lineHeight: '1.5',
            fontWeight: '700',
            marginBottom: 0,
          }}>
            {notice.title}
          </h3>
        </div>
        <div style={{
          fontSize: '16px',
          color: config.color,
          transition: 'transform 0.35s ease',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          flexShrink: 0,
          opacity: 0.8,
        }}>
          ▼
        </div>
      </div>

      {expanded && (
        <div style={{
          padding: '0 24px 24px 66px',
          borderTop: `1px solid ${config.border}`,
          background: 'rgba(0,0,0,0.2)',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '15px',
            color: 'rgba(240,255,240,0.85)',
            lineHeight: '1.8',
            whiteSpace: 'pre-line',
            marginTop: '20px',
            marginBottom: 0,
          }}>
            {notice.message}
          </p>
        </div>
      )}
    </div>
  )
}

export default function NoticesPageClient({ notices }: { notices: Notice[] }) {
  return (
    <div style={{
      background: 'linear-gradient(180deg, #030A03, #0a1a0a)',
      minHeight: '100vh',
      padding: '100px 24px 80px',
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-block',
            padding: '8px 24px',
            borderRadius: '9999px',
            background: 'rgba(255,152,0,0.12)',
            border: '1px solid rgba(255,152,0,0.35)',
            marginBottom: '24px',
          }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '13px',
              color: '#FF9800',
              fontWeight: '600',
              letterSpacing: '0.15em',
            }}>
              📢 OFFICIAL NOTICES
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 'clamp(2.5rem, 7vw, 4rem)',
            color: 'white',
            letterSpacing: '0.1em',
            marginBottom: '16px',
          }}>
            IMPORTANT NOTICES
          </h1>

          <div style={{
            width: '140px',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #FF9800, transparent)',
            margin: '0 auto 24px',
            boxShadow: '0 0 20px rgba(255,152,0,0.6)',
          }} />

          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '15px',
            color: 'rgba(165,214,167,0.7)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Stay updated with all announcements, deadlines, and event updates
          </p>
        </div>

        {/* Notices list */}
        {notices.length === 0 ? (
          <div style={{
            padding: '80px 40px',
            textAlign: 'center',
            borderRadius: '16px',
            border: '1px solid rgba(76,175,80,0.15)',
            background: 'rgba(27,94,32,0.03)',
          }}>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '16px',
              color: 'rgba(165,214,167,0.4)',
            }}>
              No notices available at the moment.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {notices.map(notice => (
              <NoticeCard key={notice.id} notice={notice} />
            ))}
          </div>
        )}

        {/* Back button */}
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <a
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.12em',
              color: '#4CAF50',
              border: '2px solid rgba(76,175,80,0.4)',
              borderRadius: '10px',
              textDecoration: 'none',
              background: 'rgba(76,175,80,0.05)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(76,175,80,0.15)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(76,175,80,0.05)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            ← BACK TO HOME
          </a>
        </div>
      </div>
    </div>
  )
}
