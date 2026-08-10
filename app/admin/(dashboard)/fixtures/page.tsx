import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { requirePermission } from '@/lib/auth/protectRoute'

export const dynamic = 'force-dynamic'
import FixturesFilters from './FixturesFilters'
import ConfirmButton from '@/components/ui/ConfirmButton'

export default async function AdminFixturesPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; success?: string; error?: string }>
}) {
  await requirePermission('canManageFixtures')

  const { sport, success, error } = await searchParams

  const fixtures = await prisma.fixture.findMany({
    where: { ...(sport && { sportId: sport }) },
    include: {
      sport: true,
      participant1: {
        include: { student: true },
      },
      participant2: {
        include: { student: true },
      },
    },
    orderBy: { fixtureNumber: 'asc' },
  })

  const sports = await prisma.sport.findMany({
    where: { isActive: true },
  })

  // Auto-generate fixtures
  async function generateFixtures(formData: FormData) {
    'use server'
    
    const sportId = formData.get('sportId') as string
    const format = formData.get('format') as string

    const registrations = await prisma.registration.findMany({
      where: { sportId, status: 'approved' },
      include: { student: true, sport: true },
    })

    if (registrations.length < 2) {
      redirect('/admin/fixtures?error=Not enough approved participants (minimum 2)')
    }

    const targetSport = await prisma.sport.findUnique({ where: { id: sportId } })
    if (!targetSport) redirect('/admin/fixtures?error=Sport not found')

    const prefix = targetSport!.name.replace(/\s+/g, '').toUpperCase().slice(0, 4)

    // Clear existing fixtures for this sport
    const existing = await prisma.fixture.findMany({ where: { sportId }, select: { id: true } })
    const existingIds = existing.map(f => f.id)
    await prisma.liveScore.deleteMany({ where: { fixtureId: { in: existingIds } } })
    await prisma.fixture.updateMany({ where: { nextFixtureId: { in: existingIds } }, data: { nextFixtureId: null } })
    await prisma.fixture.deleteMany({ where: { sportId } })

    // Helper: get display name for a registration
    function getName(reg: typeof registrations[number]) {
      return reg.isTeamEvent ? (reg.teamName || `${reg.student.fullName}'s Team`) : reg.student.fullName
    }

    // Shuffle helper for seeding
    function shuffle<T>(arr: T[]): T[] {
      const a = [...arr]
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]]
      }
      return a
    }

    let fixtureNumber = 1

    if (format === 'knockout') {
      // Single Elimination — pairs from top, bye for odd participant
      const participants = registrations
      const roundSize = Math.pow(2, Math.ceil(Math.log2(participants.length)))
      const stage = roundSize === 2 ? 'Final' : roundSize === 4 ? 'Semi Final' : `Round of ${roundSize}`

      for (let i = 0; i < participants.length; i += 2) {
        if (participants[i + 1]) {
          await prisma.fixture.create({ data: {
            fixtureNumber: `${prefix}-KO-${fixtureNumber}`,
            sportId, stage, matchType: 'knockout',
            participant1Id: participants[i].id,
            participant1Name: getName(participants[i]),
            participant2Id: participants[i + 1].id,
            participant2Name: getName(participants[i + 1]),
            status: 'scheduled',
          }})
        } else {
          await prisma.fixture.create({ data: {
            fixtureNumber: `${prefix}-KO-${fixtureNumber}`,
            sportId, stage, matchType: 'knockout',
            participant1Id: participants[i].id,
            participant1Name: getName(participants[i]),
            participant2Name: 'BYE',
            status: 'completed', winnerId: participants[i].id,
            score1: 'W/O', score2: '-',
          }})
        }
        fixtureNumber++
      }

    } else if (format === 'league') {
      // Round Robin — every team plays every other team once
      const participants = registrations
      for (let i = 0; i < participants.length; i++) {
        for (let j = i + 1; j < participants.length; j++) {
          await prisma.fixture.create({ data: {
            fixtureNumber: `${prefix}-L-${fixtureNumber}`,
            sportId, stage: 'League', matchType: 'league',
            participant1Id: participants[i].id,
            participant1Name: getName(participants[i]),
            participant2Id: participants[j].id,
            participant2Name: getName(participants[j]),
            status: 'scheduled',
          }})
          fixtureNumber++
        }
      }

    } else if (format === 'league_knockout') {
      // Group Stage + Knockout: split into 2 groups, round robin within, then semis + final
      const participants = shuffle(registrations)
      const half = Math.ceil(participants.length / 2)
      const groupA = participants.slice(0, half)
      const groupB = participants.slice(half)

      // Group A matches
      for (let i = 0; i < groupA.length; i++) {
        for (let j = i + 1; j < groupA.length; j++) {
          await prisma.fixture.create({ data: {
            fixtureNumber: `${prefix}-GA-${fixtureNumber}`,
            sportId, stage: 'Group A', matchType: 'league',
            participant1Id: groupA[i].id, participant1Name: getName(groupA[i]),
            participant2Id: groupA[j].id, participant2Name: getName(groupA[j]),
            status: 'scheduled',
          }})
          fixtureNumber++
        }
      }
      // Group B matches
      for (let i = 0; i < groupB.length; i++) {
        for (let j = i + 1; j < groupB.length; j++) {
          await prisma.fixture.create({ data: {
            fixtureNumber: `${prefix}-GB-${fixtureNumber}`,
            sportId, stage: 'Group B', matchType: 'league',
            participant1Id: groupB[i].id, participant1Name: getName(groupB[i]),
            participant2Id: groupB[j].id, participant2Name: getName(groupB[j]),
            status: 'scheduled',
          }})
          fixtureNumber++
        }
      }
      // Knockout placeholders (TBD until group winners known)
      await prisma.fixture.create({ data: {
        fixtureNumber: `${prefix}-SF-1`,
        sportId, stage: 'Semi Final', matchType: 'knockout',
        participant1Name: 'Winner Group A', participant2Name: 'Runner-up Group B',
        status: 'scheduled',
      }})
      await prisma.fixture.create({ data: {
        fixtureNumber: `${prefix}-SF-2`,
        sportId, stage: 'Semi Final', matchType: 'knockout',
        participant1Name: 'Winner Group B', participant2Name: 'Runner-up Group A',
        status: 'scheduled',
      }})
      await prisma.fixture.create({ data: {
        fixtureNumber: `${prefix}-F-1`,
        sportId, stage: 'Final', matchType: 'knockout',
        participant1Name: 'Winner SF-1', participant2Name: 'Winner SF-2',
        status: 'scheduled',
      }})
      await prisma.fixture.create({ data: {
        fixtureNumber: `${prefix}-3P`,
        sportId, stage: '3rd Place', matchType: 'knockout',
        participant1Name: 'Loser SF-1', participant2Name: 'Loser SF-2',
        status: 'scheduled',
      }})

    } else if (format === 'double_knockout') {
      // Double Elimination: Winners bracket + Losers bracket
      const participants = registrations
      const roundSize = Math.pow(2, Math.ceil(Math.log2(participants.length)))
      const stage = `Round of ${roundSize}`

      // Winners bracket R1
      for (let i = 0; i < participants.length; i += 2) {
        if (participants[i + 1]) {
          await prisma.fixture.create({ data: {
            fixtureNumber: `${prefix}-WB-${fixtureNumber}`,
            sportId, stage: `Winners Bracket R1`, matchType: 'knockout',
            participant1Id: participants[i].id, participant1Name: getName(participants[i]),
            participant2Id: participants[i + 1].id, participant2Name: getName(participants[i + 1]),
            status: 'scheduled',
          }})
        } else {
          await prisma.fixture.create({ data: {
            fixtureNumber: `${prefix}-WB-${fixtureNumber}`,
            sportId, stage: 'Winners Bracket R1', matchType: 'knockout',
            participant1Id: participants[i].id, participant1Name: getName(participants[i]),
            participant2Name: 'BYE', status: 'completed',
            winnerId: participants[i].id, score1: 'W/O', score2: '-',
          }})
        }
        fixtureNumber++
      }
      // Losers bracket placeholder
      await prisma.fixture.create({ data: {
        fixtureNumber: `${prefix}-LB-1`,
        sportId, stage: 'Losers Bracket R1', matchType: 'knockout',
        participant1Name: 'Loser WB-1', participant2Name: 'Loser WB-2',
        status: 'scheduled',
      }})
      // Grand Final placeholder
      await prisma.fixture.create({ data: {
        fixtureNumber: `${prefix}-GF`,
        sportId, stage: 'Grand Final', matchType: 'knockout',
        participant1Name: 'Winner Winners Bracket', participant2Name: 'Winner Losers Bracket',
        status: 'scheduled',
      }})

    } else if (format === 'pools') {
      // Pool play (Badminton, Table Tennis etc.) — split into N pools of ~4
      const participants = shuffle(registrations)
      const poolSize = 4
      const numPools = Math.ceil(participants.length / poolSize)

      for (let p = 0; p < numPools; p++) {
        const pool = participants.slice(p * poolSize, (p + 1) * poolSize)
        const poolLabel = String.fromCharCode(65 + p) // A, B, C...
        for (let i = 0; i < pool.length; i++) {
          for (let j = i + 1; j < pool.length; j++) {
            await prisma.fixture.create({ data: {
              fixtureNumber: `${prefix}-P${poolLabel}-${fixtureNumber}`,
              sportId, stage: `Pool ${poolLabel}`, matchType: 'league',
              participant1Id: pool[i].id, participant1Name: getName(pool[i]),
              participant2Id: pool[j].id, participant2Name: getName(pool[j]),
              status: 'scheduled',
            }})
            fixtureNumber++
          }
        }
      }
      // Knockout stage placeholders
      await prisma.fixture.create({ data: {
        fixtureNumber: `${prefix}-QF-1`, sportId, stage: 'Quarter Final', matchType: 'knockout',
        participant1Name: 'Pool A Winner', participant2Name: 'Pool B Runner-up', status: 'scheduled',
      }})
      await prisma.fixture.create({ data: {
        fixtureNumber: `${prefix}-QF-2`, sportId, stage: 'Quarter Final', matchType: 'knockout',
        participant1Name: 'Pool B Winner', participant2Name: 'Pool A Runner-up', status: 'scheduled',
      }})
      await prisma.fixture.create({ data: {
        fixtureNumber: `${prefix}-SF-1`, sportId, stage: 'Semi Final', matchType: 'knockout',
        participant1Name: 'Winner QF-1', participant2Name: 'Winner QF-2', status: 'scheduled',
      }})
      await prisma.fixture.create({ data: {
        fixtureNumber: `${prefix}-F-1`, sportId, stage: 'Final', matchType: 'knockout',
        participant1Name: 'Winner SF-1', participant2Name: 'Winner SF-2', status: 'scheduled',
      }})

    } else if (format === 'heats') {
      // Athletics / Swimming / Track & Field
      // Each heat = up to 8 athletes competing simultaneously (NOT 1v1 pairs)
      // One fixture per heat. participant1Name = comma-separated list of all athletes.
      // participant2Name holds lane/position info. Score fields hold times/distances.
      const participants = shuffle(registrations)
      const heatSize = 8
      const numHeats = Math.ceil(participants.length / heatSize)

      for (let h = 0; h < numHeats; h++) {
        const heat = participants.slice(h * heatSize, (h + 1) * heatSize)
        const athleteNames = heat.map((p, idx) => `Lane ${idx + 1}: ${getName(p)}`).join(' | ')
        const laneList = heat.map((_, idx) => `Lane ${idx + 1}`).join(', ')

        // Use participant1 as the first seed, participant2 as last seed
        // participant1Name contains all athletes for display
        await prisma.fixture.create({ data: {
          fixtureNumber: `${prefix}-H${h + 1}`,
          sportId,
          stage: `Heat ${h + 1}`,
          matchType: 'knockout',
          participant1Id: heat[0].id,
          participant1Name: athleteNames,          // all 8 athletes listed
          participant2Name: `${heat.length} Athletes · ${laneList}`,
          status: 'scheduled',
        }})
      }

      // Semi Final — only needed if more than 1 heat
      if (numHeats > 1) {
        const sfAthletes = `Top ${Math.min(numHeats * 3, 8)} qualifiers from Heats`
        await prisma.fixture.create({ data: {
          fixtureNumber: `${prefix}-SF-1`,
          sportId, stage: 'Semi Final', matchType: 'knockout',
          participant1Name: sfAthletes,
          participant2Name: `8 Athletes · Lanes 1–8`,
          status: 'scheduled',
        }})
        // If large field, add SF-2
        if (numHeats > 3) {
          await prisma.fixture.create({ data: {
            fixtureNumber: `${prefix}-SF-2`,
            sportId, stage: 'Semi Final', matchType: 'knockout',
            participant1Name: `Next ${Math.min(numHeats * 3, 8)} qualifiers from Heats`,
            participant2Name: `8 Athletes · Lanes 1–8`,
            status: 'scheduled',
          }})
        }
      }

      // Final — 8 finalists
      await prisma.fixture.create({ data: {
        fixtureNumber: `${prefix}-F-1`,
        sportId, stage: 'Final', matchType: 'knockout',
        participant1Name: numHeats > 1 ? 'Top 8 from Semi Finals' : `Top 8 from Heat 1`,
        participant2Name: `8 Athletes · Lanes 1–8`,
        status: 'scheduled',
      }})

    } else if (format === 'swiss') {
      // Swiss System — Chess, Carrom, Arm Wrestling etc.
      // Round 1: random pairing; admin fills subsequent rounds after results
      const participants = shuffle(registrations)
      const rounds = Math.min(Math.ceil(Math.log2(participants.length)) + 1, 5)

      for (let i = 0; i < participants.length; i += 2) {
        if (participants[i + 1]) {
          await prisma.fixture.create({ data: {
            fixtureNumber: `${prefix}-SW-R1-${fixtureNumber}`,
            sportId, stage: 'Swiss Round 1', matchType: 'league',
            participant1Id: participants[i].id, participant1Name: getName(participants[i]),
            participant2Id: participants[i + 1].id, participant2Name: getName(participants[i + 1]),
            status: 'scheduled',
          }})
        } else {
          await prisma.fixture.create({ data: {
            fixtureNumber: `${prefix}-SW-R1-${fixtureNumber}`,
            sportId, stage: 'Swiss Round 1', matchType: 'league',
            participant1Id: participants[i].id, participant1Name: getName(participants[i]),
            participant2Name: 'BYE', status: 'completed',
            winnerId: participants[i].id, score1: 'W/O', score2: '-',
          }})
        }
        fixtureNumber++
      }
      // Placeholder rows for rounds 2–N (admin fills in after R1 results)
      for (let r = 2; r <= rounds; r++) {
        await prisma.fixture.create({ data: {
          fixtureNumber: `${prefix}-SW-R${r}-1`, sportId,
          stage: `Swiss Round ${r}`, matchType: 'league',
          participant1Name: `Pair 1A (fill after Round ${r - 1})`,
          participant2Name: `Pair 1B`,
          status: 'scheduled',
        }})
      }
    }

    revalidatePath('/admin/fixtures')
    redirect('/admin/fixtures?success=Fixtures generated successfully')
  }

  // Delete fixture
  async function deleteFixture(formData: FormData) {
    'use server'
    
    const id = formData.get('id') as string

    // 1. Delete associated livescore
    await prisma.liveScore.deleteMany({
      where: { fixtureId: id },
    })

    // 2. Clear self-referencing nextFixture relations
    await prisma.fixture.updateMany({
      where: { nextFixtureId: id },
      data: { nextFixtureId: null },
    })

    // 3. Delete fixture
    await prisma.fixture.delete({ where: { id } })

    revalidatePath('/admin/fixtures')
    redirect('/admin/fixtures?success=Fixture deleted')
  }

  return (
    <div>
      {/* Success Message */}
      {success && (
        <div style={{
          padding: '16px 24px',
          borderRadius: '12px',
          background: 'rgba(76,175,80,0.15)',
          border: '1px solid rgba(76,175,80,0.4)',
          marginBottom: '24px',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#4CAF50' }}>
            ✅ {decodeURIComponent(success)}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          padding: '16px 24px',
          borderRadius: '12px',
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.4)',
          marginBottom: '24px',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#ef4444' }}>
            ❌ {decodeURIComponent(error)}
          </p>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: '48px',
            color: '#4CAF50',
            letterSpacing: '0.1em',
            marginBottom: '8px',
          }}>
            MANAGE FIXTURES
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: 'rgba(165,214,167,0.6)',
          }}>
            Total: {fixtures.length} fixtures
          </p>
        </div>

        {/* Export to PDF */}
        <a
          href="/api/fixtures/export-pdf"
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
            color: 'white',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            borderRadius: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
          }}
        >
          📄 EXPORT TO PDF
        </a>
      </div>

      {/* Generate Fixtures Form */}
      <div style={{
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid rgba(76,175,80,0.2)',
        background: 'rgba(27,94,32,0.05)',
        marginBottom: '40px',
      }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: '24px',
          color: 'white',
          marginBottom: '24px',
          letterSpacing: '0.05em',
        }}>
          AUTO-GENERATE FIXTURES
        </h2>

        <form action={generateFixtures}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '24px',
          }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                SELECT SPORT *
              </label>
              <select
                name="sportId"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <option value="">Choose sport...</option>
                {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                TOURNAMENT FORMAT *
              </label>
              <select
                name="format"
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <option value="knockout">🏆 Knockout — Single Elimination (Cricket, Football, Hockey, Basketball…)</option>
                <option value="league">📋 League — Round Robin, everyone vs everyone (small groups)</option>
                <option value="league_knockout">🔄 Group Stage + Knockout — 2 Groups then Semis & Final (Football, Hockey, Volleyball…)</option>
                <option value="pools">🎯 Pool Play + Knockout — Pools of 4 then QF/SF/Final (Badminton, Table Tennis…)</option>
                <option value="double_knockout">⚡ Double Elimination — Winners + Losers bracket (Chess, Carrom, Esports…)</option>
                <option value="heats">🏃 Heats → Semi Final → Final (Athletics, Swimming, Track & Field)</option>
                <option value="swiss">♟️ Swiss System — Paired by score each round (Chess, Carrom, Arm Wrestling)</option>
              </select>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(165,214,167,0.45)', marginTop: '8px' }}>
                Tip: Heats for Athletics/Swimming · Pools for Badminton/TT · Group+KO for Football/Hockey · Swiss for Chess/Carrom
              </p>
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '14px 32px',
              background: '#4CAF50',
              color: 'black',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            ⚡ GENERATE FIXTURES
          </button>
        </form>
      </div>

      {/* Filter */}
      <FixturesFilters sports={sports} currentSport={sport} />

      {/* Fixtures List */}
      {fixtures.length === 0 ? (
        <div style={{
          padding: '64px', textAlign: 'center', borderRadius: '16px',
          border: '1px solid rgba(76,175,80,0.15)', background: 'rgba(27,94,32,0.03)',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px', color: 'rgba(165,214,167,0.4)' }}>
            No fixtures generated yet. Use the form above to generate.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {fixtures.map((fix) => {
            const statusColor = fix.status === 'completed' ? '#4CAF50' : fix.status === 'live' ? '#ef4444' : '#FF9800'
            const statusBg   = fix.status === 'completed' ? 'rgba(76,175,80,0.12)' : fix.status === 'live' ? 'rgba(239,68,68,0.12)' : 'rgba(255,152,0,0.12)'
            const isHeats = fix.participant1Name.includes('Lane ')
            return (
              <div key={fix.id} style={{
                borderRadius: '12px',
                border: `1px solid ${fix.status === 'live' ? 'rgba(239,68,68,0.35)' : 'rgba(76,175,80,0.15)'}`,
                background: fix.status === 'live' ? 'rgba(239,68,68,0.04)' : 'rgba(27,94,32,0.03)',
                overflow: 'hidden',
              }}>
                {/* Row header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '130px 110px 130px 1fr auto',
                  alignItems: 'center',
                  gap: '0',
                  padding: '0',
                }}>
                  {/* Fixture number */}
                  <div style={{
                    padding: '16px 14px',
                    borderRight: '1px solid rgba(76,175,80,0.1)',
                  }}>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px',
                      color: '#4CAF50', fontWeight: '700', letterSpacing: '0.06em',
                    }}>{fix.fixtureNumber}</span>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(165,214,167,0.45)', marginTop: '2px' }}>
                      {fix.sport.name}
                    </div>
                  </div>

                  {/* Stage */}
                  <div style={{ padding: '16px 14px', borderRight: '1px solid rgba(76,175,80,0.1)' }}>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px',
                      color: 'rgba(165,214,167,0.75)', fontWeight: '500',
                    }}>{fix.stage}</span>
                  </div>

                  {/* Date + Venue */}
                  <div style={{ padding: '16px 14px', borderRight: '1px solid rgba(76,175,80,0.1)' }}>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(165,214,167,0.6)' }}>
                      {fix.scheduledDate ? new Date(fix.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Date TBD'}
                      {fix.scheduledTime && <span style={{ color: 'rgba(165,214,167,0.45)' }}> · {fix.scheduledTime}</span>}
                    </div>
                    <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '11px', color: 'rgba(165,214,167,0.4)', marginTop: '2px' }}>
                      {fix.venue || 'Venue TBD'}
                    </div>
                  </div>

                  {/* Participants */}
                  <div style={{ padding: '16px 14px' }}>
                    {isHeats ? (
                      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: 'rgba(165,214,167,0.8)', lineHeight: '1.5' }}>
                        {fix.participant1Name.split(' | ').map((lane, i) => (
                          <span key={i} style={{ marginRight: '12px', whiteSpace: 'nowrap' }}>{lane}</span>
                        ))}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px',
                          color: 'white', fontWeight: '600',
                        }}>{fix.participant1Name}</span>
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '14px', color: 'rgba(165,214,167,0.3)' }}>VS</span>
                        <span style={{
                          fontFamily: "'Space Grotesk', sans-serif", fontSize: '13px',
                          color: fix.participant2Name === 'BYE' ? 'rgba(165,214,167,0.35)' : 'white', fontWeight: '600',
                        }}>{fix.participant2Name}</span>
                        {(fix.score1 || fix.score2) && (
                          <span style={{
                            fontFamily: "'Space Grotesk', sans-serif", fontSize: '12px',
                            color: '#4CAF50', marginLeft: '8px', fontWeight: '700',
                          }}>
                            {fix.score1 || '–'} : {fix.score2 || '–'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status + Actions */}
                  <div style={{ padding: '16px 14px', display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid rgba(76,175,80,0.1)' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '700',
                      background: statusBg, color: statusColor,
                      border: `1px solid ${statusColor}40`,
                      fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '0.06em', whiteSpace: 'nowrap',
                    }}>
                      {fix.status === 'live' ? '🔴 LIVE' : fix.status.toUpperCase()}
                    </span>
                    <a href={`/admin/fixtures/${fix.id}/edit`} style={{
                      padding: '7px 12px', background: 'rgba(33,150,243,0.15)', color: '#2196F3',
                      border: '1px solid rgba(33,150,243,0.3)', borderRadius: '6px',
                      fontSize: '12px', fontWeight: '600', textDecoration: 'none',
                      fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap',
                    }}>✏️ Edit</a>
                    <form action={deleteFixture} style={{ margin: 0 }}>
                      <input type="hidden" name="id" value={fix.id} />
                      <ConfirmButton message="Delete this fixture?" style={{
                        padding: '7px 10px', background: 'rgba(239,68,68,0.15)', color: '#ef4444',
                        border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px',
                        fontSize: '13px', cursor: 'pointer',
                      }}>🗑️</ConfirmButton>
                    </form>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}