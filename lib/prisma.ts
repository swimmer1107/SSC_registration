import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  seeded: boolean | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Auto-seed on first use in production — creates admin + sports if DB is empty
async function autoSeed() {
  if (globalForPrisma.seeded) return
  globalForPrisma.seeded = true

  try {
    const adminCount = await prisma.adminUser.count()
    if (adminCount > 0) return // already seeded

    const hash = await bcrypt.hash('Admin@SSC2026', 12)
    await prisma.adminUser.upsert({
      where: { email: 'admin@gla.ac.in' },
      update: { passwordHash: hash, role: 'SUPER_ADMIN', isActive: true },
      create: { fullName: 'SSC Super Admin', email: 'admin@gla.ac.in', passwordHash: hash, role: 'SUPER_ADMIN', isActive: true },
    })

    const sports = [
      { name: 'Cricket', category: 'team', minTeamSize: 11, maxTeamSize: 15, registrationFee: 1500 },
      { name: 'Football', category: 'team', minTeamSize: 11, maxTeamSize: 18, registrationFee: 2000 },
      { name: 'Basketball', category: 'team', minTeamSize: 5, maxTeamSize: 10, registrationFee: 1000 },
      { name: 'Volleyball', category: 'team', minTeamSize: 6, maxTeamSize: 12, registrationFee: 800 },
      { name: 'Badminton', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 200 },
      { name: 'Table Tennis', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 200 },
      { name: 'Lawn Tennis', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 300 },
      { name: 'Chess', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 100 },
      { name: 'Athletics', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 150 },
      { name: 'Swimming', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 250 },
      { name: 'Kabaddi', category: 'team', minTeamSize: 7, maxTeamSize: 12, registrationFee: 1000 },
      { name: 'Kho Kho', category: 'team', minTeamSize: 9, maxTeamSize: 12, registrationFee: 800 },
      { name: 'Hockey', category: 'team', minTeamSize: 11, maxTeamSize: 16, registrationFee: 1500 },
      { name: 'Squash', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 400 },
      { name: 'Wrestling', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 300 },
      { name: 'Boxing', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 300 },
    ]

    for (const sport of sports) {
      await prisma.sport.upsert({
        where: { name: sport.name },
        update: {},
        create: { ...sport, isActive: true },
      })
    }

    console.log('[auto-seed] Admin and sports created successfully')
  } catch (e) {
    globalForPrisma.seeded = false // allow retry on next request
    console.error('[auto-seed] Failed:', e)
  }
}

// Trigger auto-seed (non-blocking)
if (process.env.NODE_ENV === 'production') {
  autoSeed()
}
