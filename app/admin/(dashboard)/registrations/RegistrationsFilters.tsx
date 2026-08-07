'use client'

interface Props {
  sports: { id: string; name: string }[]
  currentSport?: string
  currentStatus?: string
}

export default function RegistrationsFilters({ sports, currentSport, currentStatus }: Props) {
  return (
    <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
      <select
        onChange={(e) => {
          const val = e.target.value
          const params = new URLSearchParams()
          if (val) params.set('sport', val)
          if (currentStatus) params.set('status', currentStatus)
          window.location.href = `/admin/registrations${params.toString() ? `?${params}` : ''}`
        }}
        defaultValue={currentSport || ''}
        style={{
          padding: '12px 20px',
          background: 'rgba(27,94,32,0.1)',
          border: '1px solid rgba(76,175,80,0.3)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        <option value="">All Sports</option>
        {sports.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
      </select>

      <select
        onChange={(e) => {
          const val = e.target.value
          const params = new URLSearchParams()
          if (currentSport) params.set('sport', currentSport)
          if (val) params.set('status', val)
          window.location.href = `/admin/registrations${params.toString() ? `?${params}` : ''}`
        }}
        defaultValue={currentStatus || ''}
        style={{
          padding: '12px 20px',
          background: 'rgba(27,94,32,0.1)',
          border: '1px solid rgba(76,175,80,0.3)',
          borderRadius: '8px',
          color: 'white',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  )
}
