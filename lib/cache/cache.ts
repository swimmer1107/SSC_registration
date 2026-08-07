interface CacheEntry {
  value: unknown
  expiresAt: number
}

class MemoryCache {
  private cache = new Map<string, CacheEntry>()

  constructor() {
    if (typeof window === 'undefined') {
      setInterval(() => this.cleanup(), 5 * 60 * 1000)
    }
  }

  set(key: string, value: unknown, ttlSeconds = 300) {
    this.cache.set(key, { value, expiresAt: Date.now() + ttlSeconds * 1000 })
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    if (Date.now() > entry.expiresAt) { this.cache.delete(key); return null }
    return entry.value as T
  }

  delete(key: string) { this.cache.delete(key) }
  clear() { this.cache.clear() }

  private cleanup() {
    const now = Date.now()
    for (const [k, e] of this.cache.entries()) {
      if (now > e.expiresAt) this.cache.delete(k)
    }
  }
}

export const cache = new MemoryCache()

export const cacheKeys = {
  activeSports: 'active_sports',
  registrationCount: (sportId: string) => `reg_count_${sportId}`,
  studentRegistrations: (email: string) => `student_regs_${email}`,
}
