import { cache } from '@/lib/cache/cache'

export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds = 300
): Promise<T> {
  const cached = cache.get<T>(key)
  if (cached !== null) return cached
  const result = await fn()
  cache.set(key, result, ttlSeconds)
  return result
}
