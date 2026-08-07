import { NextResponse } from 'next/server'
import { getAdminFromCookie } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const tokenData = await getAdminFromCookie()
  if (!tokenData) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Always fetch fresh role/name from DB — never trust stale JWT payload
  const admin = await prisma.adminUser.findUnique({
    where: { id: tokenData.id },
    select: { id: true, email: true, fullName: true, role: true, isActive: true },
  })

  if (!admin || !admin.isActive) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ admin })
}
