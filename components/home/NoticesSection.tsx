'use client'
import React, { useState } from 'react'

type Notice = {
  id: string
  title: string
  message: string
  category: string
  priority: string
  createdAt: Date
}

const priorityConfig = {
  urgent: {
    icon: '🚨',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.1)',
    border: 'rgba(239,68,68,0.3)',
  },
  normal: {
    icon: '📢',
    color: '#FF9800',
    bg: 'rgba(255,152,0,0.1)',
    border: 'rgba(255,152,0,0.3)',
  },
  info: {
    icon: 'ℹ️',
    color: '#2196F3',
    bg: 'rgba(33,150,243,0.1)',
    border: 'rgba(33,150,243,0.3)',
  },
}

function NoticeCard({ notice, index }: { notice: Notice; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const [hovered, setHovered] = useState(false)

  const config =
    priorityConfig[notice.priority as keyof typeof priorityConfig] ||
    priorityConfig.normal

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: '14px',
        border: `2px solid ${hovered ? config.color + '80' : config.border}`,
        background: `linear-gradient(135deg, ${config.bg}, rgba(0,0,0,0.2))`,
        backdropFilter: 'blur(16px)',
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: hovered 
          ? `0 12px 40px ${config.bg}, 0 0 0 1px ${config.color}40` 
          : `0 2px 12px rgba(0,0,0,0.3)`,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '18px 22px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          cursor: 'pointer',
          userSelect: 'none',
          background: expanded ? 'rgba(0,0,0,0.15)' : 'transparent',
          transition: 'background 0.3s ease',
        }}
      >
        {/* Number badge */}
        <div style={{
          minWidth: '42px',
          height: '42px',
          borderRadius: '12px',
          background: `linear-gradient(135deg, ${config.color}25, ${config.color}10)`,
          border: `2px solid ${config.color}60`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: '22px',
          color: config.color,
          flexShrink: 0,
          boxShadow: `0 3px 10px ${config.color}30`,
          fontWeight: 'bold',
        }}>
          {index + 1}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '6px',
          }}>
            <span style={{ 
              fontSize: '16px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
            }}>{config.icon}</span>
            <span style={{
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: `${config.color}20`,
              color: config.color,
              border: `1.5px solid ${config.color}50`,
              fontFamily: "'Space Grotesk', sans-serif",
              boxShadow: `0 2px 6px ${config.color}15`,
            }}>
              {notice.priority}
            </span>
            <span style={{
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '10px',
              fontWeight: '600',
              letterSpacing: '0.06em',
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
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: 'white',
            lineHeight: '1.4',
            fontWeight: '700',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: expanded ? 'normal' : 'nowrap',
            marginBottom: 0,
            letterSpacing: '0.02em',
          }}>
            {notice.title}
          </h3>
        </div>

        {/* Expand arrow */}
        <div style={{
          fontSize: '16px',
          color: config.color,
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          flexShrink: 0,
          opacity: 0.8,
        }}>
          ▼
        </div>
      </div>

      {/* Expanded message */}
      {expanded && (
        <div style={{
          padding: '0 22px 20px 80px',
          animation: 'fadeInDown 0.3s ease',
          borderTop: `1px solid ${config.border}`,
          background: 'rgba(0,0,0,0.2)',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: 'rgba(240,255,240,0.85)',
            lineHeight: '1.7',
            whiteSpace: 'pre-line',
            marginTop: '16px',
            marginBottom: 0,
          }}>
            {notice.message}
          </p>
        </div>
      )}
    </div>
  )
}

type Props = {
  notices: Notice[]
}

export const NoticesSection = ({ notices }: Props) => {
  return (
    <section style={{
      padding: '80px 24px',
      background: 'linear-gradient(180deg, rgba(3,10,3,1) 0%, rgba(8,18,8,1) 50%, rgba(3,10,3,1) 100%)',
      borderTop: '1px solid rgba(76,175,80,0.12)',
      borderBottom: '1px solid rgba(76,175,80,0.12)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '400px',
        background: 'radial-gradient(ellipse, rgba(255,152,0,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Section header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '44px',
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(255,152,0,0.2) 0%, rgba(239,68,68,0.15) 100%)',
            border: '2px solid rgba(255,152,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            flexShrink: 0,
            boxShadow: '0 6px 18px rgba(255,152,0,0.2)',
          }}>
            ⚠️
          </div>

          <div>
            <h2 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              color: 'white',
              letterSpacing: '0.1em',
              lineHeight: '1',
              marginBottom: '10px',
              textShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              IMPORTANT NOTICES
            </h2>
            <div style={{
              width: '100px',
              height: '3px',
              background: 'linear-gradient(90deg, #FF9800, #ef4444, transparent)',
              boxShadow: '0 0 12px rgba(255,152,0,0.5)',
              borderRadius: '2px',
            }} />
          </div>
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
              No notices at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '14px' }}>
            {notices.map((notice, index) => (
              <NoticeCard key={notice.id} notice={notice} index={index} />
            ))}
          </div>
        )}

        {/* View all button */}
        <ViewAllButton />
      </div>
    </section>
  )
}

function ViewAllButton() {
  const [h, setH] = useState(false)
  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <a
        href="/notices"
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 36px',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '0.12em',
          color: h ? '#000' : '#FF9800',
          border: 'none',
          borderRadius: '10px',
          textDecoration: 'none',
          background: h 
            ? 'linear-gradient(135deg, #FF9800, #FF6D00)' 
            : 'rgba(255,152,0,0.1)',
          outline: `2px solid ${h ? 'transparent' : 'rgba(255,152,0,0.4)'}`,
          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: h ? 'translateY(-2px)' : 'translateY(0)',
          boxShadow: h ? '0 8px 24px rgba(255,152,0,0.35)' : 'none',
        }}
      >
        VIEW ALL NOTICES
        <span style={{
          display: 'inline-block',
          transition: 'transform 0.3s ease',
          transform: h ? 'translateX(3px)' : 'translateX(0)',
          fontSize: '14px',
        }}>→</span>
      </a>
    </div>
  )
}
