import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import { writeFile, unlink } from 'fs/promises'
import path from 'path'
import ConfirmButton from '@/components/ui/ConfirmButton'

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; success?: string; error?: string }>
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) redirect('/admin/login')

  const admin = jwt.verify(token, process.env.JWT_SECRET!) as any

  // Role check - only MODERATOR and SUPER_ADMIN can manage gallery
  const { hasPermission } = await import('@/lib/auth/permissions')
  if (!hasPermission(admin.role, 'gallery.view')) {
    redirect('/admin/dashboard')
  }

  const { category, success, error } = await searchParams

  // Count per category for badges
  const allImages = await prisma.galleryImage.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const filtered = category
    ? allImages.filter((img) => img.category === category)
    : allImages

  // --------------- Server Actions ---------------

  async function uploadImage(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const cat = formData.get('category') as string
    const event = formData.get('event') as string
    const file = formData.get('image') as File

    if (!file || file.size === 0) {
      redirect('/admin/gallery?error=No+image+selected')
    }

    let uploadSuccess = false
    try {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const uploadBase = process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'public', 'uploads')
      const uploadDir = path.join(uploadBase, 'gallery')
      const { mkdir } = await import('fs/promises')
      await mkdir(uploadDir, { recursive: true })
      const filepath = path.join(uploadDir, filename)

      await writeFile(filepath, buffer)

      const imageUrl = process.env.UPLOAD_DIR
        ? `/api/uploads/gallery/${filename}`
        : `/uploads/gallery/${filename}`

      const cookieStore = await cookies()
      const token = cookieStore.get('admin_token')?.value
      const adminData = jwt.verify(token!, process.env.JWT_SECRET!) as any

      await prisma.galleryImage.create({
        data: {
          title: title || file.name,
          description: description || null,
          category: cat,
          event: event || null,
          imageUrl,
          uploadedBy: adminData.email,
        },
      })

      revalidatePath('/admin/gallery')
      revalidatePath('/gallery')
      uploadSuccess = true
    } catch (err: any) {
      console.error('Upload error:', err)
    }

    if (uploadSuccess) {
      redirect('/admin/gallery?success=Image+uploaded+successfully')
    } else {
      redirect('/admin/gallery?error=Failed+to+upload+image')
    }
  }

  async function deleteImage(formData: FormData) {
    'use server'

    const id = formData.get('id') as string
    const imageUrl = formData.get('imageUrl') as string

    try {
      await prisma.galleryImage.delete({ where: { id } })

      // Also delete file from disk
      if (imageUrl) {
        let filepath: string
        if (process.env.UPLOAD_DIR) {
          // On Railway volume: imageUrl is like /api/uploads/gallery/filename
          const filename = imageUrl.split('/').pop()!
          const category = imageUrl.split('/').slice(-2, -1)[0]
          filepath = path.join(process.env.UPLOAD_DIR, category, filename)
        } else {
          filepath = path.join(process.cwd(), 'public', imageUrl)
        }
        await unlink(filepath).catch(() => {}) // ignore if already missing
      }
    } catch {
      // ignore
    }

    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
    redirect('/admin/gallery?success=Image+deleted')
  }

  async function toggleActive(formData: FormData) {
    'use server'

    const id = formData.get('id') as string
    const image = await prisma.galleryImage.findUnique({ where: { id } })

    if (image) {
      await prisma.galleryImage.update({
        where: { id },
        data: { isActive: !image.isActive },
      })
    }

    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
    redirect('/admin/gallery' + (category ? `?category=${category}` : ''))
  }

  // --------------- Category counts ---------------
  const counts: Record<string, number> = { all: allImages.length }
  for (const cat of ['sports', 'cultural', 'events', 'workshops', 'team']) {
    counts[cat] = allImages.filter((img) => img.category === cat).length
  }

  // --------------- Render ---------------
  return (
    <div>
      {/* Flash Messages */}
      {success && (
        <div style={{
          padding: '14px 20px',
          borderRadius: '10px',
          background: 'rgba(76,175,80,0.12)',
          border: '1px solid rgba(76,175,80,0.35)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ fontSize: '18px' }}>✅</span>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#4CAF50', margin: 0 }}>
            {decodeURIComponent(success)}
          </p>
        </div>
      )}
      {error && (
        <div style={{
          padding: '14px 20px',
          borderRadius: '10px',
          background: 'rgba(239,68,68,0.12)',
          border: '1px solid rgba(239,68,68,0.35)',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ fontSize: '18px' }}>⚠️</span>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#ef4444', margin: 0 }}>
            {decodeURIComponent(error)}
          </p>
        </div>
      )}

      {/* Page Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: '48px',
          color: '#4CAF50',
          letterSpacing: '0.1em',
          margin: 0,
        }}>
          MANAGE GALLERY
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(165,214,167,0.55)',
          marginTop: '6px',
        }}>
          {allImages.length} image{allImages.length !== 1 ? 's' : ''} total — upload and organize event photos
        </p>
      </div>

      {/* ── Upload Form ── */}
      <div style={{
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid rgba(76,175,80,0.2)',
        background: 'rgba(27,94,32,0.05)',
        marginBottom: '40px',
      }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: '22px',
          color: 'white',
          marginBottom: '24px',
          letterSpacing: '0.05em',
        }}>
          📤 UPLOAD NEW IMAGE
        </h2>

        <form action={uploadImage}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '20px',
          }}>
            {/* File */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>IMAGE FILE *</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                style={inputStyle}
              />
            </div>

            {/* Category */}
            <div>
              <label style={labelStyle}>CATEGORY *</label>
              <select name="category" required style={inputStyle}>
                <option value="sports">Sports</option>
                <option value="cultural">Cultural</option>
                <option value="events">Events</option>
                <option value="workshops">Workshops</option>
                <option value="team">Team</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label style={labelStyle}>TITLE</label>
              <input
                name="title"
                placeholder="e.g., Cricket Finals 2025"
                style={inputStyle}
              />
            </div>

            {/* Event */}
            <div>
              <label style={labelStyle}>EVENT NAME</label>
              <input
                name="event"
                placeholder="e.g., AAGAAZ 2026"
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>DESCRIPTION</label>
              <input
                name="description"
                placeholder="Brief description of the photo"
                style={inputStyle}
              />
            </div>
          </div>

          <button type="submit" style={submitBtnStyle}>
            📤 UPLOAD IMAGE
          </button>
        </form>
      </div>

      {/* ── Category Filter Tabs ── */}
      <div style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: '28px',
      }}>
        {([
          { label: 'All', key: '' },
          { label: 'Sports', key: 'sports' },
          { label: 'Cultural', key: 'cultural' },
          { label: 'Events', key: 'events' },
          { label: 'Workshops', key: 'workshops' },
          { label: 'Team', key: 'team' },
        ] as const).map(({ label, key }) => {
          const isActive = (category || '') === key
          const count = key === '' ? counts.all : counts[key] ?? 0
          return (
            <a
              key={key}
              href={`/admin/gallery${key ? `?category=${key}` : ''}`}
              style={{
                padding: '9px 18px',
                borderRadius: '8px',
                background: isActive ? 'rgba(76,175,80,0.2)' : 'rgba(27,94,32,0.1)',
                border: `1px solid ${isActive ? 'rgba(76,175,80,0.5)' : 'rgba(76,175,80,0.25)'}`,
                color: isActive ? '#4CAF50' : 'rgba(165,214,167,0.65)',
                fontSize: '13px',
                fontWeight: '600',
                textDecoration: 'none',
                fontFamily: "'Space Grotesk', sans-serif",
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {label}
              <span style={{
                background: isActive ? 'rgba(76,175,80,0.3)' : 'rgba(255,255,255,0.08)',
                borderRadius: '999px',
                padding: '1px 8px',
                fontSize: '11px',
              }}>
                {count}
              </span>
            </a>
          )
        })}
      </div>

      {/* ── Image Grid ── */}
      {filtered.length === 0 ? (
        <div style={{
          padding: '80px',
          textAlign: 'center',
          borderRadius: '16px',
          border: '1px dashed rgba(76,175,80,0.2)',
          background: 'rgba(27,94,32,0.03)',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '16px', color: 'rgba(165,214,167,0.4)', margin: 0 }}>
            📷 No images yet — upload your first one above
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {filtered.map((image) => (
            <div
              key={image.id}
              style={{
                borderRadius: '12px',
                border: `1px solid ${image.isActive ? 'rgba(76,175,80,0.2)' : 'rgba(100,100,100,0.25)'}`,
                background: 'rgba(10,13,20,0.6)',
                overflow: 'hidden',
                opacity: image.isActive ? 1 : 0.65,
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: '100%',
                height: '195px',
                backgroundImage: `url(${image.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
              }}>
                {/* Hidden badge */}
                {!image.isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    padding: '4px 10px',
                    background: 'rgba(0,0,0,0.75)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: 'rgba(200,200,200,0.9)',
                    fontWeight: '600',
                    letterSpacing: '0.05em',
                    border: '1px solid rgba(200,200,200,0.2)',
                  }}>
                    HIDDEN
                  </div>
                )}
                {/* Category badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  padding: '4px 10px',
                  background: 'rgba(0,0,0,0.75)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '6px',
                  fontSize: '11px',
                  color: '#4CAF50',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  border: '1px solid rgba(76,175,80,0.3)',
                }}>
                  {image.category}
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '14px 16px' }}>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '14px',
                  color: 'white',
                  fontWeight: '600',
                  marginBottom: '3px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {image.title || 'Untitled'}
                </p>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(165,214,167,0.5)',
                  marginBottom: '12px',
                }}>
                  {image.event ? `📅 ${image.event}` : 'No event tag'}
                </p>

                {/* Action row */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {/* Toggle active */}
                  <form action={toggleActive} style={{ flex: 1 }}>
                    <input type="hidden" name="id" value={image.id} />
                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: image.isActive ? 'rgba(76,175,80,0.15)' : 'rgba(120,120,120,0.15)',
                        color: image.isActive ? '#4CAF50' : 'rgba(180,180,180,0.8)',
                        border: `1px solid ${image.isActive ? 'rgba(76,175,80,0.3)' : 'rgba(120,120,120,0.3)'}`,
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {image.isActive ? '✓ Active' : '○ Hidden'}
                    </button>
                  </form>

                  {/* Delete */}
                  <form action={deleteImage}>
                    <input type="hidden" name="id" value={image.id} />
                    <input type="hidden" name="imageUrl" value={image.imageUrl} />
                    <ConfirmButton
                      message={`Delete "${image.title || 'this image'}"? This cannot be undone.`}
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(239,68,68,0.12)',
                        color: '#ef4444',
                        border: '1px solid rgba(239,68,68,0.25)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        cursor: 'pointer',
                      }}
                    >
                      🗑️
                    </ConfirmButton>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Shared style objects ──────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '11px',
  color: 'rgba(165,214,167,0.65)',
  marginBottom: '8px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  background: 'rgba(0,0,0,0.35)',
  border: '1px solid rgba(76,175,80,0.28)',
  borderRadius: '8px',
  color: 'white',
  fontSize: '14px',
  fontFamily: 'Inter, sans-serif',
  boxSizing: 'border-box',
}

const submitBtnStyle: React.CSSProperties = {
  padding: '13px 32px',
  background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
  color: 'black',
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: '14px',
  fontWeight: '700',
  letterSpacing: '0.08em',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  boxShadow: '0 4px 16px rgba(76,175,80,0.3)',
}