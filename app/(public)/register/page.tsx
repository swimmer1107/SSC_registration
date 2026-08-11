'use client'

import { useState, useEffect, useCallback } from 'react'
import AuthGate from '@/components/auth/AuthGate'
import MyRegistrations from '@/components/register/MyRegistrations'
import { User } from 'firebase/auth'

interface Sport {
  id: string
  name: string
  category: 'team' | 'individual'
  minTeamSize: number | null
  maxTeamSize: number | null
  registrationFee: number
  description: string | null
  rules: string | null
}

interface TeamMember {
  name: string
  email: string
  phone: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  color: 'white',
  background: 'rgba(0,0,0,0.4)',
  border: '2px solid rgba(76,175,80,0.3)',
  borderRadius: '8px',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '11px',
  color: 'rgba(165,214,167,0.7)',
  marginBottom: '6px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
}

export default function RegisterPage() {
  return (
    <AuthGate>
      {(user: User, signOut: () => void) => <RegisterForm user={user} signOut={signOut} />}
    </AuthGate>
  )
}

function RegisterForm({ user, signOut }: { user: User; signOut: () => void }) {
  const [sports, setSports] = useState<Sport[]>([])
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null)
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    fullName: user.displayName || '',
    email: user.email || '',
    phone: '',
    college: 'GLA University',
    course: '',
    year: '',
    registrationNumber: '',
    gender: '',
    teamName: '',
    teamMembers: [] as TeamMember[],
    transactionId: '',
    agreedToTerms: false,
  })

  useEffect(() => {
    fetch('/api/sports/active')
      .then(r => r.json())
      .then(d => setSports(d.sports || []))
      .catch(() => setError('Failed to load sports. Please refresh.'))
  }, [])

  // Re-init team members when sport changes
  useEffect(() => {
    if (selectedSport?.category === 'team') {
      const min = (selectedSport.minTeamSize || 2) - 1
      setFormData(prev => ({
        ...prev,
        teamName: '',
        teamMembers: Array(min).fill(null).map(() => ({ name: '', email: '', phone: '' })),
      }))
    } else {
      setFormData(prev => ({ ...prev, teamMembers: [], teamName: '' }))
    }
  }, [selectedSport])

  const validateContact = useCallback(async (field: 'email' | 'phone', value: string) => {
    if (!value) {
      setValidationErrors(prev => { const n = { ...prev }; delete n[field]; return n })
      return
    }
    setValidating(true)
    try {
      const res = await fetch('/api/validate/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Pass sportId so duplicate check is per-sport, not global
        body: JSON.stringify({ [field]: value, sportId: selectedSport?.id }),
      })
      const data = await res.json()
      if (data.exists) {
        setValidationErrors(prev => ({ ...prev, [field]: `Already registered for ${selectedSport?.name} with this ${field}.` }))
      } else {
        setValidationErrors(prev => { const n = { ...prev }; delete n[field]; return n })
      }
    } catch { /* allow */ } finally {
      setValidating(false)
    }
  }, [selectedSport])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const members = [...formData.teamMembers]
    members[index][field] = value
    setFormData(prev => ({ ...prev, teamMembers: members }))
  }

  const addMember = () => {
    const max = (selectedSport?.maxTeamSize || 20) - 1
    if (formData.teamMembers.length < max) {
      setFormData(prev => ({ ...prev, teamMembers: [...prev.teamMembers, { name: '', email: '', phone: '' }] }))
    }
  }

  const removeMember = (i: number) => {
    const min = (selectedSport?.minTeamSize || 2) - 1
    if (formData.teamMembers.length > min) {
      setFormData(prev => ({ ...prev, teamMembers: prev.teamMembers.filter((_, idx) => idx !== i) }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSport) { setError('Please select a sport'); return }
    if (validationErrors.email || validationErrors.phone) { setError('Please fix validation errors'); return }
    if (!formData.agreedToTerms) { setError('Please accept terms and conditions'); return }
    if (!formData.transactionId) { setError('Please enter your Transaction ID'); return }

    if (selectedSport.category === 'team') {
      const min = (selectedSport.minTeamSize || 2) - 1
      if (!formData.teamName.trim()) { setError('Please enter a team name'); return }
      if (formData.teamMembers.length < min) { setError(`Please add at least ${min} team members`); return }
      if (formData.teamMembers.some(m => !m.name || !m.email || !m.phone)) {
        setError('Please fill all team member details'); return
      }
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/registrations/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            college: formData.college,
            course: formData.course,
            year: formData.year,
            registrationNumber: formData.registrationNumber,
            gender: formData.gender,
          },
          sportId: selectedSport.id,
          isTeamEvent: selectedSport.category === 'team',
          teamName: formData.teamName || null,
          teamMembers: formData.teamMembers,
          paymentAmount: selectedSport.registrationFee,
          transactionId: formData.transactionId,
        }),
      })
      const data = await res.json()
      if (!data.success) { setError(data.error || 'Registration failed'); return }
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{ background: 'linear-gradient(180deg,#030A03,#0a1a0a)', minHeight: '100vh', padding: '100px 24px 80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '540px', width: '100%', padding: '64px 48px', borderRadius: '24px', border: '2px solid rgba(76,175,80,0.5)', background: 'linear-gradient(135deg,rgba(76,175,80,0.15),rgba(27,94,32,0.08))', textAlign: 'center', boxShadow: '0 24px 64px rgba(76,175,80,0.25)' }}>
          <div style={{ fontSize: '72px', marginBottom: '24px' }}>✅</div>
          <h2 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '40px', color: '#4CAF50', marginBottom: '16px', letterSpacing: '0.1em' }}>REGISTRATION SUBMITTED!</h2>
          <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '15px', color: 'rgba(165,214,167,0.85)', lineHeight: '1.8', marginBottom: '36px' }}>
            Your registration for <strong style={{ color: 'white' }}>{selectedSport?.name}</strong> has been submitted. You&apos;ll receive confirmation once payment is verified.
          </p>
          <a href="/" style={{ display: 'inline-block', padding: '14px 40px', background: 'linear-gradient(135deg,#4CAF50,#66BB6A)', color: 'black', fontFamily: "'Space Grotesk',sans-serif", fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.1em', textDecoration: 'none', borderRadius: '10px' }}>
            🏠 GO TO HOMEPAGE
          </a>
        </div>
      </div>
    )
  }

  // ── Main render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ background: 'linear-gradient(180deg,#030A03,#0a1a0a)', minHeight: '100vh', padding: '70px 24px 80px' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>

        {/* Responsive CSS */}
        <style>{`
          @media (max-width: 1100px) {
            .register-grid { grid-template-columns: 1fr !important; }
            .register-sidebar { display: none !important; }
          }
        `}</style>

        {/* Page header — full width */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: 'clamp(2.8rem,7vw,4.5rem)', color: 'white', letterSpacing: '0.08em', marginBottom: '12px' }}>
            EVENT REGISTRATION
          </h1>
          <div style={{ width: '120px', height: '4px', background: 'linear-gradient(90deg,transparent,#4CAF50,transparent)', margin: '0 auto 16px', boxShadow: '0 0 18px rgba(76,175,80,0.6)' }} />
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '14px', color: 'rgba(165,214,167,0.65)', letterSpacing: '0.05em' }}>
            Select your sport and fill in the details below
          </p>
        </div>

        {/* Two-column layout */}
        <div className="register-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px', alignItems: 'start' }}>

          {/* LEFT — form */}
          <div>

        {/* Error */}
        {error && (
          <div style={{ padding: '14px 20px', borderRadius: '10px', background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.45)', marginBottom: '28px' }}>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '14px', color: '#ef4444', margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {/* Card */}
        <div style={{ padding: '40px', borderRadius: '20px', border: '2px solid rgba(76,175,80,0.25)', background: 'linear-gradient(135deg,rgba(27,94,32,0.08),rgba(15,30,15,0.75))', backdropFilter: 'blur(16px)', boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}>
          <form onSubmit={handleSubmit}>

            {/* ── Sport Selector ── */}
            <div style={{ padding: '24px', borderRadius: '14px', background: 'rgba(76,175,80,0.08)', border: '2px solid rgba(76,175,80,0.25)', marginBottom: '28px' }}>
              <label style={{ ...labelStyle, fontSize: '13px', color: '#4CAF50', marginBottom: '12px' }}>⚽ SELECT SPORT *</label>
              <select
                required
                value={selectedSport?.id || ''}
                onChange={e => setSelectedSport(sports.find(s => s.id === e.target.value) || null)}
                style={{ ...inputStyle, fontSize: '15px' }}
              >
                <option value="">-- Choose a sport --</option>
                {sports.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category === 'team' ? 'Team' : 'Individual'}) — ₹{s.registrationFee}
                  </option>
                ))}
              </select>
              {selectedSport?.description && (
                <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: 'rgba(165,214,167,0.75)', marginTop: '12px', lineHeight: '1.6', margin: '12px 0 0' }}>
                  {selectedSport.description}
                </p>
              )}
            </div>

            {selectedSport && (
              <>
                {/* ── Personal Details ── */}
                <div style={{ padding: '24px', borderRadius: '14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(76,175,80,0.18)', marginBottom: '28px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '20px', color: '#4CAF50', letterSpacing: '0.06em', marginBottom: '20px' }}>👤 PERSONAL DETAILS</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '16px' }}>

                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={labelStyle}>Full Name *</label>
                      <input required type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div>
                      <label style={{ ...labelStyle, color: validationErrors.email ? '#ef4444' : 'rgba(165,214,167,0.7)' }}>
                        Email * {validating && '⏳'}
                      </label>
                      <input
                        required type="email" name="email" placeholder="john@gla.ac.in"
                        value={formData.email} onChange={handleChange}
                        onBlur={e => validateContact('email', e.target.value)}
                        style={{ ...inputStyle, borderColor: validationErrors.email ? 'rgba(239,68,68,0.6)' : 'rgba(76,175,80,0.3)' }}
                      />
                      {validationErrors.email && <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{validationErrors.email}</p>}
                    </div>

                    <div>
                      <label style={{ ...labelStyle, color: validationErrors.phone ? '#ef4444' : 'rgba(165,214,167,0.7)' }}>
                        Phone * {validating && '⏳'}
                      </label>
                      <input
                        required type="tel" name="phone" placeholder="9876543210" pattern="[0-9]{10}"
                        value={formData.phone} onChange={handleChange}
                        onBlur={e => validateContact('phone', e.target.value)}
                        style={{ ...inputStyle, borderColor: validationErrors.phone ? 'rgba(239,68,68,0.6)' : 'rgba(76,175,80,0.3)' }}
                      />
                      {validationErrors.phone && <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: '#ef4444', marginTop: '4px' }}>{validationErrors.phone}</p>}
                    </div>

                    <div>
                      <label style={labelStyle}>Gender *</label>
                      <select required name="gender" value={formData.gender} onChange={handleChange} style={inputStyle}>
                        <option value="">Select...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Course *</label>
                      <select required name="course" value={formData.course} onChange={handleChange} style={inputStyle}>
                        <option value="">Select...</option>
                        <option>B.Tech CSE</option>
                        <option>B.Tech ECE/ME/EE</option>
                        <option>BBA</option><option>MBA</option>
                        <option>BCA</option><option>MCA</option>
                        <option>B.Sc</option><option>B.Com</option>
                        <option>Polytechnic</option><option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Year *</label>
                      <select required name="year" value={formData.year} onChange={handleChange} style={inputStyle}>
                        <option value="">Select...</option>
                        <option>1st Year</option><option>2nd Year</option>
                        <option>3rd Year</option><option>4th Year</option>
                      </select>
                    </div>

                    <div>
                      <label style={labelStyle}>Registration No.</label>
                      <input type="text" name="registrationNumber" placeholder="e.g. 2315000101" value={formData.registrationNumber} onChange={handleChange} style={inputStyle} />
                    </div>

                    <div>
                      <label style={labelStyle}>College / University *</label>
                      <input required type="text" name="college" placeholder="e.g. GLA University" value={formData.college} onChange={handleChange} style={inputStyle} />
                    </div>

                  </div>
                </div>

                {/* ── Team Details ── */}
                {selectedSport.category === 'team' && (
                  <div style={{ padding: '24px', borderRadius: '14px', background: 'rgba(33,150,243,0.07)', border: '1px solid rgba(33,150,243,0.25)', marginBottom: '28px' }}>
                    <h3 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '20px', color: '#2196F3', letterSpacing: '0.06em', marginBottom: '20px' }}>
                      👥 TEAM DETAILS ({selectedSport.minTeamSize}–{selectedSport.maxTeamSize} players)
                    </h3>

                    <div style={{ marginBottom: '20px' }}>
                      <label style={labelStyle}>Team Name *</label>
                      <input required type="text" name="teamName" placeholder="e.g. Thunder Warriors" value={formData.teamName} onChange={handleChange}
                        style={{ ...inputStyle, borderColor: 'rgba(33,150,243,0.4)' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: 'rgba(165,214,167,0.7)' }}>
                        Members (excl. you): {formData.teamMembers.length} / {(selectedSport.maxTeamSize || 20) - 1} max
                      </span>
                      {formData.teamMembers.length < (selectedSport.maxTeamSize || 20) - 1 && (
                        <button type="button" onClick={addMember}
                          style={{ padding: '7px 16px', background: 'rgba(76,175,80,0.15)', color: '#4CAF50', border: '1px solid rgba(76,175,80,0.35)', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
                          + Add Member
                        </button>
                      )}
                    </div>

                    {formData.teamMembers.map((m, i) => (
                      <div key={i} style={{ padding: '16px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(33,150,243,0.18)', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '12px', color: '#2196F3', fontWeight: '600' }}>MEMBER {i + 2}</span>
                          {formData.teamMembers.length > (selectedSport.minTeamSize || 2) - 1 && (
                            <button type="button" onClick={() => removeMember(i)}
                              style={{ padding: '4px 10px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '5px', fontSize: '11px', cursor: 'pointer' }}>
                              Remove
                            </button>
                          )}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '10px' }}>
                          <input required type="text" placeholder="Full Name *" value={m.name} onChange={e => handleMemberChange(i, 'name', e.target.value)}
                            style={{ ...inputStyle, borderColor: 'rgba(33,150,243,0.25)', fontSize: '13px', padding: '10px 14px' }} />
                          <input required type="email" placeholder="Email *" value={m.email} onChange={e => handleMemberChange(i, 'email', e.target.value)}
                            style={{ ...inputStyle, borderColor: 'rgba(33,150,243,0.25)', fontSize: '13px', padding: '10px 14px' }} />
                          <input required type="tel" placeholder="Phone *" pattern="[0-9]{10}" value={m.phone} onChange={e => handleMemberChange(i, 'phone', e.target.value)}
                            style={{ ...inputStyle, borderColor: 'rgba(33,150,243,0.25)', fontSize: '13px', padding: '10px 14px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── Payment ── */}
                <div style={{ padding: '24px', borderRadius: '14px', background: 'rgba(255,152,0,0.07)', border: '1px solid rgba(255,152,0,0.28)', marginBottom: '28px' }}>
                  <h3 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '20px', color: '#FF9800', letterSpacing: '0.06em', marginBottom: '20px' }}>💳 PAYMENT — ₹{selectedSport.registrationFee}</h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px', alignItems: 'start' }}>

                    {/* QR */}
                    <div style={{ padding: '28px', borderRadius: '14px', background: 'white', textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '13px', color: '#000', fontWeight: '600', marginBottom: '16px' }}>
                        Scan to Pay ₹{selectedSport.registrationFee}
                      </p>
                      <div style={{ width: '200px', height: '200px', margin: '0 auto', background: '#f0f0f0', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #ccc', fontSize: '13px', color: '#888' }}>
                        QR Code
                      </div>
                      <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px', color: '#555', marginTop: '12px' }}>UPI: ssc@gla.ac.in</p>
                    </div>

                    {/* Transaction ID */}
                    <div>
                      <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(255,152,0,0.12)', border: '1px solid rgba(255,152,0,0.28)', marginBottom: '18px' }}>
                        <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7', margin: 0 }}>
                          <strong>Steps:</strong><br />
                          1. Scan QR with any UPI app<br />
                          2. Pay ₹{selectedSport.registrationFee}<br />
                          3. Copy the Transaction / UTR ID<br />
                          4. Paste below and submit
                        </p>
                      </div>
                      <label style={labelStyle}>Transaction ID / UTR *</label>
                      <input
                        required type="text" name="transactionId"
                        placeholder="e.g. 123456789012" maxLength={24}
                        value={formData.transactionId} onChange={handleChange}
                        style={{ ...inputStyle, borderColor: 'rgba(255,152,0,0.45)', fontFamily: "'Courier New',monospace", letterSpacing: '0.08em' }}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Terms & Submit ── */}
                <div style={{ padding: '20px', borderRadius: '12px', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(76,175,80,0.18)' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.agreedToTerms}
                      onChange={e => setFormData(prev => ({ ...prev, agreedToTerms: e.target.checked }))}
                      style={{ width: '18px', height: '18px', marginTop: '2px', cursor: 'pointer', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: 'rgba(165,214,167,0.8)', lineHeight: '1.6' }}>
                      I confirm all information is accurate and agree to abide by tournament rules. Registration fee is non-refundable.
                    </span>
                  </label>

                  <button type="submit" disabled={loading || validating}
                    style={{ width: '100%', padding: '16px', fontFamily: "'Space Grotesk',sans-serif", fontSize: '15px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', border: 'none', borderRadius: '10px',
                      background: loading || validating ? 'rgba(76,175,80,0.3)' : 'linear-gradient(135deg,#4CAF50,#66BB6A)',
                      color: loading || validating ? 'rgba(0,0,0,0.4)' : 'black',
                      cursor: loading || validating ? 'not-allowed' : 'pointer',
                      boxShadow: loading || validating ? 'none' : '0 6px 28px rgba(76,175,80,0.4)',
                    }}>
                    {loading ? '⏳ SUBMITTING...' : validating ? '⏳ VALIDATING...' : '🚀 SUBMIT REGISTRATION'}
                  </button>
                </div>
              </>
            )}

          </form>
        </div>
        </div> {/* end left column */}

          {/* RIGHT — My Registrations sidebar */}
          <div className="register-sidebar" style={{ position: 'sticky', top: '90px', minWidth: 0 }}>

            {/* Registrations */}
            <div style={{ marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(76,175,80,0.12)' }}>
              <h3 style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '18px', color: 'white', letterSpacing: '0.08em', margin: 0 }}>
                MY REGISTRATIONS
              </h3>
              <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '11px', color: 'rgba(165,214,167,0.4)', margin: '3px 0 0' }}>
                Your participation status
              </p>
            </div>
            <MyRegistrations user={user} />
          </div>
        </div> {/* end grid */}
      </div>
    </div>
  )
}
