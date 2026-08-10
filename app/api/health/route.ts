import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const checks: Record<string, string> = {}

  // Check env vars
  checks.DATABASE_URL = process.env.DATABASE_URL ? '✅' : '❌ MISSING'
  checks.JWT_SECRET = process.env.JWT_SECRET ? '✅' : '❌ MISSING'
  checks.FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID ? '✅' : '❌ MISSING'
  checks.FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL ? '✅' : '❌ MISSING'
  checks.FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY ? '✅' : '❌ MISSING'
  checks.SMTP_USER = process.env.SMTP_USER ? '✅' : '❌ MISSING'
  checks.NODE_ENV = process.env.NODE_ENV ?? 'not set'

  // Check DB connection
  try {
    await prisma.$queryRaw`SELECT 1`
    checks.database = '✅ connected'
  } catch (e: any) {
    checks.database = `❌ ${e.message}`
  }

  const allOk = Object.values(checks).every(v => v.startsWith('✅'))

  return NextResponse.json({ status: allOk ? 'ok' : 'degraded', checks }, {
    status: allOk ? 200 : 500,
  })
}
