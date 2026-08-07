import crypto from 'crypto'
import { cookies } from 'next/headers'

const TOKEN_LENGTH = 32

export function generateCsrfToken(): string {
  return crypto.randomBytes(TOKEN_LENGTH).toString('hex')
}

export async function setCsrfToken(): Promise<string> {
  const token = generateCsrfToken()
  const store = await cookies()
  store.set('csrf_token', token, {
    httpOnly: false, // client must read it
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
  })
  return token
}

export async function verifyCsrfToken(token: string): Promise<boolean> {
  if (!token) return false
  const store = await cookies()
  const stored = store.get('csrf_token')?.value
  if (!stored) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(stored), Buffer.from(token))
  } catch {
    return false
  }
}
