'use client'
import { useState } from 'react'

interface GlassButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  style?: React.CSSProperties
}

export function GlassButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  glow = false,
  disabled = false,
  loading = false,
  type = 'button',
  style = {},
}: GlassButtonProps) {
  const [hovered, setHovered] = useState(false)

  const variantStyles = {
    primary: {
      background: hovered
        ? 'linear-gradient(135deg, #66BB6A 0%, #81C784 100%)'
        : 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
      color: '#000',
      border: '1px solid rgba(76,175,80,0.6)',
    },
    secondary: {
      background: hovered ? 'rgba(76,175,80,0.25)' : 'rgba(76,175,80,0.15)',
      color: '#4CAF50',
      border: '1px solid rgba(76,175,80,0.4)',
    },
    tertiary: {
      background: hovered ? 'rgba(27,94,32,0.15)' : 'rgba(27,94,32,0.08)',
      color: 'rgba(165,214,167,0.9)',
      border: '1px solid rgba(76,175,80,0.2)',
    },
  }

  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '13px', minHeight: '36px' },
    md: { padding: '12px 24px', fontSize: '14px', minHeight: '44px' },
    lg: { padding: '14px 32px', fontSize: '15px', minHeight: '50px' },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...variantStyles[variant],
        ...sizeStyles[size],
        borderRadius: '10px',
        fontWeight: '700',
        fontFamily: '"Space Grotesk", sans-serif',
        letterSpacing: '0.06em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        opacity: disabled ? 0.5 : 1,
        boxShadow: hovered && !disabled
          ? glow
            ? '0 0 40px rgba(76,175,80,0.5), 0 8px 24px rgba(0,0,0,0.4)'
            : '0 8px 24px rgba(0,0,0,0.4)'
          : glow
          ? '0 0 20px rgba(76,175,80,0.3), 0 4px 16px rgba(0,0,0,0.3)'
          : '0 4px 16px rgba(0,0,0,0.3)',
        transform: hovered && !disabled ? 'translateY(-2px)' : 'translateY(0)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style,
      }}
    >
      {loading ? (
        <span style={{ animation: 'spinLoader 1s linear infinite', display: 'inline-block' }}>⟳</span>
      ) : children}
    </button>
  )
}
