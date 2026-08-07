import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import { hasPermission, AdminRole, RolePermissions } from '@/lib/rbac/permissions'
import { prisma } from '@/lib/prisma'

export interface AdminSession {
  id: string
  email: string
  role: AdminRole
  fullName: string
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return null

    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }

    // Always fetch fresh from DB so role changes take effect immediately
    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.id },
      select: { id: true, email: true, fullName: true, role: true, isActive: true },
    })

    if (!admin || !admin.isActive) return null
    return admin as AdminSession
  } catch {
    return null
  }
}

export async function requireAuth(): Promise<AdminSession> {
  const admin = await getAdminSession()
  if (!admin) redirect('/admin/login')
  return admin
}

export async function requirePermission(
  permission: keyof RolePermissions
): Promise<AdminSession> {
  const admin = await requireAuth()
  if (!hasPermission(admin.role, permission)) {
    redirect('/admin/dashboard')
  }
  return admin
}
