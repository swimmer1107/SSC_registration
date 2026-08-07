// components/home/SponsorsSection.tsx
'use client'
import { motion } from 'framer-motion'

// Text-based sponsor placeholders — no broken images
const sponsors = [
  { name: 'Red Bull',    initial: 'RB', color: '#CC0000' },
  { name: 'Nike',        initial: 'NK', color: '#111111' },
  { name: 'Adidas',      initial: 'AD', color: '#000000' },
  { name: 'Gatorade',    initial: 'GT', color: '#F4A100' },
  { name: 'Decathlon',   initial: 'DC', color: '#003087' },
  { name: 'Puma',        initial: 'PM', color: '#1A1A1A' },
]

export function SponsorsSection() {
  return (
    <section style={{ padding: '5rem 0', background: '#0A1A0A' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontFamily: 'var(--font-bebas, sans-serif)',
            fontSize: 'clamp(2rem,5vw,3.5rem)',
            color: 'white', letterSpacing: '6px',
            textAlign: 'center', marginBottom: '0.5rem',
          }}
        >
          EVENT SPONSORS
        </motion.h2>
        <div style={{ width: '60px', height: '3px', background: '#4CAF50',
          margin: '0 auto 3rem' }} />

        <div style={{
          display: 'flex', flexWrap: 'wrap',
          gap: '1.5rem', justifyContent: 'center',
        }}>
          {sponsors.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.08, y: -4 }}
              style={{
                width: '100px', height: '100px',
                borderRadius: '50%',
                background: 'white',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                border: '2px solid rgba(76,175,80,0.1)',
              }}
            >
              <span style={{ fontWeight: 900, fontSize: '1rem',
                color: s.color, letterSpacing: '1px' }}>
                {s.initial}
              </span>
              <span style={{ fontSize: '9px', color: '#555',
                marginTop: '4px', fontWeight: 600 }}>
                {s.name}
              </span>
            </motion.div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(76,175,80,0.4)',
          fontSize: '12px', marginTop: '2.5rem',
          fontFamily: 'var(--font-space, sans-serif)', letterSpacing: '2px' }}>
          INTERESTED IN SPONSORING? CONTACT US AT SSC@GLA.AC.IN
        </p>
      </div>
    </section>
  )
}
