import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { getAdminFromCookie } from '@/lib/auth'
import { canAccessRoute } from '@/lib/auth/permissions'

export default async function AdminContactMessagesPage() {
  const admin = await getAdminFromCookie()
  if (!admin || !canAccessRoute(admin.role, '/admin/contact-messages')) {
    redirect('/admin/login')
  }

  const messages = await prisma.contactMessage.findMany({
    orderBy: { sentAt: 'desc' },
  })

  // Mark as read
  async function markAsRead(formData: FormData) {
    'use server'
    
    const id = formData.get('id') as string
    await prisma.contactMessage.update({
      where: { id },
      data: { status: 'read' },
    })
    revalidatePath('/admin/contact-messages')
  }

  // Delete message
  async function deleteMessage(formData: FormData) {
    'use server'
    
    const id = formData.get('id') as string
    await prisma.contactMessage.delete({ where: { id } })
    revalidatePath('/admin/contact-messages')
  }

  const unreadCount = messages.filter(m => m.status === 'unread').length

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
          CONTACT MESSAGES
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(165,214,167,0.6)',
        }}>
          {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Messages List */}
      <div style={{ display: 'grid', gap: '20px' }}>
        {messages.length === 0 ? (
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
              No messages yet
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                padding: '24px',
                borderRadius: '12px',
                border: msg.status === 'unread' 
                  ? '1px solid rgba(76,175,80,0.4)'
                  : '1px solid rgba(76,175,80,0.2)',
                background: msg.status === 'unread'
                  ? 'rgba(76,175,80,0.08)'
                  : 'rgba(27,94,32,0.03)',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}>
                <div>
                  <h3 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '18px',
                    color: 'white',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}>
                    {msg.fullName}
                  </h3>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: 'rgba(165,214,167,0.6)',
                  }}>
                    {msg.email}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {msg.status === 'unread' && (
                    <form action={markAsRead}>
                      <input type="hidden" name="id" value={msg.id} />
                      <button
                        type="submit"
                        style={{
                          padding: '8px 16px',
                          background: 'rgba(76,175,80,0.15)',
                          color: '#4CAF50',
                          border: '1px solid rgba(76,175,80,0.3)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        ✓ Mark Read
                      </button>
                    </form>
                  )}

                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={msg.id} />
                    <button
                      type="submit"
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
                      🗑️ Delete
                    </button>
                  </form>
                </div>
              </div>

              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                color: 'rgba(165,214,167,0.85)',
                lineHeight: '1.7',
                marginBottom: '12px',
              }}>
                {msg.message}
              </p>

              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '12px',
                color: 'rgba(165,214,167,0.5)',
              }}>
                Received: {new Date(msg.sentAt).toLocaleString('en-US')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
