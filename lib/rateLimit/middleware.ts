import { NextRequest, NextResponse } from 'next/server'
import { rateLimiter } from '@/lib/rateLimit/rateLimiter'

export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  max = 30,
  windowSec = 60
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    if (!rateLimiter.check(ip, max, windowSec)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { status: 429 }
      )
    }

    const response = await handler(req)
    response.headers.set('X-RateLimit-Remaining', rateLimiter.remaining(ip, max).toString())
    response.headers.set('X-RateLimit-Limit', max.toString())
    return response
  }
}
