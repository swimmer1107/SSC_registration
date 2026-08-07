import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function RegistrationViewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) redirect('/admin/login')

  const { id } = await params

  const reg = await prisma.registration.findUnique({
    where: { id },
    include: {
      student: true,
      sport: true,
      registrationMembers: {
        include: {
          student: true,
        },
      },
    },
  })

  if (!reg) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ color: '#ef4444', fontFamily: 'Inter, sans-serif' }}>Registration Not Found</h1>
        <p style={{ color: 'white', marginTop: '16px' }}>The requested registration ID does not exist.</p>
        <Link href="/admin/registrations" style={{ display: 'inline-block', marginTop: '24px', color: '#4CAF50', textDecoration: 'underline' }}>
          Back to registrations
        </Link>
      </div>
    )
  }

  // Update Status server action
  async function updateStatus(formData: FormData) {
    'use server'
    
    const newStatus = formData.get('status') as string
    const rejectionReason = formData.get('rejectionReason') as string || null

    await prisma.registration.update({
      where: { id },
      data: { 
        status: newStatus, 
        rejectionReason: newStatus === 'rejected' ? rejectionReason : null,
        approvedAt: newStatus === 'approved' ? new Date() : null
      },
    })

    revalidatePath(`/admin/registrations/${id}/view`)
    revalidatePath('/admin/registrations')
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Back button */}
      <Link
        href="/admin/registrations"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#4CAF50',
          textDecoration: 'none',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '24px',
        }}
      >
        ← BACK TO REGISTRATIONS
      </Link>

      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{
          fontFamily: "'Bebas Neue', Impact, sans-serif",
          fontSize: '48px',
          color: '#4CAF50',
          letterSpacing: '0.05em',
          marginBottom: '8px',
        }}>
          REGISTRATION DETAILS
        </h1>
        <p style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: 'rgba(165,214,167,0.6)',
        }}>
          Reference ID: #{reg.registrationId}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '32px',
      }}>
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Primary Applicant (Student) Info */}
          <div style={{
            background: 'rgba(27,94,32,0.03)',
            border: '1px solid rgba(76,175,80,0.2)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '18px',
              color: 'white',
              marginBottom: '20px',
              borderBottom: '1px solid rgba(76,175,80,0.2)',
              paddingBottom: '10px',
            }}>
              👤 APPLICANT INFORMATION
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px 24px',
            }}>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(165,214,167,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Full Name</p>
                <p style={{ fontSize: '15px', color: 'white', fontWeight: '600' }}>{reg.student.fullName}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(165,214,167,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Email</p>
                <p style={{ fontSize: '15px', color: 'white' }}>{reg.student.email}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(165,214,167,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Phone</p>
                <p style={{ fontSize: '15px', color: 'white' }}>{reg.student.phone || '-'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(165,214,167,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>College</p>
                <p style={{ fontSize: '15px', color: 'white' }}>{reg.student.college}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(165,214,167,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Course</p>
                <p style={{ fontSize: '15px', color: 'white' }}>{reg.student.course || '-'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(165,214,167,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Year</p>
                <p style={{ fontSize: '15px', color: 'white' }}>{reg.student.year || '-'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(165,214,167,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Registration No</p>
                <p style={{ fontSize: '15px', color: 'white' }}>{reg.student.registrationNumber || '-'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(165,214,167,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Gender</p>
                <p style={{ fontSize: '15px', color: 'white' }}>{reg.student.gender || '-'}</p>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <p style={{ fontSize: '11px', color: 'rgba(165,214,167,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Address</p>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.5' }}>{reg.student.address || '-'}</p>
              </div>
            </div>
          </div>

          {/* Event & Sport Details */}
          <div style={{
            background: 'rgba(27,94,32,0.03)',
            border: '1px solid rgba(76,175,80,0.2)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '18px',
              color: 'white',
              marginBottom: '20px',
              borderBottom: '1px solid rgba(76,175,80,0.2)',
              paddingBottom: '10px',
            }}>
              🏆 SPORT / TEAM INFORMATION
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px 24px',
              marginBottom: '24px',
            }}>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(165,214,167,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Sport Registered</p>
                <p style={{ fontSize: '16px', color: '#4CAF50', fontWeight: '600' }}>{reg.sport.name}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(165,214,167,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Participation Type</p>
                <p style={{ fontSize: '15px', color: 'white' }}>{reg.isTeamEvent ? 'Team Event' : 'Individual Event'}</p>
              </div>
              {reg.isTeamEvent && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <p style={{ fontSize: '11px', color: 'rgba(165,214,167,0.5)', textTransform: 'uppercase', marginBottom: '4px' }}>Team Name</p>
                  <p style={{ fontSize: '16px', color: 'white', fontWeight: '600' }}>{reg.teamName || '-'}</p>
                </div>
              )}
            </div>

            {/* Team Members List */}
            {reg.isTeamEvent && (
              <div>
                <p style={{ fontSize: '12px', color: 'rgba(165,214,167,0.7)', fontWeight: '600', marginBottom: '12px', textTransform: 'uppercase' }}>
                  👥 Team Members ({reg.registrationMembers.length})
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {reg.registrationMembers.length === 0 ? (
                    <p style={{ fontSize: '13px', color: 'rgba(165,214,167,0.5)' }}>No team members added</p>
                  ) : (
                    reg.registrationMembers.map((m, idx) => (
                      <div key={m.id} style={{
                        padding: '12px 16px',
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid rgba(76,175,80,0.1)',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                        <div>
                          <p style={{ fontSize: '14px', color: 'white', fontWeight: '600' }}>{m.student.fullName}</p>
                          <p style={{ fontSize: '12px', color: 'rgba(165,214,167,0.5)' }}>{m.student.email}</p>
                        </div>
                        <span style={{
                          fontSize: '11px',
                          color: '#4CAF50',
                          background: 'rgba(76,175,80,0.1)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: '600',
                        }}>
                          {m.role || 'Player'}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Actions & Payment proof */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Status Actions */}
          <div style={{
            background: 'rgba(27,94,32,0.03)',
            border: '1px solid rgba(76,175,80,0.2)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '16px',
              color: 'white',
              marginBottom: '16px',
            }}>
              ⚡ VERIFICATION STATUS
            </h3>

            {/* Current Status Badge */}
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '14px',
              letterSpacing: '0.05em',
              background: reg.status === 'approved'
                ? 'rgba(76,175,80,0.15)'
                : reg.status === 'rejected'
                ? 'rgba(239,68,68,0.15)'
                : 'rgba(255,152,0,0.15)',
              color: reg.status === 'approved'
                ? '#4CAF50'
                : reg.status === 'rejected'
                ? '#ef4444'
                : '#FF9800',
              border: `1px solid ${
                reg.status === 'approved'
                  ? 'rgba(76,175,80,0.3)'
                  : reg.status === 'rejected'
                  ? 'rgba(239,68,68,0.3)'
                  : 'rgba(255,152,0,0.3)'
              }`,
              marginBottom: '24px',
            }}>
              {reg.status.toUpperCase()}
            </div>

            {/* Form to Update */}
            <form action={updateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(165,214,167,0.7)', marginBottom: '6px' }}>
                  CHANGE STATUS
                </label>
                <select
                  name="status"
                  defaultValue={reg.status}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'black',
                    border: '1px solid rgba(76,175,80,0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px',
                  }}
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'rgba(165,214,167,0.7)', marginBottom: '6px' }}>
                  REJECTION REASON (IF REJECTED)
                </label>
                <textarea
                  name="rejectionReason"
                  defaultValue={reg.rejectionReason || ''}
                  placeholder="Explain why registration was rejected..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '10px',
                    background: 'black',
                    border: '1px solid rgba(76,175,80,0.3)',
                    borderRadius: '8px',
                    color: 'white',
                    fontSize: '13px',
                    resize: 'vertical',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#4CAF50',
                  color: 'black',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 'bold',
                  fontSize: '13px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                }}
              >
                💾 SAVE CHANGES
              </button>
            </form>
          </div>

          {/* Payment screenshot */}
          <div style={{
            background: 'rgba(27,94,32,0.03)',
            border: '1px solid rgba(76,175,80,0.2)',
            borderRadius: '16px',
            padding: '24px',
          }}>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '16px',
              color: 'white',
              marginBottom: '16px',
            }}>
              💳 PAYMENT PROOF
            </h3>
            
            <p style={{ fontSize: '13px', color: 'rgba(165,214,167,0.7)', marginBottom: '4px' }}>
              Amount paid: <strong style={{ color: '#4CAF50' }}>₹{reg.paymentAmount}</strong>
            </p>
            
            <p style={{ fontSize: '13px', color: 'rgba(165,214,167,0.7)', marginBottom: '16px' }}>
              Transaction ID: <strong style={{ color: 'white' }}>{reg.transactionId || 'N/A'}</strong>
            </p>

            {reg.paymentScreenshot ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  border: '1px solid rgba(76,175,80,0.2)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: 'black',
                }}>
                  <img
                    src={reg.paymentScreenshot}
                    alt="Payment Screenshot Proof"
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '300px',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                <a
                  href={reg.paymentScreenshot}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: '#4CAF50',
                    fontSize: '13px',
                    textDecoration: 'underline',
                    textAlign: 'center',
                    fontWeight: '500',
                  }}
                >
                  🔗 Open full image in new tab
                </a>
              </div>
            ) : (
              <div style={{
                padding: '30px',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '8px',
                border: '1px dashed rgba(76,175,80,0.2)',
              }}>
                <span style={{ fontSize: '24px' }}>❌</span>
                <p style={{ color: 'rgba(165,214,167,0.5)', fontSize: '13px', marginTop: '8px' }}>No screenshot proof uploaded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
