import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth/protectRoute'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

export default async function EditFixturePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requirePermission('canManageFixtures')
  const { id } = await params

  const fixture = await prisma.fixture.findUnique({
    where: { id },
    include: { sport: true },
  })

  if (!fixture) notFound()

  async function updateFixture(formData: FormData) {
    'use server'
    const scheduledDate = formData.get('scheduledDate') as string
    const scheduledTime = formData.get('scheduledTime') as string
    const venue         = formData.get('venue') as string
    const participant1Name = formData.get('participant1Name') as string
    const participant2Name = formData.get('participant2Name') as string
    const score1        = formData.get('score1') as string
    const score2        = formData.get('score2') as string
    const status        = formData.get('status') as string
    const winnerId      = formData.get('winnerId') as string

    await prisma.fixture.update({
      where: { id },
      data: {
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        scheduledTime: scheduledTime || null,
        venue:         venue || null,
        participant1Name,
        participant2Name,
        score1: score1 || null,
        score2: score2 || null,
        status,
        winnerId: winnerId || null,
        updatedAt: new Date(),
      },
    })

    revalidatePath('/admin/fixtures')
    revalidatePath('/admin/live-scores')
    redirect('/admin/fixtures?success=Fixture updated successfully')
  }

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    background: 'rgba(0,0,0,0.35)',
    border: '1px solid rgba(76,175,80,0.25)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontFamily: 'Inter, sans-serif',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  const labelStyle = {
    display: 'block',
    fontFamily: "'Space Grotesk', sans-serif",
    fontSize: '11px',
    color: 'rgba(165,214,167,0.65)',
    marginBottom: '6px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase' as const,
  }

  const statusColor = fixture.status === 'completed' ? '#4CAF50' : fixture.status === 'live' ? '#ef4444' : '#FF9800'

  return (
    <div style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <a href="/admin/fixtures" style={{
          fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px',
          color: '#4CAF50', textDecoration: 'none', fontWeight: '600',
          display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px',
        }}>
          ← Back to Fixtures
        </a>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: '36px', color: '#4CAF50', letterSpacing: '0.1em', marginBottom: '6px',
        }}>
          EDIT FIXTURE
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px',
            color: '#4CAF50', fontWeight: '700',
          }}>{fixture.fixtureNumber}</span>
          <span style={{ color: 'rgba(165,214,167,0.5)', fontSize: '12px' }}>·</span>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'rgba(165,214,167,0.65)' }}>
            {fixture.sport.name} · {fixture.stage}
          </span>
          <span style={{
            padding: '3px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '700',
            background: `${statusColor}20`, color: statusColor, border: `1px solid ${statusColor}40`,
            fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.06em',
          }}>
            {fixture.status.toUpperCase()}
          </span>
        </div>
      </div>

      <form action={updateFixture}>
        {/* Participants */}
        <div style={{
          padding: '24px', borderRadius: '14px',
          border: '1px solid rgba(76,175,80,0.2)',
          background: 'rgba(27,94,32,0.05)', marginBottom: '20px',
        }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '18px',
            color: 'white', letterSpacing: '0.06em', marginBottom: '18px',
          }}>PARTICIPANTS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Participant 1 / Athletes</label>
              <input name="participant1Name" defaultValue={fixture.participant1Name}
                style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Participant 2 / Lane Info</label>
              <input name="participant2Name" defaultValue={fixture.participant2Name}
                style={inputStyle} required />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div style={{
          padding: '24px', borderRadius: '14px',
          border: '1px solid rgba(76,175,80,0.2)',
          background: 'rgba(27,94,32,0.05)', marginBottom: '20px',
        }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '18px',
            color: 'white', letterSpacing: '0.06em', marginBottom: '18px',
          }}>SCHEDULE & VENUE</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input name="scheduledDate" type="date"
                defaultValue={fixture.scheduledDate ? fixture.scheduledDate.toISOString().split('T')[0] : ''}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Time</label>
              <input name="scheduledTime" type="time"
                defaultValue={fixture.scheduledTime || ''}
                style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Venue</label>
              <input name="venue" defaultValue={fixture.venue || ''}
                placeholder="e.g. Ground A" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Scores & Status */}
        <div style={{
          padding: '24px', borderRadius: '14px',
          border: '1px solid rgba(76,175,80,0.2)',
          background: 'rgba(27,94,32,0.05)', marginBottom: '24px',
        }}>
          <h2 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '18px',
            color: 'white', letterSpacing: '0.06em', marginBottom: '18px',
          }}>SCORE & STATUS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>Score — {fixture.participant1Name.split(' | ')[0]?.replace('Lane 1: ', '') || 'Team 1'}</label>
              <input name="score1" defaultValue={fixture.score1 || ''}
                placeholder="e.g. 2 / 145/3 / 10.5s"
                style={{ ...inputStyle, color: '#4CAF50', fontWeight: '600', textAlign: 'center' }} />
            </div>
            <div>
              <label style={labelStyle}>Score — {fixture.participant2Name.split(' | ')[0]?.replace('Lane 2: ', '') || 'Team 2'}</label>
              <input name="score2" defaultValue={fixture.score2 || ''}
                placeholder="e.g. 1 / 138/7 / 11.2s"
                style={{ ...inputStyle, color: '#4CAF50', fontWeight: '600', textAlign: 'center' }} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select name="status" defaultValue={fixture.status} style={inputStyle}>
                <option value="scheduled">⏱ Scheduled</option>
                <option value="live">🔴 Live Now</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>
          </div>

          {/* Winner ID — hidden, optional */}
          <input type="hidden" name="winnerId" value={fixture.winnerId || ''} />
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" style={{
            padding: '13px 32px', background: '#4CAF50', color: 'black',
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px',
            fontWeight: '700', letterSpacing: '0.08em', border: 'none',
            borderRadius: '8px', cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(76,175,80,0.3)',
          }}>
            💾 SAVE CHANGES
          </button>
          <a href="/admin/fixtures" style={{
            padding: '13px 24px', background: 'rgba(255,255,255,0.05)',
            color: 'rgba(165,214,167,0.7)', fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '14px', fontWeight: '600', border: '1px solid rgba(76,175,80,0.2)',
            borderRadius: '8px', textDecoration: 'none',
          }}>
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}
