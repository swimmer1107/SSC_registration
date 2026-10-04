#!/bin/sh

echo ">>> Creating database tables and seeding..."

# Use node to run the seed via the built-in API logic directly
node -e "
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const tables = [
  'CREATE TABLE IF NOT EXISTS sports (id TEXT PRIMARY KEY, name TEXT UNIQUE NOT NULL, category TEXT NOT NULL, \"minTeamSize\" INT, \"maxTeamSize\" INT, \"registrationFee\" INT NOT NULL, \"isActive\" BOOL DEFAULT true, description TEXT, rules TEXT, \"createdAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS events (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT DEFAULT \\'\\', status TEXT DEFAULT \\'upcoming\\', \"academicYear\" TEXT DEFAULT \\'2025-26\\', \"registrationOpen\" BOOL DEFAULT true, icon TEXT, category TEXT DEFAULT \\'tournament\\', sport TEXT, \"prizePool\" INT, capacity TEXT, \"ctaText\" TEXT, \"ctaLink\" TEXT, gradient TEXT, \"isActive\" BOOL DEFAULT true, \"order\" INT DEFAULT 0, \"createdAt\" TIMESTAMP DEFAULT NOW(), \"updatedAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS students (id TEXT PRIMARY KEY, \"fullName\" TEXT NOT NULL, email TEXT UNIQUE NOT NULL, phone TEXT, college TEXT DEFAULT \\'\\', course TEXT DEFAULT \\'\\', year TEXT DEFAULT \\'\\', \"registrationNumber\" TEXT, gender TEXT, \"createdAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS registrations (id TEXT PRIMARY KEY, \"registrationId\" TEXT UNIQUE NOT NULL, \"studentId\" TEXT NOT NULL, \"sportId\" TEXT NOT NULL, \"isTeamEvent\" BOOL DEFAULT false, \"teamName\" TEXT, \"paymentAmount\" INT NOT NULL, \"transactionId\" TEXT, \"paymentStatus\" TEXT DEFAULT \\'pending\\', status TEXT DEFAULT \\'pending\\', \"registeredAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS registration_members (id TEXT PRIMARY KEY, \"registrationId\" TEXT NOT NULL, \"studentId\" TEXT NOT NULL, role TEXT)',
  'CREATE TABLE IF NOT EXISTS fixtures (id TEXT PRIMARY KEY, \"fixtureNumber\" TEXT UNIQUE NOT NULL, \"sportId\" TEXT NOT NULL, stage TEXT NOT NULL, \"matchType\" TEXT NOT NULL, \"participant1Name\" TEXT NOT NULL, \"participant2Name\" TEXT NOT NULL, status TEXT DEFAULT \\'scheduled\\', \"createdAt\" TIMESTAMP DEFAULT NOW(), \"updatedAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS \"LiveScore\" (id TEXT PRIMARY KEY, \"fixtureId\" TEXT UNIQUE NOT NULL, \"sportId\" TEXT NOT NULL, \"teamA\" TEXT NOT NULL, \"teamB\" TEXT NOT NULL, \"scoreA\" TEXT DEFAULT \\'0\\', \"scoreB\" TEXT DEFAULT \\'0\\', status TEXT DEFAULT \\'upcoming\\', \"updatedAt\" TIMESTAMP DEFAULT NOW(), \"createdAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS \"Result\" (id TEXT PRIMARY KEY, \"eventId\" TEXT NOT NULL, \"sportId\" TEXT NOT NULL, position INT NOT NULL, \"winnerName\" TEXT NOT NULL, \"awardedAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS event_sports (id TEXT PRIMARY KEY, \"eventId\" TEXT NOT NULL, \"sportId\" TEXT NOT NULL, price FLOAT DEFAULT 0, \"isExpired\" BOOL DEFAULT false, \"currentSlots\" INT DEFAULT 0, \"slotType\" TEXT DEFAULT \\'individual\\', UNIQUE(\"eventId\",\"sportId\"))',
  'CREATE TABLE IF NOT EXISTS admin_users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, \"passwordHash\" TEXT NOT NULL, \"fullName\" TEXT NOT NULL, role TEXT DEFAULT \\'MODERATOR\\', \"isActive\" BOOL DEFAULT true, \"createdAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS gallery_images (id TEXT PRIMARY KEY, title TEXT, \"imageUrl\" TEXT NOT NULL, category TEXT NOT NULL, \"uploadedBy\" TEXT NOT NULL, \"isActive\" BOOL DEFAULT true, \"order\" INT DEFAULT 0, \"createdAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS team_members (id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, type TEXT NOT NULL, sport TEXT, \"imageUrl\" TEXT DEFAULT \\'\\', \"isActive\" BOOL DEFAULT true, \"order\" INT DEFAULT 0, \"createdAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS notices (id TEXT PRIMARY KEY, title TEXT NOT NULL, message TEXT NOT NULL, category TEXT NOT NULL, priority TEXT DEFAULT \\'normal\\', \"sendEmail\" BOOL DEFAULT false, \"emailSentTo\" INT DEFAULT 0, \"isActive\" BOOL DEFAULT true, \"createdBy\" TEXT NOT NULL, \"createdAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS contact_messages (id TEXT PRIMARY KEY, \"fullName\" TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, status TEXT DEFAULT \\'unread\\', \"sentAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS fest_events (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, icon TEXT NOT NULL, category TEXT NOT NULL, \"ctaText\" TEXT NOT NULL, \"ctaLink\" TEXT NOT NULL, \"isActive\" BOOL DEFAULT true, \"order\" INT DEFAULT 0, \"createdAt\" TIMESTAMP DEFAULT NOW(), \"updatedAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS \"OtpCode\" (id TEXT PRIMARY KEY, contact TEXT NOT NULL, method TEXT DEFAULT \\'phone\\', code TEXT NOT NULL, \"expiresAt\" TIMESTAMP NOT NULL, used BOOL DEFAULT false, \"createdAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS council_members (id TEXT PRIMARY KEY, \"fullName\" TEXT NOT NULL, role TEXT NOT NULL, \"sportId\" TEXT, \"displayOrder\" INT DEFAULT 0, \"isActive\" BOOL DEFAULT true)',
  'CREATE TABLE IF NOT EXISTS \"GalleryPhoto\" (id TEXT PRIMARY KEY, url TEXT NOT NULL, category TEXT NOT NULL, \"displayOrder\" INT DEFAULT 0, \"uploadedAt\" TIMESTAMP DEFAULT NOW())',
  'CREATE TABLE IF NOT EXISTS \"Sponsor\" (id TEXT PRIMARY KEY, name TEXT NOT NULL, \"logoUrl\" TEXT NOT NULL, tier TEXT DEFAULT \\'main\\', \"displayOrder\" INT DEFAULT 0)',
];

async function run() {
  for (const sql of tables) {
    try { await prisma.\$executeRawUnsafe(sql) } catch(e) { /* ignore if exists */ }
  }
  try {
    const hash = bcrypt.hashSync('Admin@SSC2026', 12);
    await prisma.adminUser.upsert({
      where: { email: 'admin@gla.ac.in' },
      update: { passwordHash: hash, role: 'SUPER_ADMIN', isActive: true },
      create: { id: 'admin-1', fullName: 'SSC Super Admin', email: 'admin@gla.ac.in', passwordHash: hash, role: 'SUPER_ADMIN', isActive: true }
    });
    console.log('Admin seeded OK');
  } catch(e) { console.log('Seed note:', e.message.slice(0,80)); }
  await prisma.\$disconnect();
}
run();
" 2>&1 || true

echo ">>> Starting Next.js..."
exec npm start
