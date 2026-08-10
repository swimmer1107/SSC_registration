import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { requirePermission } from '@/lib/auth/protectRoute'

export const dynamic = 'force-dynamic'
import RegistrationsFilters from './RegistrationsFilters'
import RegistrationStatusSelect from './RegistrationStatusSelect'
import ConfirmButton from '@/components/ui/ConfirmButton'

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ sport?: string; status?: string; success?: string }>
}) {
  await requirePermission('canManageRegistrations')

  const { sport, status, success } = await searchParams

  // Fetch registrations with related data
  const registrations = await prisma.registration.findMany({
    where: {
      ...(sport && { sportId: sport }),
      ...(status && { status }),
    },
    include: {
      student: true,
      sport: true,
      registrationMembers: {
        include: {
          student: true,
        },
      },
    },
    orderBy: { registeredAt: 'desc' },
  })

  const sports = await prisma.sport.findMany({
    where: { isActive: true },
  })

  // Update status
  async function updateStatus(formData: FormData) {
    'use server'
    
    const id = formData.get('id') as string
    const newStatus = formData.get('status') as string

    await prisma.registration.update({
      where: { id },
      data: { status: newStatus },
    })

    revalidatePath('/admin/registrations')
    redirect('/admin/registrations?success=Status updated')
  }

  // Delete registration
  async function deleteRegistration(formData: FormData) {
    'use server'
    
    const id = formData.get('id') as string

    // 1. Dissociate from fixtures to avoid foreign key errors
    await prisma.fixture.updateMany({
      where: { participant1Id: id },
      data: { participant1Id: null, participant1Name: 'Deleted Participant' }
    })
    await prisma.fixture.updateMany({
      where: { participant2Id: id },
      data: { participant2Id: null, participant2Name: 'Deleted Participant' }
    })

    // 2. Delete team members first
    await prisma.registrationMember.deleteMany({
      where: { registrationId: id },
    })

    // 3. Delete registration
    await prisma.registration.delete({
      where: { id },
    })

    revalidatePath('/admin/registrations')
    redirect('/admin/registrations?success=Registration deleted')
  }

  return (
    <div>
      {/* Success Message */}
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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{
            fontFamily: "'Bebas Neue', Impact, sans-serif",
            fontSize: '48px',
            color: '#4CAF50',
            letterSpacing: '0.1em',
            marginBottom: '8px',
          }}>
            MANAGE REGISTRATIONS
          </h1>
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: 'rgba(165,214,167,0.6)',
          }}>
            Total: {registrations.length} registrations
          </p>
        </div>

        {/* Export to Excel */}
        <a
          href="/api/registrations/export-excel"
          style={{
            padding: '14px 28px',
            background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
            color: 'black',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            borderRadius: '10px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(76,175,80,0.3)',
          }}
        >
          📊 EXPORT TO EXCEL
        </a>
      </div>

      {/* Filters */}
      <RegistrationsFilters sports={sports} currentSport={sport} currentStatus={status} />

      {/* Registrations Table */}
      <div style={{
        borderRadius: '16px',
        border: '1px solid rgba(76,175,80,0.2)',
        background: 'rgba(27,94,32,0.03)',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
      }}>
        <table style={{
          width: '100%',
          minWidth: '1150px',
          borderCollapse: 'collapse',
        }}>
          <thead>
            <tr style={{
              background: 'rgba(76,175,80,0.12)',
              borderBottom: '1px solid rgba(76,175,80,0.3)',
            }}>
              {[
                { name: 'ID', width: '90px' },
                { name: 'Student', width: '150px' },
                { name: 'Email', width: '220px' },
                { name: 'Sport', width: '130px' },
                { name: 'Type', width: '120px' },
                { name: 'Team Name', width: '140px' },
                { name: 'Payment', width: '140px' },
                { name: 'Status', width: '160px' },
                { name: 'Actions', width: '190px' }
              ].map(col => (
                <th key={col.name} style={{
                  padding: '18px 16px',
                  width: col.width,
                  textAlign: 'left',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '12px',
                  color: 'rgba(165,214,167,0.8)',
                  fontWeight: '600',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  {col.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={9} style={{
                  padding: '60px',
                  textAlign: 'center',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: 'rgba(165,214,167,0.5)',
                }}>
                  No registrations found
                </td>
              </tr>
            ) : (
              registrations.map((reg) => (
                <tr key={reg.id} style={{
                  borderBottom: '1px solid rgba(76,175,80,0.1)',
                  background: 'transparent',
                }}>
                  <td style={{
                    padding: '18px 16px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(165,214,167,0.7)',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                  }}>
                    #{reg.registrationId}
                  </td>
                  <td style={{
                    padding: '18px 16px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: 'white',
                    fontWeight: '600',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                  }}>
                    {reg.student.fullName}
                  </td>
                  <td style={{
                    padding: '18px 16px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(165,214,167,0.7)',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                  }}>
                    {reg.student.email}
                  </td>
                  <td style={{
                    padding: '18px 16px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: '#4CAF50',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                  }}>
                    {reg.sport.name}
                  </td>
                  <td style={{
                    padding: '18px 16px',
                    verticalAlign: 'middle',
                  }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: reg.isTeamEvent ? 'rgba(33,150,243,0.12)' : 'rgba(255,152,0,0.12)',
                      color: reg.isTeamEvent ? '#2196F3' : '#FF9800',
                      border: `1px solid ${reg.isTeamEvent ? 'rgba(33,150,243,0.25)' : 'rgba(255,152,0,0.25)'}`,
                      whiteSpace: 'nowrap',
                      display: 'inline-block',
                    }}>
                      {reg.isTeamEvent ? 'Team' : 'Individual'}
                    </span>
                  </td>
                  <td style={{
                    padding: '18px 16px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '13px',
                    color: 'rgba(165,214,167,0.7)',
                    verticalAlign: 'middle',
                    whiteSpace: 'nowrap',
                  }}>
                    {reg.teamName || '-'}
                  </td>
                  <td style={{
                    padding: '18px 16px',
                    verticalAlign: 'middle',
                  }}>
                    {reg.transactionId ? (
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: '12.5px',
                        color: '#4CAF50',
                        background: 'rgba(76,175,80,0.08)',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(76,175,80,0.2)',
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                      }} title={`Transaction ID: ${reg.transactionId}`}>
                        Tx: {reg.transactionId.length > 10 ? reg.transactionId.slice(0, 10) + '...' : reg.transactionId}
                      </span>
                    ) : reg.paymentScreenshot ? (
                      <a
                        href={reg.paymentScreenshot}
                        target="_blank"
                        style={{
                          color: '#4CAF50',
                          fontSize: '13px',
                          textDecoration: 'none',
                          fontWeight: '600',
                          background: 'rgba(76,175,80,0.12)',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid rgba(76,175,80,0.25)',
                          display: 'inline-block',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        📄 View Proof
                      </a>
                    ) : (
                      <span style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '13px',
                        color: 'rgba(165,214,167,0.4)',
                        padding: '6px 12px',
                        display: 'inline-block',
                      }}>
                        No proof
                      </span>
                    )}
                  </td>
                  <td style={{ 
                    padding: '18px 16px',
                    verticalAlign: 'middle',
                  }}>
                    <RegistrationStatusSelect id={reg.id} status={reg.status} updateStatusAction={updateStatus} />
                  </td>
                  <td style={{ 
                    padding: '18px 16px',
                    verticalAlign: 'middle',
                  }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a
                        href={`/admin/registrations/${reg.id}/view`}
                        style={{
                          padding: '8px 14px',
                          background: 'rgba(33,150,243,0.12)',
                          color: '#2196F3',
                          border: '1px solid rgba(33,150,243,0.25)',
                          borderRadius: '6px',
                          fontSize: '12px',
                          textDecoration: 'none',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        👁️ View
                      </a>

                      <form action={deleteRegistration} style={{ margin: 0 }}>
                        <input type="hidden" name="id" value={reg.id} />
                        <ConfirmButton
                          message={`Delete registration for ${reg.student.fullName}?`}
                          style={{
                            padding: '8px 14px',
                            background: 'rgba(239,68,68,0.12)',
                            color: '#ef4444',
                            border: '1px solid rgba(239,68,68,0.25)',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          🗑️ Delete
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}