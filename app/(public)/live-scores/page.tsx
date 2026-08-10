// app/(public)/live-scores/page.tsx
import { prisma } from '@/lib/prisma'
import ParticleBackground from '@/components/visuals/ParticleBackground'
import LiveScoresClient from '@/components/live-scores/LiveScoresClient'

export const dynamic = 'force-dynamic'

export default async function LiveScoresPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; tab?: string }>
}) {
  const { sport, tab } = await searchParams
  const selectedTab = (tab || 'live') as 'live' | 'upcoming' | 'completed'
  const selectedSport = sport || 'all'

  // Fetch data from database
  const fixtures = await prisma.fixture.findMany({
    where: {
      ...(selectedSport !== 'all' && { sportId: selectedSport }),
      status: selectedTab === 'live' ? 'live' : selectedTab === 'upcoming' ? 'scheduled' : 'completed',
    },
    include: {
      sport: true,
    },
    orderBy: selectedTab === 'completed' ? { updatedAt: 'desc' } : { scheduledDate: 'asc' },
  })

  const sports = await prisma.sport.findMany({ where: { isActive: true } })

  // Map database fixtures to the format expected by the UI
  const matches = fixtures.map(f => {
    const isHeat = f.participant1Name.includes('Lane ') || 
                   f.stage.toLowerCase().includes('heat') ||
                   f.stage.toLowerCase().includes('final') && f.participant1Name.toLowerCase().includes('qualifier')

    return {
      id: f.id,
      sport: f.sport.name,
      teamA: f.participant1Name,
      teamB: f.participant2Name,
      scoreA: f.score1 || '0',
      scoreB: f.score2 || '0',
      status: f.status === 'live' ? 'LIVE' : f.status === 'completed' ? 'FINAL' : `${f.scheduledDate ? new Date(f.scheduledDate).toLocaleDateString() : 'TBD'} ${f.scheduledTime || ''}`,
      time: f.scheduledTime ?? undefined,
      venue: f.venue ?? undefined,
      winner: f.winnerId === f.participant1Id ? f.participant1Name : f.participant2Name,
      progress: f.status === 'live' ? 50 : 0,
      stage: f.stage,
      isHeat,
    }
  })

  return (
    <div style={{ 
      background: '#030A03', 
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <ParticleBackground />
      
      <LiveScoresClient 
        initialMatches={matches} 
        sports={sports} 
        selectedTab={selectedTab}
        selectedSport={selectedSport}
      />
    </div>
  )
}