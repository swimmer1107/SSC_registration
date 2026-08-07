import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import SportForm from './SportForm'
import DeleteSportButton from './DeleteSportButton'

export default async function AdminSportsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) redirect('/admin/login')

  const { success, error } = await searchParams

  const sports = await prisma.sport.findMany({
    orderBy: { name: 'asc' },
  })

  // Create Sport
  async function createSport(formData: FormData) {
    'use server'
    
    const name = formData.get('name') as string
    const category = formData.get('category') as string
    const minTeamSize = formData.get('minTeamSize') as string
    const maxTeamSize = formData.get('maxTeamSize') as string
    const registrationFee = formData.get('registrationFee') as string
    const description = formData.get('description') as string
    const rules = formData.get('rules') as string

    try {
      await prisma.sport.create({
        data: {
          name,
          category,
          minTeamSize: minTeamSize ? parseInt(minTeamSize) : null,
          maxTeamSize: maxTeamSize ? parseInt(maxTeamSize) : null,
          registrationFee: parseInt(registrationFee),
          description: description || null,
          rules: rules || null,
        },
      })

      revalidatePath('/admin/sports')
      revalidatePath('/register') // User registration page
      redirect('/admin/sports?success=Sport added successfully')
    } catch (err: any) {
      if (err.code === 'P2002') {
        redirect('/admin/sports?error=Sport already exists')
      }
      redirect('/admin/sports?error=Failed to add sport')
    }
  }

  // Delete Sport
  async function deleteSport(formData: FormData) {
    'use server'
    
    const id = formData.get('id') as string

    try {
      await prisma.sport.delete({ where: { id } })
      revalidatePath('/admin/sports')
      revalidatePath('/register')
      redirect('/admin/sports?success=Sport deleted')
    } catch (err) {
      redirect('/admin/sports?error=Cannot delete sport with existing registrations')
    }
  }

  // Toggle Active
  async function toggleActive(formData: FormData) {
    'use server'
    
    const id = formData.get('id') as string
    const sport = await prisma.sport.findUnique({ where: { id } })
    
    if (sport) {
      await prisma.sport.update({
        where: { id },
        data: { isActive: !sport.isActive },
      })
    }

    revalidatePath('/admin/sports')
    revalidatePath('/register')
  }

  return (
    <div>
      {/* Success/Error Messages */}
      {success && (
        <div style={{
          padding: '16px 24px',
          borderRadius: '12px',
          background: 'rgba(76,175,80,0.15)',
          border: '1px solid rgba(76,175,80,0.4)',
          marginBottom: '24px',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#4CAF50' }}>
            ✅ {decodeURIComponent(success)}
          </p>
        </div>
      )}

      {error && (
        <div style={{
          padding: '16px 24px',
          borderRadius: '12px',
          background: 'rgba(239,68,68,0.15)',
          border: '1px solid rgba(239,68,68,0.4)',
          marginBottom: '24px',
        }}>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#ef4444' }}>
            ⚠️ {decodeURIComponent(error)}
          </p>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: '48px',
          color: '#4CAF50',
          letterSpacing: '0.1em',
        }}>
          MANAGE SPORTS
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(165,214,167,0.6)',
        }}>
          Configure sports for registration
        </p>
      </div>

      {/* Add Sport Form */}
      <SportForm createSport={createSport} />

      {/* Sports Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px',
      }}>
        {sports.map((sport) => (
          <div
            key={sport.id}
            style={{
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid rgba(76,175,80,0.2)',
              background: 'rgba(27,94,32,0.03)',
            }}
          >
            <h3 style={{
              fontFamily: "'Bebas Neue', Impact, sans-serif",
              fontSize: '24px',
              color: 'white',
              marginBottom: '12px',
              letterSpacing: '0.05em',
            }}>
              {sport.name}
            </h3>

            <div style={{ marginBottom: '16px' }}>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '600',
                background: sport.category === 'team' 
                  ? 'rgba(33,150,243,0.15)' 
                  : 'rgba(255,152,0,0.15)',
                color: sport.category === 'team' ? '#2196F3' : '#FF9800',
                border: `1px solid ${sport.category === 'team' ? 'rgba(33,150,243,0.3)' : 'rgba(255,152,0,0.3)'}`,
              }}>
                {sport.category.toUpperCase()}
              </span>
            </div>

            {sport.category === 'team' && (
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '12px',
              }}>
                Team Size: {sport.minTeamSize || '?'} - {sport.maxTeamSize || '?'} players
              </p>
            )}

            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '16px',
              color: '#4CAF50',
              fontWeight: '600',
              marginBottom: '16px',
            }}>
              Fee: ₹{sport.registrationFee}
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <form action={toggleActive} style={{ flex: 1 }}>
                <input type="hidden" name="id" value={sport.id} />
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: sport.isActive 
                      ? 'rgba(76,175,80,0.15)' 
                      : 'rgba(158,158,158,0.15)',
                    color: sport.isActive ? '#4CAF50' : 'rgba(158,158,158,0.8)',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  {sport.isActive ? '✓ Active' : '○ Hidden'}
                </button>
              </form>

              <DeleteSportButton
                sportId={sport.id}
                sportName={sport.name}
                deleteSport={deleteSport}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
