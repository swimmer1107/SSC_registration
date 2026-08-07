import { writeFile, unlink, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'public', 'uploads')

interface ValidationResult { valid: boolean; error?: string }

/** Validate file size, MIME type, and magic bytes */
export async function validateFile(
  file: File,
  allowedTypes = ALLOWED_IMAGE_TYPES,
  maxSize = MAX_FILE_SIZE
): Promise<ValidationResult> {
  if (file.size > maxSize) {
    return { valid: false, error: `File too large. Max: ${maxSize / 1024 / 1024}MB` }
  }
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Allowed: ${allowedTypes.join(', ')}` }
  }

  // Check magic bytes
  const arrayBuf = await file.arrayBuffer()
  const buf = new Uint8Array(arrayBuf.slice(0, 8))
  const isJpeg = buf[0] === 0xFF && buf[1] === 0xD8
  const isPng  = buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47
  const isWebp = buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46

  if (!isJpeg && !isPng && !isWebp) {
    return { valid: false, error: 'File content does not match declared type' }
  }
  return { valid: true }
}

/** Save file with a random name to prevent overwrite attacks */
export async function saveFileSecurely(file: File, category = 'uploads'): Promise<string> {
  const validation = await validateFile(file)
  if (!validation.valid) throw new Error(validation.error)

  const ext = path.extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, '')
  const name = crypto.randomBytes(16).toString('hex') + ext
  const dir = path.join(UPLOAD_DIR, category)

  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()))

  return `/uploads/${category}/${name}`
}

/** Delete file, preventing directory traversal */
export async function deleteFileSecurely(relativePath: string): Promise<void> {
  const norm = path.normalize(relativePath)
  if (norm.includes('..')) throw new Error('Invalid path')

  const full = path.join(process.cwd(), 'public', norm)
  if (!full.startsWith(UPLOAD_DIR)) throw new Error('Path outside upload directory')

  try { await unlink(full) } catch { /* file may not exist */ }
}
