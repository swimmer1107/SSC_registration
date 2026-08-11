// scripts/seed.mjs - runs at startup using native Node ESM, no tsx needed
import { PrismaClient } from '@prisma/client'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

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

async function main() {
  // Upsert admin
  const hash = await bcrypt.hash('Admin@SSC2026', 12)
  await prisma.adminUser.upsert({
    where: { email: 'admin@gla.ac.in' },
    update: { passwordHash: hash, role: 'SUPER_ADMIN', isActive: true },
    create: { fullName: 'SSC Super Admin', email: 'admin@gla.ac.in', passwordHash: hash, role: 'SUPER_ADMIN', isActive: true },
  })

  // Upsert sports
  for (const sport of sports) {
    await prisma.sport.upsert({
      where: { name: sport.name },
      update: {},
      create: { ...sport, isActive: true },
    })
  }

  console.log('✓ Seeded admin and sports')
}

main()
  .catch(e => { console.error('Seed error:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
