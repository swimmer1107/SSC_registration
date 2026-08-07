import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sport = await prisma.sport.findUnique({ where: { id } })
    if (!sport) return NextResponse.json({ success: false, error: 'Sport not found' }, { status: 404 })

    await prisma.sport.update({ where: { id }, data: { isActive: !sport.isActive } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to toggle sport' }, { status: 500 })
  }
}
