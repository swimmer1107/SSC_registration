interface Entry { count: number; resetAt: number }

class RateLimiter {
  private limits = new Map<string, Entry>()

  check(id: string, max = 30, windowSec = 60): boolean {
    const now = Date.now()
    const entry = this.limits.get(id)

    if (!entry || now > entry.resetAt) {
      this.limits.set(id, { count: 1, resetAt: now + windowSec * 1000 })
      return true
    }
    if (entry.count < max) { entry.count++; return true }
    return false
  }

  remaining(id: string, max = 30): number {
    const entry = this.limits.get(id)
    if (!entry) return max
    return Math.max(0, max - entry.count)
  }
}

export const rateLimiter = new RateLimiter()
