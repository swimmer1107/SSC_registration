// app/(public)/team/page.tsx
import { prisma } from '@/lib/prisma'
import TeamPageClient from './TeamPageClient'

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const councilMembers = await prisma.teamMember.findMany({
    where: { isActive: true, type: 'council' },
    orderBy: { order: 'asc' },
  })

  const captains = await prisma.teamMember.findMany({
    where: { isActive: true, type: 'captain' },
    orderBy: { order: 'asc' },
  })

  return <TeamPageClient councilMembers={councilMembers} captains={captains} />
}