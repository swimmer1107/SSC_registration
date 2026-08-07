'use client'
import React from 'react'

export function CommunitySection() {
  return (
    <section style={{
      padding: '96px 24px',
      background: '#030A03',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: '700px',
        width: '100%',
        padding: '56px 48px',
        borderRadius: '24px',
        border: '1px solid rgba(76,175,80,0.3)',
        background: 'rgba(27,94,32,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        textAlign: 'center',
      }}>
        {/* Heading */}
        <h2 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          color: 'white',
          letterSpacing: '0.05em',
          marginBottom: '16px',
        }}>
          JOIN THE COMMUNITY
        </h2>

        {/* Subtitle */}
        <p style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '16px',
          color: '#4CAF50',
          letterSpacing: '0.1em',
          marginBottom: '12px',
        }}>
          Welcome to AAGAAZ — GLA University's Sports Fest!
        </p>

        {/* Description */}
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '15px',
          color: 'rgba(165,214,167,0.6)',
          lineHeight: '1.7',
          marginBottom: '40px',
        }}>
          Be part of the biggest university sports festival. Get live match scores, event schedules, and exclusive announcements delivered instantly.
        </p>

        {/* Two buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          {/* Instagram Button (CHANGED FROM DOWNLOAD APP) */}
          <a
            href="https://instagram.com/ssc_gla"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 32px',
              border: '2px solid #4CAF50',
              color: '#4CAF50',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '0.1em',
              borderRadius: '9999px',
              textDecoration: 'none',
              background: 'transparent',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4CAF50'
              e.currentTarget.style.color = 'black'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(76,175,80,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#4CAF50'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Instagram icon SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
            Follow on Instagram
          </a>

          {/* WhatsApp Button */}
          <a
            href="https://chat.whatsapp.com/your-group-link"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 32px',
              border: '2px solid #4CAF50',
              color: '#4CAF50',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '0.1em',
              borderRadius: '9999px',
              textDecoration: 'none',
              background: 'transparent',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#4CAF50'
              e.currentTarget.style.color = 'black'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(76,175,80,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#4CAF50'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* WhatsApp icon SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
            WhatsApp Channel
          </a>
        </div>
      </div>
    </section>
  )
}
