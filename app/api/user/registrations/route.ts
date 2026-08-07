import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('student_session')?.value
    if (!token) return NextResponse.json({ registrations: [] })

    const decoded = await adminAuth.verifyIdToken(token)
    const email = decoded.email
    if (!email) return NextResponse.json({ registrations: [] })

    const student = await prisma.student.findUnique({
      where: { email },
      select: { id: true, fullName: true, email: true, college: true, course: true, year: true },
    })

    if (!student) return NextResponse.json({ registrations: [] })

    const registrations = await prisma.registration.findMany({
      where: { studentId: student.id },
      include: {
        sport: { select: { name: true, category: true } },
      },
      orderBy: { registeredAt: 'desc' },
    })

    return NextResponse.json({ student, registrations })
  } catch {
    return NextResponse.json({ registrations: [] })
  }
}
