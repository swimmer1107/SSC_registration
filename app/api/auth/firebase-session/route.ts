import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase/admin'

// POST — verify Firebase ID token, set session cookie
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    if (!token) return NextResponse.json({ error: 'No token' }, { status: 400 })

    const decoded = await adminAuth.verifyIdToken(token)

    const response = NextResponse.json({ success: true, uid: decoded.uid, email: decoded.email })
    response.cookies.set('student_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return response
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

// DELETE — clear session
export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('student_session', '', { maxAge: 0, path: '/' })
  return response
}
