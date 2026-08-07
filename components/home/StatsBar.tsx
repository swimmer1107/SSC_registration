// components/home/StatsBar.tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const stats = [
  { value: 16,   suffix: '+', label: 'Sports' },
  { value: 5000, suffix: '+', label: 'Athletes' },
  { value: 300,  suffix: '+', label: 'Colleges' },
  { value: 12,   suffix: '',  label: 'Events' },
]

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = target / 50
    const t = setInterval(() => {
      start = Math.min(start + step, target)
      setN(Math.floor(start))
      if (start >= target) clearInterval(t)
    }, 30)
    return () => clearInterval(t)
  }, [inView, target])

  return <span ref={ref}>{n}{suffix}</span>
}

export function StatsBar() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      borderTop: '1px solid rgba(76,175,80,0.2)',
      borderBottom: '1px solid rgba(76,175,80,0.2)',
      background: 'rgba(27,94,32,0.06)',
      backdropFilter: 'blur(20px)',
    }}>
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          style={{
            padding: '2rem 1rem',
            textAlign: 'center',
            borderRight: i < 3 ? '1px solid rgba(76,175,80,0.15)' : 'none',
          }}
        >
          <p style={{
            fontFamily: 'var(--font-bebas, "Bebas Neue", Impact, sans-serif)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            color: '#4CAF50',
            lineHeight: 1,
            margin: 0,
            letterSpacing: '2px',
          }}>
            <AnimatedNumber target={s.value} suffix={s.suffix} />
          </p>
          <p style={{
            fontSize: '11px',
            color: 'rgba(165,214,167,0.6)',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginTop: '8px',
            fontFamily: 'var(--font-space, "Space Grotesk", sans-serif)',
          }}>
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  )
}
