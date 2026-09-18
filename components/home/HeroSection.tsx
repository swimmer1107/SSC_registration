'use client'
import React, { useEffect, useState } from 'react'

export function HeroSection() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setTimeout(() => setMounted(true), 50) }, [])

  return (
    <section style={{
      position: 'relative',
      minHeight: '88vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px 80px',
      background: `linear-gradient(135deg, rgba(3,10,3,0.96) 0%, rgba(15,30,15,0.88) 50%, rgba(27,94,32,0.78) 100%), url('/images/hero-bg.jpg') center/cover no-repeat`,
      overflow: 'hidden',
    }}>
      {/* Animated orbs */}
      <div style={{
        position: 'absolute', width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(76,175,80,0.12) 0%, transparent 70%)',
        borderRadius: '50%', top: '-150px', left: '-100px',
        animation: 'floatUp 8s ease-in-out infinite', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: '350px', height: '350px',
        background: 'radial-gradient(circle, rgba(0,255,136,0.07) 0%, transparent 70%)',
        borderRadius: '50%', bottom: '-80px', right: '-60px',
        animation: 'floatUp 10s ease-in-out infinite 2s', pointerEvents: 'none',
      }} />
      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10, textAlign: 'center',
        maxWidth: '900px', width: '100%', padding: '0 16px',
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(28px)',
        transition: 'opacity 0.8s cubic-bezier(0,0,0.2,1), transform 0.8s cubic-bezier(0,0,0.2,1)',
      }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 'clamp(2.8rem, 10vw, 9rem)',
          fontWeight: 900, color: 'white',
          letterSpacing: '0.08em', lineHeight: '1.05',
          margin: '0 0 4px 0',
          textShadow: '0 4px 40px rgba(0,0,0,0.8), 0 0 60px rgba(76,175,80,0.15)',
        }}>
          STUDENT SPORTS
        </h1>

        <h2 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 'clamp(2.4rem, 9vw, 8rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #4CAF50 0%, #A5D6A7 60%, #00FF88 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          letterSpacing: '0.1em', lineHeight: '1.1',
          margin: '0 0 16px 0',
          filter: 'drop-shadow(0 0 30px rgba(76,175,80,0.4))',
        }}>
          COUNCIL
        </h2>

        {/* Animated divider */}
        <div style={{
          width: '140px', height: '3px',
          background: 'linear-gradient(90deg, transparent, #4CAF50, #00FF88, transparent)',
          margin: '0 auto 20px',
          boxShadow: '0 0 20px rgba(76,175,80,0.7)',
          borderRadius: '2px',
          animation: 'glowPulse 2.5s ease-in-out infinite',
        }} />

        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(12px, 2.5vw, 18px)',
          color: 'rgba(165,214,167,0.95)',
          letterSpacing: '0.15em', margin: '0 0 6px 0',
        }}>
          GLA UNIVERSITY
        </p>
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(10px, 1.5vw, 12px)',
          color: 'rgba(165,214,167,0.45)',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          margin: '0 0 36px 0',
        }}>
          Scroll to Explore
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/register" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: 'clamp(12px,2vw,16px) clamp(28px,4vw,44px)',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(12px, 2vw, 15px)', fontWeight: '700',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'black', textDecoration: 'none', borderRadius: '12px',
            background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
            boxShadow: '0 8px 32px rgba(76,175,80,0.45)',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(76,175,80,0.6)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(76,175,80,0.45)'
          }}>
            🚀 Register Now
          </a>
          <a href="/about" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: 'clamp(12px,2vw,16px) clamp(24px,3vw,36px)',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(12px, 2vw, 15px)', fontWeight: '600',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'rgba(165,214,167,0.9)', textDecoration: 'none', borderRadius: '12px',
            background: 'rgba(27,94,32,0.15)',
            border: '1px solid rgba(76,175,80,0.35)',
            backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.background = 'rgba(76,175,80,0.2)'
            e.currentTarget.style.borderColor = 'rgba(76,175,80,0.6)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.background = 'rgba(27,94,32,0.15)'
            e.currentTarget.style.borderColor = 'rgba(76,175,80,0.35)'
          }}>
            Learn More
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '32px', left: '50%',
        animation: 'bounceScroll 2s ease-in-out infinite',
      }}>
        <div style={{
          width: '28px', height: '46px', borderRadius: '14px',
          border: '2px solid rgba(76,175,80,0.5)',
          position: 'relative',
        }}>
          <div style={{
            width: '5px', height: '9px', background: '#4CAF50',
            borderRadius: '3px', position: 'absolute',
            top: '7px', left: '50%', transform: 'translateX(-50%)',
            animation: 'scrolldot 1.5s infinite',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes scrolldot {
          0% { top: 7px; opacity: 1; }
          100% { top: 26px; opacity: 0; }
        }
      `}</style>
    </section>
  )
}
