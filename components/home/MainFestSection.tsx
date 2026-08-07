// components/home/MainFestSection.tsx
'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'

const features = [
  { emoji: '🎤', title: 'MEGA PERFORMANCES',
    desc: 'Live concerts and cultural nights featuring top artists from across India.',
    cta: 'See Lineup' },
  { emoji: '🎓', title: 'WORKSHOPS',
    desc: 'Masterclasses by industry experts and veteran athletes.',
    cta: 'View Schedule' },
  { emoji: '🎨', title: 'FESTIVE AMBIENCE',
    desc: 'Immersive themes and artistic installations across the entire campus.',
    cta: 'Explore' },
  { emoji: '🤝', title: 'CULTURAL NETWORKING',
    desc: 'Connect with peers from over 300+ colleges nationwide. Build lifelong bonds.',
    cta: 'Join Community' },
]

export function MainFestSection() {
  return (
    <section style={{
      position: 'relative',
      padding: '6rem 0',
      overflow: 'hidden',
      backgroundImage: 'url(/images/fest-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(3,10,3,0.95) 0%, rgba(10,26,10,0.9) 50%, rgba(3,10,3,0.95) 100%)',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', color: '#4CAF50', letterSpacing: '4px',
            fontSize: '11px', textTransform: 'uppercase', marginBottom: '1rem',
            fontFamily: 'var(--font-space, sans-serif)' }}
        >
          The Biggest Sports Festival
        </motion.p>

        {/* MAIN HEADING — use template literal to avoid JSX color split issues */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '1rem' }}
        >
          <h2 style={{
            fontFamily: 'var(--font-bebas, "Bebas Neue", Impact, sans-serif)',
            fontSize: 'clamp(3rem,8vw,6rem)',
            lineHeight: 1,
            color: 'white',
            letterSpacing: '3px',
            margin: 0,
          }}>
            MAIN FEST :{' '}
            <span style={{ color: '#4CAF50' }}>AAGAAZ 2026</span>
          </h2>
          {/* Green underline */}
          <div style={{ width: '80px', height: '3px', background: '#4CAF50',
            margin: '1rem auto 0' }} />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', color: 'rgba(165,214,167,0.6)',
            maxWidth: '600px', margin: '0 auto 2rem', lineHeight: 1.7,
            fontFamily: 'var(--font-inter, sans-serif)', fontSize: '15px' }}
        >
          We've got more than just sports. Experience a holistic celebration
          of talent, culture, and competitive spirit.
        </motion.p>

        {/* Register button */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <Link href="/register" style={{
            display: 'inline-block',
            padding: '12px 40px',
            border: '2px solid #4CAF50',
            color: '#4CAF50',
            fontFamily: 'var(--font-display, "Bebas Neue", sans-serif)',
            fontSize: '18px',
            letterSpacing: '3px',
            borderRadius: '100px',
            transition: 'all 0.3s',
            textDecoration: 'none',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.background = '#4CAF50'
            el.style.color = 'black'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.background = 'transparent'
            el.style.color = '#4CAF50'
          }}>
            REGISTER FOR EVENTS
          </Link>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(76,175,80,0.2)' }} />
          <p style={{ color: 'rgba(76,175,80,0.5)', fontSize: '10px',
            letterSpacing: '3px', textTransform: 'uppercase', whiteSpace: 'nowrap',
            fontFamily: 'var(--font-space, sans-serif)' }}>
            We've got more than just sports
          </p>
          <div style={{ flex: 1, height: '1px', background: 'rgba(76,175,80,0.2)' }} />
        </div>

        {/* 2×2 CARDS GRID — using inline grid to guarantee it works */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '1.25rem',
        }}>
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              style={{
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(76,175,80,0.2)',
                background: 'rgba(27,94,32,0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
              whileHover={{ y: -6, borderColor: 'rgba(76,175,80,0.5)' }}
            >
              {/* Emoji icon in a circle */}
              <div style={{
                width: '56px', height: '56px', borderRadius: '14px',
                background: 'rgba(76,175,80,0.12)',
                border: '1px solid rgba(76,175,80,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '24px', marginBottom: '1.2rem',
              }}>
                {f.emoji}
              </div>

              <h3 style={{
                fontFamily: 'var(--font-bebas, "Bebas Neue", sans-serif)',
                fontSize: '1.5rem',
                color: 'white',
                letterSpacing: '2px',
                marginBottom: '0.75rem',
              }}>
                {f.title}
              </h3>

              <p style={{
                color: 'rgba(165,214,167,0.55)',
                fontSize: '14px',
                lineHeight: 1.65,
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-inter, sans-serif)',
              }}>
                {f.desc}
              </p>

              <button style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'transparent',
                border: '1px solid rgba(76,175,80,0.3)',
                borderRadius: '100px',
                padding: '8px 20px',
                color: '#4CAF50',
                fontSize: '12px',
                letterSpacing: '2px',
                fontFamily: 'var(--font-space, sans-serif)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                {f.cta} →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
