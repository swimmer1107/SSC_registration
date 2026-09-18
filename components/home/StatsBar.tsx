// components/home/StatsBar.tsx
'use client'
import { useEffect, useRef, useState } from 'react'

const stats = [
  { value: 16,   suffix: '+', label: 'Sports',   icon: '🏅' },
  { value: 5000, suffix: '+', label: 'Athletes', icon: '🏃' },
  { value: 300,  suffix: '+', label: 'Colleges', icon: '🏛️' },
  { value: 12,   suffix: '',  label: 'Events',   icon: '🎯' },
]

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const step = target / 60
        const t = setInterval(() => {
          start = Math.min(start + step, target)
          setN(Math.floor(start))
          if (start >= target) clearInterval(t)
        }, 20)
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{n.toLocaleString('en-US')}{suffix}</span>
}

export function StatsBar() {
  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-item-border { border-right: none !important; border-bottom: 1px solid rgba(76,175,80,0.12) !important; }
        }
      `}</style>
      <div
        className="stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          borderTop: '1px solid rgba(76,175,80,0.15)',
          borderBottom: '1px solid rgba(76,175,80,0.15)',
          background: 'linear-gradient(135deg, rgba(27,94,32,0.08) 0%, rgba(3,10,3,0.6) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="stats-item-border"
            style={{
              padding: 'clamp(20px,4vw,36px) clamp(12px,2vw,24px)',
              textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(76,175,80,0.12)' : 'none',
              transition: 'background 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(76,175,80,0.06)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <div style={{ fontSize: 'clamp(20px,3vw,28px)', marginBottom: '8px', opacity: 0.8 }}>
              {s.icon}
            </div>
            <p style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: '#4CAF50',
              lineHeight: 1,
              margin: 0,
              letterSpacing: '2px',
              textShadow: '0 0 20px rgba(76,175,80,0.3)',
            }}>
              <AnimatedNumber target={s.value} suffix={s.suffix} />
            </p>
            <p style={{
              fontSize: 'clamp(9px,1.5vw,11px)',
              color: 'rgba(165,214,167,0.55)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              marginTop: '8px',
              fontFamily: "'Space Grotesk', sans-serif",
            }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </>
  )
}
