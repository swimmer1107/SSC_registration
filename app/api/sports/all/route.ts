import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const sports = await prisma.sport.findMany({ orderBy: { name: 'asc' } })
    return NextResponse.json({ sports })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch sports' }, { status: 500 })
  }
}
