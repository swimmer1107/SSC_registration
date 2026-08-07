/**
 * Input sanitization — prevent XSS without external dependency
 * Uses native string manipulation instead of DOMPurify (avoids SSR issues)
 */

/** Strip all HTML tags and dangerous characters from a string */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') return ''
  return input
    .replace(/<[^>]*>/g, '')           // remove HTML tags
    .replace(/javascript:/gi, '')      // remove JS protocol
    .replace(/on\w+\s*=/gi, '')        // remove event handlers
    .replace(/[<>"'`]/g, (c) => ({    // encode special chars
      '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;',
    }[c] ?? c))
    .trim()
}

/** Recursively sanitize all string values in an object */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) return obj
  if (Array.isArray(obj)) return obj.map(sanitizeObject) as unknown as T
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    out[k] = typeof v === 'string' ? sanitizeInput(v) : typeof v === 'object' ? sanitizeObject(v) : v
  }
  return out as T
}

/** Safe JSON parse with fallback */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try { return JSON.parse(json) as T } catch { return fallback }
}

/** Validate that a string is a valid CUID (Prisma default ID format) */
export function isValidCuid(id: unknown): id is string {
  return typeof id === 'string' && /^[a-z0-9]{20,30}$/.test(id)
}
