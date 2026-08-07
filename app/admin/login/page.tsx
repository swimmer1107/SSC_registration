'use client'
import { useState } from 'react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [attempts, setAttempts] = useState(0)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (attempts >= 5) {
      setError('Too many failed attempts. Please wait before trying again.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!data.success) {
        setAttempts(a => a + 1)
        setError(data.error || 'Invalid credentials')
        setLoading(false)
        return
      }
      window.location.href = '/admin/dashboard'
    } catch {
      setError('Connection error. Please try again.')
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    color: 'white',
    background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(76,175,80,0.25)',
    borderRadius: '10px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#030A03',
      overflow: 'hidden',
    }}>
      {/* Left panel — branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 80px',
        background: 'linear-gradient(160deg, rgba(8,20,8,1) 0%, rgba(27,94,32,0.3) 100%)',
        borderRight: '1px solid rgba(76,175,80,0.12)',
        position: 'relative',
        overflow: 'hidden',
      }} className="login-left">
        {/* Background grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(76,175,80,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(76,175,80,0.04) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none' }} />
        {/* Glow */}
        <div style={{ position: 'absolute', bottom: '-20%', left: '20%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(76,175,80,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '60px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(76,175,80,0.15)', border: '1px solid rgba(76,175,80,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
              🏆
            </div>
            <div>
              <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '22px', color: '#4CAF50', letterSpacing: '0.2em', margin: 0 }}>SSC ADMIN</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(165,214,167,0.4)', letterSpacing: '0.1em', margin: 0 }}>GLA UNIVERSITY</p>
            </div>
          </div>

          <h1 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: 'clamp(2.5rem, 4vw, 3.8rem)', color: 'white', letterSpacing: '0.06em', lineHeight: '1.05', marginBottom: '20px' }}>
            AAGAAZ 2026<br />
            <span style={{ background: 'linear-gradient(135deg, #4CAF50, #A5D6A7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CONTROL PANEL</span>
          </h1>

          <div style={{ width: '64px', height: '3px', background: 'linear-gradient(90deg, #4CAF50, rgba(76,175,80,0.1))', borderRadius: '2px', marginBottom: '24px' }} />

          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'rgba(165,214,167,0.6)', lineHeight: '1.7', maxWidth: '380px', marginBottom: '48px' }}>
            Manage registrations, fixtures, live scores, and all sporting events from one secure dashboard.
          </p>

          {/* Security badges */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', text: 'HTTPS Encrypted' },
              { icon: '🛡️', text: 'Role-Based Access' },
              { icon: '⚡', text: 'Session Protected' },
            ].map((b, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '7px',
                padding: '7px 14px', borderRadius: '9999px',
                background: 'rgba(76,175,80,0.07)', border: '1px solid rgba(76,175,80,0.2)',
              }}>
                <span style={{ fontSize: '13px' }}>{b.icon}</span>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(165,214,167,0.6)', fontWeight: '500', letterSpacing: '0.04em' }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={{
        width: '460px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
        background: 'rgba(3,5,3,0.95)',
      }} className="login-right">

        <div style={{ marginBottom: '36px' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '28px', color: 'white', letterSpacing: '0.08em', marginBottom: '8px' }}>
            SIGN IN
          </h2>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(165,214,167,0.45)' }}>
            Enter your admin credentials to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px', marginBottom: '24px',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.35)',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '16px' }}>⚠️</span>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#ef4444', margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Attempt warning */}
        {attempts > 0 && attempts < 5 && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', background: 'rgba(255,152,0,0.08)', border: '1px solid rgba(255,152,0,0.25)' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,152,0,0.8)', margin: 0 }}>
              ⚠️ {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining before lockout
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} autoComplete="off">
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: 'rgba(165,214,167,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="admin@gla.ac.in"
              style={inputStyle}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(76,175,80,0.55)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(76,175,80,0.25)'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: 'rgba(165,214,167,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={{ ...inputStyle, paddingRight: '48px' }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(76,175,80,0.55)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(76,175,80,0.25)'}
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '16px', color: 'rgba(165,214,167,0.4)', padding: '4px',
              }}>
                {showPwd ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || attempts >= 5}
            style={{
              width: '100%', padding: '15px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px', fontWeight: '700', letterSpacing: '0.12em',
              textTransform: 'uppercase', border: 'none', borderRadius: '10px',
              background: loading || attempts >= 5 ? 'rgba(76,175,80,0.2)' : 'linear-gradient(135deg,#4CAF50,#66BB6A)',
              color: loading || attempts >= 5 ? 'rgba(0,0,0,0.3)' : 'black',
              cursor: loading || attempts >= 5 ? 'not-allowed' : 'pointer',
              boxShadow: loading || attempts >= 5 ? 'none' : '0 4px 20px rgba(76,175,80,0.4)',
              transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}
          >
            {loading ? (
              <>
                <span style={{ width: '14px', height: '14px', border: '2px solid rgba(0,0,0,0.3)', borderTop: '2px solid rgba(0,0,0,0.7)', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                SIGNING IN...
              </>
            ) : attempts >= 5 ? '🔒 LOCKED' : '🔐 SIGN IN'}
          </button>
        </form>

        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(165,214,167,0.25)', textAlign: 'center', marginTop: '32px', lineHeight: '1.6' }}>
          Authorized personnel only. All login attempts are logged.<br />
          © 2026 Students Sports Council, GLA University
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .login-left { display: none !important; }
          .login-right { width: 100% !important; }
        }
      `}</style>
    </div>
  )
}
