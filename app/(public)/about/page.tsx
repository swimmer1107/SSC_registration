// app/(public)/about/page.tsx
'use client'
import { useState, useEffect, useRef } from 'react'

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [countersStarted, setCountersStarted] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  const slides = [
    { emoji: '🏏', sport: 'Cricket', gradient: 'linear-gradient(135deg, rgba(255,152,0,0.15) 0%, rgba(27,94,32,0.25) 100%)' },
    { emoji: '⚽', sport: 'Football', gradient: 'linear-gradient(135deg, rgba(76,175,80,0.15) 0%, rgba(27,94,32,0.25) 100%)' },
    { emoji: '🏀', sport: 'Basketball', gradient: 'linear-gradient(135deg, rgba(255,87,34,0.15) 0%, rgba(27,94,32,0.25) 100%)' },
    { emoji: '🏐', sport: 'Volleyball', gradient: 'linear-gradient(135deg, rgba(33,150,243,0.15) 0%, rgba(27,94,32,0.25) 100%)' },
    { emoji: '🏃', sport: 'Athletics', gradient: 'linear-gradient(135deg, rgba(156,39,176,0.15) 0%, rgba(27,94,32,0.25) 100%)' },
  ]

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % slides.length), 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !countersStarted) setCountersStarted(true) },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [countersStarted])

  return (
    <div style={{ background: '#030A03', minHeight: '100vh' }}>
      <style>{`
        @media (max-width: 768px) {
          .about-hero-grid { grid-template-columns: 1fr !important; }
          .about-hero-badge { display: none !important; }
          .about-who-grid { grid-template-columns: 1fr !important; }
          .about-who-carousel { height: 260px !important; aspect-ratio: unset !important; }
        }
      `}</style>

      {/* HERO */}
      <section style={{
        position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center',
        backgroundImage: 'url(/images/hero-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(3,10,3,0.97) 0%, rgba(10,30,10,0.9) 50%, rgba(27,94,32,0.75) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '160px', background: 'linear-gradient(to bottom, transparent, #030A03)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 24px 40px', position: 'relative', zIndex: 10, width: '100%' }}>
          <div className="about-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '60px', alignItems: 'center' }}>

            <div>
              <h1 style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                color: 'white', letterSpacing: '0.04em', lineHeight: '1.05', marginBottom: '20px',
                textShadow: '0 4px 40px rgba(0,0,0,0.5)',
              }}>
                MORE THAN<br />
                <span style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #A5D6A7 60%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  A COUNCIL.
                </span>
              </h1>
              <div style={{ width: '80px', height: '4px', background: 'linear-gradient(90deg, #4CAF50, rgba(76,175,80,0.2))', borderRadius: '2px', marginBottom: '24px' }} />
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(14px, 1.8vw, 18px)', color: 'rgba(165,214,167,0.8)', lineHeight: '1.8', maxWidth: '520px', marginBottom: '36px' }}>
                We are the heartbeat of sports at GLA University — building champions, forging bonds, and turning student athletes into legends, one event at a time.
              </p>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {[{ value: '5000+', label: 'Athletes' }, { value: '16+', label: 'Sports' }, { value: '12', label: 'Years' }, { value: '300+', label: 'Colleges' }].map(s => (
                  <div key={s.label} style={{ borderLeft: '2px solid rgba(76,175,80,0.3)', paddingLeft: '14px' }}>
                    <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '28px', color: '#4CAF50', lineHeight: '1', margin: 0 }}>{s.value}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(165,214,167,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '4px 0 0' }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-hero-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '220px', height: '220px', borderRadius: '50%',
                border: '2px solid rgba(76,175,80,0.45)',
                background: 'radial-gradient(circle, rgba(76,175,80,0.18) 0%, rgba(3,10,3,0.85) 70%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 60px rgba(76,175,80,0.2), inset 0 0 40px rgba(76,175,80,0.06)',
                position: 'relative',
              }}>
                <div style={{ position: 'absolute', inset: '-14px', borderRadius: '50%', border: '1px solid rgba(76,175,80,0.15)' }} />
                <div style={{ position: 'absolute', inset: '-28px', borderRadius: '50%', border: '1px solid rgba(76,175,80,0.07)' }} />
                <div style={{ fontSize: '64px', lineHeight: 1, marginBottom: '10px' }}>🏆</div>
                <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '24px', color: '#4CAF50', letterSpacing: '0.2em', margin: 0 }}>AAGAAZ</p>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', color: 'rgba(165,214,167,0.45)', letterSpacing: '0.15em', margin: '6px 0 0' }}>2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="about-who-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: '60px', alignItems: 'center' }}>

            <div className="about-who-carousel" style={{ position: 'relative', aspectRatio: '4/3', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(76,175,80,0.3)', background: 'rgba(27,94,32,0.08)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              {slides.map((slide, i) => (
                <div key={i} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: slide.gradient, opacity: i === currentSlide ? 1 : 0, transition: 'opacity 0.8s ease-in-out' }}>
                  <div style={{ fontSize: '140px', marginBottom: '20px', filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}>{slide.emoji}</div>
                  <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '32px', color: '#4CAF50', letterSpacing: '0.15em' }}>{slide.sport}</p>
                </div>
              ))}
              <div style={{ position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.6)', padding: '10px 18px', borderRadius: '9999px', backdropFilter: 'blur(10px)', border: '1px solid rgba(76,175,80,0.2)' }}>
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)} style={{ width: i === currentSlide ? '32px' : '10px', height: '10px', borderRadius: '5px', border: 'none', background: i === currentSlide ? 'linear-gradient(90deg, #4CAF50, #66BB6A)' : 'rgba(76,175,80,0.3)', cursor: 'pointer', transition: 'all 0.4s ease' }} />
                ))}
              </div>
              <button onClick={() => setCurrentSlide(p => (p - 1 + slides.length) % slides.length)} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', border: '1px solid rgba(76,175,80,0.4)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: '#4CAF50', fontSize: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
              <button onClick={() => setCurrentSlide(p => (p + 1) % slides.length)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', borderRadius: '50%', border: '1px solid rgba(76,175,80,0.4)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)', color: '#4CAF50', fontSize: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
            </div>

            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 'clamp(32px, 5vw, 48px)', color: 'white', letterSpacing: '0.05em', marginBottom: '20px', lineHeight: '1.1' }}>WHO WE ARE</h2>
              <div style={{ width: '60px', height: '3px', background: '#4CAF50', marginBottom: '24px' }} />
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: 'rgba(165,214,167,0.85)', lineHeight: '1.8', marginBottom: '20px' }}>
                The <strong style={{ color: '#4CAF50' }}>Students Sports Council (SSC)</strong> of GLA University serves as the cornerstone of athletic excellence and student engagement in sports.
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: 'rgba(165,214,167,0.85)', lineHeight: '1.8', marginBottom: '20px' }}>
                We organize, manage, and celebrate sports across <strong style={{ color: '#4CAF50' }}>16 disciplines</strong>, from cricket and football to athletics and chess.
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: 'rgba(165,214,167,0.85)', lineHeight: '1.8', marginBottom: '32px' }}>
                <strong style={{ color: '#4CAF50' }}>AAGAAZ</strong>, our flagship annual festival, brings together <strong style={{ color: '#4CAF50' }}>5000+ athletes from 300+ colleges</strong>.
              </p>
              <div style={{ display: 'flex', gap: '24px' }}>
                {[{ value: '5000+', label: 'PARTICIPANTS' }, { value: '16+', label: 'SPORTS' }, { value: '300+', label: 'COLLEGES' }].map((stat, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: '3px solid rgba(76,175,80,0.4)', background: 'rgba(27,94,32,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                      <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '22px', color: '#4CAF50' }}>{stat.value}</span>
                    </div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: 'rgba(165,214,167,0.5)', letterSpacing: '0.12em', fontWeight: '500' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE DO */}
      <section style={{ padding: '80px 24px', background: 'rgba(27,94,32,0.03)', borderTop: '1px solid rgba(76,175,80,0.15)', borderBottom: '1px solid rgba(76,175,80,0.15)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 'clamp(36px, 6vw, 52px)', color: 'white', letterSpacing: '0.08em', marginBottom: '12px' }}>WHAT WE <span style={{ color: '#4CAF50' }}>DO</span></h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'rgba(165,214,167,0.6)' }}>Empowering student athletes through comprehensive sports management</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
            {[
              { icon: '🏆', title: 'Organize Tournaments', desc: 'Plan and execute intra and inter-college sports competitions across all disciplines.' },
              { icon: '📅', title: 'Manage Events', desc: 'Coordinate AAGAAZ and other major sporting events with seamless logistics.' },
              { icon: '👥', title: 'Build Community', desc: 'Foster vibrant sports culture by connecting athletes and building team spirit.' },
              { icon: '🎯', title: 'Athlete Development', desc: 'Provide resources, coaching, and support to help athletes reach their potential.' },
              { icon: '🏅', title: 'Recognition Programs', desc: 'Celebrate excellence through awards, certificates, and showcasing achievements.' },
              { icon: '🤝', title: 'University Liaison', desc: 'Bridge between student athletes and administration for sports matters.' },
            ].map((item, idx) => (
              <div key={idx} style={{ padding: '32px 24px', borderRadius: '16px', border: '1px solid rgba(76,175,80,0.25)', background: 'rgba(27,94,32,0.06)', backdropFilter: 'blur(15px)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '22px', color: '#4CAF50', letterSpacing: '0.08em', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(165,214,167,0.65)', lineHeight: '1.7' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR MISSION */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 'clamp(36px, 6vw, 52px)', color: 'white', letterSpacing: '0.08em', marginBottom: '12px' }}>OUR <span style={{ color: '#4CAF50' }}>MISSION</span></h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'rgba(165,214,167,0.6)' }}>Three pillars that drive everything we do</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {[
              { icon: '🎯', title: 'EXCELLENCE', desc: 'Foster a culture of athletic excellence and competitive spirit. We celebrate victories, big and small.', color: '#4CAF50' },
              { icon: '🤝', title: 'INCLUSIVITY', desc: 'Create opportunities for athletes of all skill levels. Everyone deserves a chance to play.', color: '#66BB6A' },
              { icon: '🏆', title: 'GROWTH', desc: 'Develop leadership, teamwork, and sportsmanship. Sports teach lessons beyond the field.', color: '#81C784' },
            ].map((item, idx) => (
              <div key={idx} style={{ padding: '40px 32px', borderRadius: '20px', border: '1px solid rgba(76,175,80,0.3)', background: 'rgba(27,94,32,0.08)', backdropFilter: 'blur(20px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, transparent, ${item.color}, transparent)` }} />
                <div style={{ fontSize: '56px', marginBottom: '20px' }}>{item.icon}</div>
                <h3 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '28px', color: item.color, letterSpacing: '0.12em', marginBottom: '14px' }}>{item.title}</h3>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(165,214,167,0.7)', lineHeight: '1.8' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BY THE NUMBERS */}
      <section ref={statsRef} style={{ padding: '60px 24px', background: 'linear-gradient(135deg, rgba(27,94,32,0.08) 0%, rgba(3,10,3,1) 100%)', borderTop: '1px solid rgba(76,175,80,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 'clamp(32px, 5vw, 48px)', color: 'white', letterSpacing: '0.08em', marginBottom: '10px' }}>BY THE <span style={{ color: '#4CAF50' }}>NUMBERS</span></h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(165,214,167,0.6)' }}>Our impact speaks louder than words</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '32px', maxWidth: '1100px', margin: '0 auto' }}>
            {[
              { value: 12, suffix: '', label: 'Years of Excellence', duration: 1200 },
              { value: 5000, suffix: '+', label: 'Active Athletes', duration: 2000 },
              { value: 300, suffix: '+', label: 'Partner Colleges', duration: 1800 },
              { value: 16, suffix: '', label: 'Sports Disciplines', duration: 1000 },
              { value: 150, suffix: '+', label: 'Events Annually', duration: 1500 },
              { value: 50, suffix: '+', label: 'Trophies Won', duration: 1300 },
            ].map((stat, idx) => (
              <AnimatedStat key={idx} target={stat.value} suffix={stat.suffix} label={stat.label} duration={stat.duration} start={countersStarted} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function AnimatedStat({ target, suffix, label, duration, start }: { target: number; suffix: string; label: string; duration: number; start: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime: number
    let animationFrame: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) animationFrame = requestAnimationFrame(animate)
      else setCount(target)
    }
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [start, target, duration])

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 'clamp(36px, 5vw, 56px)', color: '#4CAF50', lineHeight: '1', marginBottom: '8px', textShadow: '0 2px 20px rgba(76,175,80,0.3)' }}>
        {count.toLocaleString('en-US')}{suffix}
      </p>
      <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: 'rgba(165,214,167,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: '500' }}>{label}</p>
    </div>
  )
}
