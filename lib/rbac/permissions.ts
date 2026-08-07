// lib/rbac/permissions.ts - Role permissions in boolean format for easy checks

export type AdminRole = 'SUPER_ADMIN' | 'EVENT_MANAGER' | 'SCORE_KEEPER' | 'MODERATOR'

export interface RolePermissions {
  canAccessDashboard: boolean
  canManageAdminUsers: boolean
  canManageEvents: boolean
  canManageSports: boolean
  canManageRegistrations: boolean
  canManageFixtures: boolean
  canManageLiveScores: boolean
  canManageResults: boolean
  canManageGallery: boolean
  canManageTeam: boolean
  canManageNotices: boolean
  canManageContactMessages: boolean
  canManageCertificates: boolean
}

export const rolePermissions: Record<AdminRole, RolePermissions> = {
  SUPER_ADMIN: {
    canAccessDashboard: true,
    canManageAdminUsers: true,
    canManageEvents: true,
    canManageSports: true,
    canManageRegistrations: true,
    canManageFixtures: true,
    canManageLiveScores: true,
    canManageResults: true,
    canManageGallery: true,
    canManageTeam: true,
    canManageNotices: true,
    canManageContactMessages: true,
    canManageCertificates: true,
  },
  EVENT_MANAGER: {
    canAccessDashboard: true,
    canManageAdminUsers: false,
    canManageEvents: true,
    canManageSports: true,
    canManageRegistrations: true,
    canManageFixtures: true,
    canManageLiveScores: false,
    canManageResults: false,
    canManageGallery: false,
    canManageTeam: false,
    canManageNotices: true,
    canManageContactMessages: true,
    canManageCertificates: false,
  },
  SCORE_KEEPER: {
    canAccessDashboard: true,
    canManageAdminUsers: false,
    canManageEvents: false,
    canManageSports: false,
    canManageRegistrations: false,
    canManageFixtures: false,
    canManageLiveScores: true,
    canManageResults: true,
    canManageGallery: false,
    canManageTeam: false,
    canManageNotices: false,
    canManageContactMessages: false,
    canManageCertificates: false,
  },
  MODERATOR: {
    canAccessDashboard: true,
    canManageAdminUsers: false,
    canManageEvents: false,
    canManageSports: false,
    canManageRegistrations: false,
    canManageFixtures: false,
    canManageLiveScores: false,
    canManageResults: false,
    canManageGallery: true,
    canManageTeam: true,
    canManageNotices: true,
    canManageContactMessages: true,
    canManageCertificates: false,
  },
}

export function hasPermission(
  role: AdminRole,
  permission: keyof RolePermissions
): boolean {
  return rolePermissions[role]?.[permission] ?? false
}
