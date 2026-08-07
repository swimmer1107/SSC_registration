import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth/protectRoute'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission('canManageAdminUsers')
    const { id } = await params
    const user = await prisma.adminUser.findUnique({ where: { id } })
    if (!user) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    await prisma.adminUser.update({ where: { id }, data: { isActive: !user.isActive } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
  }
}
