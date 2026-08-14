'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface Match {
  id: string
  sport: string
  teamA: string
  teamB: string
  scoreA: string
  scoreB: string
  status: string
  time?: string
  venue?: string
  winner?: string
  progress?: number
  stage?: string
  isHeat?: boolean
}

interface Sport {
  id: string
  name: string
}

interface LiveScoresClientProps {
  initialMatches: Match[]
  sports: Sport[]
  selectedTab: 'live' | 'upcoming' | 'completed'
  selectedSport: string
}

export default function LiveScoresClient({
  initialMatches,
  sports,
  selectedTab,
  selectedSport,
}: LiveScoresClientProps) {
  const router = useRouter()

  const setTab = (tab: string) => {
    const params = new URLSearchParams(window.location.search)
    params.set('tab', tab)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  // Real-time Sync: Refresh data every 30 seconds
  useEffect(() => {
    if (selectedTab !== 'live') return // Only poll for live tab
    
    const interval = setInterval(() => {
      router.refresh()
    }, 30000)

    return () => clearInterval(interval)
  }, [router, selectedTab])

  const setSport = (sport: string) => {
    const params = new URLSearchParams(window.location.search)
    if (sport === 'all') params.delete('sport')
    else params.set('sport', sport)
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div>
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '140px 24px 60px',
        background: 'linear-gradient(135deg, rgba(27,94,32,0.15) 0%, rgba(3,10,3,0.8) 100%)',
        borderBottom: '1px solid rgba(76,175,80,0.2)',
        zIndex: 10,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: 'clamp(4rem, 10vw, 7rem)',
            color: 'white',
            letterSpacing: '0.08em',
            marginBottom: '20px',
            lineHeight: '1',
            textShadow: '0 4px 30px rgba(0,0,0,0.8)',
          }}>
            LIVE <span style={{
              background: 'linear-gradient(135deg, #4CAF50 0%, #A5D6A7 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>SCORES</span>
          </h1>
          <div style={{
            width: '120px',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #4CAF50, transparent)',
            margin: '0 auto 24px',
            boxShadow: '0 0 20px rgba(76,175,80,0.5)',
          }} />
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: 'rgba(165,214,167,0.9)',
          }}>
            Real-time updates from all sports
          </p>
        </div>
      </section>

      {/* SPORT SELECTOR */}
      <section style={{ position: 'relative', zIndex: 10, padding: '32px 0', borderBottom: '1px solid rgba(76,175,80,0.1)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', WebkitOverflowScrolling: 'touch' as any, scrollbarWidth: 'none' as any }}>
            <style>{`.sport-scroll::-webkit-scrollbar { display: none; }`}</style>
            <SportCard
              id="all"
              name="All Sports"
              icon="🏆"
              selected={selectedSport === 'all'}
              onClick={() => setSport('all')}
            />
            {sports.map((sport) => (
              <SportCard
                key={sport.id}
                id={sport.id}
                name={sport.name}
                icon="🏅"
                selected={selectedSport === sport.id}
                onClick={() => setSport(sport.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TABS */}
      <section style={{ position: 'relative', zIndex: 10, padding: '40px 16px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '48px', flexWrap: 'wrap' }}>
            {(['live', 'upcoming', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTab(tab)}
                style={{
                  padding: '12px 24px',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '13px',
                  fontWeight: '600',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: selectedTab === tab ? '1px solid rgba(76,175,80,0.6)' : '1px solid rgba(76,175,80,0.25)',
                  borderRadius: '9999px',
                  background: selectedTab === tab ? '#4CAF50' : 'rgba(27,94,32,0.06)',
                  backdropFilter: 'blur(10px)',
                  color: selectedTab === tab ? 'black' : 'rgba(165,214,167,0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: selectedTab === tab ? '0 0 30px rgba(76,175,80,0.4)' : 'none',
                }}
              >
                {tab === 'live' && (
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: selectedTab === 'live' ? 'black' : '#4CAF50',
                    animation: selectedTab === 'live' ? 'none' : 'pulse 2s infinite',
                  }} />
                )}
                {tab}
              </button>
            ))}
          </div>

          {/* Match Cards */}
          <div style={{ display: 'grid', gap: '32px', marginBottom: '80px' }}>
            {initialMatches.length === 0 ? (
              <EmptyState tab={selectedTab} sport={selectedSport} />
            ) : (
              initialMatches.map((match, i) => (
                selectedTab === 'live' ? (
                  match.isHeat ? <HeatMatchCard key={match.id || i} match={match} /> : <LiveMatchCard key={match.id || i} match={match} />
                ) : selectedTab === 'upcoming' ? (
                  <UpcomingMatchCard key={match.id || i} match={match} />
                ) : (
                  match.isHeat ? <HeatMatchCard key={match.id || i} match={match} /> : <CompletedMatchCard key={match.id || i} match={match} />
                )
              ))
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}

function SportCard({ id, name, icon, selected, onClick }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        minWidth: '140px',
        padding: '20px 24px',
        borderRadius: '16px',
        border: selected ? '2px solid rgba(76,175,80,0.6)' : '1px solid rgba(76,175,80,0.2)',
        background: selected ? 'rgba(76,175,80,0.15)' : 'rgba(27,94,32,0.05)',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <div style={{ fontSize: '36px' }}>{icon}</div>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px', fontWeight: '600', color: selected ? '#4CAF50' : 'rgba(165,214,167,0.7)', textTransform: 'uppercase' }}>
        {name}
      </span>
    </button>
  )
}

function LiveMatchCard({ match }: { match: Match }) {
  return (
    <div style={{ padding: '40px', borderRadius: '24px', border: '1px solid rgba(76,175,80,0.3)', background: 'rgba(27,94,32,0.08)', backdropFilter: 'blur(20px)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #4CAF50, transparent)' }} />
      <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: '9999px', background: 'rgba(76,175,80,0.15)', color: '#4CAF50', fontSize: '12px', fontWeight: '600', marginBottom: '24px' }}>
        {match.sport}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '32px', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '32px', color: 'white' }}>{match.teamA}</p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '48px', color: '#4CAF50', fontWeight: 'bold' }}>{match.scoreA}</p>
        </div>
        <div style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '28px', color: 'rgba(165,214,167,0.3)' }}>VS</div>
        <div>
          <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '32px', color: 'white' }}>{match.teamB}</p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '48px', color: '#4CAF50', fontWeight: 'bold' }}>{match.scoreB}</p>
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4CAF50', animation: 'pulse 2s infinite' }} />
        {match.status}
      </div>
    </div>
  )
}

function UpcomingMatchCard({ match }: { match: Match }) {
  const isHeat = match.isHeat || match.teamA?.includes('Lane ')

  if (isHeat) {
    // Parse athletes from Lane format
    const athletes = match.teamA?.includes('Lane ')
      ? match.teamA.split(' | ').map(entry => {
          const m = entry.match(/Lane (\d+):\s*(.+)/)
          return m ? { lane: parseInt(m[1]), name: m[2].trim() } : null
        }).filter(Boolean) as { lane: number; name: string }[]
      : []

    return (
      <div style={{ padding: '28px 32px', borderRadius: '20px', border: '1px solid rgba(76,175,80,0.2)', background: 'rgba(27,94,32,0.05)', backdropFilter: 'blur(15px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(33,150,243,0.15)', color: '#2196F3', fontSize: '12px', fontWeight: '600' }}>
            {match.sport}
          </span>
          {match.stage && (
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '13px', color: 'rgba(165,214,167,0.55)' }}>
              {match.stage}
            </span>
          )}
        </div>

        {athletes.length > 0 ? (
          <div>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '12px', color: 'rgba(165,214,167,0.45)', letterSpacing: '0.08em', marginBottom: '12px' }}>
              ATHLETES REGISTERED
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px' }}>
              {athletes.map(({ lane, name }) => (
                <div key={lane} style={{
                  padding: '10px 12px', borderRadius: '10px',
                  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(76,175,80,0.12)',
                }}>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '10px', color: 'rgba(165,214,167,0.4)', letterSpacing: '0.08em', marginBottom: '4px' }}>LANE {lane}</p>
                  <p style={{ fontFamily: 'Inter,sans-serif', fontSize: '13px', color: 'white', fontWeight: '600' }}>{name}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{ fontFamily: "'Bebas Neue',Impact,sans-serif", fontSize: '20px', color: 'rgba(165,214,167,0.7)', letterSpacing: '0.05em' }}>
            {match.teamA}
          </p>
        )}

        <div style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(165,214,167,0.5)', marginTop: '16px' }}>
          {match.status !== 'LIVE' && match.status !== 'FINAL' ? `📅 ${match.status}` : ''}{match.venue ? ` · 📍 ${match.venue}` : ''}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '32px', borderRadius: '20px', border: '1px solid rgba(76,175,80,0.25)', background: 'rgba(27,94,32,0.05)', backdropFilter: 'blur(15px)' }}>
      <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(33,150,243,0.15)', color: '#2196F3', fontSize: '11px', fontWeight: '600', marginBottom: '20px' }}>
        {match.sport}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '24px', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '26px', color: 'white', textAlign: 'right' }}>{match.teamA}</p>
        <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '20px', color: 'rgba(165,214,167,0.3)' }}>VS</span>
        <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '26px', color: 'white' }}>{match.teamB}</p>
      </div>
      <div style={{ textAlign: 'center', fontSize: '13px', color: 'rgba(165,214,167,0.6)' }}>
        {match.status !== 'LIVE' && match.status !== 'FINAL' ? `📅 ${match.status}` : ''}{match.venue ? ` · 📍 ${match.venue}` : ''}
      </div>
    </div>
  )
}

function CompletedMatchCard({ match }: { match: Match }) {
  if (match.isHeat) {
    return <HeatMatchCard match={match} />
  }
  return (
    <div style={{ padding: '32px', borderRadius: '20px', border: '1px solid rgba(76,175,80,0.2)', background: 'rgba(27,94,32,0.04)', backdropFilter: 'blur(15px)' }}>
      <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(158,158,158,0.15)', color: 'rgba(158,158,158,0.8)', fontSize: '11px', fontWeight: '600', marginBottom: '20px' }}>
        {match.sport} • COMPLETED
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '24px', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '26px', color: match.winner === match.teamA ? '#4CAF50' : 'rgba(165,214,167,0.5)' }}>{match.teamA}</p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', color: match.winner === match.teamA ? '#4CAF50' : 'rgba(165,214,167,0.5)', fontWeight: 'bold' }}>{match.scoreA}</p>
        </div>
        <span style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '20px', color: 'rgba(165,214,167,0.3)' }}>VS</span>
        <div>
          <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '26px', color: match.winner === match.teamB ? '#4CAF50' : 'rgba(165,214,167,0.5)' }}>{match.teamB}</p>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '36px', color: match.winner === match.teamB ? '#4CAF50' : 'rgba(165,214,167,0.5)', fontWeight: 'bold' }}>{match.scoreB}</p>
        </div>
      </div>
      <div style={{ textAlign: 'center', color: '#4CAF50' }}>🏆 Winner: {match.winner}</div>
    </div>
  )
}

function HeatMatchCard({ match }: { match: Match }) {
  const isLive = match.status === 'LIVE'
  const isCompleted = match.status === 'FINAL'

  // Parse athletes from participant1Name: "Lane 1: Name | Lane 2: Name | ..."
  const athletes = match.teamA.includes('Lane ')
    ? match.teamA.split(' | ').map(entry => {
        const m = entry.match(/Lane (\d+):\s*(.+)/)
        return m ? { lane: parseInt(m[1]), name: m[2].trim() } : null
      }).filter(Boolean) as { lane: number; name: string }[]
    : []

  // Parse results: "Name: P1 | Name: P2 | ..."
  const results: Record<string, string> = {}
  if (match.scoreA && match.scoreA !== '0') {
    match.scoreA.split(' | ').forEach(entry => {
      const idx = entry.lastIndexOf(': ')
      if (idx !== -1) {
        results[entry.substring(0, idx).trim()] = entry.substring(idx + 2).trim()
      }
    })
  }

  const posLabel = (pos: string) => {
    if (pos === 'P1') return { label: '🥇 1st', color: '#FFD700' }
    if (pos === 'P2') return { label: '🥈 2nd', color: '#C0C0C0' }
    if (pos === 'P3') return { label: '🥉 3rd', color: '#CD7F32' }
    if (pos === 'DNF') return { label: 'DNF', color: 'rgba(239,68,68,0.8)' }
    if (pos === 'DNS') return { label: 'DNS', color: 'rgba(158,158,158,0.7)' }
    if (pos === 'DQ') return { label: 'DQ', color: 'rgba(239,68,68,0.8)' }
    if (pos?.startsWith('P')) return { label: `${pos.replace('P', '')}th`, color: 'rgba(165,214,167,0.7)' }
    return { label: pos || '—', color: 'rgba(165,214,167,0.5)' }
  }

  // Sort athletes by result (P1 first)
  const sorted = [...athletes].sort((a, b) => {
    const ra = results[a.name] || 'Z'
    const rb = results[b.name] || 'Z'
    return ra.localeCompare(rb)
  })

  return (
    <div style={{
      padding: '32px', borderRadius: '20px',
      border: `1px solid ${isLive ? 'rgba(76,175,80,0.4)' : 'rgba(76,175,80,0.2)'}`,
      background: isLive ? 'rgba(27,94,32,0.1)' : 'rgba(27,94,32,0.05)',
      backdropFilter: 'blur(20px)', position: 'relative',
    }}>
      {isLive && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #4CAF50, transparent)' }} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ padding: '6px 16px', borderRadius: '9999px', background: 'rgba(76,175,80,0.15)', color: '#4CAF50', fontSize: '12px', fontWeight: '600' }}>
            {match.sport}
          </span>
          {match.stage && (
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', color: 'rgba(165,214,167,0.6)' }}>
              {match.stage}
            </span>
          )}
        </div>
        {isLive && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '9999px', background: 'rgba(76,175,80,0.2)', border: '1px solid rgba(76,175,80,0.4)' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4CAF50', display: 'inline-block', boxShadow: '0 0 8px #4CAF50' }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: '#4CAF50', fontWeight: '700' }}>LIVE</span>
          </div>
        )}
        {isCompleted && (
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '11px', color: 'rgba(165,214,167,0.5)', fontWeight: '600', letterSpacing: '0.08em' }}>COMPLETED</span>
        )}
      </div>

      {athletes.length > 0 ? (
        /* Podium grid — athletes sorted by position */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' }}>
          {(isCompleted ? sorted : athletes).map(({ lane, name }) => {
            const pos = results[name]
            const { label, color } = posLabel(pos || '')
            const isTop3 = pos === 'P1' || pos === 'P2' || pos === 'P3'
            return (
              <div key={lane} style={{
                padding: '16px 14px', borderRadius: '12px', textAlign: 'center',
                background: isTop3 ? `${color}15` : 'rgba(0,0,0,0.25)',
                border: `1px solid ${isTop3 ? `${color}40` : 'rgba(76,175,80,0.12)'}`,
                transition: 'all 0.3s ease',
              }}>
                <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '10px', color: 'rgba(165,214,167,0.45)', letterSpacing: '0.1em', marginBottom: '6px' }}>
                  LANE {lane}
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: 'white', fontWeight: '600', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {name}
                </p>
                {pos ? (
                  <p style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: '22px', color, letterSpacing: '0.05em' }}>
                    {label}
                  </p>
                ) : (
                  <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px', color: 'rgba(165,214,167,0.3)' }}>
                    {isLive ? 'Running' : '—'}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        /* Placeholder heat — athletes TBD */
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px', color: 'rgba(165,214,167,0.6)' }}>
            {match.teamA}
          </p>
          {match.scoreA && match.scoreA !== '0' && (
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '13px', color: '#4CAF50', marginTop: '12px' }}>
              {match.scoreA}
            </p>
          )}
        </div>
      )}

      {match.venue && (
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(165,214,167,0.4)', textAlign: 'center', marginTop: '16px' }}>
          📍 {match.venue}
        </p>
      )}
    </div>
  )
}

function EmptyState({ tab, sport }: any) {
  return (
    <div style={{ padding: '80px 40px', textAlign: 'center', borderRadius: '20px', border: '1px solid rgba(76,175,80,0.15)', background: 'rgba(27,94,32,0.03)' }}>
      <p style={{ color: 'rgba(165,214,167,0.5)' }}>No {tab} matches found{sport !== 'all' ? ' for this sport' : ''}.</p>
    </div>
  )
}
