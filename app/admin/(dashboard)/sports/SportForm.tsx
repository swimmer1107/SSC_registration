'use client'

import { useState } from 'react'

const CATEGORIES = [
  { value: 'individual', label: 'Individual', desc: 'One player per registration (100m, Chess, Badminton Singles…)', icon: '🏃' },
  { value: 'team',       label: 'Team',       desc: 'Multiple players per registration (Cricket, Football, Volleyball…)', icon: '👥' },
]

export default function SportForm({ createSport }: { createSport: (formData: FormData) => Promise<void> }) {
  const [category, setCategory] = useState('individual')
  const [showTeamSize, setShowTeamSize] = useState(false)

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(76,175,80,0.25)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '11px',
    color: 'rgba(165,214,167,0.65)',
    marginBottom: '6px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  }

  return (
    <div style={{
      padding: '28px 32px',
      borderRadius: '16px',
      border: '1px solid rgba(76,175,80,0.2)',
      background: 'rgba(27,94,32,0.04)',
      marginBottom: '36px',
    }}>
      <h2 style={{
        fontFamily: "'Bebas Neue', Impact, sans-serif",
        fontSize: '22px', color: 'white',
        letterSpacing: '0.08em', marginBottom: '24px',
      }}>
        ADD NEW SPORT
      </h2>

      <form action={createSport}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>

          {/* Sport Name */}
          <div>
            <label style={labelStyle}>Sport Name *</label>
            <input name="name" required placeholder="e.g. Badminton, Cricket, Chess" style={inputStyle} />
          </div>

          {/* Registration Fee */}
          <div>
            <label style={labelStyle}>Registration Fee (₹) *</label>
            <input name="registrationFee" type="number" required placeholder="500" style={inputStyle} />
          </div>

          {/* Category selector — card style */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Category *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {CATEGORIES.map(cat => (
                <label key={cat.value} style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '14px 16px', borderRadius: '10px', cursor: 'pointer',
                  border: `2px solid ${category === cat.value ? 'rgba(76,175,80,0.6)' : 'rgba(76,175,80,0.18)'}`,
                  background: category === cat.value ? 'rgba(76,175,80,0.1)' : 'rgba(0,0,0,0.2)',
                  transition: 'all 0.2s ease',
                }}>
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={category === cat.value}
                    onChange={() => { setCategory(cat.value); setShowTeamSize(false) }}
                    style={{ display: 'none' }}
                  />
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>{cat.icon}</span>
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', color: category === cat.value ? '#4CAF50' : 'white', fontWeight: '600', margin: 0 }}>
                      {cat.label}
                    </p>
                    <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(165,214,167,0.45)', margin: '3px 0 0', lineHeight: '1.4' }}>
                      {cat.desc}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Team size — optional toggle, only for team sports */}
          {category === 'team' && (
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '14px' }}>
                <div
                  onClick={() => setShowTeamSize(!showTeamSize)}
                  style={{
                    width: '40px', height: '22px', borderRadius: '11px', position: 'relative', cursor: 'pointer', flexShrink: 0,
                    background: showTeamSize ? '#4CAF50' : 'rgba(76,175,80,0.2)',
                    border: '1px solid rgba(76,175,80,0.4)',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '3px',
                    left: showTeamSize ? '20px' : '3px',
                    width: '14px', height: '14px', borderRadius: '50%',
                    background: 'white', transition: 'left 0.2s',
                  }} />
                </div>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(165,214,167,0.75)' }}>
                  Specify team size limits <span style={{ color: 'rgba(165,214,167,0.4)', fontStyle: 'italic' }}>(optional — skip for sports like Badminton Doubles with fixed 2-player teams)</span>
                </span>
              </label>

              {showTeamSize && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={labelStyle}>Min Team Size</label>
                    <input name="minTeamSize" type="number" min={2} placeholder="e.g. 11 for Football" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Max Team Size</label>
                    <input name="maxTeamSize" type="number" min={2} placeholder="e.g. 15 for Football (with subs)" style={inputStyle} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              name="description" rows={2}
              placeholder="Brief description of the sport..."
              style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties}
            />
          </div>

          {/* Rules */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Rules</label>
            <textarea
              name="rules" rows={3}
              placeholder="Competition rules and regulations..."
              style={{ ...inputStyle, resize: 'vertical' } as React.CSSProperties}
            />
          </div>
        </div>

        <button type="submit" style={{
          padding: '12px 28px',
          background: '#4CAF50', color: 'black',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '13px', fontWeight: '700', letterSpacing: '0.1em',
          border: 'none', borderRadius: '8px', cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(76,175,80,0.35)',
        }}>
          + ADD SPORT
        </button>
      </form>
    </div>
  )
}
