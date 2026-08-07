'use client'

import { useEffect, useState } from 'react'
import { User } from 'firebase/auth'

interface Registration {
  id: string
  registrationId: string
  sport: { name: string; category: string }
  status: string
  paymentStatus: string
  isTeamEvent: boolean
  teamName: string | null
  paymentAmount: number
  transactionId: string | null
  registeredAt: string
  approvedAt: string | null
}

interface StudentData {
  fullName: string
  email: string
  college: string
  course: string
  year: string
}

export default function MyRegistrations({ user }: { user: User }) {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [student, setStudent] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/registrations')
      .then(r => r.json())
      .then(d => { setRegistrations(d.registrations || []); setStudent(d.student || null) })
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <div style={{ width: '28px', height: '28px', border: '2px solid rgba(76,175,80,0.2)', borderTop: '2px solid #4CAF50', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (registrations.length === 0) return (
    <div style={{
      padding: '24px 20px', borderRadius: '16px', textAlign: 'center',
      border: '1px solid rgba(76,175,80,0.12)', background: 'rgba(27,94,32,0.04)',
    }}>
      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '13px', color: 'rgba(165,214,167,0.4)', lineHeight: '1.6' }}>
        No registrations yet.<br/>Submit the form to register.
      </p>
    </div>
  )

  const approved = registrations.filter(r => r.status === 'approved')
  const others   = registrations.filter(r => r.status !== 'approved')

  return (
    <div style={{ marginBottom: '0' }}>
      {/* Section header — hidden, parent sidebar has header */}

      {/* Approved cards */}
      {approved.length > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4CAF50', display: 'inline-block', boxShadow: '0 0 8px #4CAF50' }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#4CAF50', fontWeight: '700', letterSpacing: '0.12em' }}>
              APPROVED — CONFIRMED PARTICIPATION
            </span>
          </div>
          <div style={{ display: 'grid', gap: '16px' }}>
            {approved.map(reg => (
              <ApprovedCard key={reg.id} reg={reg} student={student} />
            ))}
          </div>
        </div>
      )}

      {/* Pending / rejected */}
      {others.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: 'rgba(165,214,167,0.4)', fontWeight: '700', letterSpacing: '0.12em' }}>
              OTHER REGISTRATIONS
            </span>
          </div>
          <div style={{ display: 'grid', gap: '10px' }}>
            {others.map(reg => <PendingCard key={reg.id} reg={reg} />)}
          </div>
        </div>
      )}
    </div>
  )
}

function ApprovedCard({ reg, student }: { reg: Registration; student: StudentData | null }) {
  return (
    <div style={{
      borderRadius: '20px', overflow: 'hidden',
      border: '1px solid rgba(76,175,80,0.35)',
      background: 'linear-gradient(160deg, rgba(10,25,10,0.95) 0%, rgba(3,8,3,0.98) 100%)',
      boxShadow: '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(76,175,80,0.1)',
      position: 'relative',
    }}>
      {/* Top gradient bar */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #4CAF50 0%, #66BB6A 50%, #4CAF50 100%)' }} />

      <div style={{ padding: '24px' }}>
        {/* Status + event type row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            padding: '6px 14px', borderRadius: '9999px',
            background: 'rgba(76,175,80,0.12)', border: '1px solid rgba(76,175,80,0.4)',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4CAF50', display: 'inline-block', boxShadow: '0 0 6px #4CAF50' }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#4CAF50', fontWeight: '700', letterSpacing: '0.08em' }}>APPROVED</span>
          </div>
          <span style={{
            padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '600',
            background: reg.isTeamEvent ? 'rgba(33,150,243,0.12)' : 'rgba(255,152,0,0.12)',
            color: reg.isTeamEvent ? '#2196F3' : '#FF9800',
            border: `1px solid ${reg.isTeamEvent ? 'rgba(33,150,243,0.3)' : 'rgba(255,152,0,0.3)'}`,
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {reg.isTeamEvent ? 'TEAM' : 'INDIVIDUAL'}
          </span>
        </div>

        {/* Sport name */}
        <h3 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: '32px', color: 'white', letterSpacing: '0.06em',
          marginBottom: '4px', lineHeight: '1',
        }}>
          {reg.sport.name}
        </h3>
        {reg.isTeamEvent && reg.teamName && (
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#4CAF50', fontWeight: '600', marginBottom: '18px' }}>
            {reg.teamName}
          </p>
        )}
        {(!reg.isTeamEvent || !reg.teamName) && <div style={{ marginBottom: '18px' }} />}

        {/* Info grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px',
        }}>
          {[
            { label: 'REG ID', value: reg.registrationId, full: true },
            { label: 'STUDENT', value: student?.fullName || '—' },
            { label: 'COLLEGE', value: student?.college || '—' },
            { label: 'COURSE', value: student?.course || '—' },
            { label: 'YEAR', value: student?.year || '—' },
            { label: 'AMOUNT', value: `₹${reg.paymentAmount}` },
          ].map((item, i) => (
            <div key={i} style={{
              gridColumn: item.full ? '1 / -1' : undefined,
              padding: '10px 12px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(76,175,80,0.1)',
            }}>
              <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '9px', color: 'rgba(165,214,167,0.4)', letterSpacing: '0.1em', marginBottom: '4px' }}>
                {item.label}
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'white', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '14px', borderTop: '1px solid rgba(76,175,80,0.1)' }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(165,214,167,0.35)' }}>
            Registered {new Date(reg.registeredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          {reg.approvedAt && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(76,175,80,0.6)', fontWeight: '500' }}>
              ✓ Approved {new Date(reg.approvedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>
          )}
        </div>
      </div>

      {/* Watermark */}
      <div style={{
        position: 'absolute', bottom: '20px', right: '20px',
        fontFamily: "'Bebas Neue', Impact, sans-serif",
        fontSize: '48px', color: 'rgba(76,175,80,0.05)',
        letterSpacing: '0.1em', pointerEvents: 'none', userSelect: 'none', lineHeight: 1,
      }}>
        SSC
      </div>
    </div>
  )
}

function PendingCard({ reg }: { reg: Registration }) {
  const cfg =
    reg.status === 'rejected'
      ? { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)', label: 'Rejected', dot: '#ef4444' }
      : { color: '#FF9800', bg: 'rgba(255,152,0,0.08)', border: 'rgba(255,152,0,0.2)', label: 'Pending Review', dot: '#FF9800' }

  return (
    <div style={{
      padding: '16px 20px', borderRadius: '14px',
      background: cfg.bg, border: `1px solid ${cfg.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
    }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '15px', color: 'white', fontWeight: '600', marginBottom: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {reg.sport.name}{reg.isTeamEvent && reg.teamName ? ` — ${reg.teamName}` : ''}
        </p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(165,214,167,0.45)' }}>
          {reg.registrationId} · ₹{reg.paymentAmount}
        </p>
      </div>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0,
        padding: '6px 14px', borderRadius: '9999px',
        background: `${cfg.color}15`, border: `1px solid ${cfg.border}`,
      }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: cfg.color, fontWeight: '700', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
          {cfg.label.toUpperCase()}
        </span>
      </div>
    </div>
  )
}
