import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const count = await prisma.registration.count({ where: { sportId: id } })
    if (count > 0) {
      return NextResponse.json({ success: false, error: 'Cannot delete sport with existing registrations' }, { status: 400 })
    }
    await prisma.sport.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete sport' }, { status: 500 })
  }
}
