import { prisma } from '@/lib/prisma'
import { ok, guard } from '@/lib/api'

export const GET = guard(async () => {
  const events = await prisma.event.findMany({
    where: { status: 'upcoming' },
    include: {
      eventSports: {
        include: {
          sport: true
        }
      }
    }
  })
  return ok({ events })
})
