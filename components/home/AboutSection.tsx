// components/home/AboutSection.tsx
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800',
    sport: 'Cricket',
    color: '#1B5E20'
  },
  {
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    sport: 'Football',
    color: '#0A3D62'
  },
  {
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=800',
    sport: 'Basketball',
    color: '#7E2F00'
  },
  {
    image: 'https://images.unsplash.com/photo-1626225443592-564506c1341a?auto=format&fit=crop&q=80&w=800',
    sport: 'Badminton',
    color: '#1A237E'
  },
  {
    image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?auto=format&fit=crop&q=80&w=800',
    sport: 'Swimming',
    color: '#006064'
  },
]

const statCircles = [
  { value: '5000+', label: 'Participants' },
  { value: '16+', label: 'Sports' },
  { value: '300+', label: 'Colleges' },
]

export function AboutSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ padding: '6rem 0', background: '#030A03' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
        }}>

          {/* LEFT — Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div style={{
              position: 'relative',
              aspectRatio: '4/3',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid rgba(76,175,80,0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 20px rgba(76,175,80,0.1)',
            }}>
              {slides.map((slide, i) => (
                <div key={i} style={{
                  position: 'absolute', inset: 0,
                  opacity: i === current ? 1 : 0,
                  transition: 'opacity 0.8s ease-in-out',
                }}>
                  <img
                    src={slide.image}
                    alt={slide.sport}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'brightness(0.7) contrast(1.1)',
                    }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.8))',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'flex-end',
                    paddingBottom: '3rem',
                  }}>
                    <p style={{
                      color: '#4CAF50',
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: '2rem',
                      letterSpacing: '4px',
                      textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    }}>
                      {slide.sport}
                    </p>
                  </div>
                </div>
              ))}

              {/* Dot indicators */}
              <div style={{
                position: 'absolute', bottom: '1.5rem', left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex', gap: '8px',
                zIndex: 20,
              }}>
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} style={{
                    width: i === current ? '32px' : '8px',
                    height: '8px',
                    borderRadius: '4px',
                    background: i === current ? '#4CAF50' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    padding: 0,
                  }} />
                ))}
              </div>

              {/* Arrow buttons */}
              {['‹', '›'].map((arrow, j) => (
                <button key={j} onClick={() => setCurrent(c =>
                  j === 0
                    ? (c - 1 + slides.length) % slides.length
                    : (c + 1) % slides.length
                )} style={{
                  position: 'absolute',
                  top: '50%', transform: 'translateY(-50%)',
                  [j === 0 ? 'left' : 'right']: '16px',
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(76,175,80,0.4)',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                  zIndex: 20,
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(76,175,80,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.6)'}
                >
                  {arrow}
                </button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT — Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >


            <h2 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(2.5rem,5vw,4rem)',
              color: 'white', lineHeight: 1, letterSpacing: '2px',
              marginBottom: '16px',
            }}>
              ABOUT <span style={{ color: '#4CAF50' }}>US</span>
            </h2>

            <div style={{ width: '60px', height: '4px', background: '#4CAF50', marginBottom: '2rem' }} />

            <p style={{
              color: 'rgba(165,214,167,0.7)', lineHeight: 1.8,
              marginBottom: '1.2rem', fontFamily: 'Inter, sans-serif', fontSize: '16px'
            }}>
              The Students Sports Council (SSC) of GLA University acts as the vital bridge
              between passionate student athletes and university administration.
              We organize, manage, and celebrate sports across 16+ disciplines.
            </p>

            <p style={{
              color: 'rgba(165,214,167,0.7)', lineHeight: 1.8,
              marginBottom: '3rem', fontFamily: 'Inter, sans-serif', fontSize: '16px'
            }}>
              AAGAAZ — our annual sports festival — brings together 5000+ athletes from 300+
              colleges nationwide for 3 days of competition and unforgettable moments.
            </p>

            {/* Stat circles */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {statCircles.map(s => (
                <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '90px', height: '90px', borderRadius: '50%',
                    border: '2px solid rgba(76,175,80,0.5)',
                    background: 'rgba(76,175,80,0.1)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    marginBottom: '12px',
                    boxShadow: '0 0 20px rgba(76,175,80,0.15)',
                  }}>
                    <span style={{
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: '1.6rem', color: '#4CAF50', lineHeight: 1,
                    }}>
                      {s.value}
                    </span>
                  </div>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '11px', color: 'rgba(165,214,167,0.5)',
                    textTransform: 'uppercase', letterSpacing: '2px',
                  }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
