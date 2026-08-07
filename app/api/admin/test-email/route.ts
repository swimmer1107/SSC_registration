import { NextRequest, NextResponse } from 'next/server'
import { sendNoticeMail } from '@/lib/mail'

// Quick SMTP test — only usable in development
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  const { to } = await request.json()
  if (!to) return NextResponse.json({ error: 'Missing "to" email' }, { status: 400 })

  const ok = await sendNoticeMail(
    to,
    'Test User',
    'SMTP Test — AAGAAZ 2026',
    'This is a test email to verify your Gmail SMTP configuration is working correctly.',
    'info'
  )

  if (ok) {
    return NextResponse.json({ success: true, message: `Test email sent to ${to}` })
  } else {
    return NextResponse.json({ success: false, message: 'Failed to send — check server logs for SMTP error' }, { status: 500 })
  }
}
