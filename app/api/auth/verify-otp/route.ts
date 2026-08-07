import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { contact, code } = await request.json()

    if (!contact || !code) {
      return NextResponse.json(
        { success: false, error: 'Contact and OTP code are required' },
        { status: 400 }
      )
    }

    // Find the OTP
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        contact,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired OTP. Please try again.' },
        { status: 401 }
      )
    }

    // Mark OTP as used
    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    })

    // Find or create student
    const isEmail = contact.includes('@')
    const whereClause = isEmail ? { email: contact } : { phone: contact }

    let student = await prisma.student.findFirst({ where: whereClause })

    if (!student) {
      student = await prisma.student.create({
        data: {
          email: isEmail ? contact : `${contact}@placeholder.ssc.com`,
          phone: isEmail ? null : contact,
          fullName: '',
          college: '',
          course: '',
          year: '',
        },
      })
    }

    const isProfileComplete = !!(student.fullName && student.college && student.course && student.year && !student.email.endsWith('@placeholder.ssc.com'))

    // Issue a student JWT
    const token = jwt.sign(
      { id: student.id, contact },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      success: true,
      profileComplete: isProfileComplete,
      studentId: student.id,
    })

    response.cookies.set('student_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[verify-otp error]', error)
    return NextResponse.json(
      { success: false, error: 'Verification failed. Try again.' },
      { status: 500 }
    )
  }
}
