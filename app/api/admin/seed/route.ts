import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

// One-time seed endpoint — protected by SEED_SECRET env var
export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-seed-secret')
  if (!secret || secret !== process.env.JWT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Create super admin
    const hash = await bcrypt.hash('Admin@SSC2026', 12)
    const admin = await prisma.adminUser.upsert({
      where: { email: 'admin@gla.ac.in' },
      update: { passwordHash: hash, role: 'SUPER_ADMIN', isActive: true },
      create: {
        fullName: 'SSC Super Admin',
        email: 'admin@gla.ac.in',
        passwordHash: hash,
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    })

    // Seed sports
    const sports = [
      { name: 'Cricket', category: 'team', minTeamSize: 11, maxTeamSize: 15, registrationFee: 1500 },
      { name: 'Football', category: 'team', minTeamSize: 11, maxTeamSize: 18, registrationFee: 2000 },
      { name: 'Basketball', category: 'team', minTeamSize: 5, maxTeamSize: 10, registrationFee: 1000 },
      { name: 'Volleyball', category: 'team', minTeamSize: 6, maxTeamSize: 12, registrationFee: 800 },
      { name: 'Badminton', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 200 },
      { name: 'Table Tennis', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 200 },
      { name: 'Chess', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 100 },
      { name: 'Athletics', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 150 },
    ]

    for (const sport of sports) {
      await prisma.sport.upsert({
        where: { name: sport.name },
        update: {},
        create: { ...sport, isActive: true },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      admin: { email: admin.email, role: admin.role },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
