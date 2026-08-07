import { NextResponse, NextRequest } from 'next/server'

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status })
}

export function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status })
}

type Handler = (
  req: NextRequest,
  ctx?: { params: Promise<Record<string, string | string[]>> }
) => Promise<NextResponse>

export function guard(handler: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await handler(req, ctx)
    } catch (e) {
      console.error('[API Error]', e)
      const msg = e instanceof Error ? e.message : 'Unknown error'
      return fail(`Internal error: ${msg}`, 500)
    }
  }
}
