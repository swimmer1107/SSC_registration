'use client'
import React from 'react'

export function DynamicEventsSection({ events }: { events: any[] }) {
  return (
    <section id="events" style={{
      padding: '100px 24px',
      background: 'linear-gradient(180deg, rgba(3,10,3,1) 0%, rgba(15,30,15,1) 100%)',
      borderTop: '1px solid rgba(76,175,80,0.15)',
      borderBottom: '1px solid rgba(76,175,80,0.15)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(76,175,80,0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        opacity: 0.3,
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>


          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            color: 'white',
            letterSpacing: '0.08em',
            marginBottom: '20px',
            lineHeight: '1.1',
          }}>
            Sports <span style={{ color: '#4CAF50' }}>EVENTS</span>
          </h2>

          <div style={{
            width: '120px',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #4CAF50, transparent)',
            margin: '0 auto 24px',
            boxShadow: '0 0 20px rgba(76,175,80,0.5)',
          }} />

          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(15px, 2.5vw, 18px)',
            color: 'rgba(165,214,167,0.7)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6',
          }}>
            Compete in prestigious tournaments across multiple sports disciplines
          </p>
        </div>

        {/* Event Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
        }}>
          {events.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              padding: '80px',
              textAlign: 'center',
              color: 'rgba(165,214,167,0.5)',
            }}>
              <p>No tournaments scheduled yet. Check back soon!</p>
            </div>
          ) : (
            events.map((event, i) => (
            <div
              key={event.id || i}
              style={{
                padding: '40px 32px',
                borderRadius: '24px',
                border: '1px solid rgba(76,175,80,0.25)',
                background: event.gradient || 'linear-gradient(135deg, rgba(27,94,32,0.15) 0%, rgba(76,175,80,0.05) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px) scale(1.02)'
                e.currentTarget.style.borderColor = 'rgba(76,175,80,0.6)'
                e.currentTarget.style.boxShadow = '0 24px 64px rgba(76,175,80,0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.borderColor = 'rgba(76,175,80,0.25)'
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)'
              }}
            >
              {/* Hover Glow Effect */}
              <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(76,175,80,0.15) 0%, transparent 70%)',
                opacity: 0,
                transition: 'opacity 0.4s ease',
                pointerEvents: 'none',
              }} />

              {/* Icon */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'rgba(76,175,80,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                marginBottom: '24px',
                border: '1px solid rgba(76,175,80,0.3)',
                boxShadow: '0 4px 16px rgba(76,175,80,0.2)',
              }}>
                {event.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: '32px',
                color: 'white',
                letterSpacing: '0.08em',
                marginBottom: '16px',
                lineHeight: '1.1',
              }}>
                {event.title}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '15px',
                color: 'rgba(165,214,167,0.75)',
                lineHeight: '1.7',
                marginBottom: '24px',
                minHeight: '84px',
              }}>
                {event.description}
              </p>

              {/* Stats */}
              {event.prizePool && event.capacity && (
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '28px',
                }}>
                  <div style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(76,175,80,0.1)',
                    border: '1px solid rgba(76,175,80,0.2)',
                    textAlign: 'center',
                  }}>
                    <p style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '11px',
                      color: 'rgba(165,214,167,0.6)',
                      marginBottom: '4px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}>
                      Prize Pool
                    </p>
                    <p style={{
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: '20px',
                      color: '#4CAF50',
                      letterSpacing: '0.05em',
                    }}>
                      ₹{event.prizePool.toLocaleString('en-US')}
                    </p>
                  </div>

                  <div style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    background: 'rgba(76,175,80,0.1)',
                    border: '1px solid rgba(76,175,80,0.2)',
                    textAlign: 'center',
                  }}>
                    <p style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: '11px',
                      color: 'rgba(165,214,167,0.6)',
                      marginBottom: '4px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}>
                      Capacity
                    </p>
                    <p style={{
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: '20px',
                      color: '#4CAF50',
                      letterSpacing: '0.05em',
                    }}>
                      {event.capacity}
                    </p>
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <a
                href={event.ctaLink}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 28px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  color: '#4CAF50',
                  border: '1px solid rgba(76,175,80,0.4)',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(76,175,80,0.15)'
                  e.currentTarget.style.borderColor = 'rgba(76,175,80,0.6)'
                  e.currentTarget.style.transform = 'translateX(4px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'rgba(76,175,80,0.4)'
                  e.currentTarget.style.transform = 'translateX(0)'
                }}
              >
                {event.ctaText}
                <span style={{ fontSize: '16px' }}>→</span>
              </a>
            </div>
          ))
          )}
        </div>
      </div>
    </section>
  )
}
