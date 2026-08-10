// app/admin/(dashboard)/live-scores/page.tsx - COMPLETE REBUILD

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import { hasPermission } from '@/lib/auth/permissions'
import FinishMatchButton from '@/components/admin/FinishMatchButton'

export default async function AdminLiveScoresPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; status?: string; success?: string }>
}) {
  // Auth check
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) redirect('/admin/login')
  
  const admin = jwt.verify(token, process.env.JWT_SECRET!) as any
  
  if (!hasPermission(admin.role, 'live-scores.view')) {
    redirect('/admin/dashboard')
  }
  
  const canUpdate = hasPermission(admin.role, 'live-scores.update')

  const { sport, status, success } = await searchParams

  // Fetch fixtures that are scheduled or live
  const fixtures = await prisma.fixture.findMany({
    where: {
      ...(sport && { sportId: sport }),
      ...(status === 'scheduled' && { status: 'scheduled' }),
      ...(status === 'live' && { status: 'live' }),
      ...(!status && { status: { in: ['scheduled', 'live'] } }),
    },
    include: {
      sport: true,
      participant1: { include: { student: true } },
      participant2: { include: { student: true } },
    },
    orderBy: [
      { status: 'desc' }, // Live matches first
      { scheduledDate: 'asc' },
    ],
  })

  const sports = await prisma.sport.findMany({ where: { isActive: true } })

  // Detect fixture type — heats have Lane format OR are stage-based athletics placeholders
  function isHeatFixture(p1Name: string, stage: string): boolean {
    if (p1Name.includes('Lane ')) return true
    const s = stage.toLowerCase()
    return s.includes('heat') || s.includes('semi final') || s.includes('final')
      ? p1Name.toLowerCase().includes('qualifier') || p1Name.toLowerCase().includes('heat') || p1Name.toLowerCase().includes('top ')
      : false
  }

  // Parse athletes from heat fixture participant1Name
  function parseAthletes(p1Name: string): { lane: number; name: string }[] {
    return p1Name.split(' | ').map((entry, i) => {
      const match = entry.match(/Lane (\d+):\s*(.+)/)
      return { lane: match ? parseInt(match[1]) : i + 1, name: match ? match[2].trim() : entry.trim() }
    })
  }

  // Generic score placeholder based on sport name
  function scorePlaceholder(sportName: string, category: string): string {
    const name = sportName.toLowerCase()
    if (name.includes('cricket'))   return 'e.g., 145/3'
    if (name.includes('football') || name.includes('hockey') || name.includes('basketball') || name.includes('volleyball')) return 'e.g., 2'
    if (name.includes('badminton') || name.includes('tennis') || name.includes('table tennis')) return 'e.g., 21'
    if (name.includes('kabaddi') || name.includes('kho')) return 'e.g., 35'
    if (category === 'individual') return 'e.g., 10.5s / 8.5m'
    return 'Enter score'
  }

  // Update score and status
  async function updateScore(formData: FormData) {
    'use server'
    
    if (!hasPermission(admin.role, 'live-scores.update')) {
      redirect('/admin/live-scores?error=Unauthorized')
    }
    
    const id = formData.get('id') as string
    const newStatus = formData.get('status') as string
    const isHeat = formData.get('isHeat') === 'true'

    let score1: string | null = null
    let score2: string | null = null

    if (isHeat) {
      // Collect per-athlete results: lane_1_name=..., lane_1_time=..., etc.
      const entries: Record<string, string> = {}
      formData.forEach((value, key) => {
        if (key.startsWith('lane_')) entries[key] = value as string
      })
      // Encode all lane results into score1 as pipe-separated "Lane N: time"
      const laneKeys = Object.keys(entries).filter(k => k.endsWith('_time'))
      const results = laneKeys
        .sort()
        .map(k => {
          const laneNum = k.replace('lane_', '').replace('_time', '')
          const name = entries[`lane_${laneNum}_name`] || `Lane ${laneNum}`
          const time = entries[k]
          return time ? `${name}: ${time}` : null
        })
        .filter(Boolean)
        .join(' | ')
      score1 = results || null
      score2 = null
    } else {
      score1 = (formData.get('score1') as string) || null
      score2 = (formData.get('score2') as string) || null
    }

    await prisma.fixture.update({
      where: { id },
      data: { score1, score2, status: newStatus, updatedAt: new Date() },
    })

    revalidatePath('/admin/live-scores')
    revalidatePath('/live-scores')
    redirect('/admin/live-scores?success=Score updated successfully')
  }


  return (
    <div>
      {/* Success Message */}
      {success && (
        <div style={{
          padding: '16px 24px',
          borderRadius: '12px',
          background: 'rgba(76,175,80,0.1)',
          border: '1px solid rgba(76,175,80,0.3)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}>
          <span style={{ fontSize: '24px' }}>✅</span>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#4CAF50',
          }}>
            {decodeURIComponent(success)}
          </p>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: '48px',
          color: '#4CAF50',
          letterSpacing: '0.1em',
          marginBottom: '8px',
        }}>
          MANAGE LIVE SCORES
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(165,214,167,0.6)',
        }}>
          Update scores in real-time • Changes reflect instantly on user-side
        </p>
      </div>

      {/* Filters */}
      <form method="GET" style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '32px',
      }}>
        <select
          name="sport"
          defaultValue={sport || ''}
          style={{
            padding: '12px 20px',
            background: 'rgba(27,94,32,0.1)',
            border: '1px solid rgba(76,175,80,0.3)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <option value="">All Sports</option>
          {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        <select
          name="status"
          defaultValue={status || ''}
          style={{
            padding: '12px 20px',
            background: 'rgba(27,94,32,0.1)',
            border: '1px solid rgba(76,175,80,0.3)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="live">Live Now</option>
        </select>
        
        <button type="submit" style={{
          padding: '12px 24px',
          background: 'rgba(76,175,80,0.1)',
          color: '#4CAF50',
          border: '1px solid rgba(76,175,80,0.3)',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>Filter</button>
      </form>

      {/* Matches Grid */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {fixtures.length === 0 ? (
          <div style={{
            padding: '80px', textAlign: 'center', borderRadius: '16px',
            border: '1px solid rgba(76,175,80,0.15)', background: 'rgba(27,94,32,0.03)',
          }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'rgba(165,214,167,0.4)' }}>
              No matches to display. Generate fixtures first.
            </p>
          </div>
        ) : (
          fixtures.map((fixture) => {
            const isLive = fixture.status === 'live'
            const isHeat = isHeatFixture(fixture.participant1Name, fixture.stage)
            const athletes = isHeat && fixture.participant1Name.includes('Lane ') ? parseAthletes(fixture.participant1Name) : []
            const placeholder = scorePlaceholder(fixture.sport.name, fixture.sport.category)
            return (
            <div key={fixture.id} style={{
              borderRadius: '16px',
              border: `2px solid ${isLive ? 'rgba(76,175,80,0.5)' : 'rgba(76,175,80,0.15)'}`,
              background: isLive ? 'rgba(76,175,80,0.06)' : 'rgba(27,94,32,0.03)',
              overflow: 'hidden',
            }}>
              {/* Card Header */}
              <div style={{
                padding: '14px 24px',
                background: isLive ? 'rgba(76,175,80,0.12)' : 'rgba(0,0,0,0.2)',
                borderBottom: `1px solid ${isLive ? 'rgba(76,175,80,0.25)' : 'rgba(76,175,80,0.1)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '700',
                    fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.08em',
                    background: 'rgba(76,175,80,0.15)', color: '#4CAF50',
                    border: '1px solid rgba(76,175,80,0.3)',
                  }}>
                    {fixture.fixtureNumber}
                  </span>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', color: 'rgba(165,214,167,0.7)', fontWeight: '600' }}>
                    {fixture.sport.name.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(165,214,167,0.45)' }}>
                    {fixture.stage}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {fixture.scheduledDate && (
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(165,214,167,0.45)' }}>
                      {new Date(fixture.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      {fixture.scheduledTime && ` • ${fixture.scheduledTime}`}
                    </span>
                  )}
                  {isLive && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '5px 12px', borderRadius: '9999px',
                      background: 'rgba(76,175,80,0.2)', border: '1px solid rgba(76,175,80,0.4)',
                    }}>
                      <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4CAF50', boxShadow: '0 0 8px #4CAF50', display: 'inline-block' }} />
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#4CAF50', fontWeight: '700', letterSpacing: '0.1em' }}>LIVE</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '24px' }}>
                {canUpdate ? (
                  <form action={updateScore}>
                    <input type="hidden" name="id" value={fixture.id} />
                    <input type="hidden" name="isHeat" value={isHeat ? 'true' : 'false'} />

                    {isHeat ? (
                      athletes.length > 0 ? (
                      /* ── HEATS with actual athletes — position-based ranking ── */
                      <>
                        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: 'rgba(165,214,167,0.5)', marginBottom: '14px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          Enter finishing position for each athlete (1 = 1st place, 2 = 2nd, etc.)
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '10px', marginBottom: '18px' }}>
                          {athletes.map(({ lane, name }) => {
                            const existing = fixture.score1
                              ? fixture.score1.split(' | ').find(e => e.startsWith(name + ':'))?.replace(name + ': ', '') || ''
                              : ''
                            return (
                              <div key={lane} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(76,175,80,0.18)' }}>
                                <input type="hidden" name={`lane_${lane}_name`} value={name} />
                                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#4CAF50', fontWeight: '700', letterSpacing: '0.08em', marginBottom: '4px' }}>LANE {lane}</p>
                                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'white', fontWeight: '600', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
                                <select name={`lane_${lane}_time`} defaultValue={existing}
                                  style={{ width: '100%', padding: '8px 10px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: '6px', color: '#4CAF50', fontSize: '14px', fontWeight: '700', fontFamily: "'Space Grotesk', sans-serif", cursor: 'pointer', outline: 'none' }}>
                                  <option value="">— Not set —</option>
                                  {Array.from({ length: athletes.length }, (_, i) => i + 1).map(pos => (
                                    <option key={pos} value={`P${pos}`}>
                                      {pos === 1 ? '🥇 1st' : pos === 2 ? '🥈 2nd' : pos === 3 ? '🥉 3rd' : `${pos}th`}
                                    </option>
                                  ))}
                                  <option value="DNF">DNF — Did Not Finish</option>
                                  <option value="DNS">DNS — Did Not Start</option>
                                  <option value="DQ">DQ — Disqualified</option>
                                </select>
                              </div>
                            )
                          })}
                        </div>
                      </>
                      ) : (
                      /* ── Placeholder heat (SF/Final — athletes TBD) ── */
                      <div style={{ marginBottom: '18px' }}>
                        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: 'rgba(165,214,167,0.5)', marginBottom: '14px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          Athletes qualify from previous round — enter result summary
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(165,214,167,0.6)', marginBottom: '6px' }}>{fixture.participant1Name}</p>
                            <input name="score1" type="text" defaultValue={fixture.score1 || ''} placeholder="e.g. 1st — Pulkit (10.5s)"
                              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: '8px', color: '#4CAF50', fontSize: '13px', fontWeight: '600', fontFamily: "'Space Grotesk', sans-serif", outline: 'none', boxSizing: 'border-box' as const }} />
                          </div>
                          <div>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(165,214,167,0.6)', marginBottom: '6px' }}>{fixture.participant2Name}</p>
                            <input name="score2" type="text" defaultValue={fixture.score2 || ''} placeholder="e.g. 2nd — Yash (10.8s)"
                              style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(76,175,80,0.3)', borderRadius: '8px', color: '#4CAF50', fontSize: '13px', fontWeight: '600', fontFamily: "'Space Grotesk', sans-serif", outline: 'none', boxSizing: 'border-box' as const }} />
                          </div>
                        </div>
                      </div>
                      )
                    ) : (
                      /* ── REGULAR 1v1 ── */
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                          <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '22px', color: 'white', marginBottom: '10px', letterSpacing: '0.05em', lineHeight: '1.2' }}>
                            {fixture.participant1Name}
                          </p>
                          <input name="score1" type="text" defaultValue={fixture.score1 || ''} placeholder={placeholder}
                            style={{ width: '100%', padding: '12px 16px', fontSize: '20px', fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(76,175,80,0.35)', borderRadius: '10px', outline: 'none', fontFamily: "'Space Grotesk', sans-serif", boxSizing: 'border-box' as const }} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '28px', color: 'rgba(165,214,167,0.25)', display: 'block' }}>VS</span>
                        </div>
                        <div>
                          <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '22px', color: 'white', marginBottom: '10px', letterSpacing: '0.05em', lineHeight: '1.2' }}>
                            {fixture.participant2Name}
                          </p>
                          <input name="score2" type="text" defaultValue={fixture.score2 || ''} placeholder={placeholder}
                            style={{ width: '100%', padding: '12px 16px', fontSize: '20px', fontWeight: 'bold', color: '#4CAF50', textAlign: 'center', background: 'rgba(0,0,0,0.3)', border: '2px solid rgba(76,175,80,0.35)', borderRadius: '10px', outline: 'none', fontFamily: "'Space Grotesk', sans-serif", boxSizing: 'border-box' as const }} />
                        </div>
                      </div>
                    )}

                    {/* Controls */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <select name="status" defaultValue={fixture.status} style={{ padding: '11px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(76,175,80,0.25)', borderRadius: '8px', color: 'white', fontSize: '13px', fontFamily: "'Space Grotesk', sans-serif", cursor: 'pointer' }}>
                        <option value="scheduled">⏱ Scheduled</option>
                        <option value="live">🔴 Live Now</option>
                      </select>
                      <button type="submit" style={{ padding: '11px 24px', background: '#4CAF50', color: 'black', fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 4px 16px rgba(76,175,80,0.35)' }}>
                        ⚡ UPDATE SCORE
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Read-only view */
                  isHeat ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
                      {athletes.map(({ lane, name }) => {
                        const raw = fixture.score1
                          ? fixture.score1.split(' | ').find(e => e.startsWith(name + ':'))?.replace(name + ': ', '') || '—'
                          : '—'
                        const posLabel =
                          raw === 'P1' ? '🥇 1st' :
                          raw === 'P2' ? '🥈 2nd' :
                          raw === 'P3' ? '🥉 3rd' :
                          raw.startsWith('P') ? `${raw.replace('P', '')}th` :
                          raw
                        return (
                          <div key={lane} style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(76,175,80,0.12)', textAlign: 'center' }}>
                            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: '#4CAF50', fontWeight: '700', marginBottom: '4px' }}>LANE {lane}</p>
                            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'white', marginBottom: '6px' }}>{name}</p>
                            <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '20px', color: '#4CAF50', fontWeight: '700' }}>{posLabel}</p>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: '16px', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '22px', color: 'white', marginBottom: '8px' }}>{fixture.participant1Name}</p>
                        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '40px', color: '#4CAF50', fontWeight: 'bold', margin: 0 }}>{fixture.score1 || '—'}</p>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '28px', color: 'rgba(165,214,167,0.25)' }}>VS</span>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '22px', color: 'white', marginBottom: '8px' }}>{fixture.participant2Name}</p>
                        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '40px', color: '#4CAF50', fontWeight: 'bold', margin: 0 }}>{fixture.score2 || '—'}</p>
                      </div>
                    </div>
                  )
                )}

                {/* Finish match — for regular 1v1 needs both scores; for heats just needs live status */}
                {canUpdate && fixture.status === 'live' && (
                  (!isHeat && fixture.score1 && fixture.score2) || isHeat
                ) && (
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(76,175,80,0.12)' }}>
                    <FinishMatchButton
                      fixtureId={fixture.id}
                      participant1Name={fixture.participant1Name}
                      participant2Name={fixture.participant2Name}
                      participant1Id={fixture.participant1Id}
                      participant2Id={fixture.participant2Id}
                      isHeat={isHeat}
                      score1={fixture.score1}
                    />
                  </div>
                )}
              </div>
            </div>
          )})
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}} />
    </div>
  )
}