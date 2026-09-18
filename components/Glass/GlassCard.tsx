'use client'
import { useState } from 'react'

interface GlassCardProps {
  children: React.ReactNode
  variant?: 'light' | 'medium' | 'dark'
  border?: 'light' | 'medium' | 'bright'
  glow?: boolean
  hover?: boolean
  animation?: 'slideUp' | 'fadeIn' | 'scaleIn' | 'none'
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
}

export function GlassCard({
  children,
  variant = 'medium',
  border = 'medium',
  glow = false,
  hover = true,
  animation = 'fadeIn',
  className = '',
  style = {},
  onClick,
}: GlassCardProps) {
  const [hovered, setHovered] = useState(false)

  const variantMap = {
    light: 'rgba(27,94,32,0.08)',
    medium: 'rgba(27,94,32,0.12)',
    dark: 'rgba(27,94,32,0.16)',
  }
  const borderMap = {
    light: 'rgba(76,175,80,0.1)',
    medium: 'rgba(76,175,80,0.2)',
    bright: 'rgba(76,175,80,0.4)',
  }
  const animationMap = {
    slideUp: 'slideInUp 0.5s cubic-bezier(0,0,0.2,1) forwards',
    fadeIn: 'fadeIn 0.4s cubic-bezier(0,0,0.2,1) forwards',
    scaleIn: 'scaleIn 0.4s cubic-bezier(0,0,0.2,1) forwards',
    none: 'none',
  }

  return (
    <div
      className={className}
      onClick={onClick}
      onMouseEnter={() => hover && setHovered(true)}
      onMouseLeave={() => hover && setHovered(false)}
      style={{
        background: hovered ? 'rgba(27,94,32,0.18)' : variantMap[variant],
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${hovered ? 'rgba(76,175,80,0.5)' : borderMap[border]}`,
        borderRadius: '16px',
        padding: 'clamp(16px, 4vw, 28px)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        boxShadow: hovered
          ? '0 16px 48px rgba(0,0,0,0.5), 0 0 30px rgba(76,175,80,0.15)'
          : glow
          ? '0 0 20px rgba(76,175,80,0.2), 0 4px 16px rgba(0,0,0,0.4)'
          : '0 4px 16px rgba(0,0,0,0.4)',
        transform: hovered && hover ? 'translateY(-4px)' : 'translateY(0)',
        cursor: onClick ? 'pointer' : 'default',
        animation: animationMap[animation],
        ...style,
      }}
    >
      {children}
    </div>
  )
}
