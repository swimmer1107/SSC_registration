import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth/protectRoute'

export async function POST(request: NextRequest) {
  try {
    await requirePermission('canManageLiveScores')
    const { id, winnerId } = await request.json()

    await prisma.fixture.update({
      where: { id },
      data: {
        status: 'completed',
        winnerId: winnerId || null,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Complete fixture error:', error)
    return NextResponse.json({ success: false, error: 'Failed to complete fixture' }, { status: 500 })
  }
}
