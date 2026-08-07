import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit } from '@/lib/rateLimit/middleware'

async function handler(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json()
    const { email, phone, sportId } = body

    if (!email && !phone) return NextResponse.json({ exists: false })

    let exists = false

    if (sportId) {
      // Per-sport check: only flag duplicate if registered for the SAME sport
      if (email) {
        const student = await prisma.student.findUnique({ where: { email }, select: { id: true } })
        if (student) {
          const reg = await prisma.registration.findFirst({ where: { studentId: student.id, sportId }, select: { id: true } })
          exists = !!reg
        }
      }
      if (!exists && phone) {
        const student = await prisma.student.findFirst({ where: { phone }, select: { id: true } })
        if (student) {
          const reg = await prisma.registration.findFirst({ where: { studentId: student.id, sportId }, select: { id: true } })
          exists = !!reg
        }
      }
    } else {
      // Global check
      if (email) {
        const count = await prisma.student.count({ where: { email } })
        exists = count > 0
      }
      if (!exists && phone) {
        const count = await prisma.student.count({ where: { phone } })
        exists = count > 0
      }
    }

    return NextResponse.json({ exists })
  } catch {
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 })
  }
}

// 100 checks per minute per IP
export const POST = withRateLimit(handler, 100, 60)
