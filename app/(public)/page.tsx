import { HeroSection } from '@/components/home/HeroSection'
import { StatsBar } from '@/components/home/StatsBar'
import { AboutSection } from '@/components/home/AboutSection'
import { NoticesSection } from '@/components/home/NoticesSection'
import { SponsorsSection } from '@/components/home/SponsorsSection'
import { CommunitySection } from '@/components/home/CommunitySection'
import { ContactSection } from '@/components/home/ContactSection'
import { prisma } from '@/lib/prisma'
import { DynamicEventsSection } from '@/components/home/DynamicEventsSection'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let events: any[] = []
  let notices: any[] = []
  
  try {
    ;[events, notices] = await Promise.all([
      prisma.event.findMany({
        where: { isActive: true, category: 'tournament' },
        orderBy: { order: 'asc' },
      }),
      prisma.notice.findMany({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 4,
      }),
    ])
  } catch (e) {
    console.error('[HomePage] DB error:', e)
  }

  return (
    <>
      <HeroSection />
      <StatsBar />
      <DynamicEventsSection events={events} />
      <AboutSection />
      <NoticesSection notices={notices} />
      <SponsorsSection />
      <CommunitySection />
      <ContactSection />
    </>
  )
}
