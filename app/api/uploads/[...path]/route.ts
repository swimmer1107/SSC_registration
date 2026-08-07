import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

// This route serves uploaded files when UPLOAD_DIR env var is set (e.g. Railway volume).
// In local dev, Next.js serves /public/uploads directly without hitting this route.

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  if (!process.env.UPLOAD_DIR) {
    return new NextResponse('Not found', { status: 404 })
  }

  const { path: segments } = await params
  // Prevent path traversal
  const joined = segments.join('/')
  if (joined.includes('..')) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const filePath = path.join(process.env.UPLOAD_DIR, ...segments)

  // Ensure the resolved path is still inside UPLOAD_DIR
  if (!filePath.startsWith(path.resolve(process.env.UPLOAD_DIR))) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  try {
    const buffer = await readFile(filePath)
    const ext = path.extname(filePath).toLowerCase()
    const contentType =
      ext === '.png' ? 'image/png' :
      ext === '.webp' ? 'image/webp' :
      ext === '.gif' ? 'image/gif' :
      'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=2592000',
      },
    })
  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
