import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const sports = [
    { name: 'Cricket', icon: '🏏', category: 'team', minTeamSize: 11, maxTeamSize: 15, registrationFee: 1500, isActive: true },
    { name: 'Football', icon: '⚽', category: 'team', minTeamSize: 11, maxTeamSize: 18, registrationFee: 2000, isActive: true },
    { name: 'Basketball', icon: '🏀', category: 'team', minTeamSize: 5, maxTeamSize: 10, registrationFee: 1000, isActive: true },
    { name: 'Volleyball', icon: '🏐', category: 'team', minTeamSize: 6, maxTeamSize: 12, registrationFee: 800, isActive: true },
    { name: 'Badminton', icon: '🏸', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 200, isActive: true },
    { name: 'Table Tennis', icon: '🏓', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 200, isActive: true },
    { name: 'Lawn Tennis', icon: '🎾', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 300, isActive: true },
    { name: 'Chess', icon: '♟️', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 100, isActive: true },
    { name: 'Athletics', icon: '🏃', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 150, isActive: true },
    { name: 'Swimming', icon: '🏊', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 250, isActive: true },
    { name: 'Kabaddi', icon: '🤼', category: 'team', minTeamSize: 7, maxTeamSize: 12, registrationFee: 1000, isActive: true },
    { name: 'Kho Kho', icon: '🏃‍♂️', category: 'team', minTeamSize: 9, maxTeamSize: 12, registrationFee: 800, isActive: true },
    { name: 'Hockey', icon: '🏑', category: 'team', minTeamSize: 11, maxTeamSize: 16, registrationFee: 1500, isActive: true },
    { name: 'Squash', icon: '🎾', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 400, isActive: true },
    { name: 'Wrestling', icon: '🤼‍♂️', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 300, isActive: true },
    { name: 'Boxing', icon: '🥊', category: 'individual', minTeamSize: 1, maxTeamSize: 1, registrationFee: 300, isActive: true },
  ]

  for (const sport of sports) {
    await prisma.sport.upsert({
      where: { name: sport.name },
      update: {},
      create: sport,
    })
  }

  const hash = await bcrypt.hash('Admin@SSC2026', 12)
  await prisma.adminUser.upsert({
    where: { email: 'admin@gla.ac.in' },
    update: { role: 'SUPER_ADMIN' },
    create: {
      fullName: 'SSC Super Admin',
      email: 'admin@gla.ac.in',
      passwordHash: hash,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  })

  const event = await prisma.event.upsert({
    where: { id: 'aagaaz-2026' },
    update: {},
    create: {
      id: 'aagaaz-2026',
      title: 'AAGAAZ 2026',
      description: 'Annual sports festival of GLA University',
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-04-05'),
      venue: 'GLA University Sports Complex',
      status: 'upcoming',
      academicYear: '2025-26',
    },
  })

  await prisma.festEvent.deleteMany()

  const festEvents = [
    {
      title: 'MEGA PERFORMANCES',
      description: 'Live concerts and cultural nights featuring top artists from across India.',
      icon: '🎤',
      category: 'performance',
      ctaText: 'See Lineup',
      ctaLink: '/events/performances',
      order: 1,
      isActive: true,
    },
    {
      title: 'WORKSHOPS',
      description: 'Masterclasses by industry experts and veteran athletes.',
      icon: '🎨',
      category: 'workshop',
      ctaText: 'View Schedule',
      ctaLink: '/events/workshops',
      order: 2,
      isActive: true,
    },
    {
      title: 'FESTIVE AMBIENCE',
      description: 'Immersive themes and artistic installations across the entire campus.',
      icon: '🎭',
      category: 'festive',
      ctaText: 'Explore',
      ctaLink: '/events/festive',
      order: 3,
      isActive: true,
    },
    {
      title: 'CULTURAL NETWORKING',
      description: 'Connect with peers from over 300+ colleges nationwide. Build lifelong bonds.',
      icon: '🤝',
      category: 'networking',
      ctaText: 'Join Community',
      ctaLink: '/events/networking',
      order: 4,
      isActive: true,
    },
  ]

  for (const fe of festEvents) {
    await prisma.festEvent.create({ data: fe })
  }

  await prisma.event.deleteMany({ where: { category: 'tournament' } })

  const tournaments = [
    {
      title: 'CRICKET CHAMPIONSHIP',
      description: 'Experience intense cricket action in our premier tournament. T20, ODI, and Test formats with professional commentary.',
      icon: '🏏',
      category: 'tournament',
      sport: 'Cricket',
      prizePool: 50000,
      capacity: '16 Teams',
      ctaText: 'View Fixtures',
      ctaLink: '/events/cricket',
      gradient: 'linear-gradient(135deg, rgba(27,94,32,0.15) 0%, rgba(76,175,80,0.05) 100%)',
      order: 1,
      isActive: true,
    },
    {
      title: 'FOOTBALL LEAGUE',
      description: 'Join the ultimate football showdown. Professional pitches, expert coaching, and thrilling matches await.',
      icon: '⚽',
      category: 'tournament',
      sport: 'Football',
      prizePool: 40000,
      capacity: '12 Teams',
      ctaText: 'Register Now',
      ctaLink: '/events/football',
      gradient: 'linear-gradient(135deg, rgba(33,150,243,0.1) 0%, rgba(76,175,80,0.05) 100%)',
      order: 2,
      isActive: true,
    },
    {
      title: 'BASKETBALL SLAM',
      description: 'Fast-paced basketball action on state-of-the-art indoor courts. Show your skills in this high-energy tournament.',
      icon: '🏀',
      category: 'tournament',
      sport: 'Basketball',
      prizePool: 30000,
      capacity: '10 Teams',
      ctaText: 'View Schedule',
      ctaLink: '/events/basketball',
      gradient: 'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(76,175,80,0.05) 100%)',
      order: 3,
      isActive: true,
    },
  ]

  for (const t of tournaments) {
    await prisma.event.create({ data: t })
  }

  console.log('✓ Seeded 16 sports, 1 admin, 1 event, fest events, and tournaments')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
