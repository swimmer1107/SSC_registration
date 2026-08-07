import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import { requirePermission } from '@/lib/auth/protectRoute'
import AdminFilters from '@/components/admin/AdminFilters'

export default async function AdminResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string }>
}) {
  await requirePermission('canManageResults')

  const { sport } = await searchParams

  // Fetch completed fixtures
  const results = await prisma.fixture.findMany({
    where: {
      status: 'completed',
      ...(sport && { sportId: sport }),
    },
    include: {
      sport: true,
      participant1: { include: { student: true } },
      participant2: { include: { student: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  const sports = await prisma.sport.findMany({ where: { isActive: true } })

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: '48px',
            color: '#4CAF50',
            letterSpacing: '0.1em',
          }}>
            MATCH RESULTS
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: 'rgba(165,214,167,0.6)',
          }}>
            View and export completed match results
          </p>
        </div>

        {/* Export Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <a
            href={`/api/results/export-pdf?sport=${sport || ''}`}
            style={{
              padding: '14px 28px',
              background: '#4CAF50',
              color: 'black',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            📄 EXPORT PDF
          </a>
          <a
            href={`/api/results/export-excel?sport=${sport || ''}`}
            style={{
              padding: '14px 28px',
              background: 'rgba(76,175,80,0.15)',
              color: '#4CAF50',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              borderRadius: '8px',
              border: '1px solid rgba(76,175,80,0.4)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            📊 EXPORT EXCEL
          </a>
        </div>
      </div>

      {/* Sport Filter */}
      <AdminFilters
        sports={sports}
        currentSport={sport}
        showStatusFilter={false}
        basePath="/admin/results"
      />

      {/* Results Table */}
      <div style={{
        borderRadius: '12px',
        border: '1px solid rgba(76,175,80,0.2)',
        background: 'rgba(27,94,32,0.03)',
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(76,175,80,0.2)', background: 'rgba(27,94,32,0.08)' }}>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: 'rgba(165,214,167,0.7)', fontSize: '12px', textTransform: 'uppercase' }}>Fixture</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: 'rgba(165,214,167,0.7)', fontSize: '12px', textTransform: 'uppercase' }}>Sport</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: 'rgba(165,214,167,0.7)', fontSize: '12px', textTransform: 'uppercase' }}>Stage</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: 'rgba(165,214,167,0.7)', fontSize: '12px', textTransform: 'uppercase' }}>Match</th>
              <th style={{ padding: '16px 20px', textAlign: 'center', color: 'rgba(165,214,167,0.7)', fontSize: '12px', textTransform: 'uppercase' }}>Score</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: 'rgba(165,214,167,0.7)', fontSize: '12px', textTransform: 'uppercase' }}>Winner</th>
              <th style={{ padding: '16px 20px', textAlign: 'left', color: 'rgba(165,214,167,0.7)', fontSize: '12px', textTransform: 'uppercase' }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '60px', textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: '14px', color: 'rgba(165,214,167,0.5)' }}>
                  No completed matches yet
                </td>
              </tr>
            ) : (
              results.map((result) => {
                const winnerName = result.winnerId === result.participant1Id
                  ? result.participant1Name
                  : result.participant2Name

                return (
                  <tr key={result.id} style={{ borderBottom: '1px solid rgba(76,175,80,0.1)' }}>
                    <td style={{ padding: '16px 20px', color: '#4CAF50', fontSize: '14px', fontWeight: '600' }}>
                      {result.fixtureNumber}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'white', fontSize: '14px' }}>
                      {result.sport.name}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'rgba(165,214,167,0.7)', fontSize: '13px' }}>
                      {result.stage}
                    </td>
                    <td style={{ padding: '16px 20px', color: 'white', fontSize: '14px' }}>
                      {result.participant1Name} vs {result.participant2Name}
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '18px', fontWeight: 'bold', color: '#4CAF50' }}>
                        {result.score1 ?? '—'} - {result.score2 ?? '—'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ padding: '6px 16px', borderRadius: '9999px', background: 'rgba(76,175,80,0.15)', color: '#4CAF50', fontSize: '13px', fontWeight: '600' }}>
                        🏆 {winnerName}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'rgba(165,214,167,0.6)', fontSize: '13px' }}>
                      {new Date(result.updatedAt).toLocaleDateString()}
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