'use client'
import React from 'react'

export function ContactSection() {
  return (
    <section style={{
      padding: '100px 24px',
      background: 'linear-gradient(180deg, rgba(3,10,3,1) 0%, rgba(15,30,15,1) 100%)',
      borderTop: '1px solid rgba(76,175,80,0.15)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '80px',
          alignItems: 'center',
        }}>
          
          {/* Left Side - Info */}
          <div>
            <div style={{
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: '9999px',
              background: 'rgba(76,175,80,0.1)',
              border: '1px solid rgba(76,175,80,0.3)',
              marginBottom: '24px',
            }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: '#4CAF50',
                letterSpacing: '0.15em',
                fontWeight: '600',
              }}>
                GET IN TOUCH
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: 'clamp(3rem, 8vw, 5rem)',
              color: 'white',
              letterSpacing: '0.08em',
              marginBottom: '16px',
              lineHeight: '1',
            }}>
              CONTACT <span style={{ color: '#4CAF50' }}>US</span>
            </h2>

            <div style={{
              width: '100px',
              height: '4px',
              background: 'linear-gradient(90deg, #4CAF50, transparent)',
              marginBottom: '32px',
              boxShadow: '0 0 16px rgba(76,175,80,0.4)',
            }} />

            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '16px',
              color: 'rgba(165,214,167,0.7)',
              lineHeight: '1.8',
              marginBottom: '48px',
            }}>
              Have questions about AAGAAZ 2026? Our team is here to help you anytime.
            </p>

            {/* Contact Info */}
            <div style={{ display: 'grid', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'rgba(76,175,80,0.1)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}>
                  📧
                </div>
                <div>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '12px',
                    color: 'rgba(165,214,167,0.6)',
                    marginBottom: '4px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    EMAIL US
                  </p>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '16px',
                    color: 'white',
                    fontWeight: '600',
                  }}>
                    ssc@gla.ac.in
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'rgba(76,175,80,0.1)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}>
                  📸
                </div>
                <div>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '12px',
                    color: 'rgba(165,214,167,0.6)',
                    marginBottom: '4px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    FOLLOW US
                  </p>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '16px',
                    color: 'white',
                    fontWeight: '600',
                  }}>
                    @ssc_gla
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'rgba(76,175,80,0.1)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}>
                  📞
                </div>
                <div>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '12px',
                    color: 'rgba(165,214,167,0.6)',
                    marginBottom: '4px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                  }}>
                    CALL US
                  </p>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '16px',
                    color: 'white',
                    fontWeight: '600',
                  }}>
                    +91 98765 43210
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <ContactForm />
        </div>
      </div>
    </section>
  )
}

function ContactForm() {
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    message: '',
  })
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contact/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Failed to send message')
        return
      }

      setSuccess(true)
      setFormData({ fullName: '', email: '', message: '' })

      // Reset success after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (err) {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      padding: '48px',
      borderRadius: '24px',
      border: '1px solid rgba(76,175,80,0.25)',
      background: 'rgba(27,94,32,0.05)',
      backdropFilter: 'blur(20px)',
    }}>
      <h3 style={{
        fontFamily: "'Bebas Neue', Impact, sans-serif",
        fontSize: '28px',
        color: 'white',
        letterSpacing: '0.08em',
        marginBottom: '32px',
      }}>
        WRITE TO US
      </h3>

      {success && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          background: 'rgba(76,175,80,0.15)',
          border: '1px solid rgba(76,175,80,0.4)',
          marginBottom: '24px',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#4CAF50',
          }}>
            ✅ Message sent successfully! We'll get back to you soon.
          </p>
        </div>
      )}

      {error && (
        <div style={{
          padding: '16px 20px',
          borderRadius: '12px',
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.4)',
          marginBottom: '24px',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#ef4444',
          }}>
            ⚠️ {error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '12px',
            color: 'rgba(165,214,167,0.7)',
            marginBottom: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            FULL NAME
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="John Doe"
            style={{
              width: '100%',
              padding: '16px 20px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              color: 'white',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(76,175,80,0.3)',
              borderRadius: '12px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '12px',
            color: 'rgba(165,214,167,0.7)',
            marginBottom: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@example.com"
            style={{
              width: '100%',
              padding: '16px 20px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              color: 'white',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(76,175,80,0.3)',
              borderRadius: '12px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <label style={{
            display: 'block',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '12px',
            color: 'rgba(165,214,167,0.7)',
            marginBottom: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            YOUR MESSAGE
          </label>
          <textarea
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Tell us what's on your mind..."
            style={{
              width: '100%',
              padding: '16px 20px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              color: 'white',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid rgba(76,175,80,0.3)',
              borderRadius: '12px',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '18px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '15px',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            border: 'none',
            borderRadius: '12px',
            background: loading ? 'rgba(76,175,80,0.3)' : 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
            color: loading ? 'rgba(0,0,0,0.5)' : 'black',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(76,175,80,0.3)',
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(76,175,80,0.4)'
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(76,175,80,0.3)'
            }
          }}
        >
          {loading ? '✈️ SENDING...' : '➤ SEND MESSAGE'}
        </button>
      </form>
    </div>
  )
}
