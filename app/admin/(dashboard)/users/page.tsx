'use client'

import { useState, useEffect } from 'react'

interface AdminUser {
  id: string
  email: string
  fullName: string
  role: 'SUPER_ADMIN' | 'EVENT_MANAGER' | 'SCORE_KEEPER' | 'MODERATOR'
  isActive: boolean
  createdAt: string
}

const roleColors: Record<string, { bg: string; color: string; border: string }> = {
  SUPER_ADMIN:    { bg: 'rgba(239,68,68,0.15)',   color: '#ef4444',  border: 'rgba(239,68,68,0.35)' },
  EVENT_MANAGER:  { bg: 'rgba(33,150,243,0.15)',  color: '#2196F3',  border: 'rgba(33,150,243,0.35)' },
  SCORE_KEEPER:   { bg: 'rgba(255,152,0,0.15)',   color: '#FF9800',  border: 'rgba(255,152,0,0.35)' },
  MODERATOR:      { bg: 'rgba(76,175,80,0.15)',   color: '#4CAF50',  border: 'rgba(76,175,80,0.35)' },
}

const roleDescriptions: Record<string, string> = {
  SUPER_ADMIN:   'Full access to all features including admin management',
  EVENT_MANAGER: 'Manage events, sports, registrations, fixtures & notices',
  SCORE_KEEPER:  'Update live scores and manage results',
  MODERATOR:     'Manage gallery, team, notices & contact messages',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: 'rgba(0,0,0,0.35)',
  border: '1px solid rgba(76,175,80,0.25)',
  borderRadius: '8px',
  color: 'white',
  fontSize: '14px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '11px',
  color: 'rgba(165,214,167,0.65)',
  marginBottom: '6px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
}

export default function AdminUsersPage() {
  const [users, setUsers]   = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)
  const [msg, setMsg]       = useState('')
  const [msgType, setMsgType] = useState<'success' | 'error'>('success')

  const [form, setForm] = useState({
    email: '', fullName: '', password: '',
    role: 'EVENT_MANAGER' as AdminUser['role'],
  })

  useEffect(() => { fetchUsers() }, [])

  async function fetchUsers() {
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      if (data.users) setUsers(data.users)
    } catch { /* ignore */ }
  }

  function flash(message: string, type: 'success' | 'error' = 'success') {
    setMsg(message); setMsgType(type)
    setTimeout(() => setMsg(''), 4000)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        flash('Admin user created successfully!')
        setForm({ email: '', fullName: '', password: '', role: 'EVENT_MANAGER' })
        fetchUsers()
      } else {
        flash(data.error || 'Failed to create user', 'error')
      }
    } catch {
      flash('An error occurred', 'error')
    } finally {
      setLoading(false)
    }
  }

  async function handleToggle(id: string) {
    const res = await fetch(`/api/admin/users/${id}/toggle`, { method: 'POST' })
    const data = await res.json()
    if (data.success) fetchUsers()
    else flash('Failed to toggle status', 'error')
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete admin user "${name}"? This cannot be undone.`)) return
    const res = await fetch(`/api/admin/users/${id}/delete`, { method: 'POST' })
    const data = await res.json()
    if (data.success) { flash('User deleted'); fetchUsers() }
    else flash(data.error || 'Failed to delete', 'error')
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: '42px', color: '#4CAF50',
          letterSpacing: '0.1em', marginBottom: '6px',
        }}>
          MANAGE ADMIN USERS
        </h1>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(165,214,167,0.55)' }}>
          Create and manage admin accounts with role-based access control
        </p>
      </div>

      {/* Flash message */}
      {msg && (
        <div style={{
          padding: '14px 20px', borderRadius: '10px', marginBottom: '24px',
          background: msgType === 'success' ? 'rgba(76,175,80,0.15)' : 'rgba(239,68,68,0.15)',
          border: `1px solid ${msgType === 'success' ? 'rgba(76,175,80,0.4)' : 'rgba(239,68,68,0.4)'}`,
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', margin: 0,
            color: msgType === 'success' ? '#4CAF50' : '#ef4444' }}>
            {msgType === 'success' ? '✅' : '⚠️'} {msg}
          </p>
        </div>
      )}

      {/* Role legend */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '12px', marginBottom: '36px',
      }}>
        {Object.entries(roleDescriptions).map(([role, desc]) => {
          const c = roleColors[role]
          return (
            <div key={role} style={{
              padding: '14px 16px', borderRadius: '10px',
              background: c.bg, border: `1px solid ${c.border}`,
            }}>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px',
                fontWeight: '700', color: c.color, letterSpacing: '0.08em',
                display: 'block', marginBottom: '4px',
              }}>
                {role.replace('_', ' ')}
              </span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(165,214,167,0.65)' }}>
                {desc}
              </span>
            </div>
          )
        })}
      </div>

      {/* Create form */}
      <div style={{
        padding: '28px', borderRadius: '16px',
        border: '1px solid rgba(76,175,80,0.2)',
        background: 'rgba(27,94,32,0.05)', marginBottom: '36px',
      }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '22px',
          color: 'white', letterSpacing: '0.06em', marginBottom: '22px',
        }}>
          ADD NEW ADMIN
        </h2>

        <form onSubmit={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input required type="text" placeholder="John Doe"
                value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input required type="email" placeholder="admin@gla.ac.in"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Password *</label>
              <input required type="password" placeholder="••••••••" minLength={6}
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Role *</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as AdminUser['role'] })}
                style={inputStyle}>
                <option value="EVENT_MANAGER">Event Manager</option>
                <option value="SCORE_KEEPER">Score Keeper</option>
                <option value="MODERATOR">Moderator</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </select>
            </div>
          </div>

          {/* Role description hint */}
          <div style={{
            padding: '10px 14px', borderRadius: '8px', marginBottom: '18px',
            background: `${roleColors[form.role].bg}`,
            border: `1px solid ${roleColors[form.role].border}`,
          }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(255,255,255,0.75)', margin: 0 }}>
              <span style={{ color: roleColors[form.role].color, fontWeight: '600' }}>{form.role.replace('_', ' ')}: </span>
              {roleDescriptions[form.role]}
            </p>
          </div>

          <button type="submit" disabled={loading} style={{
            padding: '12px 28px',
            background: loading ? 'rgba(76,175,80,0.3)' : '#4CAF50',
            color: loading ? 'rgba(0,0,0,0.4)' : 'black',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.1em',
            border: 'none', borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'CREATING...' : '+ CREATE ADMIN USER'}
          </button>
        </form>
      </div>

      {/* Users table */}
      <div style={{ borderRadius: '14px', border: '1px solid rgba(76,175,80,0.18)', overflow: 'hidden' }}>
        <div style={{
          padding: '16px 24px',
          background: 'rgba(76,175,80,0.08)',
          borderBottom: '1px solid rgba(76,175,80,0.18)',
        }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '18px',
            color: 'white', letterSpacing: '0.06em', margin: 0,
          }}>
            EXISTING ADMINS ({users.length})
          </h2>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(76,175,80,0.15)' }}>
              {['Name', 'Email', 'Role', 'Status', 'Created', 'Actions'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px',
                  color: 'rgba(165,214,167,0.6)', fontWeight: '600',
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{
                  padding: '48px', textAlign: 'center',
                  fontFamily: 'Inter, sans-serif', fontSize: '14px',
                  color: 'rgba(165,214,167,0.4)',
                }}>
                  No admin users found
                </td>
              </tr>
            ) : (
              users.map((user, i) => {
                const rc = roleColors[user.role]
                return (
                  <tr key={user.id} style={{
                    borderBottom: i < users.length - 1 ? '1px solid rgba(76,175,80,0.08)' : 'none',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(76,175,80,0.02)',
                  }}>
                    <td style={{ padding: '14px 16px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'white', fontWeight: '500' }}>
                      {user.fullName}
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(165,214,167,0.7)' }}>
                      {user.email}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                        background: rc.bg, color: rc.color, border: `1px solid ${rc.border}`,
                        fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.05em',
                      }}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '600',
                        background: user.isActive ? 'rgba(76,175,80,0.15)' : 'rgba(158,158,158,0.15)',
                        color: user.isActive ? '#4CAF50' : 'rgba(158,158,158,0.7)',
                        border: `1px solid ${user.isActive ? 'rgba(76,175,80,0.3)' : 'rgba(158,158,158,0.2)'}`,
                      }}>
                        {user.isActive ? '● Active' : '○ Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(165,214,167,0.5)' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleToggle(user.id)} style={{
                          padding: '7px 12px',
                          background: user.isActive ? 'rgba(255,152,0,0.15)' : 'rgba(76,175,80,0.15)',
                          color: user.isActive ? '#FF9800' : '#4CAF50',
                          border: 'none', borderRadius: '6px', fontSize: '11px',
                          cursor: 'pointer', fontWeight: '600', fontFamily: 'Inter, sans-serif',
                        }}>
                          {user.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button onClick={() => handleDelete(user.id, user.fullName)} style={{
                          padding: '7px 10px',
                          background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                          border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer',
                        }}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
