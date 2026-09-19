'use client'
import { useState } from 'react'

interface QuickActionLinkProps {
  href: string
  icon: string
  label: string
  index: number
}

export function QuickActionLink({ href, icon, label, index }: QuickActionLinkProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '14px 18px', borderRadius: '12px',
        border: `1px solid ${hovered ? 'rgba(76,175,80,0.5)' : 'rgba(76,175,80,0.2)'}`,
        background: hovered ? 'rgba(76,175,80,0.15)' : 'rgba(27,94,32,0.08)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px',
        color: hovered ? '#4CAF50' : 'rgba(165,214,167,0.8)',
        textDecoration: 'none',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 24px rgba(76,175,80,0.15)' : 'none',
        animation: `slideInUp 0.4s cubic-bezier(0,0,0.2,1) ${index * 0.06}s both`,
      }}
    >
      <span style={{ fontSize: '18px' }}>{icon}</span>
      {label}
    </a>
  )
}
