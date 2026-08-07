'use client'

import { useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User,
} from 'firebase/auth'
import { auth } from '@/lib/firebase/config'

interface Props {
  children: (user: User, signOut: () => void) => React.ReactNode
}

export default function AuthGate({ children }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          const token = await u.getIdToken()
          await fetch('/api/auth/firebase-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token }),
          })
        } catch { /* non-blocking */ }
      }
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  async function handleGoogleSignIn() {
    setSigningIn(true)
    setError('')
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      await signInWithPopup(auth, provider)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      setError(msg.includes('popup-closed') ? 'Sign-in cancelled.' : 'Sign-in failed. Please try again.')
    } finally {
      setSigningIn(false)
    }
  }

  async function handleSignOut() {
    await signOut(auth)
    await fetch('/api/auth/firebase-session', { method: 'DELETE' })
  }

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '44px', height: '44px', margin: '0 auto 16px',
            border: '3px solid rgba(76,175,80,0.2)',
            borderTop: '3px solid #4CAF50',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', color: 'rgba(165,214,167,0.5)', letterSpacing: '0.05em' }}>
            Loading...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px',
        background: 'linear-gradient(180deg,#030A03,#0a1a0a)',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          {/* Card */}
          <div style={{
            borderRadius: '24px',
            border: '1px solid rgba(76,175,80,0.2)',
            background: 'linear-gradient(160deg, rgba(15,30,15,0.9) 0%, rgba(3,10,3,0.95) 100%)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(76,175,80,0.08)',
            overflow: 'hidden',
          }}>
            {/* Top accent */}
            <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #4CAF50, transparent)' }} />

            <div style={{ padding: '48px 40px' }}>
              {/* Logo / Icon */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '20px',
                  background: 'linear-gradient(135deg, rgba(76,175,80,0.2), rgba(27,94,32,0.1))',
                  border: '2px solid rgba(76,175,80,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px', fontSize: '36px',
                  boxShadow: '0 8px 24px rgba(76,175,80,0.2)',
                }}>
                  🏆
                </div>
                <h1 style={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: '32px', color: 'white', letterSpacing: '0.1em', marginBottom: '8px',
                }}>
                  AAGAAZ 2026
                </h1>
                <p style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '14px',
                  color: 'rgba(165,214,167,0.6)', lineHeight: '1.6',
                }}>
                  Sign in to register for events and track your participation status.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                }}>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#ef4444', margin: 0 }}>
                    ⚠️ {error}
                  </p>
                </div>
              )}

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ flex: 1, height: '1px', background: 'rgba(76,175,80,0.15)' }} />
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(165,214,167,0.35)', letterSpacing: '0.05em' }}>
                  CONTINUE WITH
                </span>
                <div style={{ flex: 1, height: '1px', background: 'rgba(76,175,80,0.15)' }} />
              </div>

              {/* Google Button */}
              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                style={{
                  width: '100%', padding: '14px 20px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  background: signingIn ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.97)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  cursor: signingIn ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif', fontSize: '15px', fontWeight: '600',
                  color: signingIn ? 'rgba(50,50,50,0.5)' : '#1a1a1a',
                  boxShadow: signingIn ? 'none' : '0 4px 20px rgba(0,0,0,0.4)',
                  transition: 'all 0.25s ease',
                  letterSpacing: '0.01em',
                }}
              >
                {!signingIn && (
                  <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {signingIn ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ width: '16px', height: '16px', border: '2px solid #ccc', borderTop: '2px solid #555', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    Signing in...
                  </span>
                ) : 'Sign in with Google'}
              </button>

              <p style={{
                fontFamily: 'Inter, sans-serif', fontSize: '11px',
                color: 'rgba(165,214,167,0.25)', textAlign: 'center',
                marginTop: '20px', lineHeight: '1.7',
              }}>
                By continuing, you agree to our terms of service.<br />
                Your information is kept secure and private.
              </p>
            </div>
          </div>

          {/* Bottom hint */}
          <p style={{
            fontFamily: 'Inter, sans-serif', fontSize: '12px',
            color: 'rgba(165,214,167,0.3)', textAlign: 'center', marginTop: '20px',
          }}>
            Already registered? Sign in to view your registration status.
          </p>
        </div>
      </div>
    )
  }

  // Signed-in — just render children, no user bar here
  return <>{children(user, handleSignOut)}</>
}
