import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-seed-secret')
  if (!secret || secret !== process.env.JWT_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Step 1: Create all tables using raw SQL (safe for PostgreSQL)
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "sports" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "category" TEXT NOT NULL,
        "minTeamSize" INTEGER,
        "maxTeamSize" INTEGER,
        "registrationFee" INTEGER NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "description" TEXT,
        "rules" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "events" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL DEFAULT '',
        "startDate" TIMESTAMP,
        "endDate" TIMESTAMP,
        "venue" TEXT,
        "bannerImageUrl" TEXT,
        "status" TEXT NOT NULL DEFAULT 'upcoming',
        "academicYear" TEXT NOT NULL DEFAULT '2025-26',
        "registrationOpen" BOOLEAN NOT NULL DEFAULT true,
        "icon" TEXT,
        "category" TEXT NOT NULL DEFAULT 'tournament',
        "sport" TEXT,
        "prizePool" INTEGER,
        "capacity" TEXT,
        "ctaText" TEXT,
        "ctaLink" TEXT,
        "gradient" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "students" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "fullName" TEXT NOT NULL,
        "email" TEXT NOT NULL UNIQUE,
        "phone" TEXT,
        "college" TEXT NOT NULL DEFAULT '',
        "course" TEXT NOT NULL DEFAULT '',
        "year" TEXT NOT NULL DEFAULT '',
        "registrationNumber" TEXT,
        "gender" TEXT,
        "dateOfBirth" TIMESTAMP,
        "address" TEXT,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "registrations" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "registrationId" TEXT NOT NULL UNIQUE,
        "studentId" TEXT NOT NULL REFERENCES "students"("id"),
        "sportId" TEXT NOT NULL REFERENCES "sports"("id"),
        "isTeamEvent" BOOLEAN NOT NULL DEFAULT false,
        "teamName" TEXT,
        "paymentAmount" INTEGER NOT NULL,
        "paymentScreenshot" TEXT,
        "transactionId" TEXT,
        "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
        "status" TEXT NOT NULL DEFAULT 'pending',
        "rejectionReason" TEXT,
        "registeredAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "approvedAt" TIMESTAMP
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "registration_members" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "registrationId" TEXT NOT NULL REFERENCES "registrations"("id") ON DELETE CASCADE,
        "studentId" TEXT NOT NULL REFERENCES "students"("id"),
        "role" TEXT
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "fixtures" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "fixtureNumber" TEXT NOT NULL UNIQUE,
        "sportId" TEXT NOT NULL REFERENCES "sports"("id"),
        "stage" TEXT NOT NULL,
        "matchType" TEXT NOT NULL,
        "participant1Id" TEXT REFERENCES "registrations"("id"),
        "participant1Name" TEXT NOT NULL,
        "participant2Id" TEXT REFERENCES "registrations"("id"),
        "participant2Name" TEXT NOT NULL,
        "scheduledDate" TIMESTAMP,
        "scheduledTime" TEXT,
        "venue" TEXT,
        "score1" TEXT,
        "score2" TEXT,
        "winnerId" TEXT,
        "status" TEXT NOT NULL DEFAULT 'scheduled',
        "nextFixtureId" TEXT REFERENCES "fixtures"("id"),
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LiveScore" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "fixtureId" TEXT NOT NULL UNIQUE REFERENCES "fixtures"("id"),
        "sportId" TEXT NOT NULL REFERENCES "sports"("id"),
        "teamA" TEXT NOT NULL,
        "teamB" TEXT NOT NULL,
        "scoreA" TEXT NOT NULL DEFAULT '0',
        "scoreB" TEXT NOT NULL DEFAULT '0',
        "status" TEXT NOT NULL DEFAULT 'upcoming',
        "venue" TEXT,
        "details" TEXT,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Result" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "eventId" TEXT NOT NULL REFERENCES "events"("id"),
        "sportId" TEXT NOT NULL REFERENCES "sports"("id"),
        "position" INTEGER NOT NULL,
        "winnerName" TEXT NOT NULL,
        "certUrl" TEXT,
        "awardedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "event_sports" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "eventId" TEXT NOT NULL REFERENCES "events"("id") ON DELETE CASCADE,
        "sportId" TEXT NOT NULL REFERENCES "sports"("id"),
        "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
        "registrationDeadline" TIMESTAMP,
        "isExpired" BOOLEAN NOT NULL DEFAULT false,
        "maxSlots" INTEGER,
        "currentSlots" INTEGER NOT NULL DEFAULT 0,
        "slotType" TEXT NOT NULL DEFAULT 'individual',
        UNIQUE("eventId", "sportId")
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "admin_users" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL UNIQUE,
        "passwordHash" TEXT NOT NULL,
        "fullName" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'MODERATOR',
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "gallery_images" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT,
        "description" TEXT,
        "imageUrl" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "event" TEXT,
        "uploadedBy" TEXT NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "team_members" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "sport" TEXT,
        "imageUrl" TEXT NOT NULL DEFAULT '',
        "email" TEXT,
        "phone" TEXT,
        "bio" TEXT,
        "year" TEXT,
        "course" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "notices" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "priority" TEXT NOT NULL DEFAULT 'normal',
        "sendEmail" BOOLEAN NOT NULL DEFAULT false,
        "emailSentTo" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "createdBy" TEXT NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "contact_messages" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "fullName" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "message" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'unread',
        "sentAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "fest_events" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "icon" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "ctaText" TEXT NOT NULL,
        "ctaLink" TEXT NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "OtpCode" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "contact" TEXT NOT NULL,
        "method" TEXT NOT NULL DEFAULT 'phone',
        "code" TEXT NOT NULL,
        "expiresAt" TIMESTAMP NOT NULL,
        "used" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "council_members" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "fullName" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "designation" TEXT,
        "department" TEXT,
        "photoUrl" TEXT,
        "sportId" TEXT REFERENCES "sports"("id"),
        "instagram" TEXT,
        "linkedin" TEXT,
        "email" TEXT,
        "displayOrder" INTEGER NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT true
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "GalleryPhoto" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "url" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        "sportTag" TEXT,
        "eventTag" TEXT,
        "displayOrder" INTEGER NOT NULL DEFAULT 0,
        "uploadedAt" TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `)

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Sponsor" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "logoUrl" TEXT NOT NULL,
        "tier" TEXT NOT NULL DEFAULT 'main',
        "displayOrder" INTEGER NOT NULL DEFAULT 0
      )
    `)

    // Also mark migration as applied
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
        "id" VARCHAR(36) NOT NULL PRIMARY KEY,
        "checksum" VARCHAR(64) NOT NULL,
        "finished_at" TIMESTAMPTZ,
        "migration_name" VARCHAR(255) NOT NULL,
        "logs" TEXT,
        "rolled_back_at" TIMESTAMPTZ,
        "started_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        "applied_steps_count" INTEGER NOT NULL DEFAULT 0
      )
    `)

    // Step 2: Seed admin
    const hash = await bcrypt.hash('Admin@SSC2026', 12)
    await prisma.adminUser.upsert({
      where: { email: 'admin@gla.ac.in' },
      update: { passwordHash: hash, role: 'SUPER_ADMIN', isActive: true },
      create: { fullName: 'SSC Super Admin', email: 'admin@gla.ac.in', passwordHash: hash, role: 'SUPER_ADMIN', isActive: true },
    })

    // Step 3: Seed sports
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

    return NextResponse.json({
      success: true,
      message: 'Tables created and database seeded successfully',
      admin: { email: 'admin@gla.ac.in', role: 'SUPER_ADMIN' },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
