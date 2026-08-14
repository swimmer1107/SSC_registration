// scripts/seed.mjs - creates tables via raw SQL then seeds data
import { PrismaClient } from '@prisma/client'
import { createRequire } from 'module'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const require = createRequire(import.meta.url)
const bcrypt = require('bcryptjs')
const __dirname = dirname(fileURLToPath(import.meta.url))

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

async function createTables() {
  const sql = readFileSync(
    join(__dirname, '../prisma/migrations/20260424043736_init/migration.sql'),
    'utf8'
  )
  // Split by semicolon and run each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  for (const stmt of statements) {
    try {
      await prisma.$executeRawUnsafe(stmt)
    } catch (e) {
      // Ignore "already exists" errors
      if (!e.message.includes('already exists') && !e.message.includes('duplicate')) {
        console.warn('SQL warning:', e.message.slice(0, 100))
      }
    }
  }
  console.log('✓ Tables created/verified')
}

async function main() {
  console.log('Creating tables...')
  await createTables()

  console.log('Seeding data...')
  const adminCount = await prisma.adminUser.count()
  if (adminCount === 0) {
    const hash = await bcrypt.hash('Admin@SSC2026', 12)
    await prisma.adminUser.create({
      data: { fullName: 'SSC Super Admin', email: 'admin@gla.ac.in', passwordHash: hash, role: 'SUPER_ADMIN', isActive: true },
    })
    console.log('✓ Admin user created')
  } else {
    console.log('✓ Admin already exists')
  }

  for (const sport of sports) {
    await prisma.sport.upsert({
      where: { name: sport.name },
      update: {},
      create: { ...sport, isActive: true },
    })
  }
  console.log('✓ Sports seeded')
}

main()
  .catch(e => { console.error('Fatal:', e.message); process.exit(1) })
  .finally(() => prisma.$disconnect())
