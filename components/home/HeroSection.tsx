'use client'
import React from 'react'

export function HeroSection() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '85vh',  // Changed from 100vh to 85vh for better spacing
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px 24px 80px',  // ← UPDATED: Less space from navbar
      background: `linear-gradient(
        135deg, 
        rgba(3, 10, 3, 0.92) 0%, 
        rgba(15, 30, 15, 0.85) 50%, 
        rgba(27, 94, 32, 0.75) 100%
      ), url('/images/hero-bg.jpg') center/cover no-repeat`,
      backgroundAttachment: 'fixed',
      overflow: 'hidden',
    }}>
      {/* Vignette overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        maxWidth: '1200px',
      }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 'clamp(4rem, 12vw, 9rem)',
          fontWeight: 900,
          color: 'white',
          letterSpacing: '0.097em',
          lineHeight: '0',
          marginBottom: '2px',
          textShadow: '0 8px 40px rgba(0, 0, 0, 0.8), 0 0 80px rgba(76, 175, 80, 0.3)',
        }}>
          STUDENT SPORTS
        </h1>

        <h2 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 'clamp(3.5rem, 10vw, 8rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #4CAF50 0%, #A5D6A7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.1em',
          lineHeight: '1.1',
          marginBottom: '1px',
          textShadow: '0 0 60px rgba(76, 175, 80, 0.4)',
          filter: 'drop-shadow(0 0 40px rgba(76, 175, 80, 0.5))',
        }}>
          COUNCIL
        </h2>

        <div style={{
          width: '160px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, #4CAF50, transparent)',
          margin: '0 auto 1px',
          boxShadow: '0 0 20px rgba(76, 175, 80, 0.6)',
        }} />

        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(13px, 2vw, 22px)',
          color: 'rgba(165, 214, 167, 0.95)',
          letterSpacing: '0.15em',
          marginBottom: '3px',
          textShadow: '0 2px 12px rgba(0, 0, 0, 0.8)',
        }}>
          GLA UNIVERSITY
        </p>

        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(10px, 1vw, 12px)',
          color: 'rgba(165, 214, 167, 0.7)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '20px',
          textShadow: '0 2px 12px rgba(0, 0, 0, 0.8)',
        }}>
          Scroll to Explore
        </p>

        {/* CTA Button */}
        <a
          href="#events"
          style={{
            display: 'inline-block',
            padding: '18px 48px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '15px',
            fontWeight: 'bold',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'black',
            background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
            borderRadius: '12px',
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)'
            e.currentTarget.style.boxShadow = '0 16px 48px rgba(76, 175, 80, 0.6)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(76, 175, 80, 0.4)'
          }}
        >
          Explore Events
        </a>
      </div>

      {/* Scroll Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'bounce 2s infinite',
      }}>
        <div style={{
          width: '30px',
          height: '50px',
          border: '2px solid rgba(76, 175, 80, 0.5)',
          borderRadius: '15px',
          position: 'relative',
        }}>
          <div style={{
            width: '6px',
            height: '10px',
            background: '#4CAF50',
            borderRadius: '3px',
            position: 'absolute',
            top: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'scroll 1.5s infinite',
          }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes scroll {
          0% { top: 8px; opacity: 1; }
          100% { top: 28px; opacity: 0; }
        }
      `}</style>
    </section>
  )
}
