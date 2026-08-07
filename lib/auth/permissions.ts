// lib/auth/permissions.ts - RBAC Helper Functions

export type AdminRole = 'SUPER_ADMIN' | 'EVENT_MANAGER' | 'SCORE_KEEPER' | 'MODERATOR'

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: ['*'], // Full access to everything
  
  EVENT_MANAGER: [
    'events.view',
    'events.create',
    'events.edit',
    'events.delete',
    'sports.view',
    'sports.create',
    'sports.edit',
    'sports.delete',
    'registrations.view',
    'registrations.approve',
    'registrations.export',
    'fixtures.view',
    'fixtures.create',
    'fixtures.edit',
    'fixtures.delete',
  ],
  
  SCORE_KEEPER: [
    'live-scores.view',
    'live-scores.update',
    'results.view',
    'results.create',
  ],
  
  MODERATOR: [
    'gallery.view',
    'gallery.upload',
    'team.view',
    'team.edit',
    'notices.view',
    'notices.create',
    'contact.view',
  ],
}

export function hasPermission(role: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role as AdminRole] || []
  
  // Super admin has all permissions
  if (permissions.includes('*')) return true
  
  // Check specific permission
  return permissions.includes(permission)
}

export function canAccessRoute(role: string, route: string): boolean {
  // Route-to-permission mapping
  const routePermissions: Record<string, string> = {
    '/admin/dashboard': 'dashboard',
    '/admin/events': 'events.view',
    '/admin/sports': 'sports.view',
    '/admin/registrations': 'registrations.view',
    '/admin/fixtures': 'fixtures.view',
    '/admin/live-scores': 'live-scores.view',
    '/admin/results': 'results.view',
    '/admin/gallery': 'gallery.view',
    '/admin/team': 'team.view',
    '/admin/notices': 'notices.view',
    '/admin/contact-messages': 'contact.view',
    '/admin/users': 'admin.manage', // Only super admin
    '/admin/certificates': 'certificates.view',
  }
  
  const permission = routePermissions[route]
  if (!permission) return true // Public admin route (e.g. login)
  if (permission === 'dashboard') return true // All roles can see dashboard link
  if (permission === 'admin.manage') return role === 'SUPER_ADMIN'
  if (permission === 'certificates.view') return role === 'SUPER_ADMIN'
  
  return hasPermission(role, permission)
}
