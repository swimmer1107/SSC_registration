import { prisma } from '@/lib/prisma'
import { ok, guard } from '@/lib/api'

export const GET = guard(async () => {
  const sports = await prisma.sport.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      category: true,
      registrationFee: true,
      minTeamSize: true,
      maxTeamSize: true,
    }
  })
  return ok({ sports })
})
