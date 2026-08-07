'use client'

interface Props {
  sports: { id: string; name: string }[]
  currentSport?: string
}

export default function FixturesFilters({ sports, currentSport }: Props) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <select
        onChange={(e) => {
          const val = e.target.value
          window.location.href = `/admin/fixtures${val ? `?sport=${val}` : ''}`
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
    </div>
  )
}
