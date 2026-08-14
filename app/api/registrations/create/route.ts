import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit } from '@/lib/rateLimit/middleware'
import { cache, cacheKeys } from '@/lib/cache/cache'
import { z } from 'zod'

const schema = z.object({
  student: z.object({
    fullName: z.string().min(2).max(100),
    email: z.string().email(),
    phone: z.string().regex(/^[0-9]{10}$/),
    college: z.string().min(1),
    course: z.string().optional().default(''),
    year: z.string().optional().default(''),
    registrationNumber: z.string().optional(),
    gender: z.string().optional(),
  }),
  sportId: z.string().min(1),
  isTeamEvent: z.boolean(),
  teamName: z.string().nullable().optional(),
  teamMembers: z.array(z.object({
    name: z.string().optional(),
    fullName: z.string().optional(),
    email: z.string().email(),
    phone: z.string().regex(/^[0-9]{10}$/),
    role: z.string().optional(),
  })).optional(),
  paymentAmount: z.number().optional(),
  transactionId: z.string().min(8),
})

async function handler(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const validated = schema.parse(body)
    const { student, sportId, isTeamEvent, teamName, teamMembers, transactionId } = validated

    // 1. Fetch sport (select only needed fields)
    const sport = await prisma.sport.findUnique({
      where: { id: sportId },
      select: { id: true, name: true, category: true, isActive: true, registrationFee: true, minTeamSize: true, maxTeamSize: true },
    })
    if (!sport || !sport.isActive) {
      return NextResponse.json({ success: false, error: 'Sport not available' }, { status: 400 })
    }

    const expectedTeam = sport.category === 'team'
    if (expectedTeam !== !!isTeamEvent) {
      return NextResponse.json({ success: false, error: `Selected sport is a ${sport.category} sport` }, { status: 400 })
    }

    // 2. Duplicate transaction ID check
    const dupTx = await prisma.registration.findFirst({ where: { transactionId }, select: { id: true } })
    if (dupTx) {
      return NextResponse.json({ success: false, error: 'This Transaction ID has already been submitted!' }, { status: 400 })
    }

    // 3. Duplicate registration check (email × sport)
    const existingStudent = await prisma.student.findUnique({
      where: { email: student.email },
      select: { id: true },
    })
    if (existingStudent) {
      const dupReg = await prisma.registration.findFirst({
        where: { studentId: existingStudent.id, sportId },
        select: { id: true },
      })
      if (dupReg) {
        return NextResponse.json({ success: false, error: 'You are already registered for this sport!' }, { status: 400 })
      }
    }

    // 4. Team validation
    if (expectedTeam) {
      if (!teamName?.trim()) {
        return NextResponse.json({ success: false, error: 'Team name is required' }, { status: 400 })
      }
      const minRequired = (sport.minTeamSize || 2) - 1
      const maxAllowed = (sport.maxTeamSize || 20) - 1
      if (!teamMembers || teamMembers.length < minRequired) {
        return NextResponse.json({ success: false, error: `At least ${minRequired} team member(s) required` }, { status: 400 })
      }
      if (teamMembers.length > maxAllowed) {
        return NextResponse.json({ success: false, error: `Maximum ${maxAllowed} team member(s) allowed` }, { status: 400 })
      }
      const incomplete = teamMembers.some(m => !m.email || !m.phone)
      if (incomplete) {
        return NextResponse.json({ success: false, error: 'Fill in email and phone for all team members' }, { status: 400 })
      }
    }

    // 5. Transaction — atomic write for consistency under high load
    const result = await prisma.$transaction(async (tx) => {
      // Upsert primary student
      const primaryStudent = await tx.student.upsert({
        where: { email: student.email },
        update: {
          fullName: student.fullName,
          phone: student.phone,
          college: student.college,
          course: student.course || '',
          year: student.year || '',
          registrationNumber: student.registrationNumber || null,
          gender: student.gender || null,
        },
        create: {
          fullName: student.fullName,
          email: student.email,
          phone: student.phone,
          college: student.college,
          course: student.course || '',
          year: student.year || '',
          registrationNumber: student.registrationNumber || null,
          gender: student.gender || null,
        },
      })

      // Generate registration ID
      const count = await tx.registration.count()
      const regId = `AAGAAZ-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`

      // Create registration
      const registration = await tx.registration.create({
        data: {
          registrationId: regId,
          studentId: primaryStudent.id,
          sportId,
          isTeamEvent: expectedTeam,
          teamName: expectedTeam ? teamName : null,
          paymentAmount: sport.registrationFee,
          transactionId,
          paymentStatus: 'pending',
          status: 'pending',
        },
      })

      // Team members
      if (expectedTeam && teamMembers?.length) {
        for (const member of teamMembers) {
          const memberName = member.name || member.fullName || ''
          const memberStudent = await tx.student.upsert({
            where: { email: member.email },
            update: { fullName: memberName, phone: member.phone, college: student.college, course: '', year: '' },
            create: { fullName: memberName, email: member.email, phone: member.phone, college: student.college, course: '', year: '' },
          })
          await tx.registrationMember.create({
            data: { registrationId: registration.id, studentId: memberStudent.id, role: member.role || 'Player' },
          })
        }
      }

      return regId
    })

    // 6. Invalidate caches
    cache.delete(cacheKeys.studentRegistrations(student.email))
    cache.delete(cacheKeys.registrationCount(sportId))

    return NextResponse.json({ success: true, registrationId: result })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const fields = error.issues.map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`).join(', ')
      return NextResponse.json({ success: false, error: `Invalid data: ${fields}` }, { status: 400 })
    }
    const err = error as any
    if (err?.code === 'P2002') {
      return NextResponse.json({ success: false, error: 'Already registered for this sport' }, { status: 400 })
    }
    console.error('Registration Error:', error)
    return NextResponse.json({ success: false, error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}

// 30 registrations per minute per IP
export const POST = withRateLimit(handler, 30, 60)
