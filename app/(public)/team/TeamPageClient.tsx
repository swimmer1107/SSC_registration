'use client'
import React, { useState, useEffect, useRef } from 'react'

type Member = {
  id: string
  name: string
  role: string
  type: string
  sport: string | null
  imageUrl: string
  email: string | null
  phone: string | null
  bio: string | null
  year: string | null
  course: string | null
  order: number
  isActive: boolean
  createdAt: Date
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function TeamCard({ member, index }: { member: Member; index: number }) {
  const { ref, visible } = useInView()
  const [hovered, setHovered] = useState(false)
  const [imgHovered, setImgHovered] = useState(false)

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '36px 28px 28px',
        borderRadius: '20px',
        border: `1px solid ${hovered ? 'rgba(76,175,80,0.55)' : 'rgba(76,175,80,0.18)'}`,
        background: 'linear-gradient(160deg, rgba(27,94,32,0.1) 0%, rgba(3,10,3,0.8) 100%)',
        backdropFilter: 'blur(12px)',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'all 0.45s cubic-bezier(0.4,0,0.2,1)',
        transform: !visible
          ? 'translateY(50px)'
          : hovered
          ? 'translateY(-10px) scale(1.02)'
          : 'translateY(0) scale(1)',
        opacity: visible ? 1 : 0,
        transitionDelay: visible ? `${index * 80}ms` : '0ms',
        boxShadow: hovered
          ? '0 24px 60px rgba(76,175,80,0.18), 0 0 0 1px rgba(76,175,80,0.2)'
          : '0 4px 20px rgba(0,0,0,0.4)',
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '20%',
        right: '20%',
        height: '3px',
        borderRadius: '0 0 3px 3px',
        background: 'linear-gradient(90deg, transparent, #4CAF50, transparent)',
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity 0.4s ease',
      }} />

      {/* Radial glow overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 0%, rgba(76,175,80,0.1) 0%, transparent 60%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.45s ease',
        pointerEvents: 'none',
      }} />

      {/* Profile Photo */}
      <div
        onMouseEnter={() => setImgHovered(true)}
        onMouseLeave={() => setImgHovered(false)}
        style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          margin: '0 auto 24px',
          border: `4px solid ${imgHovered ? 'rgba(76,175,80,0.7)' : 'rgba(76,175,80,0.3)'}`,
          boxShadow: imgHovered ? '0 0 32px rgba(76,175,80,0.4)' : '0 8px 32px rgba(0,0,0,0.4)',
          backgroundImage: member.imageUrl ? `url(${member.imageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'rgba(76,175,80,0.1)',
          transition: 'all 0.4s ease',
          transform: imgHovered ? 'scale(1.08)' : 'scale(1)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '48px',
        }}
      >
        {!member.imageUrl && '👤'}
      </div>

      {/* Name */}
      <h3 style={{
        fontFamily: "'Bebas Neue', Impact, sans-serif",
        fontSize: '28px',
        color: 'white',
        letterSpacing: '0.05em',
        marginBottom: '8px',
        lineHeight: '1',
      }}>
        {member.name}
      </h3>

      {/* Role + Sport */}
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '15px',
        color: '#4CAF50',
        fontWeight: '600',
        marginBottom: '14px',
        letterSpacing: '0.04em',
      }}>
        {member.role}{member.sport ? ` • ${member.sport}` : ''}
      </p>

      {/* Course & Year badges */}
      {(member.course || member.year) && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '18px',
        }}>
          {member.course && (
            <span style={{
              padding: '5px 14px',
              borderRadius: '9999px',
              background: 'rgba(76,175,80,0.1)',
              border: '1px solid rgba(76,175,80,0.22)',
              fontSize: '12px',
              color: 'rgba(165,214,167,0.85)',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif',
            }}>
              {member.course}
            </span>
          )}
          {member.year && (
            <span style={{
              padding: '5px 14px',
              borderRadius: '9999px',
              background: 'rgba(76,175,80,0.1)',
              border: '1px solid rgba(76,175,80,0.22)',
              fontSize: '12px',
              color: 'rgba(165,214,167,0.85)',
              fontWeight: '600',
              fontFamily: 'Inter, sans-serif',
            }}>
              {member.year}
            </span>
          )}
        </div>
      )}

      {/* Bio */}
      {member.bio && (
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(165,214,167,0.7)',
          lineHeight: '1.65',
          marginBottom: '20px',
          minHeight: '44px',
        }}>
          {member.bio}
        </p>
      )}

      {/* Contact icons */}
      {(member.email || member.phone) && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '14px',
          paddingTop: '18px',
          borderTop: '1px solid rgba(76,175,80,0.15)',
        }}>
          {member.email && (
            <ContactIcon href={`mailto:${member.email}`} emoji="📧" />
          )}
          {member.phone && (
            <ContactIcon href={`tel:${member.phone}`} emoji="📞" />
          )}
        </div>
      )}
    </div>
  )
}

function ContactIcon({ href, emoji }: { href: string; emoji: string }) {
  const [h, setH] = useState(false)
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: h ? 'rgba(76,175,80,0.22)' : 'rgba(76,175,80,0.1)',
        border: '1px solid rgba(76,175,80,0.3)',
        fontSize: '18px',
        transition: 'all 0.3s ease',
        transform: h ? 'scale(1.12)' : 'scale(1)',
        textDecoration: 'none',
      }}
    >
      {emoji}
    </a>
  )
}

function SectionHeader({ title }: { title: string }) {
  const { ref, visible } = useInView(0.2)
  return (
    <div
      ref={ref}
      style={{
        marginBottom: '52px',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }}
    >
      <div style={{
        width: '5px',
        height: '48px',
        borderRadius: '3px',
        background: 'linear-gradient(180deg, #4CAF50, rgba(76,175,80,0.2))',
        boxShadow: '0 0 16px rgba(76,175,80,0.5)',
        flexShrink: 0,
      }} />
      <div>
        <h2 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: 'clamp(2rem, 5vw, 3.4rem)',
          color: 'white',
          letterSpacing: '0.1em',
          lineHeight: '1',
          marginBottom: '6px',
        }}>
          {title}
        </h2>
        <div style={{
          width: '80px',
          height: '3px',
          background: 'linear-gradient(90deg, #4CAF50, rgba(76,175,80,0.1))',
          borderRadius: '2px',
          boxShadow: '0 0 10px rgba(76,175,80,0.4)',
        }} />
      </div>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div style={{
      padding: '80px 40px',
      textAlign: 'center',
      borderRadius: '16px',
      border: '1px solid rgba(76,175,80,0.15)',
      background: 'rgba(27,94,32,0.04)',
    }}>
      <p style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '16px',
        color: 'rgba(165,214,167,0.45)',
      }}>
        {text}
      </p>
    </div>
  )
}

export default function TeamPageClient({
  councilMembers,
  captains,
}: {
  councilMembers: Member[]
  captains: Member[]
}) {
  return (
    <div style={{ background: '#030A03', minHeight: '100vh', paddingTop: '0' }}>

      {/* ─── Hero ─── */}
      <section style={{
        position: 'relative',
        minHeight: '55vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(160deg, rgba(8,18,8,1) 0%, rgba(3,10,3,1) 100%)',
        borderBottom: '1px solid rgba(76,175,80,0.12)',
        overflow: 'hidden',
      }}>
        {/* Grid background */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(76,175,80,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(76,175,80,0.035) 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />
        {/* Centre radial glow */}
        <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%,-50%)', width: '600px', height: '400px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(76,175,80,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to bottom, transparent, #030A03)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '100px 48px 80px', position: 'relative', zIndex: 1, width: '100%' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '60px', alignItems: 'center' }}>

            {/* Left */}
            <div>
              {/* Title */}
              <h1 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 'clamp(3.2rem, 7vw, 6rem)', letterSpacing: '0.05em', lineHeight: '0.95', marginBottom: '22px' }}>
                <span style={{ color: 'white' }}>MEET THE </span>
                <span style={{ background: 'linear-gradient(135deg, #4CAF50 0%, #A5D6A7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>TEAM</span>
              </h1>

              {/* Accent */}
              <div style={{ width: '72px', height: '3px', background: 'linear-gradient(90deg, #4CAF50, rgba(76,175,80,0.15))', borderRadius: '2px', marginBottom: '24px', boxShadow: '0 0 14px rgba(76,175,80,0.45)' }} />

              {/* Description */}
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(14px, 1.5vw, 16px)', color: 'rgba(165,214,167,0.65)', lineHeight: '1.75', maxWidth: '460px', marginBottom: '36px' }}>
                The dedicated council and sports captains who work tirelessly behind the scenes to make AAGAAZ 2026 an unforgettable experience for every athlete.
              </p>

              {/* Mini stats */}
              <div style={{ display: 'flex', gap: '32px' }}>
                {[{ v: 'Council', l: 'Leadership' }, { v: 'Captains', l: 'Per Sport' }].map((s, i) => (
                  <div key={i} style={{ borderLeft: '2px solid rgba(76,175,80,0.25)', paddingLeft: '14px' }}>
                    <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '18px', color: '#4CAF50', letterSpacing: '0.06em', margin: 0 }}>{s.v}</p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(165,214,167,0.4)', letterSpacing: '0.08em', margin: '3px 0 0' }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — sport icons, centered and spaced */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
              {[
                { emoji: '🏏', label: 'Cricket' },
                { emoji: '⚽', label: 'Football' },
                { emoji: '🏀', label: 'Basketball' },
              ].map((s, i) => (
                <div key={i} style={{
                  width: '64px', height: '64px', borderRadius: '16px',
                  background: 'rgba(76,175,80,0.07)',
                  border: '1px solid rgba(76,175,80,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.35)',
                  transform: i === 1 ? 'translateX(20px)' : 'none',
                  opacity: 0.8,
                  transition: 'all 0.3s ease',
                }}>
                  {s.emoji}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ─── Council Leadership ─── */}
      <section style={{
        padding: '90px 24px',
        background: 'linear-gradient(180deg, rgba(3,10,3,1) 0%, rgba(12,25,12,1) 100%)',
      }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <SectionHeader title="COUNCIL LEADERSHIP" />

          {councilMembers.length === 0 ? (
            <EmptyState text="Council members will be announced soon" />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '28px',
            }}>
              {councilMembers.map((m, i) => (
                <TeamCard key={m.id} member={m} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── Sports Captains ─── */}
      <section style={{
        padding: '90px 24px',
        background: 'linear-gradient(180deg, rgba(12,25,12,1) 0%, rgba(3,10,3,1) 100%)',
        borderTop: '1px solid rgba(76,175,80,0.12)',
      }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <SectionHeader title="SPORTS CAPTAINS" />

          {captains.length === 0 ? (
            <EmptyState text="Sports captains will be announced soon" />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '28px',
            }}>
              {captains.map((m, i) => (
                <TeamCard key={m.id} member={m} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
