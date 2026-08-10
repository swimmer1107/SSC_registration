import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import { requirePermission } from '@/lib/auth/protectRoute'
import { writeFile } from 'fs/promises'
import path from 'path'
import ConfirmButton from '@/components/ui/ConfirmButton'

export const dynamic = 'force-dynamic'

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>
}) {
  await requirePermission('canManageTeam')

  const { type } = await searchParams

  const members = await prisma.teamMember.findMany({
    where: { ...(type && { type }) },
    orderBy: { order: 'asc' },
  })

  // Add member
  async function addMember(formData: FormData) {
    'use server'

    const name = formData.get('name') as string
    const role = formData.get('role') as string
    const memberType = formData.get('type') as string
    const sport = formData.get('sport') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const bio = formData.get('bio') as string
    const year = formData.get('year') as string
    const course = formData.get('course') as string
    const file = formData.get('image') as File

    if (!file || file.size === 0) {
      redirect('/admin/team?error=No image selected')
    }

    // Save profile photo
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
    const uploadBase = process.env.UPLOAD_DIR ?? path.join(process.cwd(), 'public', 'uploads')
    const uploadDir = path.join(uploadBase, 'team')
    const { mkdir } = await import('fs/promises')
    await mkdir(uploadDir, { recursive: true })
    const filepath = path.join(uploadDir, filename)

    await writeFile(filepath, buffer)

    // Determine the public URL for the image
    const imageUrl = process.env.UPLOAD_DIR
      ? `/api/uploads/team/${filename}`
      : `/uploads/team/${filename}`

    // Save to database
    await prisma.teamMember.create({
      data: {
        name,
        role,
        type: memberType,
        sport: memberType === 'captain' ? sport : null,
        email,
        phone,
        bio,
        year,
        course,
        imageUrl,
      },
    })

    revalidatePath('/admin/team')
    revalidatePath('/team') // User side
    redirect('/admin/team?success=Member added successfully')
  }

  // Delete member
  async function deleteMember(formData: FormData) {
    'use server'

    const id = formData.get('id') as string
    await prisma.teamMember.delete({ where: { id } })

    revalidatePath('/admin/team')
    revalidatePath('/team')
    redirect('/admin/team?success=Member deleted')
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: '48px',
          color: '#4CAF50',
          letterSpacing: '0.1em',
        }}>
          MANAGE TEAM
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(165,214,167,0.6)',
        }}>
          Add SSC council members and sports captains
        </p>
      </div>

      {/* Add Member Form */}
      <div style={{
        padding: '32px',
        borderRadius: '16px',
        border: '1px solid rgba(76,175,80,0.2)',
        background: 'rgba(27,94,32,0.05)',
        marginBottom: '40px',
      }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: '24px',
          color: 'white',
          marginBottom: '24px',
        }}>
          ADD TEAM MEMBER
        </h2>

        <form action={addMember}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '20px',
          }}>
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
              }}>
                FULL NAME *
              </label>
              <input
                name="name"
                required
                placeholder="e.g., Rahul Sharma"
                style={{
                  width: '90%',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
              }}>
                TYPE *
              </label>
              <select
                name="type"
                required
                id="memberType"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              >
                <option value="council">Council Member</option>
                <option value="captain">Sports Captain</option>
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
              }}>
                ROLE *
              </label>
              <input
                name="role"
                required
                placeholder="e.g., President / Vice President"
                style={{
                  width: '90%',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div id="sportField">
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
              }}>
                SPORT (For Captains)
              </label>
              <input
                name="sport"
                placeholder="e.g., Cricket / Football"
                style={{
                  width: '95%',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
              }}>
                YEAR
              </label>
              <input
                name="year"
                placeholder="e.g., 3rd Year"
                style={{
                  width: '90%',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
              }}>
                COURSE
              </label>
              <input
                name="course"
                placeholder="e.g., B.Tech CSE"
                style={{
                  width: '95%',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
              }}>
                EMAIL
              </label>
              <input
                name="email"
                type="email"
                placeholder="student@gla.ac.in"
                style={{
                  width: '90%',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
              }}>
                PHONE
              </label>
              <input
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                style={{
                  width: '95%',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
              }}>
                PROFILE PHOTO *
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                required
                style={{
                  width: '45%',
                  padding: '12px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
              }}>
                BIO
              </label>
              <textarea
                name="bio"
                rows={3}
                placeholder="Short description about the member..."
                style={{
                  width: '98%',
                  padding: '12px 16px',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '8px',
                  color: 'white',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '14px 32px',
              background: '#4CAF50',
              color: 'black',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            ➕ ADD MEMBER
          </button>
        </form>
      </div>

      {/* Filter */}
      <form method="GET" action="/admin/team" style={{ marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <select
          name="type"
          defaultValue={type || ''}
          style={{
            padding: '12px 20px',
            background: 'rgba(27,94,32,0.1)',
            border: '1px solid rgba(76,175,80,0.3)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
          }}
        >
          <option value="">All Members</option>
          <option value="council">Council Members</option>
          <option value="captain">Sports Captains</option>
        </select>
        <button
          type="submit"
          style={{
            padding: '12px 20px',
            background: 'rgba(76,175,80,0.15)',
            border: '1px solid rgba(76,175,80,0.3)',
            borderRadius: '8px',
            color: '#4CAF50',
            fontSize: '14px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          FILTER
        </button>
      </form>

      {/* Members Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '24px',
      }}>
        {members.map((member) => (
          <div
            key={member.id}
            style={{
              padding: '24px',
              borderRadius: '16px',
              border: '1px solid rgba(76,175,80,0.2)',
              background: 'rgba(27,94,32,0.03)',
              textAlign: 'center',
            }}
          >
            {/* Profile Photo */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: `url(${member.imageUrl}) center/cover`,
              margin: '0 auto 16px',
              border: '3px solid rgba(76,175,80,0.3)',
            }} />

            {/* Info */}
            <h3 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: '24px',
              color: 'white',
              marginBottom: '4px',
            }}>
              {member.name}
            </h3>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '14px',
              color: '#4CAF50',
              marginBottom: '8px',
              fontWeight: '600',
            }}>
              {member.role}
              {member.sport && ` • ${member.sport}`}
            </p>
            {member.course && (
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'rgba(165,214,167,0.6)',
                marginBottom: '12px',
              }}>
                {member.course} {member.year && `• ${member.year}`}
              </p>
            )}

            {/* Actions */}
            <div style={{ marginTop: '16px' }}>
              <form action={deleteMember}>
                <input type="hidden" name="id" value={member.id} />
                <ConfirmButton
                  message={`Remove ${member.name}?`}
                  style={{
                    padding: '8px 16px',
                    background: 'rgba(239,68,68,0.15)',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  🗑️ Remove
                </ConfirmButton>
              </form>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div style={{
          padding: '80px',
          textAlign: 'center',
          borderRadius: '16px',
          border: '1px solid rgba(76,175,80,0.2)',
          background: 'rgba(27,94,32,0.03)',
        }}>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            color: 'rgba(165,214,167,0.5)',
          }}>
            No team members added yet
          </p>
        </div>
      )}
    </div>
  )
}