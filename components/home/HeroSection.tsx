'use client'
import React from 'react'

export function HeroSection() {
  return (
    <section style={{
      position: 'relative',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px 80px',
      background: `linear-gradient(
        135deg, 
        rgba(3, 10, 3, 0.92) 0%, 
        rgba(15, 30, 15, 0.85) 50%, 
        rgba(27, 94, 32, 0.75) 100%
      ), url('/images/hero-bg.jpg') center/cover no-repeat`,
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
        maxWidth: '900px',
        width: '100%',
        padding: '0 16px',
      }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 'clamp(2.8rem, 10vw, 9rem)',
          fontWeight: 900,
          color: 'white',
          letterSpacing: '0.08em',
          lineHeight: '1.05',
          margin: '0 0 4px 0',
          textShadow: '0 8px 40px rgba(0, 0, 0, 0.8)',
        }}>
          STUDENT SPORTS
        </h1>

        <h2 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 'clamp(2.4rem, 9vw, 8rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #4CAF50 0%, #A5D6A7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '0.1em',
          lineHeight: '1.1',
          margin: '0 0 12px 0',
        }}>
          COUNCIL
        </h2>

        <div style={{
          width: '120px',
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #4CAF50, transparent)',
          margin: '0 auto 16px',
          boxShadow: '0 0 20px rgba(76, 175, 80, 0.6)',
        }} />

        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(12px, 2.5vw, 18px)',
          color: 'rgba(165, 214, 167, 0.95)',
          letterSpacing: '0.15em',
          margin: '0 0 6px 0',
        }}>
          GLA UNIVERSITY
        </p>

        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(10px, 1.5vw, 12px)',
          color: 'rgba(165, 214, 167, 0.6)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin: '0 0 28px 0',
        }}>
          Scroll to Explore
        </p>

        {/* CTA Button */}
        <a
          href="#events"
          style={{
            display: 'inline-block',
            padding: '14px 40px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(12px, 2vw, 15px)',
            fontWeight: 'bold',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'black',
            background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
            borderRadius: '10px',
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(76, 175, 80, 0.4)',
          }}
        >
          Explore Events
        </a>
      </div>

      {/* Scroll Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'bounce 2s infinite',
      }}>
        <div style={{
          width: '28px',
          height: '46px',
          border: '2px solid rgba(76, 175, 80, 0.5)',
          borderRadius: '14px',
          position: 'relative',
        }}>
          <div style={{
            width: '5px',
            height: '9px',
            background: '#4CAF50',
            borderRadius: '3px',
            position: 'absolute',
            top: '7px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'scrolldot 1.5s infinite',
          }} />
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }
        @keyframes scrolldot {
          0% { top: 7px; opacity: 1; }
          100% { top: 26px; opacity: 0; }
        }
      `}</style>
    </section>
  )
}
