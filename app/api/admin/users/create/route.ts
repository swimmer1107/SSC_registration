import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/auth/protectRoute'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    await requirePermission('canManageAdminUsers')
    const { email, fullName, password, role } = await request.json()

    const existing = await prisma.adminUser.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    await prisma.adminUser.create({ data: { email, fullName, passwordHash, role, isActive: true } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 })
  }
}
