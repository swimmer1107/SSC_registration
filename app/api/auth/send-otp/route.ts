import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendOTP } from '@/lib/otp'

export async function POST(request: NextRequest) {
  try {
    const { contact, method } = await request.json()

    if (!contact) {
      return NextResponse.json({ success: false, error: 'Contact is required' }, { status: 400 })
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Save to DB
    await prisma.otpCode.create({
      data: {
        contact,
        method: method || 'email',
        code,
        expiresAt,
      },
    })

    // Send OTP
    const result = await sendOTP(contact, code, method || 'email')

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('OTP Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
