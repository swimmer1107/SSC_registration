'use client'
import { useState } from 'react'

interface StatCardProps {
  icon: string
  value: number | null
  label: string
  color: string
  index: number
}

export function DashboardStatCard({ icon, value, label, color, index }: StatCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '24px',
        borderRadius: '16px',
        border: `1px solid ${hovered ? color + '60' : color + '30'}`,
        background: hovered
          ? `linear-gradient(135deg, ${color}12 0%, rgba(3,10,3,0.8) 100%)`
          : `linear-gradient(135deg, ${color}08 0%, rgba(3,10,3,0.6) 100%)`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: hovered
          ? `0 12px 40px rgba(0,0,0,0.5), 0 0 20px ${color}20`
          : `0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 ${color}15`,
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        animation: `slideInUp 0.5s cubic-bezier(0,0,0.2,1) ${index * 0.08}s both`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px',
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        borderRadius: '0 0 2px 2px',
      }} />
      <div style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
      <p style={{
        fontFamily: "'Bebas Neue', Impact, sans-serif",
        fontSize: '40px', color, lineHeight: '1', marginBottom: '6px',
        textShadow: `0 0 20px ${color}40`,
      }}>
        {value ?? '—'}
      </p>
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px',
        color: 'rgba(165,214,167,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {label}
      </p>
    </div>
  )
}
