import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) redirect('/admin/login')

  const { success, error } = await searchParams

  const events = await prisma.event.findMany({
    orderBy: { order: 'asc' },
  })

  // Create Event
  async function createEvent(formData: FormData) {
    'use server'

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const sport = formData.get('sport') as string
    const prizePool = parseInt(formData.get('prizePool') as string) || 0
    const capacity = formData.get('capacity') as string
    const ctaText = formData.get('ctaText') as string
    const ctaLink = formData.get('ctaLink') as string
    const order = parseInt(formData.get('order') as string) || 0

    await prisma.event.create({
      data: {
        title,
        description,
        category,
        sport,
        prizePool,
        capacity,
        ctaText,
        ctaLink,
        order,
      },
    })

    revalidatePath('/admin/events')
    revalidatePath('/') // Homepage
    redirect('/admin/events?success=Tournament created successfully')
  }

  // Delete Event
  async function deleteEvent(formData: FormData) {
    'use server'

    const id = formData.get('id') as string
    await prisma.event.delete({ where: { id } })

    revalidatePath('/admin/events')
    revalidatePath('/')
    redirect('/admin/events?success=Tournament deleted')
  }

  // Toggle Active
  async function toggleActive(formData: FormData) {
    'use server'

    const id = formData.get('id') as string
    const event = await prisma.event.findUnique({ where: { id } })

    if (event) {
      await prisma.event.update({
        where: { id },
        data: { isActive: !event.isActive },
      })
    }

    revalidatePath('/admin/events')
    revalidatePath('/')
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
          marginBottom: '8px',
        }}>
          MANAGE SPORTS EVENTS
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(165,214,167,0.6)',
        }}>
          Create and manage championship tournaments that appear on the homepage
        </p>
      </div>

      {/* Create Tournament Form */}
      <div style={{
        padding: '40px',
        borderRadius: '20px',
        border: '1px solid rgba(76,175,80,0.25)',
        background: 'rgba(27,94,32,0.05)',
        marginBottom: '48px',
      }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: '28px',
          color: 'white',
          letterSpacing: '0.1em',
          marginBottom: '32px',
        }}>
          CREATE NEW TOURNAMENT
        </h2>

        <form action={createEvent}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '24px',
            marginBottom: '24px',
          }}>
            {/* Tournament Title */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Tournament Title *
              </label>
              <input
                name="title"
                required
                placeholder="CRICKET CHAMPIONSHIP"
                style={{
                  width: '95%',
                  padding: '14px 18px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: 'white',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '10px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Category */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Category *
              </label>
              <select
                name="category"
                required
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: 'white',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '10px',
                  outline: 'none',
                }}
              >
                <option value="tournament">Tournament</option>
                <option value="workshop">Workshop</option>
                <option value="cultural">Cultural</option>
              </select>
            </div>

            {/* Sport Name */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Sport Name
              </label>
              <input
                name="sport"
                placeholder="Cricket, Football, Basketball..."
                style={{
                  width: '90%',
                  padding: '14px 18px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: 'white',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '10px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Prize Pool */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Prize Pool (₹)
              </label>
              <input
                name="prizePool"
                type="number"
                placeholder="50000"
                style={{
                  width: '94%',
                  padding: '14px 18px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: 'white',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '10px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Capacity */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Capacity
              </label>
              <input
                name="capacity"
                placeholder="16 Teams"
                style={{
                  width: '90%',
                  padding: '14px 18px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: 'white',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '10px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Display Order */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Display Order
              </label>
              <input
                name="order"
                type="number"
                defaultValue={0}
                style={{
                  width: '94%',
                  padding: '14px 18px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: 'white',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '10px',
                  outline: 'none',
                }}
              />
            </div>

            {/* CTA Button Text */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Button Text *
              </label>
              <input
                name="ctaText"
                required
                placeholder="View Fixtures"
                style={{
                  width: '90%',
                  padding: '14px 18px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: 'white',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '10px',
                  outline: 'none',
                }}
              />
            </div>

            {/* CTA Button Link */}
            <div>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Button Link *
              </label>
              <input
                name="ctaLink"
                required
                placeholder="/events/cricket"
                style={{
                  width: '94%',
                  padding: '14px 18px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: 'white',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '10px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Description */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                Description *
              </label>
              <textarea
                name="description"
                required
                rows={3}
                placeholder="Experience intense cricket action in our premier tournament. T20, ODI, and Test formats with professional commentary."
                style={{
                  width: '98%',
                  padding: '14px 18px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  color: 'white',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid rgba(76,175,80,0.3)',
                  borderRadius: '10px',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              padding: '16px 40px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '15px',
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
              color: 'black',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(76,175,80,0.3)',
            }}
          >
            ➕ CREATE TOURNAMENT
          </button>
        </form>
      </div>

      {/* Existing Events Grid */}
      <h2 style={{
        fontFamily: "'Bebas Neue', Impact, sans-serif",
        fontSize: '28px',
        color: 'white',
        letterSpacing: '0.1em',
        marginBottom: '24px',
      }}>
        EXISTING TOURNAMENTS
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '24px',
      }}>
        {events.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
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
              No tournaments created yet
            </p>
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              style={{
                padding: '28px',
                borderRadius: '16px',
                border: '1px solid rgba(76,175,80,0.25)',
                background: event.gradient || 'rgba(27,94,32,0.05)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Icon */}
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background: 'rgba(76,175,80,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                marginBottom: '20px',
                border: '1px solid rgba(76,175,80,0.3)',
              }}>
                {event.icon}
              </div>

              {/* Title */}
              <h3 style={{
                fontFamily: "'Bebas Neue', Impact, sans-serif",
                fontSize: '24px',
                color: 'white',
                marginBottom: '12px',
                letterSpacing: '0.05em',
              }}>
                {event.title}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: 'rgba(165,214,167,0.7)',
                lineHeight: '1.6',
                marginBottom: '20px',
                minHeight: '60px',
              }}>
                {event.description}
              </p>

              {/* Stats */}
              {event.prizePool && event.capacity && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '20px',
                }}>
                  <div style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(76,175,80,0.1)',
                    border: '1px solid rgba(76,175,80,0.2)',
                    textAlign: 'center',
                  }}>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      color: 'rgba(165,214,167,0.6)',
                      marginBottom: '4px',
                    }}>
                      PRIZE
                    </p>
                    <p style={{
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: '16px',
                      color: '#4CAF50',
                    }}>
                      ₹{event.prizePool.toLocaleString('en-US')}
                    </p>
                  </div>

                  <div style={{
                    padding: '10px',
                    borderRadius: '8px',
                    background: 'rgba(76,175,80,0.1)',
                    border: '1px solid rgba(76,175,80,0.2)',
                    textAlign: 'center',
                  }}>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '10px',
                      color: 'rgba(165,214,167,0.6)',
                      marginBottom: '4px',
                    }}>
                      CAPACITY
                    </p>
                    <p style={{
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      fontSize: '16px',
                      color: '#4CAF50',
                    }}>
                      {event.capacity}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <form action={toggleActive} style={{ flex: 1 }}>
                  <input type="hidden" name="id" value={event.id} />
                  <button
                    type="submit"
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: event.isActive
                        ? 'rgba(76,175,80,0.15)'
                        : 'rgba(158,158,158,0.15)',
                      color: event.isActive ? '#4CAF50' : 'rgba(158,158,158,0.8)',
                      border: `1px solid ${event.isActive ? 'rgba(76,175,80,0.3)' : 'rgba(158,158,158,0.3)'}`,
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    {event.isActive ? '✓ Active' : '⊗ Hidden'}
                  </button>
                </form>

                <form action={deleteEvent}>
                  <input type="hidden" name="id" value={event.id} />
                  <button
                    type="submit"
                    style={{
                      padding: '10px 14px',
                      background: 'rgba(239,68,68,0.15)',
                      color: '#ef4444',
                      border: '1px solid rgba(239,68,68,0.3)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️
                  </button>
                </form>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
