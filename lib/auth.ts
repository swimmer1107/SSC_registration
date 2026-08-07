import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const SECRET = process.env.JWT_SECRET!

export function signToken(payload: object, expiresIn = '7d') {
  return jwt.sign(payload, SECRET, { expiresIn } as jwt.SignOptions)
}

export function verifyToken<T>(token: string): T | null {
  try { return jwt.verify(token, SECRET) as T }
  catch { return null }
}

export async function getAdminFromCookie() {
  const token = (await cookies()).get('admin_token')?.value
  if (!token) return null
  return verifyToken<{ id: string; email: string; role: string }>(token)
}

export async function getStudentFromCookie() {
  const token = (await cookies()).get('student_token')?.value
  if (!token) return null
  return verifyToken<{ id: string }>(token)
}
