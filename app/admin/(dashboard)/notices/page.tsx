import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import ConfirmButton from '@/components/ui/ConfirmButton'
import { sendNoticeMail } from '@/lib/mail'

export default async function AdminNoticesPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) redirect('/admin/login')
  
  const admin = jwt.verify(token, process.env.JWT_SECRET!) as any

  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Create notice and send emails
  async function createNotice(formData: FormData) {
    'use server'
    
    const title = formData.get('title') as string
    const message = formData.get('message') as string
    const category = formData.get('category') as string
    const priority = formData.get('priority') as string
    const sendEmail = formData.get('sendEmail') === 'on'

    const notice = await prisma.notice.create({
      data: {
        title,
        message,
        category,
        priority,
        sendEmail,
        createdBy: admin.email,
      },
    })

    // Send emails if requested
    if (sendEmail) {
      // Only email students who have actually registered (not team members added as students)
      const students = await prisma.student.findMany({
        where: { registrations: { some: {} } },
        select: { email: true, fullName: true },
      })

      let emailsSent = 0

      for (const student of students) {
        const sent = await sendNoticeMail(
          student.email,
          student.fullName,
          title,
          message,
          priority
        )
        if (sent) emailsSent++
      }

      await prisma.notice.update({
        where: { id: notice.id },
        data: { emailSentTo: emailsSent },
      })
    }

    revalidatePath('/admin/notices')
    revalidatePath('/') // Refresh homepage notices
    redirect('/admin/notices?success=Notice created and emails sent')
  }

  // Delete notice
  async function deleteNotice(formData: FormData) {
    'use server'
    
    const id = formData.get('id') as string
    await prisma.notice.delete({ where: { id } })
    
    revalidatePath('/admin/notices')
    revalidatePath('/') // Refresh homepage notices
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
          MANAGE NOTICES
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(165,214,167,0.6)',
        }}>
          Send announcements and updates to registered students
        </p>
      </div>

      {/* Create Notice Form */}
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
          CREATE NEW NOTICE
        </h2>

        <form action={createNotice}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '20px',
            marginBottom: '20px',
          }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
              }}>
                TITLE *
              </label>
              <input
                name="title"
                required
                placeholder="e.g., Registration Deadline Extended"
                style={{
                  width: '100%',
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
                CATEGORY *
              </label>
              <select
                name="category"
                required
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
                <option value="event">Event</option>
                <option value="registration">Registration</option>
                <option value="result">Result</option>
                <option value="general">General</option>
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
                PRIORITY *
              </label>
              <select
                name="priority"
                required
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
                <option value="info">ℹ️ Info</option>
                <option value="normal">📢 Normal</option>
                <option value="urgent">🚨 Urgent</option>
              </select>
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'block',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '12px',
                color: 'rgba(165,214,167,0.7)',
                marginBottom: '8px',
              }}>
                MESSAGE *
              </label>
              <textarea
                name="message"
                required
                rows={6}
                placeholder="Detailed message for students..."
                style={{
                  width: '100%',
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

            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
              }}>
                <input
                  type="checkbox"
                  name="sendEmail"
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                  }}
                />
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '14px',
                  color: 'rgba(165,214,167,0.9)',
                }}>
                  📧 Send email notification to all registered students
                </span>
              </label>
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
            📤 CREATE & SEND
          </button>
        </form>
      </div>

      {/* Notices List */}
      <div style={{
        display: 'grid',
        gap: '16px',
      }}>
        {notices.map((notice) => (
          <div
            key={notice.id}
            style={{
              padding: '24px',
              borderRadius: '12px',
              border: `1px solid ${
                notice.priority === 'urgent' 
                  ? 'rgba(239,68,68,0.3)' 
                  : 'rgba(76,175,80,0.2)'
              }`,
              background: notice.priority === 'urgent'
                ? 'rgba(239,68,68,0.05)'
                : 'rgba(27,94,32,0.03)',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'start',
              marginBottom: '12px',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    fontWeight: '600',
                    background: notice.priority === 'urgent'
                      ? 'rgba(239,68,68,0.15)'
                      : 'rgba(76,175,80,0.15)',
                    color: notice.priority === 'urgent' ? '#ef4444' : '#4CAF50',
                  }}>
                    {notice.priority.toUpperCase()}
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '11px',
                    background: 'rgba(33,150,243,0.15)',
                    color: '#2196F3',
                  }}>
                    {notice.category}
                  </span>
                </div>
                <h3 style={{
                  fontFamily: "'Bebas Neue', Impact, sans-serif",
                  fontSize: '24px',
                  color: 'white',
                  marginBottom: '8px',
                }}>
                  {notice.title}
                </h3>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(165,214,167,0.7)',
                  lineHeight: '1.6',
                  marginBottom: '12px',
                }}>
                  {notice.message}
                </p>
                <div style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: 'rgba(165,214,167,0.5)',
                }}>
                  {notice.sendEmail && (
                    <span>📧 Sent to {notice.emailSentTo} students • </span>
                  )}
                  {new Date(notice.createdAt).toLocaleDateString()} by {notice.createdBy}
                </div>
              </div>

              <form action={deleteNotice}>
                <input type="hidden" name="id" value={notice.id} />
                <ConfirmButton
                  message="Delete this notice?"
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(239,68,68,0.15)',
                    color: '#ef4444',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  🗑️
                </ConfirmButton>
              </form>
            </div>
          </div>
        ))}
      </div>

      {notices.length === 0 && (
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
            No notices created yet
          </p>
        </div>
      )}
    </div>
  )
}

