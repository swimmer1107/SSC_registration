import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withCache } from '@/lib/cache/withCache'
import { cacheKeys } from '@/lib/cache/cache'

export const revalidate = 300

export async function GET() {
  try {
    const sports = await withCache(
      cacheKeys.activeSports,
      () => prisma.sport.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
        select: {
          id: true, name: true, category: true,
          minTeamSize: true, maxTeamSize: true,
          registrationFee: true, description: true, rules: true,
        },
      }),
      600 // 10 minutes
    )
    return NextResponse.json({ success: true, sports })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Failed'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
